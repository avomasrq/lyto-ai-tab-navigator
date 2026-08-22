-- ============================================================
-- Onboarding v2 — the fields the new three-screen flow writes.
--
-- Screen 1 asks where they heard about Argos (now with a free-text box behind
-- "something else" — that bucket was 22% of all answers and told us nothing).
-- Screen 2 asks which job they want off their hands, in concrete terms instead
-- of the abstract categories people were picking at random. Screen 3 installs.
--
-- `role` and `use_case` stay for the 180 rows already collected; nothing writes
-- them any more.
-- ============================================================

ALTER TABLE public.onboarding_responses
  ADD COLUMN IF NOT EXISTS source_other      text,
  ADD COLUMN IF NOT EXISTS job               text,
  ADD COLUMN IF NOT EXISTS browser           text,
  ADD COLUMN IF NOT EXISTS claimed_installed boolean NOT NULL DEFAULT false,
  -- Not in the spec's field list, but section 8 asks to measure "clicked Add to
  -- Chrome", and there is nowhere else to put it. Distinct from claimed_installed:
  -- one is "went to the Store", the other is "says it is already done".
  ADD COLUMN IF NOT EXISTS clicked_install   boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS completed_at      timestamptz;

COMMENT ON COLUMN public.onboarding_responses.source_other IS 'free text behind "something else"';
COMMENT ON COLUMN public.onboarding_responses.job IS 'concrete task they want off their hands (screen 2)';
COMMENT ON COLUMN public.onboarding_responses.browser IS 'chrome | opera | firefox | edge | other — can the extension run at all';
COMMENT ON COLUMN public.onboarding_responses.claimed_installed IS 'pressed "I have already installed it"; a cohort to email if lastSeen never appears';
COMMENT ON COLUMN public.onboarding_responses.clicked_install IS 'pressed Add to Chrome (left for the Web Store)';

-- The answers row is written before the install screen, then updated by it — so
-- authenticated users need UPDATE on their own row, which the RLS lockdown
-- deliberately withheld. Scoped to the same auth.uid() = user_id test as the rest.
DROP POLICY IF EXISTS "authenticated can update own onboarding" ON public.onboarding_responses;
CREATE POLICY "authenticated can update own onboarding"
  ON public.onboarding_responses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Section 4г: people whose browser cannot run the extension ────────────────
-- Two live users hit exactly this in one day (Opera, Zen). Their addresses are a
-- separate list, not the launch waitlist: different question, different answer,
-- and waitlist.email is UNIQUE — someone already on it could not be recorded.
CREATE TABLE IF NOT EXISTS public.browser_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid,
  email      text NOT NULL,
  browser    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.browser_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated can insert browser request" ON public.browser_requests;
CREATE POLICY "authenticated can insert browser request"
  ON public.browser_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Reads are admin-only: this is a list of email addresses.
REVOKE ALL ON public.browser_requests FROM anon;

NOTIFY pgrst, 'reload schema';
