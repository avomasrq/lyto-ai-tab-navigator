-- ============================================================
-- Manual Pro grant for a specific user
-- User: 4aef36da-c174-4218-bdee-191f967f9e96
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
WHERE "userId" = '4aef36da-c174-4218-bdee-191f967f9e96';
