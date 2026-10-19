import { useEffect, useMemo, useState } from "react";
import { fetchPublishedMatches } from "@/lib/matchesApi";
import type { Match } from "@/types/match";
import { MatchCard, MatchCardSkeleton } from "@/components/MatchCard";
import { ErrorState, EmptyState } from "@/components/ui/states";
import { Radio, CalendarClock, Flame, Trophy } from "lucide-react";

function SectionHeader({
  icon,
  title,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>{icon}</div>
      <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h2>
    </div>
  );
}

function MatchGrid({ matches, loading }: { matches: Match[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MatchCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (matches.length === 0) {
    return (
      <EmptyState
        title="No matches here yet"
        subtitle="Check back soon — new listings appear here automatically."
        icon={<Trophy size={36} />}
      />
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </div>
  );
}

export function HomePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublishedMatches();
      setMatches(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const liveNow = useMemo(() => matches.filter((m) => m.status === "live"), [matches]);
  const upcoming = useMemo(
    () => matches.filter((m) => m.status === "upcoming").slice(0, 8),
    [matches]
  );
  const cricket = useMemo(
    () => matches.filter((m) => m.sport === "cricket").slice(0, 8),
    [matches]
  );
  const football = useMemo(
    () => matches.filter((m) => m.sport === "football").slice(0, 8),
    [matches]
  );
  const recent = useMemo(
    () => [...matches].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 8),
    [matches]
  );

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-zinc-800/60 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-red-900/20 blur-3xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
            <Radio size={12} className="animate-pulse" /> {liveNow.length} match{liveNow.length === 1 ? "" : "es"} live now
          </div>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Watch live sports from <span className="text-red-500">official sources</span>.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-zinc-400 sm:text-base">
            StreamZone Live connects you to verified, official broadcasts for cricket, football, and more —
            no piracy, no fake streams, just the real thing.
          </p>
        </div>
      </section>

      {/* Live Now */}
      <section className="mb-12">
        <SectionHeader
          icon={<Radio size={18} className="animate-pulse text-red-300" />}
          title="Live Now"
          accent="bg-red-500/15 border border-red-500/30"
        />
        <MatchGrid matches={liveNow} loading={loading} />
      </section>

      {/* Upcoming */}
      <section className="mb-12">
        <SectionHeader
          icon={<CalendarClock size={18} className="text-amber-300" />}
          title="Upcoming Matches"
          accent="bg-amber-500/15 border border-amber-500/30"
        />
        <MatchGrid matches={upcoming} loading={loading} />
      </section>

      {/* Cricket */}
      <section className="mb-12">
        <SectionHeader
          icon={<span className="text-lg">🏏</span>}
          title="Cricket"
          accent="bg-emerald-500/15 border border-emerald-500/30"
        />
        <MatchGrid matches={cricket} loading={loading} />
      </section>

      {/* Football */}
      <section className="mb-12">
        <SectionHeader
          icon={<span className="text-lg">⚽</span>}
          title="Football"
          accent="bg-blue-500/15 border border-blue-500/30"
        />
        <MatchGrid matches={football} loading={loading} />
      </section>

      {/* Recently Added */}
      <section className="mb-8">
        <SectionHeader
          icon={<Flame size={18} className="text-orange-300" />}
          title="Recently Added"
          accent="bg-orange-500/15 border border-orange-500/30"
        />
        <MatchGrid matches={recent} loading={loading} />
      </section>
    </div>
  );
}
