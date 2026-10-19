export type MatchStatus = "upcoming" | "live" | "ended";

export interface Match {
  id: string;
  title: string;
  sport: string;
  team_home: string;
  team_away: string;
  thumbnail_url: string | null;
  source_url: string;
  start_time: string;
  status: MatchStatus;
  is_published: boolean;
  embed_allowed: boolean;
  embed_origin: string | null;
  created_at: string;
  updated_at: string;
}

export type MatchInput = Omit<Match, "id" | "created_at" | "updated_at">;
