import { Link } from "@/lib/router";
import type { Match } from "@/types/match";
import { formatRelative, sportEmoji, sportLabel, statusLabel } from "@/lib/sports";
import { Play, Radio } from "lucide-react";

export function MatchCard({ match }: { match: Match }) {
  const isLive = match.status === "live";
  return (
    <Link
      to={`/match/${match.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-950/30"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-800">
        {match.thumbnail_url ? (
          <img
            src={match.thumbnail_url}
            alt={match.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl opacity-40">
            {sportEmoji(match.sport)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md border border-zinc-700/60 bg-black/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-200 backdrop-blur">
            {sportEmoji(match.sport)} {sportLabel(match.sport)}
          </span>
        </div>
        {isLive ? (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-600/90 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
            <Radio size={12} className="animate-pulse" />
            Live
          </div>
        ) : (
          <div className="absolute right-3 top-3 rounded-md border border-zinc-700/60 bg-black/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-300 backdrop-blur">
            {statusLabel(match.status)}
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs text-zinc-300">{formatRelative(match.start_time)}</span>
          <span className="flex items-center gap-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Play size={12} className="fill-white" /> Watch
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">{match.title}</h3>
        <p className="mt-1.5 line-clamp-1 text-xs text-zinc-400">
          {match.team_home} vs {match.team_away}
        </p>
      </div>
    </Link>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60">
      <div className="aspect-video w-full animate-pulse bg-zinc-800/70" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800/70" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800/50" />
      </div>
    </div>
  );
}
