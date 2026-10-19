# StreamZone Live

A premium, responsive **live sports streaming portal** built with React, TypeScript, Tailwind CSS, and Supabase. It links visitors to **official, authorized** sports broadcasts — never pirated streams, never bypassed DRM or geo-restrictions.

## Features

### Public site
- **Homepage sections:** Live Now, Upcoming Matches, Cricket, Football, Recently Added.
- Premium dark theme with red live indicators, smooth hover animations, mobile-first responsive layout.
- Dedicated **match viewing page** with title, thumbnail, sport, teams, start time, and status.
- **Safe embedding:** if a source explicitly permits embedding AND its origin matches an approved `embed_origin`, the match page renders a sandboxed, origin-restricted iframe. Otherwise, a clear **"Watch on Official Source"** link opens the original page. The app never bypasses X-Frame-Options/CSP, DRM, authentication, or geographic restrictions, and never extracts hidden streams from third-party pages.
- Loading, empty, and error states throughout.

### Admin dashboard (protected)
- Admin login/signup with Supabase email/password auth.
- Authorized admins can **add, edit, publish, unpublish, and delete** match listings.
- Form fields: title, sport, teams, thumbnail URL, start time, status, source webpage URL, embedding permission (+ approved origin).
- URL validation — HTTP(S) only — on both source and thumbnail URLs.
- Embed origin must match the source URL's origin (scheme://host[:port]).
- Non-admins cannot access admin functions; the database enforces this server-side via RLS (not just the UI).
- Changes appear on the public site **immediately** — no rebuild required.

## Tech stack
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + lucide-react.
- **Backend:** Supabase (Postgres database, Auth, Row Level Security, Edge Functions).
- **Routing:** Lightweight hash-based router (no extra dependency).

## Getting started

### 1. Environment variables
All Supabase credentials are pre-populated in `.env`:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

These are the only variables the frontend reads. The service-role key and database URL are used server-side (Edge Functions / migrations) and are **never** exposed to the browser.

### 2. Install & run
```bash
npm install
npm run dev      # local dev server
npm run build    # production build
npm run typecheck
```

### 3. Database
The schema (`admins`, `matches` tables) and RLS policies are already applied via Supabase migrations. To inspect the current security posture, use the Supabase MCP tools `get_security_posture` and `get_advisors`.

### 4. Create the first admin
1. Open the app and click **Admin login** in the header.
2. Switch to **Create account** and sign up with an email + password.
3. After signing in, you'll see a "Promote me to admin" button. Click it — this calls the `admin-promote` Edge Function, which **only** works when zero admins exist (safe bootstrap).
4. Reload — you're now an admin and can manage matches.

### 5. Add more admins (after the first)
Once an admin exists, the bootstrap endpoint refuses to run. An existing admin must promote new users directly in the database:
```sql
INSERT INTO admins (user_id) VALUES ('<new-auth-user-uuid>');
```

## Security model

| Operation | Who can do it | Enforcement |
|---|---|---|
| Read published matches | Public (anon + authenticated) | RLS `public_read_published_matches` — `is_published = true` |
| Read all matches (incl. drafts) | Admins only | RLS `admin_read_all_matches` — checks `admins` table |
| Insert / update / delete matches | Admins only | RLS policies checking `EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid())` |
| Read own admin row | Authenticated user (self) | RLS `admins_read_self` |

- **RLS is enabled on every table.** The anon-key frontend cannot mutate data without an authenticated admin session.
- No service-role keys or admin credentials are ever shipped to the frontend.
- URL validation (HTTP/HTTPS only) runs in the admin form before any write.
- Iframe embedding is gated behind an explicit `embed_allowed` flag **and** an origin match — it is never auto-attempted.

## Deployment

This app is free-tier-friendly:
- **Frontend:** deploy the Vite build (`dist/`) to any static host (Vercel, Netlify, Cloudflare Pages, etc.).
- **Backend:** Supabase free tier covers the Postgres DB, Auth, and Edge Functions.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build-time env vars on your hosting provider.

**Paid features that may be required at scale:** Supabase Edge Function invocations and database size beyond the free tier limits. No paid features are required for the app to function.

## Ethical / legal notes
StreamZone Live links only to **official** sources. It does not host video, bypass DRM or access controls, extract hidden streams from third-party webpages, convert webpage URLs into unauthorized streams, or claim a stream is live unless its status is verified by an admin. Embedding is only attempted for sources that explicitly permit it.
