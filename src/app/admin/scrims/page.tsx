import React from "react";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getScrims } from "@/lib/data";
import { Swords, Plus, Clock, Shield } from "lucide-react";
import { AdminScrimsTable } from "@/components/admin/AdminScrimsTable";

export const dynamic = "force-dynamic";

export default async function AdminScrimsPage() {
  const session = await getServerAuthSession();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin/scrims&error=unauthorized_admin");
  }

  let scrims: any[] = [];
  let totalTeams = 0;
  let pendingCount = 0;
  let activeScrimsCount = 0;

  try {
    scrims = await prisma.scrim.findMany({
      orderBy: { startTime: "desc" },
      include: {
        registrations: {
          include: { team: true },
        },
      },
    });

    totalTeams = await prisma.team.count();
    pendingCount = await prisma.scrimRegistration.count({
      where: { status: "PENDING" },
    });
    activeScrimsCount = scrims.filter((s) => s.status === "OPEN").length;
  } catch {
    // fallback if db is pending
    scrims = await getScrims();
    totalTeams = 4;
    pendingCount = 1;
    activeScrimsCount = scrims.filter((s) => s.status === "OPEN").length;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-borderSubtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white font-mono mt-1">
            MANAJEMEN <span className="text-rose-400">SCRIM</span> & TIM
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola pembukaan scrim, verifikasi pendaftaran tim, dan publikasikan hasil pertandingan.
          </p>
        </div>

        <Link
          href="/admin/scrims/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan to-blue-600 px-5 py-2.5 text-xs font-bold text-[#08090d] shadow-neonCyan hover:opacity-95"
        >
          <Plus className="h-4 w-4" />
          Buat Jadwal Scrim Baru
        </Link>
      </div>

      {/* Metrics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Swords className="h-3.5 w-3.5 text-neon-cyan" />
            Total Scrim
          </span>
          <div className="text-2xl font-black text-white font-mono">{scrims.length}</div>
        </div>

        <div className="cyber-card rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
            Scrim Terbuka
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {activeScrimsCount}
          </div>
        </div>

        <div className="cyber-card rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            Pendaftaran Pending
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {pendingCount}
          </div>
        </div>

        <div className="cyber-card rounded-2xl p-5 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-neon-violet" />
            Tim Terdaftar
          </span>
          <div className="text-2xl font-black text-white font-mono">{totalTeams}</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Semua Jadwal Pertandingan
          </h3>
        </div>

        <AdminScrimsTable scrims={scrims} />
      </div>
    </div>
  );
}
