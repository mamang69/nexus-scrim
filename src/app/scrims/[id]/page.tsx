import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getScrimById, getUserTeams } from "@/lib/data";
import { getServerAuthSession } from "@/lib/auth";
import { formatWIB, GAME_LABELS, STATUS_BADGES } from "@/lib/utils";
import {
  Calendar,
  Users,
  Trophy,
  FileText,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";
import { ScrimRegisterForm } from "@/components/scrims/ScrimRegisterForm";

export const dynamic = "force-dynamic";

interface ScrimDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ScrimDetailPage({ params }: ScrimDetailPageProps) {
  const scrim = await getScrimById(params.id);

  if (!scrim) {
    notFound();
  }

  const session = await getServerAuthSession();
  const isAdmin = session?.user?.role === "ADMIN";

  // Fetch teams of logged in user matching this game where user is captain
  let userTeams: any[] = [];
  let existingRegistration: any = null;

  if (session?.user?.id) {
    const allUserTeams = await getUserTeams(session.user.id);
    userTeams = allUserTeams.filter(
      (t) => t.game === scrim.game && (t.captainId === session.user.id || isAdmin)
    );

    existingRegistration = scrim.registrations.find((r: any) =>
      userTeams.some((ut) => ut.id === r.teamId || ut.id === r.team?.id)
    );
  }

  const gameMeta = GAME_LABELS[scrim.game] || {
    name: scrim.game,
    badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
  };
  const statusMeta = STATUS_BADGES[scrim.status] || {
    label: scrim.status,
    class: "bg-slate-700/40 border-slate-600/40 text-slate-400",
  };

  const approvedRegistrations = scrim.registrations.filter(
    (r) => r.status === "APPROVED"
  );
  const pendingRegistrations = scrim.registrations.filter(
    (r) => r.status === "PENDING"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/scrims"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-neon-cyan mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Scrim
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className={`text-xs font-mono px-3 py-1 rounded-full border font-bold ${gameMeta.badge}`}
              >
                {gameMeta.name}
              </span>
              <span
                className={`text-xs font-mono px-3 py-1 rounded border uppercase font-bold ${statusMeta.class}`}
              >
                {statusMeta.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
              {scrim.title}
            </h1>

            {/* Quick Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="rounded-xl bg-surface p-3 border border-borderSubtle">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Format
                </span>
                <span className="text-sm font-bold text-white font-mono">{scrim.format}</span>
              </div>
              <div className="rounded-xl bg-surface p-3 border border-borderSubtle">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Slot Tim
                </span>
                <span className="text-sm font-bold text-neon-cyan font-mono">
                  {approvedRegistrations.length} / {scrim.maxSlots}
                </span>
              </div>
              <div className="rounded-xl bg-surface p-3 border border-borderSubtle">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Server
                </span>
                <span className="text-xs font-semibold text-slate-200 truncate block">
                  {scrim.serverRegion}
                </span>
              </div>
              <div className="rounded-xl bg-surface p-3 border border-borderSubtle">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  Prize / Mode
                </span>
                <span className="text-xs font-semibold text-amber-400 truncate block">
                  {scrim.prizePool || "Practice"}
                </span>
              </div>
            </div>

            {/* Schedule Highlight */}
            <div className="flex items-center gap-3 rounded-xl bg-surfaceHover p-4 border border-neon-cyan/20">
              <Calendar className="h-6 w-6 text-neon-cyan shrink-0" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neon-cyan font-mono font-bold block">
                  Jadwal Pertandingan (Waktu Indonesia Barat)
                </span>
                <span className="text-base font-bold text-white">
                  {formatWIB(scrim.startTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Match Result Banner (if completed) */}
          {scrim.matchResults && scrim.matchResults.length > 0 && (
            <div className="cyber-card rounded-2xl p-6 border-amber-500/30 bg-amber-500/5 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-mono">
                  HASIL PERTANDINGAN RESMI
                </h3>
              </div>

              {scrim.matchResults.map((result) => (
                <div key={result.id} className="space-y-3">
                  <div className="flex items-center justify-center gap-6 py-4 bg-background/70 rounded-xl border border-borderSubtle">
                    <div className="text-center">
                      <span className="text-xs text-slate-400 block">{result.teamAName}</span>
                      <span className="text-3xl font-black text-white font-mono">
                        {result.scoreTeamA}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-slate-600 font-mono">VS</span>
                    <div className="text-center">
                      <span className="text-xs text-slate-400 block">{result.teamBName}</span>
                      <span className="text-3xl font-black text-white font-mono">
                        {result.scoreTeamB}
                      </span>
                    </div>
                  </div>

                  {result.details && (
                    <p className="text-xs text-slate-300 leading-relaxed bg-surface p-3 rounded-lg border border-borderSubtle">
                      {result.details}
                    </p>
                  )}

                  {result.proofUrl && (
                    <div className="pt-2">
                      <a
                        href={result.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-neon-cyan hover:underline inline-flex items-center gap-1"
                      >
                        Lihat Bukti Screenshot Match
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Rules Section */}
          <div className="cyber-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-borderSubtle">
              <FileText className="h-5 w-5 text-neon-violet" />
              <h3 className="text-base font-bold text-white font-mono">Aturan & Regulasi Scrim</h3>
            </div>
            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {scrim.rules || "Belum ada aturan khusus yang dicantumkan."}
            </div>
          </div>

          {/* Registered Teams */}
          <div className="cyber-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-borderSubtle">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-neon-cyan" />
                <h3 className="text-base font-bold text-white font-mono">
                  Daftar Tim Terkonfirmasi ({approvedRegistrations.length}/{scrim.maxSlots})
                </h3>
              </div>
            </div>

            {approvedRegistrations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada tim yang disetujui. Jadilah tim pertama yang mendaftar!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {approvedRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface border border-borderSubtle"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-800 overflow-hidden ring-1 ring-borderActive">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={reg.team.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${reg.team.tag}`}
                          alt={reg.team.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{reg.team.name}</span>
                          <span className="text-[10px] text-neon-cyan font-mono">[{reg.team.tag}]</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {(reg.team as any).members?.length || 1} Roster Member
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                      APPROVED
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Pending List (visible for admin or community) */}
            {pendingRegistrations.length > 0 && (
              <div className="pt-4 border-t border-borderSubtle">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Menunggu Persetujuan Admin ({pendingRegistrations.length})
                </h4>
                <div className="space-y-2">
                  {pendingRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 border border-borderSubtle text-xs"
                    >
                      <span className="text-slate-300">
                        [{reg.team.tag}] {reg.team.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" /> PENDING
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Registration Action (1 col) */}
        <div className="space-y-6">
          <ScrimRegisterForm
            scrimId={scrim.id}
            scrimGame={scrim.game}
            scrimStatus={scrim.status}
            isLoggedIn={!!session?.user?.id}
            userTeams={userTeams}
            existingRegistration={existingRegistration}
          />

          {/* Admin Tools Quick Action */}
          {isAdmin && (
            <div className="cyber-card rounded-2xl p-5 border-rose-500/30 bg-rose-500/5 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">
                  Admin Panel Quick Actions
                </h4>
              </div>
              <p className="text-[11px] text-slate-400">
                Kelola pendaftaran tim, setujui/tolak slot, atau input skor hasil pertandingan.
              </p>
              <div className="space-y-2 pt-1">
                <Link
                  href={`/admin/scrims/${scrim.id}/results`}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 py-2 text-xs font-bold text-rose-200 hover:bg-rose-500/30"
                >
                  <Trophy className="h-3.5 w-3.5" />
                  Input Hasil Pertandingan
                </Link>
                <Link
                  href="/admin/scrims"
                  className="flex w-full items-center justify-center py-2 text-xs text-slate-400 hover:text-white"
                >
                  Buka Manajemen Scrim
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
