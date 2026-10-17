import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWIB(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d) + " WIB";
}

export function formatTimeWIB(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d) + " WIB";
}

export function formatDateWIB(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export const GAME_LABELS: Record<string, { name: string; color: string; badge: string; icon: string }> = {
  VALORANT: {
    name: "Valorant",
    color: "from-rose-500 to-red-600",
    badge: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    icon: "Target",
  },
  MOBILE_LEGENDS: {
    name: "Mobile Legends: Bang Bang",
    color: "from-blue-500 to-indigo-600",
    badge: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    icon: "ShieldAlert",
  },
  PUBG_MOBILE: {
    name: "PUBG Mobile",
    color: "from-amber-500 to-orange-600",
    badge: "border-amber-500/30 text-amber-400 bg-amber-500/10",
    icon: "Crosshair",
  },
  FREE_FIRE: {
    name: "Free Fire",
    color: "from-yellow-500 to-amber-600",
    badge: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
    icon: "Flame",
  },
  DOTA_2: {
    name: "Dota 2",
    color: "from-red-600 to-orange-700",
    badge: "border-red-600/30 text-red-400 bg-red-600/10",
    icon: "Swords",
  },
  CS2: {
    name: "Counter-Strike 2",
    color: "from-cyan-500 to-blue-600",
    badge: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
    icon: "Bomb",
  },
};

export const STATUS_BADGES: Record<string, { label: string; class: string }> = {
  OPEN: { label: "Terbuka", class: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" },
  FULL: { label: "Penuh", class: "bg-amber-500/10 border-amber-500/40 text-amber-400" },
  ONGOING: { label: "Berlangsung", class: "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 animate-pulse" },
  COMPLETED: { label: "Selesai", class: "bg-slate-700/40 border-slate-600/40 text-slate-400" },
  CANCELLED: { label: "Dibatalkan", class: "bg-rose-500/10 border-rose-500/40 text-rose-400" },
};
