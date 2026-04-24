-- ============================================================
-- Migration: 0a3a8507-ca8f-44da-9f00-58189ba7cff4
-- Proper Polar-based subscription schema
-- ============================================================
-- Goals:
--   1. One subscription row per user (enforced)
--   2. Valid plan/status values only (enforced)
--   3. Indexes for fast webhook lookups by polarCustomerId / polarSubscriptionId
--   4. canceledAt timestamp for audit trail
--   5. trialEndsAt for future trial support
--   6. Ensure RLS is tight (service_role writes, authenticated reads own row)
-- ============================================================

-- ── 1. Add missing columns ────────────────────────────────────────────────

ALTER TABLE public."Subscription"
  ADD COLUMN IF NOT EXISTS "canceledAt"       timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS "trialEndsAt"      timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS "cancelAtPeriodEnd" boolean    NOT NULL DEFAULT false;

-- ── 2. Enforce valid plan values ──────────────────────────────────────────

ALTER TABLE public."Subscription"
  DROP CONSTRAINT IF EXISTS "Subscription_plan_check";

ALTER TABLE public."Subscription"
  ADD CONSTRAINT "Subscription_plan_check"
  CHECK (plan IN ('free', 'pro', 'team'));

-- ── 3. Enforce valid status values ───────────────────────────────────────

ALTER TABLE public."Subscription"
  DROP CONSTRAINT IF EXISTS "Subscription_status_check";

ALTER TABLE public."Subscription"
  ADD CONSTRAINT "Subscription_status_check"
  CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'unpaid'));

-- ── 4. One subscription per user (unique userId) ─────────────────────────

ALTER TABLE public."Subscription"
  DROP CONSTRAINT IF EXISTS "Subscription_userId_key";

ALTER TABLE public."Subscription"
  ADD CONSTRAINT "Subscription_userId_key"
  UNIQUE ("userId");

-- ── 5. Unique Polar subscription ID (prevents duplicate webhooks) ─────────

ALTER TABLE public."Subscription"
  DROP CONSTRAINT IF EXISTS "Subscription_polarSubscriptionId_key";

ALTER TABLE public."Subscription"
  ADD CONSTRAINT "Subscription_polarSubscriptionId_key"
  UNIQUE ("polarSubscriptionId");

-- ── 6. Indexes for fast webhook lookups ──────────────────────────────────

-- Webhook looks up by polarCustomerId when user_id is missing from metadata
CREATE INDEX IF NOT EXISTS "idx_subscription_polarCustomerId"
  ON public."Subscription" ("polarCustomerId")
  WHERE "polarCustomerId" IS NOT NULL;

-- Webhook looks up by polarSubscriptionId for updates/cancellations
CREATE INDEX IF NOT EXISTS "idx_subscription_polarSubscriptionId"
  ON public."Subscription" ("polarSubscriptionId")
  WHERE "polarSubscriptionId" IS NOT NULL;

-- Dashboard queries by userId
CREATE INDEX IF NOT EXISTS "idx_subscription_userId"
  ON public."Subscription" ("userId");

-- ── 7. Helper function: upsert subscription from webhook ─────────────────
-- Edge Functions call this instead of raw UPDATE/INSERT.
-- Runs as SECURITY DEFINER (service_role level) — never callable by users.

CREATE OR REPLACE FUNCTION public.upsert_polar_subscription(
  p_user_id            text,
  p_polar_customer_id  text,
  p_polar_sub_id       text,
  p_plan               text,
  p_status             text,
  p_period_start       timestamptz,
  p_period_end         timestamptz,
  p_cancel_at_end      boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan   text := LOWER(p_plan);
  v_status text := LOWER(p_status);
BEGIN
  -- Clamp to allowed values
  IF v_plan   NOT IN ('free','pro','team')                                            THEN v_plan   := 'free';  END IF;
  IF v_status NOT IN ('active','canceled','past_due','trialing','incomplete','unpaid') THEN v_status := 'active'; END IF;

  INSERT INTO public."Subscription" (
    id,
    "userId",
    plan,
    status,
    "polarCustomerId",
    "polarSubscriptionId",
    "currentPeriodStart",
    "currentPeriodEnd",
    "cancelAtPeriodEnd",
    "canceledAt",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    'sub_' || substring(p_user_id, 1, 8) || '_' || to_char(now(), 'SSSS'),
    p_user_id,
    v_plan,
    v_status,
    p_polar_customer_id,
    p_polar_sub_id,
    p_period_start,
    p_period_end,
    p_cancel_at_end,
    CASE WHEN v_status = 'canceled' THEN now() ELSE NULL END,
    now(),
    now()
  )
  ON CONFLICT ("userId") DO UPDATE SET
    plan                  = EXCLUDED.plan,
    status                = EXCLUDED.status,
    "polarCustomerId"     = COALESCE(EXCLUDED."polarCustomerId", "Subscription"."polarCustomerId"),
    "polarSubscriptionId" = COALESCE(EXCLUDED."polarSubscriptionId", "Subscription"."polarSubscriptionId"),
    "currentPeriodStart"  = COALESCE(EXCLUDED."currentPeriodStart", "Subscription"."currentPeriodStart"),
    "currentPeriodEnd"    = COALESCE(EXCLUDED."currentPeriodEnd", "Subscription"."currentPeriodEnd"),
    "cancelAtPeriodEnd"   = EXCLUDED."cancelAtPeriodEnd",
    "canceledAt"          = CASE
                              WHEN EXCLUDED.status = 'canceled' AND "Subscription"."canceledAt" IS NULL
                              THEN now()
                              WHEN EXCLUDED.status != 'canceled'
                              THEN NULL
                              ELSE "Subscription"."canceledAt"
                            END,
    "updatedAt"           = now();
END;
$$;

-- Only service_role can call this function (revoke from public/authenticated)
REVOKE ALL ON FUNCTION public.upsert_polar_subscription FROM PUBLIC;
REVOKE ALL ON FUNCTION public.upsert_polar_subscription FROM authenticated;
REVOKE ALL ON FUNCTION public.upsert_polar_subscription FROM anon;
GRANT EXECUTE ON FUNCTION public.upsert_polar_subscription TO service_role;

-- ── 8. RLS: double-check policies are correct ─────────────────────────────

ALTER TABLE public."Subscription" ENABLE ROW LEVEL SECURITY;

-- Users can only read their own row
DROP POLICY IF EXISTS "Users can view own subscription" ON public."Subscription";
CREATE POLICY "Users can view own subscription"
  ON public."Subscription" FOR SELECT
  TO authenticated
  USING (auth.uid() = "userId");

-- service_role has full access (webhooks, edge functions)
DROP POLICY IF EXISTS "service_role full access subscription" ON public."Subscription";
CREATE POLICY "service_role full access subscription"
  ON public."Subscription" FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- ── 9. Realtime (in case it wasn't added yet) ─────────────────────────────
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public."Subscription";
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ── 10. Reload schema cache ───────────────────────────────────────────────
NOTIFY pgrst, 'reload schema';
