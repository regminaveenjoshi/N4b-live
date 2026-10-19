CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    ad_type TEXT NOT NULL CHECK (ad_type IN ('banner', 'video')),
    media_url TEXT NOT NULL,
    click_url TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active ads"
ON public.advertisements
FOR SELECT
TO anon, authenticated
USING (is_active = TRUE);

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

CREATE INDEX IF NOT EXISTS advertisements_active_idx
ON public.advertisements (is_active, ad_type);
