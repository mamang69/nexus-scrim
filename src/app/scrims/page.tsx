import React from "react";
import Link from "next/link";
import { getScrims } from "@/lib/data";
import { formatWIB, GAME_LABELS, STATUS_BADGES } from "@/lib/utils";
import { Calendar, Users, Trophy, Globe, ArrowRight, Filter, Plus } from "lucide-react";
import { getServerAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ScrimsPageProps {
  searchParams: {
    game?: string;
    status?: string;
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

const STATUSES = [
  { key: "ALL", label: "Semua Status" },
  { key: "OPEN", label: "Terbuka" },
  { key: "FULL", label: "Penuh" },
  { key: "ONGOING", label: "Berlangsung" },
  { key: "COMPLETED", label: "Selesai" },
];

export default async function ScrimsPage({ searchParams }: ScrimsPageProps) {
  const currentGame = searchParams.game || "ALL";
  const currentStatus = searchParams.status || "ALL";

  const scrims = await getScrims({
    game: currentGame,
    status: currentStatus,
  });

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title & Action */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-borderSubtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan">
              Matchmaking Hub
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono mt-1">
            DAFTAR <span className="text-neon-cyan">SCRIM</span> RESMI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cari lawan tanding tim kamu. Semua jadwal disesuaikan dengan Waktu Indonesia Barat (WIB).
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin/scrims/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 px-4 py-2.5 text-xs font-bold text-[#08090d] shadow-neonCyan hover:opacity-95"
          >
            <Plus className="h-4 w-4" />
            Buat Scrim Baru
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6 space-y-4">
        {/* Game Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 mr-1" />
          {GAMES.map((g) => {
            const isActive = currentGame === g.key;
            return (
              <Link
                key={g.key}
                href={`/scrims?game=${g.key}&status=${currentStatus}`}
                className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-neon-cyan text-[#08090d] font-bold shadow-neonCyan"
                    : "bg-surface border border-borderSubtle text-slate-300 hover:border-slate-600 hover:text-white"
                }`}
              >
                {g.label}
              </Link>
            );
          })}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-borderSubtle pb-3">
          {STATUSES.map((s) => {
            const isActive = currentStatus === s.key;
            return (
              <Link
                key={s.key}
                href={`/scrims?game=${currentGame}&status=${s.key}`}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  isActive
                    ? "text-neon-cyan font-bold bg-neon-cyan/10 border border-neon-cyan/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Scrim Grid */}
      <div className="mt-8">
        {scrims.length === 0 ? (
          <div className="cyber-card rounded-2xl p-12 text-center">
            <Trophy className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white font-mono">Belum Ada Scrim</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Tidak ada jadwal scrim yang cocok dengan filter yang dipilih. Silakan ubah filter game atau status.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scrims.map((scrim) => {
              const gameMeta = GAME_LABELS[scrim.game] || {
                name: scrim.game,
                badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
              };
              const statusMeta = STATUS_BADGES[scrim.status] || {
                label: scrim.status,
                class: "bg-slate-700/40 border-slate-600/40 text-slate-400",
              };

              const approvedCount = scrim.registrations.filter(
                (r) => r.status === "APPROVED"
              ).length;
              const slotPercent = Math.min(100, Math.round((approvedCount / scrim.maxSlots) * 100));

              return (
                <div
                  key={scrim.id}
                  className="cyber-card rounded-2xl p-5 flex flex-col justify-between group hover:-translate-y-1 transition-all"
                >
                  <div className="space-y-3">
                    {/* Game & Status Row */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${gameMeta.badge}`}
                      >
                        {gameMeta.name}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusMeta.class}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    {/* Scrim Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
                      {scrim.title}
                    </h3>

                    {/* Format & Region */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="bg-surface px-2 py-0.5 rounded border border-borderSubtle text-slate-300 font-mono text-[11px]">
                        Format: <strong className="text-white">{scrim.format}</strong>
                      </span>
                      {scrim.prizePool && (
                        <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                          <Trophy className="h-3 w-3" />
                          {scrim.prizePool}
                        </span>
                      )}
                    </div>

                    {/* Time (WIB) */}
                    <div className="flex items-center gap-2 rounded-xl bg-surface p-3 border border-borderSubtle">
                      <Calendar className="h-4 w-4 text-neon-cyan shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                          Waktu Pertandingan
                        </span>
                        <span className="text-xs font-bold text-slate-200">
                          {formatWIB(scrim.startTime)}
                        </span>
                      </div>
                    </div>

                    {/* Slots Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-500" />
                          Slot Terisi
                        </span>
                        <span className="font-mono font-bold text-white">
                          {approvedCount} / {scrim.maxSlots} Tim
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            scrim.status === "FULL"
                              ? "bg-amber-400"
                              : "bg-gradient-to-r from-neon-cyan to-neon-violet"
                          }`}
                          style={{ width: `${slotPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer CTA */}
                  <div className="mt-5 pt-4 border-t border-borderSubtle/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Globe className="h-3 w-3 text-slate-500" />
                      {scrim.serverRegion}
                    </span>
                    <Link
                      href={`/scrims/${scrim.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-neon-cyan hover:text-white transition-colors"
                    >
                      <span>Detail & Daftar</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
