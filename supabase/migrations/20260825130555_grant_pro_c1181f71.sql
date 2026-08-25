-- ============================================================
-- Manual Pro grant for a specific user (1 month, courtesy)
-- User: c1181f71-0100-4e5d-8f74-41b8568f37c0 (pankaj.dixitp@gmail.com)
-- Was on: plan=free, status=active, no Polar customer (never paid)
-- This is a manual override, not tied to a real Polar subscription.
-- ============================================================

UPDATE public."Subscription"
SET
  plan = 'pro',
  status = 'active',
  "currentPeriodStart" = now(),
  "currentPeriodEnd" = now() + interval '1 month',
  "updatedAt" = now()
WHERE "userId" = 'c1181f71-0100-4e5d-8f74-41b8568f37c0';
