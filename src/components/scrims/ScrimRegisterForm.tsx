"use client";

import React, { useState } from "react";
import { registerTeamToScrim, cancelRegistration } from "@/actions/scrim";
import { Shield, Send, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserTeamOption {
  id: string;
  name: string;
  tag: string;
  game: string;
  captainId: string;
}

interface ExistingRegistration {
  id: string;
  status: string;
  teamId: string;
}

interface ScrimRegisterFormProps {
  scrimId: string;
  scrimGame: string;
  scrimStatus: string;
  isLoggedIn: boolean;
  userTeams: UserTeamOption[];
  existingRegistration?: ExistingRegistration | null;
}

export function ScrimRegisterForm({
  scrimId,
  scrimGame,
  scrimStatus,
  isLoggedIn,
  userTeams,
  existingRegistration,
}: ScrimRegisterFormProps) {
  const router = useRouter();
  const [selectedTeamId, setSelectedTeamId] = useState(userTeams[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="cyber-card rounded-2xl p-6 text-center space-y-3">
        <Shield className="mx-auto h-10 w-10 text-neon-cyan/70" />
        <h4 className="text-base font-bold text-white font-mono">Daftarkan Tim Kamu</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Kamu harus login sebagai kapten tim untuk mendaftarkan skuad ke scrim ini.
        </p>
        <Link
          href={`/login?callbackUrl=/scrims/${scrimId}`}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet px-6 py-2.5 text-xs font-bold text-white shadow-neonCyan hover:opacity-90"
        >
          Masuk / Login Sekarang
        </Link>
      </div>
    );
  }

  if (existingRegistration) {
    const isApproved = existingRegistration.status === "APPROVED";
    const isCancelled = existingRegistration.status === "CANCELLED";

    if (!isCancelled) {
      return (
        <div className="cyber-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            {isApproved ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            ) : (
              <AlertCircle className="h-6 w-6 text-amber-400" />
            )}
            <div>
              <h4 className="text-sm font-bold text-white">Tim Anda Sudah Terdaftar</h4>
              <p className="text-xs text-slate-400">
                Status saat ini:{" "}
                <strong
                  className={`font-mono ${
                    isApproved ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {isApproved ? "DISETUJUI (APPROVED)" : "MENUNGGU VERIFIKASI (PENDING)"}
                </strong>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {isApproved
              ? "Slot tim Anda telah dikonfirmasi oleh panitia. Mohon hadir di room koordinasi Discord 15 menit sebelum scrim dimulai."
              : "Pengajuan slot tim Anda sedang ditinjau oleh panitia turnamen/admin."}
          </p>

          <button
            onClick={async () => {
              if (confirm("Apakah Anda yakin ingin membatalkan pendaftaran tim ini?")) {
                setLoading(true);
                const res = await cancelRegistration(existingRegistration.id);
                setLoading(false);
                if (res?.error) {
                  setErrorMsg(res.error);
                } else {
                  router.refresh();
                }
              }
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            Batalkan Pendaftaran
          </button>
        </div>
      );
    }
  }

  if (scrimStatus !== "OPEN") {
    return (
      <div className="cyber-card rounded-2xl p-6 text-center space-y-2">
        <h4 className="text-sm font-bold text-white font-mono">Pendaftaran Ditutup</h4>
        <p className="text-xs text-slate-400">
          Scrim ini saat ini berstatus <strong>{scrimStatus}</strong> dan tidak menerima pendaftaran baru.
        </p>
      </div>
    );
  }

  if (userTeams.length === 0) {
    return (
      <div className="cyber-card rounded-2xl p-6 space-y-3">
        <h4 className="text-sm font-bold text-white font-mono">Belum Memiliki Tim {scrimGame}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">
          Anda belum memiliki tim terdaftar untuk game <strong>{scrimGame}</strong> di mana Anda menjabat sebagai kapten.
        </p>
        <Link
          href="/teams/create"
          className="inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-2 text-xs font-bold text-[#08090d] hover:bg-neon-cyan/90"
        >
          <Shield className="h-4 w-4" />
          Buat Tim {scrimGame} Sekarang
        </Link>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await registerTeamToScrim(scrimId, selectedTeamId, notes);
    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(res?.message || "Pendaftaran berhasil diajukan!");
      router.refresh();
    }
  };

  return (
    <div className="cyber-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2.5 pb-3 border-b border-borderSubtle">
        <Shield className="h-5 w-5 text-neon-cyan" />
        <h4 className="text-sm font-bold text-white font-mono">
          Form Pendaftaran Tim Kapten
        </h4>
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

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5 font-mono">
            Pilih Tim Anda ({scrimGame})
          </label>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs text-white focus:border-neon-cyan focus:outline-none"
          >
            {userTeams.map((t) => (
              <option key={t.id} value={t.id}>
                [{t.tag}] {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5 font-mono">
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Roster siap full 5 pemain, line up standar."
            className="w-full rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !selectedTeamId}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-violet py-2.5 text-xs font-bold text-white shadow-neonCyan hover:opacity-95 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {loading ? "Memproses Pendaftaran..." : "Ajukan Pendaftaran Tim"}
        </button>
      </form>
    </div>
  );
}
