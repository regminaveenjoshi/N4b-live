/*
# StreamZone Live — matches + admins schema

## Overview
Creates the core data model for a live sports streaming portal.
Public visitors can read published match listings. Authorized admins
(registered users listed in the `admins` table) can create, edit,
publish/unpublish, and delete matches. All authorization is enforced
server-side via Row Level Security policies.

## New Tables
1. `admins`
   - `user_id` (uuid, primary key, references auth.users) — identifies a user who has admin privileges.
   - `created_at` (timestamptz) — when the admin was granted.
   Purpose: the single source of truth for who is an admin. RLS policies on `matches` consult this table.

2. `matches`
   - `id` (uuid, primary key)
   - `title` (text, not null) — display title of the match.
   - `sport` (text, not null) — sport category, e.g. 'cricket', 'football', 'basketball', 'tennis', etc.
   - `team_home` (text, not null) — home team name.
   - `team_away` (text, not null) — away team name.
   - `thumbnail_url` (text) — optional poster/thumbnail image URL.
   - `source_url` (text, not null) — official webpage URL for the match (HTTP/HTTPS only, validated in app).
   - `start_time` (timestamptz, not null) — scheduled start time.
   - `status` (text, not null, default 'upcoming') — one of 'upcoming', 'live', 'ended'.
   - `is_published` (boolean, not null, default false) — whether the listing is visible to the public.
   - `embed_allowed` (boolean, not null, default false) — whether the source explicitly permits iframe embedding.
   - `embed_origin` (text) — approved origin (scheme://host[:port]) used as the sandbox allow-source when embedding is permitted.
   - `created_at` (timestamptz) — row creation time.
   - `updated_at` (timestamptz) — last modification time.

## Security (Row Level Security)
- `admins`: a user may read only their own admin row (to check if they are an admin). No public reads.
- `matches`:
  - SELECT: public (anon + authenticated) may read only rows where `is_published = true`.
            admins may read all rows (published and unpublished).
  - INSERT / UPDATE / DELETE: restricted to admins (existence check in `admins` table).
- All write paths are server-enforced; the anon-key frontend cannot mutate data unless the
  request carries an authenticated session belonging to an admin.

## Notes
1. To bootstrap the first admin: sign up via the app's admin signup page, then call the
   `admin-promote` edge function (which only promotes when zero admins exist) OR run SQL:
   `INSERT INTO admins (user_id) VALUES ('<auth-user-uuid>');`
2. To add more admins later, an existing admin runs:
   `INSERT INTO admins (user_id) VALUES ('<new-auth-user-uuid>');`
3. `updated_at` is refreshed on every UPDATE via a trigger.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_read_self" ON admins;
CREATE POLICY "admins_read_self"
  ON admins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sport text NOT NULL,
  team_home text NOT NULL,
  team_away text NOT NULL,
  thumbnail_url text,
  source_url text NOT NULL,
  start_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  is_published boolean NOT NULL DEFAULT false,
  embed_allowed boolean NOT NULL DEFAULT false,
  embed_origin text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Public can read only published matches.
DROP POLICY IF EXISTS "public_read_published_matches" ON matches;
CREATE POLICY "public_read_published_matches"
  ON matches FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Admins can read all matches (published + unpublished).
DROP POLICY IF EXISTS "admin_read_all_matches" ON matches;
CREATE POLICY "admin_read_all_matches"
  ON matches FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Admins can insert matches.
DROP POLICY IF EXISTS "admin_insert_matches" ON matches;
CREATE POLICY "admin_insert_matches"
  ON matches FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Admins can update matches.
DROP POLICY IF EXISTS "admin_update_matches" ON matches;
CREATE POLICY "admin_update_matches"
  ON matches FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Admins can delete matches.
DROP POLICY IF EXISTS "admin_delete_matches" ON matches;
CREATE POLICY "admin_delete_matches"
  ON matches FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid()));

-- Keep updated_at fresh on every update.
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS matches_touch_updated_at ON matches;
CREATE TRIGGER matches_touch_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();

-- Helpful indexes for the homepage sections.
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches (status);
CREATE INDEX IF NOT EXISTS idx_matches_sport ON matches (sport);
CREATE INDEX IF NOT EXISTS idx_matches_published ON matches (is_published);
CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches (start_time);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches (created_at DESC);
