-- ============================================================
-- onboarding_responses.device — what the person was ON when they signed up.
--
-- Why: Argos is a Chrome extension, and mobile Chrome cannot install extensions
-- at all. Someone who finishes onboarding on a phone therefore CANNOT reach the
-- product, no matter what the page says — they show up in the numbers as "signed
-- up, never opened the panel", indistinguishable from someone who lost interest.
-- Half of that gap (180 signed up → 87 opened the panel) may simply be phones,
-- and nothing in the schema could tell us: no user agent is stored anywhere.
--
-- Three buckets, not a raw user-agent string: the question is "could this person
-- install at all", and a UA string would be PII-adjacent detail we never need.
-- ============================================================

ALTER TABLE public.onboarding_responses
  ADD COLUMN IF NOT EXISTS device text;

COMMENT ON COLUMN public.onboarding_responses.device IS
  'desktop | mobile | tablet — form factor at signup. Mobile cannot install the extension.';

-- Existing rows stay NULL: unknown, not desktop. Backfilling them with a guess
-- would put made-up data under the exact comparison this column exists to make.

-- RLS is unchanged: the insert policy is per-row (auth.uid() = user_id) and does
-- not enumerate columns, so the new one is covered by the existing policy.

NOTIFY pgrst, 'reload schema';
