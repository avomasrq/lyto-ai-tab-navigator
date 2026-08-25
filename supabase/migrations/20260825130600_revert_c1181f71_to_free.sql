-- ============================================================
-- Revert manual Pro grant back to free
-- User: c1181f71-0100-4e5d-8f74-41b8568f37c0 (pankaj.dixitp@gmail.com)
-- Not run automatically — kept here so the 1-month courtesy grant can be
-- rolled back cleanly by hand once it expires, or earlier if needed.
-- ============================================================

UPDATE public."Subscription"
SET
  plan = 'free',
  status = 'active',
  "currentPeriodStart" = NULL,
  "currentPeriodEnd" = NULL,
  "updatedAt" = now()
WHERE "userId" = 'c1181f71-0100-4e5d-8f74-41b8568f37c0';
