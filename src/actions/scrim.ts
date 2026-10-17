"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { GameType, RegistrationStatus, Role, ScrimFormat, ScrimStatus } from "@prisma/client";
import { notifyNewScrim, notifyRegistrationStatus } from "@/lib/discord";
import { formatWIB } from "@/lib/utils";

export async function createScrim(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Akses ditolak: Hanya Admin yang dapat membuat Scrim." };
  }

  const title = formData.get("title") as string;
  const game = formData.get("game") as GameType;
  const format = formData.get("format") as ScrimFormat;
  const startTimeStr = formData.get("startTime") as string;
  const maxSlots = parseInt(formData.get("maxSlots") as string) || 2;
  const rules = formData.get("rules") as string;
  const serverRegion = (formData.get("serverRegion") as string) || "Indonesia / Singapore";
  const prizePool = formData.get("prizePool") as string;

  if (!title || !game || !format || !startTimeStr) {
    return { error: "Judul, game, format, dan jadwal waktu wajib diisi." };
  }

  try {
    const startTime = new Date(startTimeStr);

    const scrim = await prisma.scrim.create({
      data: {
        title,
        game,
        format,
        startTime,
        maxSlots,
        rules,
        serverRegion,
        prizePool: prizePool || "Latihan / Friendly",
        status: ScrimStatus.OPEN,
        createdById: session.user.id,
      },
    });

    // Notify Discord webhook
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    notifyNewScrim({
      title: scrim.title,
      game: scrim.game,
      format: scrim.format,
      startTimeWIB: formatWIB(scrim.startTime),
      scrimUrl: `${appUrl}/scrims/${scrim.id}`,
    }).catch((e) => console.error("Webhook notification error:", e));

    revalidatePath("/scrims");
    revalidatePath("/admin/scrims");
    revalidatePath("/dashboard");
    return { success: true, scrimId: scrim.id };
  } catch (err: unknown) {
    console.error("Create scrim error:", err);
    return { error: "Gagal membuat Scrim. Silakan coba kembali." };
  }
}

export async function updateScrim(scrimId: string, formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Akses ditolak" };
  }

  const title = formData.get("title") as string;
  const game = formData.get("game") as GameType;
  const format = formData.get("format") as ScrimFormat;
  const startTimeStr = formData.get("startTime") as string;
  const maxSlots = parseInt(formData.get("maxSlots") as string) || 2;
  const rules = formData.get("rules") as string;
  const serverRegion = formData.get("serverRegion") as string;
  const prizePool = formData.get("prizePool") as string;
  const status = formData.get("status") as ScrimStatus;

  try {
    await prisma.scrim.update({
      where: { id: scrimId },
      data: {
        title,
        game,
        format,
        startTime: new Date(startTimeStr),
        maxSlots,
        rules,
        serverRegion,
        prizePool,
        ...(status ? { status } : {}),
      },
    });

    revalidatePath(`/scrims/${scrimId}`);
    revalidatePath("/scrims");
    revalidatePath("/admin/scrims");
    return { success: true };
  } catch (err: unknown) {
    console.error("Update scrim error:", err);
    return { error: "Gagal memperbarui data Scrim" };
  }
}

export async function deleteScrim(scrimId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Akses ditolak" };
  }

  try {
    await prisma.scrim.delete({ where: { id: scrimId } });
    revalidatePath("/scrims");
    revalidatePath("/admin/scrims");
    return { success: true };
  } catch (err: unknown) {
    console.error("Delete scrim error:", err);
    return { error: "Gagal menghapus Scrim" };
  }
}

export async function registerTeamToScrim(scrimId: string, teamId: string, notes?: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { error: "Anda harus login untuk mendaftarkan tim." };
  }

  try {
    // 1. Fetch scrim details
    const scrim = await prisma.scrim.findUnique({
      where: { id: scrimId },
      include: {
        registrations: {
          where: {
            status: { in: [RegistrationStatus.APPROVED, RegistrationStatus.PENDING] },
          },
        },
      },
    });

    if (!scrim) {
      return { error: "Scrim tidak ditemukan" };
    }

    if (scrim.status !== ScrimStatus.OPEN) {
      return { error: `Pendaftaran scrim ini sedang ditutup atau ${scrim.status.toLowerCase()}` };
    }

    // 2. Fetch team details
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      return { error: "Tim tidak ditemukan" };
    }

    // 3. Validate user is captain
    if (team.captainId !== session.user.id && session.user.role !== Role.ADMIN) {
      return { error: "Hanya kapten tim yang berhak mendaftarkan tim ke scrim." };
    }

    // 4. Validate game compatibility
    if (team.game !== scrim.game) {
      return {
        error: `Game tim (${team.game}) tidak sesuai dengan scrim ini (${scrim.game}).`,
      };
    }

    // 5. Check if already registered
    const existingRegistration = await prisma.scrimRegistration.findUnique({
      where: {
        scrimId_teamId: {
          scrimId,
          teamId,
        },
      },
    });

    if (existingRegistration) {
      if (existingRegistration.status === RegistrationStatus.CANCELLED) {
        // Re-activate registration to PENDING
        await prisma.scrimRegistration.update({
          where: { id: existingRegistration.id },
          data: { status: RegistrationStatus.PENDING, notes: notes || null },
        });
        revalidatePath(`/scrims/${scrimId}`);
        revalidatePath("/my-registrations");
        return { success: true, message: "Pendaftaran berhasil diajukan kembali!" };
      }
      return { error: `Tim Anda sudah terdaftar dengan status: ${existingRegistration.status}` };
    }

    // 6. Check slot limit
    const approvedCount = scrim.registrations.filter(
      (r) => r.status === RegistrationStatus.APPROVED
    ).length;

    if (approvedCount >= scrim.maxSlots) {
      return { error: "Slot tim yang disetujui sudah penuh!" };
    }

    // 7. Create registration
    await prisma.scrimRegistration.create({
      data: {
        scrimId,
        teamId,
        status: RegistrationStatus.PENDING,
        notes: notes || null,
      },
    });

    revalidatePath(`/scrims/${scrimId}`);
    revalidatePath("/my-registrations");
    revalidatePath("/admin/scrims");
    return { success: true, message: "Pendaftaran berhasil diajukan! Menunggu persetujuan admin." };
  } catch (err: unknown) {
    console.error("Register team error:", err);
    return { error: "Terjadi kesalahan saat mendaftar. Silakan coba kembali." };
  }
}

export async function cancelRegistration(registrationId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return { error: "Tidak diizinkan" };

  try {
    const reg = await prisma.scrimRegistration.findUnique({
      where: { id: registrationId },
      include: { team: true, scrim: true },
    });

    if (!reg) return { error: "Pendaftaran tidak ditemukan" };

    if (reg.team.captainId !== session.user.id && session.user.role !== Role.ADMIN) {
      return { error: "Hanya kapten tim yang dapat membatalkan pendaftaran" };
    }

    if (reg.scrim.status === ScrimStatus.ONGOING || reg.scrim.status === ScrimStatus.COMPLETED) {
      return { error: "Tidak dapat membatalkan pendaftaran saat scrim sedang atau telah selesai" };
    }

    await prisma.scrimRegistration.update({
      where: { id: registrationId },
      data: { status: RegistrationStatus.CANCELLED },
    });

    // If scrim was FULL, reopening a slot might revert status to OPEN
    if (reg.scrim.status === ScrimStatus.FULL) {
      await prisma.scrim.update({
        where: { id: reg.scrimId },
        data: { status: ScrimStatus.OPEN },
      });
    }

    revalidatePath(`/scrims/${reg.scrimId}`);
    revalidatePath("/my-registrations");
    return { success: true };
  } catch (err: unknown) {
    console.error("Cancel registration error:", err);
    return { error: "Gagal membatalkan pendaftaran" };
  }
}

export async function reviewRegistration(
  registrationId: string,
  newStatus: "APPROVED" | "REJECTED"
) {
  const session = await getServerAuthSession();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Akses ditolak: Hanya Admin yang dapat mereview pendaftaran." };
  }

  try {
    const reg = await prisma.scrimRegistration.findUnique({
      where: { id: registrationId },
      include: {
        team: true,
        scrim: {
          include: {
            registrations: { where: { status: RegistrationStatus.APPROVED } },
          },
        },
      },
    });

    if (!reg) return { error: "Pendaftaran tidak ditemukan" };

    await prisma.scrimRegistration.update({
      where: { id: registrationId },
      data: { status: newStatus as RegistrationStatus },
    });

    // Check if approved slots reach maxSlots
    const currentApprovedCount = reg.scrim.registrations.length + (newStatus === "APPROVED" ? 1 : 0);
    if (currentApprovedCount >= reg.scrim.maxSlots) {
      await prisma.scrim.update({
        where: { id: reg.scrimId },
        data: { status: ScrimStatus.FULL },
      });
    }

    // Trigger Discord webhook
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    notifyRegistrationStatus({
      teamName: reg.team.name,
      scrimTitle: reg.scrim.title,
      status: newStatus,
      scrimUrl: `${appUrl}/scrims/${reg.scrimId}`,
    }).catch((e) => console.error("Discord review notification error:", e));

    revalidatePath(`/scrims/${reg.scrimId}`);
    revalidatePath("/admin/scrims");
    return { success: true };
  } catch (err: unknown) {
    console.error("Review registration error:", err);
    return { error: "Gagal memperbarui status pendaftaran" };
  }
}

export async function recordMatchResult(scrimId: string, formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Akses ditolak" };
  }

  const winnerTeamId = formData.get("winnerTeamId") as string;
  const scoreTeamA = parseInt(formData.get("scoreTeamA") as string) || 0;
  const scoreTeamB = parseInt(formData.get("scoreTeamB") as string) || 0;
  const teamAName = formData.get("teamAName") as string;
  const teamBName = formData.get("teamBName") as string;
  const details = formData.get("details") as string;
  const proofUrl = formData.get("proofUrl") as string;

  try {
    await prisma.$transaction([
      prisma.matchResult.create({
        data: {
          scrimId,
          winnerTeamId: winnerTeamId || null,
          scoreTeamA,
          scoreTeamB,
          teamAName: teamAName || "Team A",
          teamBName: teamBName || "Team B",
          details: details || null,
          proofUrl: proofUrl || null,
        },
      }),
      prisma.scrim.update({
        where: { id: scrimId },
        data: { status: ScrimStatus.COMPLETED },
      }),
    ]);

    revalidatePath(`/scrims/${scrimId}`);
    revalidatePath("/scrims");
    revalidatePath("/admin/scrims");
    return { success: true };
  } catch (err: unknown) {
    console.error("Record match error:", err);
    return { error: "Gagal menyimpan hasil pertandingan" };
  }
}
