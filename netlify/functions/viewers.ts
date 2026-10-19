import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { createClient } from "@supabase/supabase-js";

const ONLINE_WINDOW_SECONDS = 60;

export default async (request: Request) => {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers: { Allow: "POST" } },
    );
  }

  let body: { session?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.session;

  if (
    typeof sessionId !== "string" ||
    sessionId.length < 20 ||
    sessionId.length > 100 ||
    !/^[a-zA-Z0-9_-]+$/.test(sessionId)
  ) {
    return Response.json({ error: "Invalid session" }, { status: 400 });
  }

  const supabaseUrl = Netlify.env.get("SUPABASE_URL");
  const supabaseKey = Netlify.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { error: "Server configuration missing" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const cutoff = new Date(
    Date.now() - ONLINE_WINDOW_SECONDS * 1000,
  ).toISOString();

  const { error: upsertError } = await supabase
    .from("online_visitors")
    .upsert(
      { session_id: sessionId, last_seen_at: new Date().toISOString() },
      { onConflict: "session_id" },
    );

  if (upsertError) {
    console.error("Viewer heartbeat failed:", upsertError.message);
    return Response.json({ error: "Unable to update visitor" }, { status: 500 });
  }

  await supabase
    .from("online_visitors")
    .delete()
    .lt("last_seen_at", cutoff);

  const { count, error } = await supabase
    .from("online_visitors")
    .select("*", { count: "exact", head: true })
    .gte("last_seen_at", cutoff);

  if (error) {
    return Response.json({ error: "Unable to count visitors" }, { status: 500 });
  }

  return Response.json(
    { viewers: count ?? 0 },
    { headers: { "Cache-Control": "no-store" } },
  );
};

export const config: Config = {
  path: "/api/viewers",
};
