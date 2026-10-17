"use client";

import React, { useState } from "react";
import { joinTeamByInviteCode } from "@/actions/team";
import { KeyRound, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function JoinTeamCard() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [gameTag, setGameTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("inviteCode", inviteCode);
    formData.append("gameTag", gameTag);

    const res = await joinTeamByInviteCode(formData);
    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg("Berhasil bergabung ke tim!");
      setInviteCode("");
      setGameTag("");
      if (res?.teamId) {
        router.push(`/teams/${res.teamId}`);
      }
      router.refresh();
    }
  };

  return (
    <div className="cyber-card rounded-2xl p-6 border-neon-violet/30 bg-neon-violet/5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-neon-violet/20 flex items-center justify-center text-neon-violet">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white font-mono">
            Gabung Tim Menggunakan Kode Undangan
          </h3>
          <p className="text-xs text-slate-400">
            Dapatkan 6 digit kode invite dari kapten tim Anda untuk bergabung ke roster
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleJoin} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="KODE UNDANGAN (misal: PRX2026)"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          className="rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500 focus:border-neon-violet focus:outline-none uppercase"
        />
        <input
          type="text"
          placeholder="In-Game Tag Anda (misal: Lemon#ID)"
          value={gameTag}
          onChange={(e) => setGameTag(e.target.value)}
          className="rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-neon-violet focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inviteCode}
          className="flex items-center justify-center gap-2 rounded-xl bg-neon-violet hover:bg-neon-violet/90 text-white px-4 py-2 text-xs font-bold shadow-neonViolet disabled:opacity-50 transition-all"
        >
          <span>{loading ? "Memproses..." : "Gabung ke Roster"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
