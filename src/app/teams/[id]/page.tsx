import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamById } from "@/lib/data";
import { getServerAuthSession } from "@/lib/auth";
import { GAME_LABELS, formatWIB } from "@/lib/utils";
import { ArrowLeft, Calendar, Swords } from "lucide-react";
import { TeamRosterManager } from "@/components/teams/TeamRosterManager";

export const dynamic = "force-dynamic";

interface TeamDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TeamDetailPage({ params }: TeamDetailPageProps) {
  const team = await getTeamById(params.id);

  if (!team) {
    notFound();
  }

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const gameMeta = GAME_LABELS[team.game] || {
    name: team.game,
    badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-neon-violet transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Tim
      </Link>

      {/* Header Banner */}
      <div className="cyber-card rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-slate-800 overflow-hidden ring-2 ring-borderActive p-1 shadow-2xl shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${team.tag}`}
                alt={team.name}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${gameMeta.badge}`}
                >
                  {gameMeta.name}
                </span>
                <span className="text-xs font-mono font-bold text-neon-violet bg-neon-violet/10 border border-neon-violet/30 px-2 py-0.5 rounded">
                  TAG: [{team.tag}]
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">{team.name}</h1>
              <p className="text-xs text-slate-400 max-w-xl">
                {team.description || "Tim resmi terdaftar di Nexus Scrim Arena."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roster & Management (2 cols) */}
        <div className="lg:col-span-2">
          <TeamRosterManager
            teamId={team.id}
            teamName={team.name}
            captainId={team.captainId}
            inviteCode={team.inviteCode}
            members={team.members as any}
            currentUserId={session?.user?.id}
            isAdmin={isAdmin}
          />
        </div>

        {/* Scrim Participation History (1 col) */}
        <div className="space-y-6">
          <div className="cyber-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-borderSubtle">
              <Swords className="h-5 w-5 text-neon-cyan" />
              <h3 className="text-sm font-bold text-white font-mono">
                Riwayat Partisipasi Scrim
              </h3>
            </div>

            {(!(team as any).registrations || (team as any).registrations.length === 0) ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Tim ini belum pernah mendaftar ke jadwal scrim.
              </p>
            ) : (
              <div className="space-y-3">
                {(team as any).registrations.map((reg: any) => (
                  <div
                    key={reg.id}
                    className="p-3 rounded-xl bg-surface border border-borderSubtle space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {reg.scrim?.title || "Match Scrim"}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold ${
                          reg.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : reg.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>

                    {reg.scrim?.startTime && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="h-3 w-3" />
                        {formatWIB(reg.scrim.startTime)}
                      </span>
                    )}

                    {reg.scrim?.id && (
                      <div className="pt-1">
                        <Link
                          href={`/scrims/${reg.scrim.id}`}
                          className="text-[11px] font-bold text-neon-cyan hover:underline"
                        >
                          Lihat Detail Scrim →
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
