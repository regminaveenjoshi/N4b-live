import { useEffect, useState } from "react";
import { fetchMatchById } from "@/lib/matchesApi";
import type { Match } from "@/types/match";
import { navigate } from "@/lib/router";
import { ErrorState, LoadingState } from "@/components/ui/states";
import {
  formatDateTime,
  formatRelative,
  sportEmoji,
  sportLabel,
  statusLabel,
  extractOrigin,
} from "@/lib/sports";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Info,
  Clock,
} from "lucide-react";

export function MatchPage({ id }: { id: string }) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchMatchById(id)
      .then((m) => {
        if (!active) return;
        if (!m) setError("This match is not available or has been unpublished.");
        else setMatch(m);
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed to load match."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <LoadingState label="Loading match…" />
      </div>
    );
  }
  if (error || !match) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to home
        </button>
        <ErrorState message={error ?? "Match not found."} />
      </div>
    );
  }

  const isLive = match.status === "live";
  const sourceOrigin = extractOrigin(match.source_url);
  // Only embed if explicitly allowed AND the origin is derivable AND it matches the approved embed_origin.
  const canEmbed =
    match.embed_allowed &&
    !!match.embed_origin &&
    !!sourceOrigin &&
    sourceOrigin === match.embed_origin;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={16} /> Back to home
      </button>

      <div className="overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-900/50">
        {/* Player area */}
        <div className="relative aspect-video w-full bg-black">
          {canEmbed ? (
            <iframe
              src={match.source_url}
              title={match.title}
              className="h-full w-full"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
            />
          ) : (
            <FallbackPlayer
              match={match}
              imgBroken={imgBroken}
              onImgError={() => setImgBroken(true)}
              isLive={isLive}
            />
          )}
        </div>

        {/* Details */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-zinc-200">
              {sportEmoji(match.sport)} {sportLabel(match.sport)}
            </span>
            {isLive ? (
              <span className="flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-600/90 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                <Radio size={12} className="animate-pulse" /> Live
              </span>
            ) : (
              <span className="rounded-md border border-zinc-700/60 bg-zinc-800/60 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-zinc-300">
                {statusLabel(match.status)}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock size={12} /> {formatRelative(match.start_time)}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl">{match.title}</h1>
          <p className="mt-2 text-base text-zinc-300">
            {match.team_home} <span className="text-zinc-500">vs</span> {match.team_away}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
            <Calendar size={14} /> {formatDateTime(match.start_time)}
          </p>

          {/* Embedding status / link */}
          <div className="mt-6 rounded-2xl border border-zinc-800/70 bg-zinc-950/60 p-4">
            {canEmbed ? (
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-200">Embedded from approved official source</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    This source explicitly permits embedding. Stream is served from{" "}
                    <span className="text-zinc-300">{match.embed_origin}</span>.
                  </p>
                </div>
                <a
                  href={match.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:text-white"
                >
                  <ExternalLink size={12} /> Open source
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <ShieldAlert size={20} className="mt-0.5 flex-shrink-0 text-amber-400" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Watch on the official source</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {match.embed_allowed
                        ? "The URL could not be verified as an approved player URL. Check that you entered the broadcaster's official embed/player URL and that its origin matches the approved embed origin."
                        : "In-page playback is not enabled for this source. Use an official player URL only when the broadcaster permits embedding; StreamZone Live does not bypass iframe restrictions."}
                    </p>
                  </div>
                </div>
                <a
                  href={match.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  <ExternalLink size={14} /> Watch on Official Source
                </a>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-zinc-800/30 p-3 text-xs text-zinc-500">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <p>
              StreamZone Live only links to official, authorized sources. We do not bypass DRM, geographic
              restrictions, authentication, or any access controls, and we never extract hidden streams from
              third-party webpages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FallbackPlayer({
  match,
  imgBroken,
  onImgError,
  isLive,
}: {
  match: Match;
  imgBroken: boolean;
  onImgError: () => void;
  isLive: boolean;
}) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center text-center">
      {match.thumbnail_url && !imgBroken ? (
        <img
          src={match.thumbnail_url}
          alt={match.title}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          onError={onImgError}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="mb-3 text-5xl opacity-80">{sportEmoji(match.sport)}</div>
        <p className="max-w-md text-lg font-semibold text-white">{match.title}</p>
        <p className="mt-1 text-sm text-zinc-300">
          {match.team_home} vs {match.team_away}
        </p>
        {isLive ? (
          <span className="mt-4 flex items-center gap-2 rounded-md border border-red-500/40 bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            <Radio size={12} className="animate-pulse" /> Live on official source
          </span>
        ) : (
          <span className="mt-4 rounded-md border border-zinc-700 bg-zinc-800/70 px-3 py-1 text-xs text-zinc-300">
            {statusLabel(match.status)} · {formatDateTime(match.start_time)}
          </span>
        )}
        <a
          href={match.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          <ExternalLink size={14} /> Watch on Official Source
        </a>
      </div>
    </div>
  );
}
