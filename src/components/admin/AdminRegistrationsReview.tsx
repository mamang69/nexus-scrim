"use client";

import React, { useState } from "react";
import { reviewRegistration } from "@/actions/scrim";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface RegItem {
  id: string;
  status: string;
  registeredAt: Date | string;
  notes: string | null;
  team: {
    id: string;
    name: string;
    tag: string;
    logo: string | null;
    captain: {
      name: string | null;
      gameTag: string | null;
    } | null;
    members?: any[];
  };
}

interface AdminRegistrationsReviewProps {
  scrimId?: string;
  scrimTitle?: string;
  maxSlots: number;
  registrations: RegItem[];
}

export function AdminRegistrationsReview({
  maxSlots,
  registrations,
}: AdminRegistrationsReviewProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReview = async (regId: string, status: "APPROVED" | "REJECTED") => {
    setLoadingId(regId);
    setErrorMsg(null);
    const res = await reviewRegistration(regId, status);
    setLoadingId(null);
    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      router.refresh();
    }
  };

  const approvedCount = registrations.filter((r) => r.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-borderSubtle">
        <span className="text-xs text-slate-300">
          Slot Terisi: <strong className="font-mono text-neon-cyan">{approvedCount}</strong> dari{" "}
          <strong className="font-mono text-white">{maxSlots}</strong> Tim
        </span>
        <span className="text-xs font-mono text-slate-400">
          Total Pendaftar: {registrations.length}
        </span>
      </div>

      {registrations.length === 0 ? (
        <div className="cyber-card rounded-2xl p-12 text-center text-xs text-slate-400">
          Belum ada tim yang mendaftar ke scrim ini.
        </div>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => {
            const isApproved = reg.status === "APPROVED";
            const isPending = reg.status === "PENDING";
            const isRejected = reg.status === "REJECTED";

            return (
              <div
                key={reg.id}
                className="cyber-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Team Info */}
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-800 overflow-hidden ring-1 ring-borderActive shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reg.team.logo || `https://api.dicebear.com/7.x/identicon/svg?seed=${reg.team.tag}`}
                      alt={reg.team.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white">{reg.team.name}</h4>
                      <span className="text-xs font-mono text-neon-cyan font-bold">
                        [{reg.team.tag}]
                      </span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          isApproved
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : isPending
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>
                        Kapten: <strong className="text-slate-200">{reg.team.captain?.name || "Captain"}</strong>
                      </span>
                      {reg.team.captain?.gameTag && (
                        <span className="font-mono text-neon-cyan">
                          ({reg.team.captain.gameTag})
                        </span>
                      )}
                    </div>

                    {reg.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-background/60 p-2 rounded border border-borderSubtle">
                        Catatan Kapten: &quot;{reg.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Action Buttons */}
                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-borderSubtle">
                  {!isApproved && (
                    <button
                      onClick={() => handleReview(reg.id, "APPROVED")}
                      disabled={loadingId === reg.id || (approvedCount >= maxSlots && !isApproved)}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090d] px-3.5 py-2 text-xs font-bold transition-all disabled:opacity-40"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Setujui (Approve)</span>
                    </button>
                  )}

                  {!isRejected && (
                    <button
                      onClick={() => handleReview(reg.id, "REJECTED")}
                      disabled={loadingId === reg.id}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-3 py-2 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Tolak (Reject)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
