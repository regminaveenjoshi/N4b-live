-- StreamZone Live: advertisements and online visitors

CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advertiser_name TEXT NOT NULL,
    title TEXT NOT NULL,
    banner_image_url TEXT NOT NULL,
    click_url TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Visitors can see active ads within their scheduled period.
CREATE POLICY "public_read_active_advertisements"
ON public.advertisements
FOR SELECT
TO anon, authenticated
USING (
    is_active = TRUE
    AND starts_at <= NOW()
    AND expires_at > NOW()
);

-- Admins can manage advertisements.
CREATE POLICY "admins_manage_advertisements"
ON public.advertisements
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE admins.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.admins
        WHERE admins.user_id = auth.uid()
    )
);

CREATE INDEX IF NOT EXISTS idx_advertisements_active_dates
ON public.advertisements (is_active, starts_at, expires_at);

-- Online visitor sessions.
CREATE TABLE IF NOT EXISTS public.online_visitors (
    session_id TEXT PRIMARY KEY,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.online_visitors ENABLE ROW LEVEL SECURITY;

-- No direct public access to visitor sessions.
-- A trusted server-side function must update sessions
-- and return the online count.

CREATE INDEX IF NOT EXISTS idx_online_visitors_last_seen
ON public.online_visitors (last_seen_at);
