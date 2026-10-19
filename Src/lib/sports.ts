import type { MatchStatus } from "@/types/match";

export const SPORTS = [
  { id: "cricket", label: "Cricket", emoji: "🏏" },
  { id: "football", label: "Football", emoji: "⚽" },
  { id: "basketball", label: "Basketball", emoji: "🏀" },
  { id: "tennis", label: "Tennis", emoji: "🎾" },
  { id: "rugby", label: "Rugby", emoji: "🏉" },
  { id: "boxing", label: "Boxing", emoji: "🥊" },
  { id: "motorsport", label: "Motorsport", emoji: "🏎️" },
  { id: "golf", label: "Golf", emoji: "⛳" },
  { id: "hockey", label: "Hockey", emoji: "🏒" },
  { id: "other", label: "Other", emoji: "🎯" },
] as const;

export const STATUSES: { id: MatchStatus; label: string; color: string }[] = [
  { id: "upcoming", label: "Upcoming", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { id: "live", label: "Live", color: "bg-red-500/15 text-red-300 border-red-500/40" },
  { id: "ended", label: "Ended", color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
];

export function sportLabel(id: string): string {
  return SPORTS.find((s) => s.id === id)?.label ?? id;
}

export function sportEmoji(id: string): string {
  return SPORTS.find((s) => s.id === id)?.emoji ?? "🎯";
}

export function statusLabel(id: MatchStatus): string {
  return STATUSES.find((s) => s.id === id)?.label ?? id;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = Date.now();
  const diff = d.getTime() - now;
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  if (mins < 60) return diff > 0 ? `in ${mins}m` : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return diff > 0 ? `in ${hours}h` : `${hours}h ago`;
  const days = Math.round(hours / 24);
  return diff > 0 ? `in ${days}d` : `${days}d ago`;
}

export function isValidHttpUrl(value: string): boolean {
  if (!value) return false;
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Extracts a safe origin (scheme://host[:port]) from a URL string.
export function extractOrigin(value: string): string | null {
  try {
    const u = new URL(value.trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}
