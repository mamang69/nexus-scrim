"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cancelRegistration } from "@/actions/scrim";
import { formatWIB, GAME_LABELS } from "@/lib/utils";
import { Calendar, Shield, XCircle, ArrowRight, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegistrationItem {
  id: string;
  status: string;
  registeredAt: Date | string;
  notes: string | null;
  team: {
    id: string;
    name: string;
    tag: string;
    game: string;
  };
  scrim: {
    id: string;
    title: string;
    game: string;
    format: string;
    startTime: Date | string;
    status: string;
  };
}

export function MyRegistrationsList({
  registrations,
}: {
  registrations: RegistrationItem[];
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCancel = async (regId: string) => {
    if (confirm("Apakah Anda yakin ingin membatalkan pendaftaran tim ini?")) {
      setLoadingId(regId);
      setErrorMsg(null);
      const res = await cancelRegistration(regId);
      setLoadingId(null);
      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.refresh();
      }
    }
  };

  if (registrations.length === 0) {
    return (
      <div className="cyber-card rounded-2xl p-12 text-center space-y-3">
        <Shield className="mx-auto h-12 w-12 text-slate-600" />
        <h3 className="text-base font-bold text-white font-mono">
          Belum Ada Pendaftaran Scrim
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Tim Anda belum terdaftar di jadwal scrim manapun saat ini.
        </p>
        <Link
          href="/scrims"
          className="inline-flex items-center gap-2 rounded-xl bg-neon-cyan px-4 py-2 text-xs font-bold text-[#08090d] hover:bg-neon-cyan/90 transition-all"
        >
          Jelajahi Scrim Terbuka
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registrations.map((reg) => {
          const gameMeta = GAME_LABELS[reg.scrim.game] || {
            name: reg.scrim.game,
            badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
          };
          const isApproved = reg.status === "APPROVED";
          const isPending = reg.status === "PENDING";
          const isCancelled = reg.status === "CANCELLED";

          return (
            <div
              key={reg.id}
              className="cyber-card rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${gameMeta.badge}`}
                  >
                    {gameMeta.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold flex items-center gap-1 ${
                      isApproved
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : isPending
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                        : "bg-rose-500/10 border-rose-500/40 text-rose-400"
                    }`}
                  >
                    {isApproved && <CheckCircle2 className="h-3 w-3" />}
                    {isPending && <Clock className="h-3 w-3" />}
                    {reg.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white line-clamp-1">
                  {reg.scrim.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-mono text-neon-cyan font-bold">
                    Tim: [{reg.team.tag}] {reg.team.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-surface p-2.5 border border-borderSubtle text-xs">
                  <Calendar className="h-4 w-4 text-neon-cyan shrink-0" />
                  <span className="font-semibold text-slate-200">
                    {formatWIB(reg.scrim.startTime)}
                  </span>
                </div>

                {reg.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-background/50 p-2 rounded border border-borderSubtle">
                    Catatan: &quot;{reg.notes}&quot;
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-borderSubtle flex items-center justify-between">
                <Link
                  href={`/scrims/${reg.scrim.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neon-cyan hover:underline"
                >
                  <span>Buka Scrim</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {!isCancelled && reg.scrim.status === "OPEN" && (
                  <button
                    onClick={() => handleCancel(reg.id)}
                    disabled={loadingId === reg.id}
                    className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>{loadingId === reg.id ? "Membatalkan..." : "Batalkan"}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
