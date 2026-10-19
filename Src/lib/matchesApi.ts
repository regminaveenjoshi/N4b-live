import { supabase, EDGE_FUNCTION_BASE } from "@/lib/supabase";
import type { Match, MatchInput } from "@/types/match";

export async function fetchPublishedMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("is_published", true)
    .order("start_time", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Match[];
}

export async function fetchAllMatchesAdmin(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Match[];
}

export async function fetchMatchById(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Match) ?? null;
}

export async function fetchMatchByIdAdmin(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Match) ?? null;
}

export async function createMatch(input: MatchInput): Promise<Match> {
  const { data, error } = await supabase
    .from("matches")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Match;
}

export async function updateMatch(id: string, patch: Partial<MatchInput>): Promise<Match> {
  const { data, error } = await supabase
    .from("matches")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Match;
}

export async function deleteMatch(id: string): Promise<void> {
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) throw error;
}

// Promotes the calling user to admin, but only if zero admins exist.
// Used during initial bootstrap.
export async function bootstrapAdmin(): Promise<{ error: string | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) return { error: "You must be signed in first." };

    const res = await fetch(`${EDGE_FUNCTION_BASE}/admin-promote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: body?.error ?? `Request failed (${res.status})` };
    }
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Network error" };
  }
}
