"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Swords,
  Shield,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  ClipboardList,
} from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  const navLinks = [
    { href: "/scrims", label: "Daftar Scrim", icon: Calendar },
    { href: "/teams", label: "Tim & Roster", icon: Shield },
    ...(session
      ? [
          {
            href: "/my-registrations",
            label: "Pendaftaran Saya",
            icon: ClipboardList,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            href: "/admin/scrims",
            label: "Admin Panel",
            icon: Sparkles,
            badge: "ADMIN",
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-borderSubtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan via-blue-600 to-neon-violet p-[1px] shadow-neonCyan transition-all group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-[#0a0b12]">
              <Swords className="h-5 w-5 text-neon-cyan transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-wider text-white text-lg font-mono">
              NEXUS<span className="text-neon-cyan">{"//"}</span>SCRIM
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono -mt-1">
              Esports Matchmaking
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-surfaceHover text-neon-cyan border border-neon-cyan/20"
                    : "text-slate-300 hover:text-white hover:bg-surface"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 rounded bg-neon-cyan/10 px-1.5 py-0.5 text-[10px] font-bold text-neon-cyan border border-neon-cyan/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Section */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 rounded-lg border border-borderSubtle bg-surface px-3 py-1.5 transition-all hover:border-neon-cyan/40 hover:bg-surfaceHover"
              >
                <div className="h-7 w-7 rounded-full bg-slate-800 overflow-hidden ring-1 ring-borderActive">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.name}`}
                    alt={session.user.name || "Avatar"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-200">
                    {session.user.name || "Player"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-mono px-1 rounded uppercase tracking-wider ${
                        session.user.role === "ADMIN"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : session.user.role === "CAPTAIN"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {session.user.role}
                    </span>
                    {session.user.gameTag && (
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[90px]">
                        {session.user.gameTag}
                      </span>
                    )}
                  </div>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-borderSubtle bg-[#0c0e17] p-2 shadow-2xl z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-borderSubtle">
                    <p className="text-xs font-medium text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/teams/create"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-surface rounded-lg"
                    >
                      <PlusCircle className="h-4 w-4 text-neon-cyan" />
                      Buat Tim Baru
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-surface rounded-lg"
                    >
                      <User className="h-4 w-4 text-neon-violet" />
                      Pengaturan Profil
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin/scrims"
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Sparkles className="h-4 w-4 text-rose-400" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-borderSubtle pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-r from-neon-cyan via-blue-600 to-neon-violet rounded-lg shadow-neonCyan hover:opacity-90 active:scale-95"
            >
              <span>Masuk / Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {session && (
            <div className="h-7 w-7 rounded-full bg-slate-800 overflow-hidden ring-1 ring-borderActive">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.name}`}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-borderSubtle bg-background px-4 py-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-surface hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-neon-cyan" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded border border-neon-cyan/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-borderSubtle pt-3">
            {session ? (
              <div className="space-y-2">
                <div className="px-3 py-1 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{session.user.email}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                    {session.user.role}
                  </span>
                </div>
                <Link
                  href="/teams/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-surface rounded-lg"
                >
                  <PlusCircle className="h-4 w-4 text-neon-cyan" />
                  Buat Tim Baru
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-surface rounded-lg"
                >
                  <User className="h-4 w-4 text-neon-violet" />
                  Profil & Game Tag
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Keluar (Logout)
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center py-2.5 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-violet text-sm font-semibold text-white shadow-neonCyan"
              >
                Masuk / Discord Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
