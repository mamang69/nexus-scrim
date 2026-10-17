import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClipboardList } from "lucide-react";
import { MyRegistrationsList } from "@/components/scrims/MyRegistrationsList";

export const dynamic = "force-dynamic";

export default async function MyRegistrationsPage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/my-registrations");
  }

  let registrations: any[] = [];

  try {
    // Find all teams where user is captain or member
    const userTeams = await prisma.team.findMany({
      where: {
        OR: [
          { captainId: session.user.id },
          { members: { some: { userId: session.user.id } } },
        ],
      },
      select: { id: true },
    });

    const teamIds = userTeams.map((t) => t.id);

    if (teamIds.length > 0) {
      registrations = await prisma.scrimRegistration.findMany({
        where: {
          teamId: { in: teamIds },
        },
        include: {
          team: true,
          scrim: true,
        },
        orderBy: {
          registeredAt: "desc",
        },
      });
    }
  } catch (err) {
    console.error("Error fetching my registrations:", err);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Title */}
      <div className="pb-6 border-b border-borderSubtle">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-2xl font-black text-white font-mono">
            STATUS <span className="text-neon-cyan">PENDAFTARAN</span> SCRIM SAYA
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Pantau status verifikasi slot scrim tim Anda oleh panitia atau batalkan keikutsertaan sebelum batas waktu.
        </p>
      </div>

      <MyRegistrationsList registrations={registrations} />
    </div>
  );
}
