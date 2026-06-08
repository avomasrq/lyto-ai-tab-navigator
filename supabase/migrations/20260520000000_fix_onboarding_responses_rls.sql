-- ============================================================
-- Security fix: lock down onboarding_responses
-- Reported: anonymous SELECT / UPDATE / DELETE exposed PII
-- Fix: enable RLS, drop all open policies, service_role only
--      for admin reads. Authenticated users may INSERT and
--      SELECT their own row only.
-- ============================================================

-- Ensure RLS is on
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_responses FORCE ROW LEVEL SECURITY;

-- Drop any existing policies (open or otherwise)
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'onboarding_responses'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.onboarding_responses', pol.policyname);
  END LOOP;
END $$;

-- Deny everything to anon (belt + suspenders — no policy = deny by default,
-- but explicit revoke ensures even direct grants can't slip through)
REVOKE ALL ON public.onboarding_responses FROM anon;

-- Authenticated users: INSERT only (onboarding flow)
CREATE POLICY "authenticated can insert own onboarding"
  ON public.onboarding_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users: SELECT own row only
CREATE POLICY "authenticated can read own onboarding"
  ON public.onboarding_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No UPDATE or DELETE for regular users

-- service_role: full access (used by admin edge function)
CREATE POLICY "service_role full access onboarding"
  ON public.onboarding_responses
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
