"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recordMatchResult } from "@/actions/scrim";
import { Trophy, ArrowLeft, Send, AlertCircle } from "lucide-react";

export default function AdminMatchResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await recordMatchResult(params.id, formData);

    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.push(`/scrims/${params.id}`);
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
        Kembali ke Dashboard Admin
      </Link>

      <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl font-black text-white font-mono">
              INPUT HASIL PERTANDINGAN
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Simpan skor akhir match dan tautan bukti screenshot. Status Scrim akan otomatis diperbarui menjadi <strong>SELESAI (COMPLETED)</strong>.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-xl bg-surface border border-borderSubtle">
              <label className="text-xs font-semibold text-slate-300 block font-mono">
                Tim A (Nama & Skor)
              </label>
              <input
                type="text"
                name="teamAName"
                required
                placeholder="misal: Paper Rex Academy"
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
              />
              <input
                type="number"
                name="scoreTeamA"
                required
                defaultValue={0}
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs font-mono font-bold text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-surface border border-borderSubtle">
              <label className="text-xs font-semibold text-slate-300 block font-mono">
                Tim B (Nama & Skor)
              </label>
              <input
                type="text"
                name="teamBName"
                required
                placeholder="misal: Fnatic Rising"
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
              />
              <input
                type="number"
                name="scoreTeamB"
                required
                defaultValue={0}
                className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs font-mono font-bold text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Detail Pertandingan / MVP / Catatan Map
            </label>
            <textarea
              name="details"
              rows={3}
              placeholder="misal: Map: Ascent. Pertandingan ketat overtime! MVP: PRX f0rsakeN (28/14/8 KDA)"
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
              Tautan Bukti Screenshot / Streaming VOD
            </label>
            <input
              type="url"
              name="proofUrl"
              placeholder="https://imgur.com/screenshot.png atau link YouTube VOD"
              className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-xs font-bold text-[#08090d] shadow-lg shadow-amber-500/20 hover:opacity-95 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? "Menyimpan Hasil..." : "Publikasikan Hasil Pertandingan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
