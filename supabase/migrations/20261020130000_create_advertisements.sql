-- N4B StreamZone Advanced Advertisement Manager

CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    ad_type TEXT NOT NULL
        CHECK (ad_type IN ('banner', 'video')),
    media_url TEXT NOT NULL,
    click_url TEXT DEFAULT '',

    is_active BOOLEAN NOT NULL DEFAULT FALSE,

    -- Scheduling
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,

    -- Higher number = higher priority
    priority INTEGER NOT NULL DEFAULT 0,

    -- Statistics
    impressions BIGINT NOT NULL DEFAULT 0,
    clicks BIGINT NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_ad_schedule
        CHECK (
            start_at IS NULL
            OR end_at IS NULL
            OR end_at > start_at
        )
);

-- Support existing installations
ALTER TABLE public.advertisements
    ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS impressions BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS clicks BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Recreate policies safely
DROP POLICY IF EXISTS "Public can view active ads"
ON public.advertisements;

DROP POLICY IF EXISTS "Admins can manage ads"
ON public.advertisements;

-- Public can read active ads
CREATE POLICY "Public can view active ads"
ON public.advertisements
FOR SELECT
TO anon, authenticated
USING (
    is_active = TRUE
    AND (start_at IS NULL OR start_at <= NOW())
    AND (end_at IS NULL OR end_at > NOW())
);

-- Only admins can manage ads
CREATE POLICY "Admins can manage ads"
ON public.advertisements
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.admins
        WHERE admins.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.admins
        WHERE admins.user_id = auth.uid()
    )
);

-- Indexes for active ads and priority sorting
CREATE INDEX IF NOT EXISTS advertisements_active_idx
ON public.advertisements (is_active, ad_type);

CREATE INDEX IF NOT EXISTS advertisements_priority_idx
ON public.advertisements (priority DESC, created_at DESC);
