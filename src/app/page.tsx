import React from "react";
import Link from "next/link";
import { getScrims } from "@/lib/data";
import { formatWIB, GAME_LABELS, STATUS_BADGES } from "@/lib/utils";
import {
  Swords,
  Shield,
  Calendar,
  Users,
  Trophy,
  ArrowRight,
  Flame,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const scrims = await getScrims({ status: "OPEN" });
  const featuredScrims = scrims.slice(0, 3);

  const supportedGames = [
    { key: "VALORANT", name: "Valorant", desc: "5v5 Tactical FPS", border: "hover:border-rose-500/50" },
    { key: "MOBILE_LEGENDS", name: "Mobile Legends", desc: "5v5 MOBA Mobile", border: "hover:border-blue-500/50" },
    { key: "PUBG_MOBILE", name: "PUBG Mobile", desc: "Battle Royale Squad", border: "hover:border-amber-500/50" },
    { key: "FREE_FIRE", name: "Free Fire", desc: "Battle Royale Mobile", border: "hover:border-yellow-500/50" },
    { key: "DOTA_2", name: "Dota 2", desc: "Competitive PC MOBA", border: "hover:border-red-500/50" },
    { key: "CS2", name: "Counter-Strike 2", desc: "5v5 Tactical FPS", border: "hover:border-cyan-500/50" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-tr from-neon-cyan/20 via-neon-violet/20 to-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-1.5 text-xs font-mono font-bold text-neon-cyan shadow-neonCyan">
            <Flame className="h-4 w-4" />
            <span>PLATFORM SCRIM ESPORTS #1 INDONESIA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-mono uppercase leading-tight">
            TINGKATKAN LEVEL TIM <br className="hidden sm:inline" />
            DENGAN <span className="bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-violet bg-clip-text text-transparent">SCRIM RESMI</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-400 leading-relaxed">
            Temukan lawan tanding berkualitas untuk skuad Anda. Format BO1, BO3, hingga Battle Royale 16 tim. Sistem verifikasi roster kapten, jadwal WIB akurat, dan integrasi webhook Discord.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/scrims"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan via-blue-600 to-neon-violet px-8 py-3.5 text-sm font-extrabold text-white shadow-neonCyan hover:opacity-95 transition-all"
            >
              <Swords className="h-4 w-4" />
              <span>Jelajahi Jadwal Scrim</span>
            </Link>

            <Link
              href="/teams/create"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-borderSubtle bg-surface hover:bg-surfaceHover px-8 py-3.5 text-sm font-extrabold text-slate-200 hover:text-white transition-all"
            >
              <Shield className="h-4 w-4 text-neon-violet" />
              <span>Daftarkan Tim Baru</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Supported Games Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Pilihan Game Kompetitif
          </span>
          <h2 className="text-2xl font-black text-white font-mono mt-1">
            DIVISI GAME YANG DIDUKUNG
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {supportedGames.map((game) => (
            <Link
              key={game.key}
              href={`/scrims?game=${game.key}`}
              className={`cyber-card rounded-2xl p-4 text-center space-y-2 border border-borderSubtle transition-all hover:-translate-y-1 ${game.border}`}
            >
              <div className="h-10 w-10 mx-auto rounded-xl bg-surfaceHover flex items-center justify-center text-neon-cyan">
                <Swords className="h-5 w-5" />
              </div>
              <h3 className="text-xs font-bold text-white">{game.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono">{game.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Scrims Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan">
                Slot Tersedia
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              SCRIM TERBUKA MINGGU INI
            </h2>
          </div>

          <Link
            href="/scrims"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neon-cyan hover:underline"
          >
            <span>Lihat Semua Jadwal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredScrims.map((scrim) => {
            const gameMeta = GAME_LABELS[scrim.game] || {
              name: scrim.game,
              badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
            };
            const statusMeta = STATUS_BADGES[scrim.status] || {
              label: scrim.status,
              class: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
            };

            const approvedCount = scrim.registrations.filter(
              (r) => r.status === "APPROVED"
            ).length;

            return (
              <div
                key={scrim.id}
                className="cyber-card rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${gameMeta.badge}`}
                    >
                      {gameMeta.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusMeta.class}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {scrim.title}
                  </h3>

                  <div className="flex items-center gap-2 rounded-xl bg-surface p-2.5 border border-borderSubtle text-xs">
                    <Calendar className="h-4 w-4 text-neon-cyan shrink-0" />
                    <span className="font-semibold text-slate-200">
                      {formatWIB(scrim.startTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      Slot Terisi:
                    </span>
                    <span className="font-mono font-bold text-white">
                      {approvedCount} / {scrim.maxSlots} Tim
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-borderSubtle">
                  <Link
                    href={`/scrims/${scrim.id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-neon-cyan py-2.5 text-xs font-bold text-[#08090d] hover:bg-neon-cyan/90 transition-all shadow-neonCyan"
                  >
                    <span>Daftarkan Tim</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan">
            Keunggulan NexusScrim
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
            DIRANCANG UNTUK KOMUNITAS ESPORTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">
              Verifikasi Roster Kapten
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Setiap pendaftaran scrim hanya dapat diajukan oleh kapten tim terdaftar. Sistem validasi memastikan satu pemain hanya berada di satu tim per game.
            </p>
          </div>

          <div className="cyber-card rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-neon-violet/20 flex items-center justify-center text-neon-violet">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">
              Sinkronisasi Jadwal WIB
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tidak ada lagi salah jadwal atau timezone mismatch. Semua waktu pertandingan distandarisasi ke Waktu Indonesia Barat dengan kejelasan server region.
            </p>
          </div>

          <div className="cyber-card rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white font-mono">
              Rekap Hasil & Track Record
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arsip skor resmi, catatan MVP, dan verifikasi screenshot pertandingan tersimpan rapi untuk memantau perkembangan tim Anda menuju turnamen pro.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-neon-cyan/30 bg-gradient-to-r from-surface via-[#101426] to-surface p-8 sm:p-12 overflow-hidden text-center space-y-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neon-cyan/20 text-neon-cyan mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white font-mono">
            SIAP MEMULAI SCRIM PERTAMA TIM KAMU?
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400">
            Daftarkan tim Anda sekarang, ajak roster dengan kode undangan instan, dan temukan rival latih tanding hari ini juga.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/teams/create"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet px-8 py-3 text-xs font-bold text-white shadow-neonCyan hover:opacity-90"
            >
              <span>Buat Tim Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
