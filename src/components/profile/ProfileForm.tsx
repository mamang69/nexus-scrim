"use client";

import React, { useState } from "react";
import { updateProfile } from "@/actions/user";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialName: string;
  initialGameTag: string;
  initialDiscordUsername: string;
}

export function ProfileForm({
  initialName,
  initialGameTag,
  initialDiscordUsername,
}: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateProfile(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profil berhasil diperbarui!</span>
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
          Nama Tampilan
        </label>
        <input
          type="text"
          name="name"
          defaultValue={initialName}
          className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
          In-Game Nickname & Tag (IGN)
        </label>
        <input
          type="text"
          name="gameTag"
          defaultValue={initialGameTag}
          placeholder="misal: PRX f0rsakeN#WIB atau Lemon#MLBB"
          className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
        />
        <p className="text-[11px] text-slate-500 mt-1">
          Tag ini akan ditampilkan pada roster tim saat bertanding di Scrim.
        </p>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-1.5 font-mono">
          Username Discord
        </label>
        <input
          type="text"
          name="discordUsername"
          defaultValue={initialDiscordUsername}
          placeholder="misal: boaster#1234 atau boaster"
          className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-neon-cyan px-5 py-2.5 text-xs font-bold text-[#08090d] hover:bg-neon-cyan/90 transition-all shadow-neonCyan disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
