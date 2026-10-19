/*
# Harden touch_updated_at search_path

Sets an explicit `search_path` on the `touch_updated_at` trigger function to remove
the role-mutable search_path warning flagged by the database linter. Purely a
security hardening change; behavior is unchanged.
*/

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
