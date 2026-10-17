"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { GameType, Role, TeamRole } from "@prisma/client";

export async function createTeam(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  const name = formData.get("name") as string;
  const tag = (formData.get("tag") as string)?.toUpperCase();
  const game = formData.get("game") as GameType;
  const description = (formData.get("description") as string) || "";
  const logo = (formData.get("logo") as string) || "";

  if (!name || !tag || !game) {
    return { error: "Nama tim, tag (singkatan), dan game wajib diisi" };
  }

  try {
    // Check if user already is captain of a team in this game
    const existingCaptaincy = await prisma.team.findFirst({
      where: {
        captainId: session.user.id,
        game: game,
      },
    });

    if (existingCaptaincy) {
      return { error: `Anda sudah menjadi kapten tim untuk game ${game}` };
    }

    // Check if user is already a member of any team in this game
    const existingMembership = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
        team: { game: game },
      },
      include: { team: true },
    });

    if (existingMembership) {
      return {
        error: `Anda sudah terdaftar di tim ${existingMembership.team.name} untuk game ${game}. Satu pemain hanya boleh di satu tim per game.`,
      };
    }

    // Generate random invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const team = await prisma.team.create({
      data: {
        name,
        tag,
        game,
        description,
        logo: logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${tag}`,
        captainId: session.user.id,
        inviteCode,
        members: {
          create: {
            userId: session.user.id,
            roleInTeam: TeamRole.CAPTAIN,
            gameTag: session.user.gameTag || null,
          },
        },
      },
    });

    // Elevate user's global role to CAPTAIN if currently MEMBER
    if (session.user.role === Role.MEMBER) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: Role.CAPTAIN },
      });
    }

    revalidatePath("/teams");
    revalidatePath(`/teams/${team.id}`);
    revalidatePath("/dashboard");
    return { success: true, teamId: team.id };
  } catch (err: unknown) {
    console.error("Create team error:", err);
    return { error: "Gagal membuat tim. Silakan coba kembali." };
  }
}

export async function joinTeamByInviteCode(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  const inviteCode = (formData.get("inviteCode") as string)?.trim().toUpperCase();
  const gameTag = (formData.get("gameTag") as string)?.trim();

  if (!inviteCode) {
    return { error: "Kode undangan wajib diisi" };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { inviteCode },
      include: { members: true },
    });

    if (!team) {
      return { error: "Kode undangan tim tidak valid atau tidak ditemukan" };
    }

    // Check if user is already a member of this team
    const isMember = team.members.some((m) => m.userId === session.user.id);
    if (isMember) {
      return { error: "Anda sudah menjadi anggota di tim ini" };
    }

    // Rule: One player can only be in one team per game
    const existingTeamInGame = await prisma.teamMember.findFirst({
      where: {
        userId: session.user.id,
        team: { game: team.game },
      },
      include: { team: true },
    });

    if (existingTeamInGame) {
      return {
        error: `Anda sudah tergabung dalam tim "${existingTeamInGame.team.name}" untuk game ${team.game}. Keluar dari tim tersebut terlebih dahulu jika ingin pindah.`,
      };
    }

    // Add member
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: session.user.id,
        roleInTeam: TeamRole.PLAYER,
        gameTag: gameTag || session.user.gameTag || null,
      },
    });

    revalidatePath(`/teams/${team.id}`);
    revalidatePath("/dashboard");
    return { success: true, teamId: team.id };
  } catch (err: unknown) {
    console.error("Join team error:", err);
    return { error: "Gagal bergabung ke tim. Silakan coba kembali." };
  }
}

export async function kickMember(teamId: string, memberUserId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { error: "Tidak diizinkan" };
  }

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) return { error: "Tim tidak ditemukan" };

    // Only captain or admin can kick
    if (team.captainId !== session.user.id && session.user.role !== Role.ADMIN) {
      return { error: "Hanya kapten tim atau admin yang dapat mengeluarkan anggota" };
    }

    if (memberUserId === team.captainId) {
      return { error: "Kapten tidak dapat dikeluarkan dari tim" };
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: memberUserId,
        },
      },
    });

    revalidatePath(`/teams/${teamId}`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Kick member error:", err);
    return { error: "Gagal mengeluarkan anggota" };
  }
}

export async function transferCaptain(teamId: string, newCaptainUserId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return { error: "Tidak diizinkan" };

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) return { error: "Tim tidak ditemukan" };
    if (team.captainId !== session.user.id && session.user.role !== Role.ADMIN) {
      return { error: "Hanya kapten yang dapat mentransfer jabatan" };
    }

    const isTargetMember = team.members.some((m) => m.userId === newCaptainUserId);
    if (!isTargetMember) {
      return { error: "Kandidat kapten baru bukan anggota tim ini" };
    }

    await prisma.$transaction([
      prisma.team.update({
        where: { id: teamId },
        data: { captainId: newCaptainUserId },
      }),
      prisma.teamMember.update({
        where: { teamId_userId: { teamId, userId: newCaptainUserId } },
        data: { roleInTeam: TeamRole.CAPTAIN },
      }),
      prisma.teamMember.update({
        where: { teamId_userId: { teamId, userId: session.user.id } },
        data: { roleInTeam: TeamRole.PLAYER },
      }),
      prisma.user.update({
        where: { id: newCaptainUserId },
        data: { role: Role.CAPTAIN },
      }),
    ]);

    revalidatePath(`/teams/${teamId}`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Transfer captain error:", err);
    return { error: "Gagal mentransfer kapten" };
  }
}

export async function leaveTeam(teamId: string) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return { error: "Tidak diizinkan" };

  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) return { error: "Tim tidak ditemukan" };

    if (team.captainId === session.user.id) {
      if (team.members.length > 1) {
        return {
          error: "Sebagai kapten, Anda harus mentransfer jabatan kapten terlebih dahulu sebelum keluar.",
        };
      } else {
        // Only one member left (the captain) - delete the team
        await prisma.team.delete({ where: { id: teamId } });
        revalidatePath("/teams");
        revalidatePath("/dashboard");
        return { success: true, deleted: true };
      }
    }

    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId: session.user.id,
        },
      },
    });

    revalidatePath(`/teams/${teamId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Leave team error:", err);
    return { error: "Gagal keluar dari tim" };
  }
}

export async function updateTeam(teamId: string, formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) return { error: "Tidak diizinkan" };

  const name = formData.get("name") as string;
  const tag = (formData.get("tag") as string)?.toUpperCase();
  const description = (formData.get("description") as string) || "";
  const logo = (formData.get("logo") as string) || "";

  try {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return { error: "Tim tidak ditemukan" };

    if (team.captainId !== session.user.id && session.user.role !== Role.ADMIN) {
      return { error: "Hanya kapten atau admin yang dapat mengedit profil tim" };
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        name,
        tag,
        description,
        ...(logo ? { logo } : {}),
      },
    });

    revalidatePath(`/teams/${teamId}`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Update team error:", err);
    return { error: "Gagal memperbarui data tim" };
  }
}
