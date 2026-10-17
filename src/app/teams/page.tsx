import React from "react";
import Link from "next/link";
import { getTeams } from "@/lib/data";
import { GAME_LABELS } from "@/lib/utils";
import { Users, Plus, ArrowRight, UserCheck } from "lucide-react";
import { JoinTeamCard } from "@/components/teams/JoinTeamCard";

export const dynamic = "force-dynamic";

interface TeamsPageProps {
  searchParams: {
    game?: string;
  };
}

const GAMES = [
  { key: "ALL", label: "Semua Game" },
  { key: "VALORANT", label: "Valorant" },
  { key: "MOBILE_LEGENDS", label: "Mobile Legends" },
  { key: "PUBG_MOBILE", label: "PUBG Mobile" },
  { key: "FREE_FIRE", label: "Free Fire" },
  { key: "DOTA_2", label: "Dota 2" },
  { key: "CS2", label: "CS2" },
];

export default async function TeamsPage({ searchParams }: TeamsPageProps) {
  const currentGame = searchParams.game || "ALL";
  const teams = await getTeams({ game: currentGame });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-borderSubtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon-violet animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-neon-violet">
              Team Directory
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono mt-1">
            DAFTAR <span className="text-neon-violet">TIM</span> & ROSTER
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jelajahi tim-tim esport yang aktif bertanding atau daftarkan skuad kamu sendiri.
          </p>
        </div>

        <Link
          href="/teams/create"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-violet to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-neonViolet hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Daftarkan Tim Baru
        </Link>
      </div>

      {/* Join Team via Invite Code Widget */}
      <JoinTeamCard />

      {/* Game Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GAMES.map((g) => {
          const isActive = currentGame === g.key;
          return (
            <Link
              key={g.key}
              href={`/teams?game=${g.key}`}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-neon-violet text-white font-bold shadow-neonViolet"
                  : "bg-surface border border-borderSubtle text-slate-300 hover:border-slate-600 hover:text-white"
              }`}
            >
              {g.label}
            </Link>
          );
        })}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => {
          const gameMeta = GAME_LABELS[team.game] || {
            name: team.game,
            badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
          };

          return (
            <div
              key={team.id}
              className="cyber-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div className="space-y-4">
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 overflow-hidden ring-1 ring-borderActive">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={team.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${team.tag}`}
                        alt={team.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-neon-violet transition-colors">
                        {team.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-neon-violet">
                        [{team.tag}]
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${gameMeta.badge}`}
                  >
                    {gameMeta.name}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {team.description || "Tim kompetitif esport aktif."}
                </p>

                {/* Captain & Roster Meta */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-borderSubtle/60 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <UserCheck className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">
                      Kapten: <strong>{team.captain?.name?.split(" ")[0] || "Leader"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 justify-end">
                    <Users className="h-3.5 w-3.5 text-neon-cyan shrink-0" />
                    <span className="font-mono">{team.members?.length || 1} Pemain</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-borderSubtle/60">
                <Link
                  href={`/teams/${team.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface hover:bg-surfaceHover border border-borderSubtle py-2 text-xs font-bold text-slate-200 hover:text-white transition-all"
                >
                  <span>Lihat Roster & Profil</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
