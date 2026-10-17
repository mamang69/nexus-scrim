"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createScrim } from "@/actions/scrim";
import { Swords, ArrowLeft, Send, AlertCircle } from "lucide-react";
import Link from "next/link";

const GAME_OPTIONS = [
  { value: "VALORANT", label: "Valorant" },
  { value: "MOBILE_LEGENDS", label: "Mobile Legends: Bang Bang" },
  { value: "PUBG_MOBILE", label: "PUBG Mobile" },
  { value: "FREE_FIRE", label: "Free Fire" },
  { value: "DOTA_2", label: "Dota 2" },
  { value: "CS2", label: "Counter-Strike 2" },
];

const FORMAT_OPTIONS = [
  { value: "BO1", label: "Best of 1 (BO1)" },
  { value: "BO3", label: "Best of 3 (BO3)" },
  { value: "BO5", label: "Best of 5 (BO5)" },
  { value: "BATTLE_ROYALE", label: "Battle Royale (Squad Multiple Rounds)" },
];

export default function AdminNewScrimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await createScrim(formData);

    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.scrimId) {
      router.push(`/scrims/${res.scrimId}`);
      router.refresh();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/admin/scrims"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-neon-cyan mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Admin Scrim
      </Link>

      <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="h-6 w-6 text-neon-cyan" />
            <h1 className="text-2xl font-black text-white font-mono">BUAT JADWAL SCRIM BARU</h1>
          </div>
          <p className="text-xs text-slate-400">
            Publikasikan jadwal scrim kompetitif. Notifikasi otomatis akan dikirim ke Discord jika webhook terhubung.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Judul Scrim <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="misal: Valorant Tier 1-2 Weekly Showdown"
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Pilih Game <span className="text-rose-400">*</span>
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

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Format Pertandingan <span className="text-rose-400">*</span>
              </label>
              <select
                name="format"
                required
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white focus:border-neon-cyan focus:outline-none"
              >
                {FORMAT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Waktu Pertandingan (WIB) <span className="text-rose-400">*</span>
              </label>
              <input
                type="datetime-local"
                name="startTime"
                required
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Kapasitas Slot Tim <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                name="maxSlots"
                required
                defaultValue={2}
                min={2}
                max={32}
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Server / Region
              </label>
              <input
                type="text"
                name="serverRegion"
                defaultValue="Indonesia / Singapore"
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
                Hadiah / Mode Latihan
              </label>
              <input
                type="text"
                name="prizePool"
                placeholder="misal: Rp 1.000.000 atau Friendly Practice"
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Aturan & Ketentuan Scrim
            </label>
            <textarea
              name="rules"
              rows={4}
              placeholder="Sebutkan map pool, batas waktu jeda tactical pause, peraturan server lobby, dsb."
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 py-3 text-xs font-bold text-[#08090d] shadow-neonCyan hover:opacity-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? "Menyimpan Scrim..." : "Publikasikan Scrim"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
