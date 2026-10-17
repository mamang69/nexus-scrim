"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createTeam } from "@/actions/team";
import { Shield, ArrowLeft, Send, AlertCircle, Info } from "lucide-react";
import Link from "next/link";

const GAME_OPTIONS = [
  { value: "VALORANT", label: "Valorant (5v5 Tactical Shooter)" },
  { value: "MOBILE_LEGENDS", label: "Mobile Legends: Bang Bang (5v5 MOBA)" },
  { value: "PUBG_MOBILE", label: "PUBG Mobile (Squad Battle Royale)" },
  { value: "FREE_FIRE", label: "Free Fire (Squad Battle Royale)" },
  { value: "DOTA_2", label: "Dota 2 (5v5 MOBA)" },
  { value: "CS2", label: "Counter-Strike 2 (5v5 FPS)" },
];

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await createTeam(formData);

    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.teamId) {
      router.push(`/teams/${res.teamId}`);
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-neon-cyan mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Tim
      </Link>

      <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-6 w-6 text-neon-violet" />
            <h1 className="text-2xl font-black text-white font-mono">DAFTARKAN TIM BARU</h1>
          </div>
          <p className="text-xs text-slate-400">
            Setelah membuat tim, Anda akan otomatis ditunjuk sebagai Kapten dan mendapatkan kode undangan unik untuk mengajak anggota roster Anda.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20 text-xs text-neon-cyan">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Aturan Komunitas:</strong> Setiap pemain hanya dapat menjadi bagian dari satu tim aktif per judul game.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Divisi Game <span className="text-rose-400">*</span>
            </label>
            <select
              name="game"
              required
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white focus:border-neon-cyan focus:outline-none"
            >
              {GAME_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Nama Lengkap Tim <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="misal: Rex Regum Qeon"
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Tag / Singkatan <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="tag"
                required
                maxLength={6}
                placeholder="misal: RRQ"
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs font-mono font-bold uppercase text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              URL Logo Tim (Opsional)
            </label>
            <input
              type="url"
              name="logo"
              placeholder="https://example.com/logo.png (Biarkan kosong untuk avatar default)"
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Deskripsi & Motto Tim (Opsional)
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Ceritakan tentang tim Anda, target turnamen, atau jam latihan rutin."
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan via-blue-600 to-neon-violet py-3 text-xs font-bold text-white shadow-neonCyan hover:opacity-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? "Mendaftarkan Tim..." : "Buat Tim Sekarang"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
