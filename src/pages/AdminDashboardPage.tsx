import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  fetchAllMatchesAdmin,
  createMatch,
  updateMatch,
  deleteMatch,
} from "@/lib/matchesApi";
import type { Match, MatchInput, MatchStatus } from "@/types/match";
import { SPORTS, STATUSES, sportEmoji, sportLabel, statusLabel, formatDateTime, formatRelative, isValidHttpUrl, extractOrigin } from "@/lib/sports";
import { navigate } from "@/lib/router";
import { ErrorState, LoadingState, Spinner } from "@/components/ui/states";
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, X, ExternalLink, ShieldAlert } from "lucide-react";

type Draft = MatchInput & { id?: string };

const emptyDraft: Draft = {
  title: "",
  sport: "cricket",
  team_home: "",
  team_away: "",
  thumbnail_url: "",
  source_url: "",
  start_time: new Date(Date.now() + 3600_000).toISOString().slice(0, 16),
  status: "upcoming",
  is_published: false,
  embed_allowed: false,
  embed_origin: "",
};

export function AdminDashboardPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filterSport, setFilterSport] = useState<string>("all");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Match | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllMatchesAdmin();
      setMatches(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (filterSport !== "all" && m.sport !== filterSport) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.team_home.toLowerCase().includes(q) ||
        m.team_away.toLowerCase().includes(q) ||
        m.sport.toLowerCase().includes(q)
      );
    });
  }, [matches, query, filterSport]);

  if (authLoading || (!isAdmin && loading)) {
    return <LoadingState label="Checking access…" />;
  }
  if (!isAdmin) {
    navigate("/admin");
    return null;
  }
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }

  const openNew = () => {
    setFormError(null);
    setEditing({ ...emptyDraft });
  };
  const openEdit = (m: Match) => {
    setFormError(null);
    setEditing({
      id: m.id,
      title: m.title,
      sport: m.sport,
      team_home: m.team_home,
      team_away: m.team_away,
      thumbnail_url: m.thumbnail_url ?? "",
      source_url: m.source_url,
      start_time: new Date(m.start_time).toISOString().slice(0, 16),
      status: m.status,
      is_published: m.is_published,
      embed_allowed: m.embed_allowed,
      embed_origin: m.embed_origin ?? "",
    });
  };

  const save = async () => {
    if (!editing) return;
    setFormError(null);

    // Validation
    if (!editing.title.trim()) return setFormError("Title is required.");
    if (!editing.team_home.trim() || !editing.team_away.trim())
      return setFormError("Both teams are required.");
    if (!isValidHttpUrl(editing.source_url))
      return setFormError("Source URL must be a valid http(s) URL.");
    if (editing.thumbnail_url && !isValidHttpUrl(editing.thumbnail_url))
      return setFormError("Thumbnail URL must be a valid http(s) URL or empty.");
    if (editing.embed_allowed) {
      const origin = extractOrigin(editing.source_url);
      if (!origin) return setFormError("Could not derive origin from source URL.");
      // If embed_origin is blank, auto-fill from source. Otherwise validate it matches.
      if (!editing.embed_origin?.trim()) {
        editing.embed_origin = origin;
      } else if (extractOrigin(editing.embed_origin) !== origin) {
        return setFormError(
          "Embed origin must match the source URL's origin (scheme://host[:port])."
        );
      }
    } else {
      editing.embed_origin = "";
    }

    const payload: MatchInput = {
      title: editing.title.trim(),
      sport: editing.sport,
      team_home: editing.team_home.trim(),
      team_away: editing.team_away.trim(),
      thumbnail_url: editing.thumbnail_url?.trim() || null,
      source_url: editing.source_url.trim(),
      start_time: new Date(editing.start_time).toISOString(),
      status: editing.status,
      is_published: editing.is_published,
      embed_allowed: editing.embed_allowed,
      embed_origin: editing.embed_origin?.trim() || null,
    };

    setSaving(true);
    try {
      if (editing.id) {
        await updateMatch(editing.id, payload);
        setToast("Match updated.");
      } else {
        await createMatch(payload);
        setToast("Match created.");
      }
      setEditing(null);
      await load();
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Save failed. Are you still an admin?");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (m: Match) => {
    try {
      await updateMatch(m.id, { is_published: !m.is_published });
      setToast(m.is_published ? "Match unpublished." : "Match published.");
      await load();
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to toggle publish.");
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteMatch(confirmDelete.id);
      setToast("Match deleted.");
      setConfirmDelete(null);
      await load();
      setTimeout(() => setToast(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage match listings. Changes appear live on the public site.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
        >
          <Plus size={16} /> Add match
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, teams, sport…"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/60 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-red-500/50"
          />
        </div>
        <select
          value={filterSport}
          onChange={(e) => setFilterSport(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900/60 px-3 py-2.5 text-sm text-white outline-none focus:border-red-500/50"
        >
          <option value="all">All sports</option>
          {SPORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.emoji} {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <LoadingState label="Loading matches…" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-700/60 bg-zinc-900/40 py-16 text-center">
          <p className="text-base font-medium text-zinc-300">No matches found</p>
          <p className="mt-1 text-sm text-zinc-500">Add your first match listing to get started.</p>
          <button
            onClick={openNew}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
          >
            <Plus size={16} /> Add match
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-800/70">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-zinc-800/70 bg-zinc-900/60 px-4 py-3 text-xs font-medium uppercase tracking-wide text-zinc-500 md:grid">
            <span>Match</span>
            <span>Sport</span>
            <span>Start</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-1 gap-3 px-4 py-4 transition hover:bg-zinc-900/40 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-100">{m.title}</p>
                    {m.is_published ? (
                      <span className="flex flex-shrink-0 items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
                        <Eye size={10} /> Published
                      </span>
                    ) : (
                      <span className="flex flex-shrink-0 items-center gap-1 rounded border border-zinc-600/40 bg-zinc-700/20 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                        <EyeOff size={10} /> Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {m.team_home} vs {m.team_away}
                  </p>
                </div>
                <div className="text-xs text-zinc-300">
                  {sportEmoji(m.sport)} {sportLabel(m.sport)}
                </div>
                <div className="text-xs text-zinc-400">
                  <div>{formatDateTime(m.start_time)}</div>
                  <div className="text-zinc-600">{formatRelative(m.start_time)}</div>
                </div>
                <div>
                  <StatusPill status={m.status} />
                </div>
                <div className="flex items-center gap-1.5 md:justify-end">
                  <a
                    href={`#/match/${m.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/match/${m.id}`);
                    }}
                    className="rounded-md border border-zinc-700 p-2 text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    title="View"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => togglePublish(m)}
                    className="rounded-md border border-zinc-700 p-2 text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    title={m.is_published ? "Unpublish" : "Publish"}
                  >
                    {m.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(m)}
                    className="rounded-md border border-zinc-700 p-2 text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(m)}
                    className="rounded-md border border-red-500/30 p-2 text-red-300 transition hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor modal */}
      {editing && (
        <MatchEditor
          draft={editing}
          onChange={setEditing}
          onCancel={() => setEditing(null)}
          onSave={save}
          saving={saving}
          error={formError}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
                <ShieldAlert size={18} className="text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Delete this match?</h3>
            </div>
            <p className="text-sm text-zinc-400">
              "{confirmDelete.title}" will be permanently removed. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleting ? <Spinner className="text-white" /> : <Trash2 size={14} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-200 backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: MatchStatus }) {
  const cfg = STATUSES.find((s) => s.id === status)!;
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cfg.color}`}>
      {statusLabel(status)}
    </span>
  );
}

function MatchEditor({
  draft,
  onChange,
  onCancel,
  onSave,
  saving,
  error,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });

  const sourceOrigin = extractOrigin(draft.source_url);
  const originMismatch = draft.embed_allowed && draft.embed_origin && sourceOrigin && extractOrigin(draft.embed_origin) !== sourceOrigin;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h3 className="text-base font-semibold text-white">{draft.id ? "Edit match" : "Add match"}</h3>
          <button onClick={onCancel} className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Field label="Match title" required>
            <input
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
              placeholder="e.g. India vs Australia — 2nd ODI"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Home team" required>
              <input value={draft.team_home} onChange={(e) => set("team_home", e.target.value)} className={inputCls} placeholder="India" />
            </Field>
            <Field label="Away team" required>
              <input value={draft.team_away} onChange={(e) => set("team_away", e.target.value)} className={inputCls} placeholder="Australia" />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Sport" required>
              <select value={draft.sport} onChange={(e) => set("sport", e.target.value)} className={inputCls}>
                {SPORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Start time" required>
              <input
                type="datetime-local"
                value={draft.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          <Field label="Thumbnail URL (optional)">
            <input
              value={draft.thumbnail_url ?? ""}
              onChange={(e) => set("thumbnail_url", e.target.value)}
              className={inputCls}
              placeholder="https://example.com/poster.jpg"
            />
          </Field>

          <Field label="Official player / source URL" required>
            <input
              value={draft.source_url}
              onChange={(e) => set("source_url", e.target.value)}
              className={inputCls}
              placeholder="https://official-broadcaster.example/embed/..."
            />
            <p className="mt-1 text-xs text-zinc-500">
              For in-page playback, paste the broadcaster's official embed/player URL—not a normal watch-page link.
              Embedding must be permitted by the source. Some sites block iframe playback even when the URL is valid.
            </p>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select value={draft.status} onChange={(e) => set("status", e.target.value as MatchStatus)} className={inputCls}>
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Published">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950/40 px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={draft.is_published}
                  onChange={(e) => set("is_published", e.target.checked)}
                  className="h-4 w-4 accent-red-500"
                />
                <span className="text-sm text-zinc-300">Visible on public site</span>
              </label>
            </Field>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={draft.embed_allowed}
                onChange={(e) => set("embed_allowed", e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-red-500"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-200">Source permits embedding</p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Tick only if the official source explicitly allows iframe embedding (e.g. it sends no
                  X-Frame-Options/CSP deny and grants permission). Never tick this to bypass restrictions.
                </p>
              </div>
            </label>
            {draft.embed_allowed && (
              <div className="mt-3 pl-7">
                <Field label="Approved embed origin">
                  <input
                    value={draft.embed_origin ?? ""}
                    onChange={(e) => set("embed_origin", e.target.value)}
                    className={inputCls}
                    placeholder={sourceOrigin ?? "https://example.com"}
                  />
                </Field>
                <p className="mt-1 text-xs text-zinc-500">
                  Must match the source URL's origin. Detected: <span className="text-zinc-300">{sourceOrigin ?? "—"}</span>
                </p>
                {originMismatch && (
                  <p className="mt-1 text-xs text-red-400">Origin does not match the source URL.</p>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-800 px-6 py-4">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
          >
            {saving ? <Spinner className="text-white" /> : null}
            {draft.id ? "Save changes" : "Create match"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950/50 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
