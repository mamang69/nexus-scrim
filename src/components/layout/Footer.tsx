import React from "react";
import Link from "next/link";
import { Swords, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-borderSubtle bg-[#050609] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan/20 border border-neon-cyan/40">
                <Swords className="h-4 w-4 text-neon-cyan" />
              </div>
              <span className="font-extrabold tracking-wider text-white text-base font-mono">
                NEXUS<span className="text-neon-cyan">{"//"}</span>SCRIM
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform matchmaking dan turnamen scrim e-sports kompetitif untuk tim semi-pro dan amatir se-Indonesia.
            </p>
          </div>

          {/* Supported Games */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Game Populer
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/scrims?game=VALORANT" className="hover:text-neon-cyan">Valorant</Link></li>
              <li><Link href="/scrims?game=MOBILE_LEGENDS" className="hover:text-neon-cyan">Mobile Legends: Bang Bang</Link></li>
              <li><Link href="/scrims?game=PUBG_MOBILE" className="hover:text-neon-cyan">PUBG Mobile</Link></li>
              <li><Link href="/scrims?game=FREE_FIRE" className="hover:text-neon-cyan">Free Fire</Link></li>
              <li><Link href="/scrims?game=DOTA_2" className="hover:text-neon-cyan">Dota 2 & CS2</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Akses Cepat
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/scrims" className="hover:text-neon-cyan">Jadwal Scrim Terbaru</Link></li>
              <li><Link href="/teams" className="hover:text-neon-cyan">Daftar Tim & Roster</Link></li>
              <li><Link href="/teams/create" className="hover:text-neon-cyan">Daftarkan Tim Baru</Link></li>
              <li><Link href="/my-registrations" className="hover:text-neon-cyan">Status Pendaftaran</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 font-mono">
              Komunitas
            </h4>
            <p className="text-xs leading-relaxed mb-3">
              Bergabunglah di server Discord resmi kami untuk koordinasi lobby, ruleset, dan voice channel.
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg border border-borderSubtle bg-surface px-3 py-1.5 text-xs text-neon-cyan">
              <Shield className="h-3.5 w-3.5" />
              <span>Discord Community</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-borderSubtle/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NexusScrim. Built for the Indonesian Esports Community.</p>
          <p className="flex items-center gap-1">
            Ditenagai oleh Next.js App Router + Prisma + Neon PostgreSQL
          </p>
        </div>
      </div>
    </footer>
  );
}
