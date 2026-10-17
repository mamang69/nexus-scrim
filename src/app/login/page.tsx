"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Swords, Shield, Sparkles, User, ArrowRight, AlertCircle } from "lucide-react";

import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState("");
  const [customRole, setCustomRole] = useState("MEMBER");

  const handleDemoLogin = async (email: string, role: string) => {
    setLoadingRole(role);
    try {
      const res = await signIn("demo-login", {
        email,
        role,
        redirect: false,
        callbackUrl,
      });

      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan via-blue-600 to-neon-violet p-[2px] shadow-neonCyan mb-2">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c0e17]">
              <Swords className="h-7 w-7 text-neon-cyan" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-mono">
            MASUK KE <span className="text-neon-cyan">NEXUS</span>{"//"}SCRIM
          </h1>
          <p className="text-xs text-slate-400">
            Pilih metode login Discord atau gunakan akun demo untuk menguji semua fitur
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {error === "unauthorized_admin"
                ? "Halaman ini memerlukan akses Admin. Silakan login menggunakan akun Admin."
                : "Terjadi kesalahan saat otentikasi. Silakan coba kembali."}
            </span>
          </div>
        )}

        <div className="cyber-card rounded-2xl p-6 space-y-6">
          {/* Discord OAuth Login */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3 font-mono">
              Otentikasi Resmi
            </label>
            <button
              onClick={() => signIn("discord", { callbackUrl })}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] py-3 px-4 font-semibold text-white shadow-lg shadow-[#5865F2]/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Lanjut dengan Discord OAuth</span>
            </button>
            <p className="mt-1.5 text-[11px] text-slate-500 text-center">
              Perlu konfigurasi DISCORD_CLIENT_ID di .env untuk menghubungkan ke bot Discord Anda
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-borderSubtle"></div>
            </div>
            <span className="relative bg-[#0f1118] px-3 text-[11px] font-mono uppercase text-slate-400">
              Atau Uji Instan via Demo Akun
            </span>
          </div>

          {/* Quick Demo Logins */}
          <div className="space-y-2.5">
            {/* Admin */}
            <button
              onClick={() => handleDemoLogin("admin@scrim.gg", "ADMIN")}
              disabled={!!loadingRole}
              className="flex w-full items-center justify-between p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Login sebagai Admin</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1 rounded font-mono">
                      ADMIN
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    admin@scrim.gg • Akses Buat Scrim & Validasi Tim
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Captain */}
            <button
              onClick={() => handleDemoLogin("captain.prx@scrim.gg", "CAPTAIN")}
              disabled={!!loadingRole}
              className="flex w-full items-center justify-between p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Login sebagai Kapten Tim</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono">
                      CAPTAIN
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    captain.prx@scrim.gg • Kapten Paper Rex Academy
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Player Member */}
            <button
              onClick={() => handleDemoLogin("member@scrim.gg", "MEMBER")}
              disabled={!!loadingRole}
              className="flex w-full items-center justify-between p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Login sebagai Player Member</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1 rounded font-mono">
                      MEMBER
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    member@scrim.gg • Roster Paper Rex (Jinggg)
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          {/* Custom Account Form */}
          <div className="border-t border-borderSubtle pt-4 space-y-3">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block font-mono">
              Atau Buat Akun Baru Sesuai Keinginan
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="nama@email.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="flex-1 rounded-xl border border-borderSubtle bg-background px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-neon-cyan focus:outline-none"
              />
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="rounded-xl border border-borderSubtle bg-background px-2.5 py-2 text-xs text-white focus:border-neon-cyan focus:outline-none"
              >
                <option value="MEMBER">Member</option>
                <option value="CAPTAIN">Captain</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                onClick={() => {
                  if (customEmail) handleDemoLogin(customEmail, customRole);
                }}
                disabled={!customEmail || !!loadingRole}
                className="rounded-xl bg-neon-cyan px-3 py-2 text-xs font-bold text-[#08090d] hover:bg-neon-cyan/90 disabled:opacity-50"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-xs text-slate-400 font-mono">Loading authentication...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
