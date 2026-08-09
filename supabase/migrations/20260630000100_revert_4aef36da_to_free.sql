-- ============================================================
-- Revert manual Pro grant back to free
-- User: 4aef36da-c174-4218-bdee-191f967f9e96
-- ============================================================

UPDATE public."Subscription"
SET
  plan = 'free',
  status = 'active',
  "currentPeriodStart" = NULL,
  "currentPeriodEnd" = NULL,
  "updatedAt" = now()
WHERE "userId" = '4aef36da-c174-4218-bdee-191f967f9e96';
