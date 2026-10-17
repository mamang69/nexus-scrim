"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deleteScrim } from "@/actions/scrim";
import { formatWIB, GAME_LABELS, STATUS_BADGES } from "@/lib/utils";
import {
  Users,
  Trophy,
  Trash2,
  Clock,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ScrimItem {
  id: string;
  title: string;
  game: string;
  format: string;
  startTime: Date | string;
  maxSlots: number;
  status: string;
  registrations: {
    id: string;
    status: string;
    team: {
      name: string;
      tag: string;
    };
  }[];
}

export function AdminScrimsTable({ scrims }: { scrims: ScrimItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus scrim "${title}"?`)) {
      setLoadingId(id);
      await deleteScrim(id);
      setLoadingId(null);
      router.refresh();
    }
  };

  return (
    <div className="cyber-card rounded-2xl overflow-hidden border border-borderSubtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-borderSubtle bg-surface text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Scrim & Game</th>
              <th className="py-3 px-4">Jadwal (WIB)</th>
              <th className="py-3 px-4">Slot Disetujui</th>
              <th className="py-3 px-4">Menunggu Review</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderSubtle text-xs">
            {scrims.map((scrim) => {
              const gameMeta = GAME_LABELS[scrim.game] || {
                name: scrim.game,
                badge: "border-slate-500/30 text-slate-300 bg-slate-500/10",
              };
              const statusMeta = STATUS_BADGES[scrim.status] || {
                label: scrim.status,
                class: "bg-slate-700/40 text-slate-400",
              };

              const approvedCount = scrim.registrations.filter(
                (r) => r.status === "APPROVED"
              ).length;
              const pendingCount = scrim.registrations.filter(
                (r) => r.status === "PENDING"
              ).length;

              return (
                <tr key={scrim.id} className="hover:bg-surface/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white line-clamp-1">
                        {scrim.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold ${gameMeta.badge}`}
                        >
                          {gameMeta.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {scrim.format}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                    {formatWIB(scrim.startTime)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    <span className="text-neon-cyan">{approvedCount}</span> / {scrim.maxSlots}
                  </td>

                  <td className="py-3.5 px-4">
                    {pendingCount > 0 ? (
                      <Link
                        href={`/admin/scrims/${scrim.id}/registrations`}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold hover:bg-amber-500/20"
                      >
                        <Clock className="h-3 w-3" />
                        {pendingCount} Tim Pending
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">0 Pending</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${statusMeta.class}`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/scrims/${scrim.id}/registrations`}
                        title="Review Pendaftaran Tim"
                        className="p-1.5 rounded-lg border border-borderSubtle bg-surface hover:bg-surfaceHover text-slate-300 hover:text-white"
                      >
                        <Users className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/scrims/${scrim.id}/results`}
                        title="Input Hasil Pertandingan"
                        className="p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300"
                      >
                        <Trophy className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/scrims/${scrim.id}`}
                        title="Lihat Halaman Publik"
                        className="p-1.5 rounded-lg border border-borderSubtle bg-surface hover:bg-surfaceHover text-slate-300 hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(scrim.id, scrim.title)}
                        disabled={loadingId === scrim.id}
                        title="Hapus Scrim"
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
