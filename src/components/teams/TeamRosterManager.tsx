"use client";

import React, { useState } from "react";
import { kickMember, transferCaptain, leaveTeam } from "@/actions/team";
import {
  Users,
  Shield,
  UserX,
  Crown,
  LogOut,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface MemberItem {
  id: string;
  userId: string;
  roleInTeam: string;
  gameTag: string | null;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface TeamRosterManagerProps {
  teamId: string;
  teamName?: string;
  captainId: string;
  inviteCode: string;
  members: MemberItem[];
  currentUserId?: string;
  isAdmin?: boolean;
}

export function TeamRosterManager({
  teamId,
  captainId,
  inviteCode,
  members,
  currentUserId,
  isAdmin,
}: TeamRosterManagerProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isCaptain = currentUserId === captainId || isAdmin;
  const isMember = members.some((m) => m.userId === currentUserId);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKick = async (targetUserId: string, memberName: string) => {
    if (confirm(`Apakah Anda yakin ingin mengeluarkan ${memberName} dari roster?`)) {
      setLoading(true);
      setActionError(null);
      const res = await kickMember(teamId, targetUserId);
      setLoading(false);
      if (res?.error) {
        setActionError(res.error);
      } else {
        router.refresh();
      }
    }
  };

  const handleTransfer = async (targetUserId: string, memberName: string) => {
    if (confirm(`Pindahkan jabatan Kapten kepada ${memberName}? Anda akan menjadi anggota biasa.`)) {
      setLoading(true);
      setActionError(null);
      const res = await transferCaptain(teamId, targetUserId);
      setLoading(false);
      if (res?.error) {
        setActionError(res.error);
      } else {
        router.refresh();
      }
    }
  };

  const handleLeave = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari tim ini?")) {
      setLoading(true);
      setActionError(null);
      const res = await leaveTeam(teamId);
      setLoading(false);
      if (res?.error) {
        setActionError(res.error);
      } else {
        router.push("/teams");
        router.refresh();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Invite Code Box (for Captain) */}
      {isCaptain && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-neon-cyan/30 bg-neon-cyan/5 p-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-neon-cyan font-mono flex items-center gap-1.5">
              <Shield className="h-4 w-4" /> KODE UNDANGAN ROSTER
            </span>
            <p className="text-xs text-slate-400">
              Bagikan kode ini kepada rekan tim Anda agar mereka dapat bergabung:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-borderSubtle bg-background px-4 py-2 font-mono text-sm font-extrabold tracking-widest text-white uppercase">
              {inviteCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 rounded-xl bg-neon-cyan px-3 py-2 text-xs font-bold text-[#08090d] hover:bg-neon-cyan/90 transition-all shadow-neonCyan"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Tersalin!" : "Salin Kode"}</span>
            </button>
          </div>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Roster Cards / Table */}
      <div className="cyber-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-borderSubtle">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-neon-violet" />
            <h3 className="text-base font-bold text-white font-mono">
              Line-Up Roster ({members.length} Pemain)
            </h3>
          </div>

          {isMember && !isCaptain && (
            <button
              onClick={handleLeave}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Keluar Tim
            </button>
          )}
        </div>

        <div className="space-y-3">
          {members.map((member) => {
            const isMemberCaptain = member.roleInTeam === "CAPTAIN";
            const isSelf = member.userId === currentUserId;

            return (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-surface border border-borderSubtle hover:border-slate-700 transition-colors"
              >
                {/* Member Info */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-800 overflow-hidden ring-1 ring-borderActive shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${member.user.name}`}
                      alt={member.user.name || "Member"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {member.user.name || "Player"}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          YOU
                        </span>
                      )}
                      {isMemberCaptain ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                          <Crown className="h-3 w-3" /> KAPTEN
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          ROSTER
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-neon-cyan mt-0.5 block">
                      IGN: {member.gameTag || "Belum diatur"}
                    </span>
                  </div>
                </div>

                {/* Captain Management Controls */}
                {isCaptain && !isMemberCaptain && (
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-borderSubtle">
                    <button
                      onClick={() => handleTransfer(member.userId, member.user.name || "Member")}
                      disabled={loading}
                      title="Jadikan Kapten Tim"
                      className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 disabled:opacity-50"
                    >
                      <Crown className="h-3.5 w-3.5" />
                      <span>Transfer Kapten</span>
                    </button>
                    <button
                      onClick={() => handleKick(member.userId, member.user.name || "Member")}
                      disabled={loading}
                      title="Keluarkan dari Tim"
                      className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      <span>Keluarkan</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
