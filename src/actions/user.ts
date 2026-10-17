"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function updateProfile(formData: FormData) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    return { error: "Anda harus login terlebih dahulu" };
  }

  const name = formData.get("name") as string;
  const gameTag = formData.get("gameTag") as string;
  const discordUsername = formData.get("discordUsername") as string;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name ? { name } : {}),
        gameTag: gameTag || null,
        discordUsername: discordUsername || null,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    console.error("Update profile error:", err);
    return { error: "Gagal memperbarui profil" };
  }
}

export async function changeUserRole(userId: string, newRole: Role) {
  const session = await getServerAuthSession();
  if (!session?.user?.id || session.user.role !== Role.ADMIN) {
    return { error: "Akses ditolak: Hanya Admin yang dapat mengubah role." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: unknown) {
    console.error("Change user role error:", err);
    return { error: "Gagal memperbarui role pengguna" };
  }
}
