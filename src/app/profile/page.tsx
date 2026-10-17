import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { User, Shield, ArrowRight } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  let dbUser: any = null;
  let userTeams: any[] = [];

  try {
    dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        teamMembers: {
          include: { team: true },
        },
      },
    });

    if (dbUser?.teamMembers) {
      userTeams = dbUser.teamMembers.map((tm: any) => ({
        ...tm.team,
        roleInTeam: tm.roleInTeam,
      }));
    }
  } catch {
    dbUser = {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      gameTag: session.user.gameTag,
      discordUsername: session.user.discordUsername,
    };
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-borderSubtle">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-2xl font-black text-white font-mono">
            PENGATURAN <span className="text-neon-cyan">PROFIL</span> PEMAIN
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Kelola in-game tag, username Discord, dan pantau status tim yang Anda ikuti.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card & Edit Form (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-borderSubtle">
              <div className="h-16 w-16 rounded-2xl bg-slate-800 overflow-hidden ring-2 ring-borderActive">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.name}`}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{dbUser?.name || session.user.name}</h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      session.user.role === "ADMIN"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : session.user.role === "CAPTAIN"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    }`}
                  >
                    {session.user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{session.user.email}</p>
              </div>
            </div>

            <ProfileForm
              initialName={dbUser?.name || session.user.name || ""}
              initialGameTag={dbUser?.gameTag || ""}
              initialDiscordUsername={dbUser?.discordUsername || ""}
            />
          </div>
        </div>

        {/* User Teams (1 col) */}
        <div className="space-y-6">
          <div className="cyber-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-borderSubtle">
              <Shield className="h-5 w-5 text-neon-violet" />
              <h3 className="text-sm font-bold text-white font-mono">
                Tim Saya ({userTeams.length})
              </h3>
            </div>

            {userTeams.length === 0 ? (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-400">
                  Anda belum tergabung di tim manapun.
                </p>
                <Link
                  href="/teams/create"
                  className="inline-block text-xs text-neon-violet font-bold hover:underline"
                >
                  + Buat Tim Baru
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userTeams.map((team: any) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface border border-borderSubtle hover:border-slate-700 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white group-hover:text-neon-cyan transition-colors">
                          {team.name}
                        </span>
                        <span className="text-[10px] text-neon-violet font-mono">
                          [{team.tag}]
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Peran: {team.roleInTeam}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-neon-cyan group-hover:translate-x-0.5 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
