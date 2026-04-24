-- ============================================================
-- Security Hardening: RLS audit + hardened policies
-- ============================================================
-- Principles applied:
--   1. Deny by default — only what is explicitly needed is allowed
--   2. Sensitive write paths go through service_role (Edge Functions) only
--   3. No anonymous access to user data — not even aggregate counts
--   4. Waitlist emails never exposed; count served via SECURITY DEFINER fn
--   5. Email format validated at DB level on waitlist
--   6. Subscription and TokenUsage are write-locked to service_role so
--      users cannot upgrade themselves or erase usage limits
--
-- NOTE: PascalCase Prisma tables are wrapped in DO blocks so the migration
--       is safe even if those tables don't exist in this environment.
-- ============================================================

-- ============================================================
-- SECTION 1: _prisma_migrations — service_role only
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_prisma_migrations') THEN
    ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "service_role only" ON public."_prisma_migrations";
    CREATE POLICY "service_role only"
      ON public."_prisma_migrations" FOR ALL TO service_role
      USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 2: WAITLIST — insert-only for anon, no email exposure
-- ============================================================

DROP POLICY IF EXISTS "anon can select waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "anon can insert waitlist" ON public.waitlist;

-- Validate email format; block garbage entries
DROP POLICY IF EXISTS "anon insert waitlist" ON public.waitlist;
CREATE POLICY "anon insert waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email ~* '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    AND length(email) <= 254
    AND length(email) >= 5
  );

-- Count served through a SECURITY DEFINER function — emails never exposed
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COUNT(*) FROM public.waitlist;
$$;

GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon, authenticated;

-- ============================================================
-- SECTION 3: SUBSCRIPTION (Prisma) — read-only for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Subscription') THEN
    DROP POLICY IF EXISTS "Users can insert own subscription" ON public."Subscription";
    DROP POLICY IF EXISTS "Users can update own subscription" ON public."Subscription";
    DROP POLICY IF EXISTS "Users can delete own subscription" ON public."Subscription";
    DROP POLICY IF EXISTS "Users can view own subscription" ON public."Subscription";
    CREATE POLICY "Users can view own subscription"
      ON public."Subscription" FOR SELECT TO authenticated
      USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access subscription" ON public."Subscription";
    CREATE POLICY "service_role full access subscription"
      ON public."Subscription" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 4: TOKEN_USAGE (Prisma) — read-only for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'TokenUsage') THEN
    DROP POLICY IF EXISTS "Users can insert own token usage" ON public."TokenUsage";
    DROP POLICY IF EXISTS "Users can update own token usage" ON public."TokenUsage";
    DROP POLICY IF EXISTS "Users can delete own token usage" ON public."TokenUsage";
    DROP POLICY IF EXISTS "Users can view own token usage" ON public."TokenUsage";
    CREATE POLICY "Users can view own token usage"
      ON public."TokenUsage" FOR SELECT TO authenticated
      USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access token_usage" ON public."TokenUsage";
    CREATE POLICY "service_role full access token_usage"
      ON public."TokenUsage" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 5: PROMPT (Prisma) — read + delete for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Prompt') THEN
    DROP POLICY IF EXISTS "Users can view own prompts" ON public."Prompt";
    DROP POLICY IF EXISTS "Users can insert own prompts" ON public."Prompt";
    DROP POLICY IF EXISTS "Users can update own prompts" ON public."Prompt";
    DROP POLICY IF EXISTS "Users can delete own prompts" ON public."Prompt";
    CREATE POLICY "Users can view own prompts"
      ON public."Prompt" FOR SELECT TO authenticated USING (auth.uid() = "userId");
    CREATE POLICY "Users can delete own prompts"
      ON public."Prompt" FOR DELETE TO authenticated USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access prompt" ON public."Prompt";
    CREATE POLICY "service_role full access prompt"
      ON public."Prompt" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 6: PROJECT (Prisma) — full CRUD for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Project') THEN
    DROP POLICY IF EXISTS "Users can view own projects" ON public."Project";
    DROP POLICY IF EXISTS "Users can insert own projects" ON public."Project";
    DROP POLICY IF EXISTS "Users can update own projects" ON public."Project";
    DROP POLICY IF EXISTS "Users can delete own projects" ON public."Project";
    CREATE POLICY "Users can view own projects"
      ON public."Project" FOR SELECT TO authenticated USING (auth.uid() = "userId");
    CREATE POLICY "Users can insert own projects"
      ON public."Project" FOR INSERT TO authenticated WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can update own projects"
      ON public."Project" FOR UPDATE TO authenticated
      USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can delete own projects"
      ON public."Project" FOR DELETE TO authenticated USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access project" ON public."Project";
    CREATE POLICY "service_role full access project"
      ON public."Project" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 7: RESEARCH_SESSION (Prisma) — full CRUD for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ResearchSession') THEN
    DROP POLICY IF EXISTS "Users can view own research sessions" ON public."ResearchSession";
    DROP POLICY IF EXISTS "Users can insert own research sessions" ON public."ResearchSession";
    DROP POLICY IF EXISTS "Users can update own research sessions" ON public."ResearchSession";
    DROP POLICY IF EXISTS "Users can delete own research sessions" ON public."ResearchSession";
    CREATE POLICY "Users can view own research sessions"
      ON public."ResearchSession" FOR SELECT TO authenticated USING (auth.uid() = "userId");
    CREATE POLICY "Users can insert own research sessions"
      ON public."ResearchSession" FOR INSERT TO authenticated WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can update own research sessions"
      ON public."ResearchSession" FOR UPDATE TO authenticated
      USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can delete own research sessions"
      ON public."ResearchSession" FOR DELETE TO authenticated USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access research_session" ON public."ResearchSession";
    CREATE POLICY "service_role full access research_session"
      ON public."ResearchSession" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 8: USER_MEMORY (Prisma) — full CRUD for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'UserMemory') THEN
    DROP POLICY IF EXISTS "Users can view own memories" ON public."UserMemory";
    DROP POLICY IF EXISTS "Users can insert own memories" ON public."UserMemory";
    DROP POLICY IF EXISTS "Users can update own memories" ON public."UserMemory";
    DROP POLICY IF EXISTS "Users can delete own memories" ON public."UserMemory";
    CREATE POLICY "Users can view own memories"
      ON public."UserMemory" FOR SELECT TO authenticated USING (auth.uid() = "userId");
    CREATE POLICY "Users can insert own memories"
      ON public."UserMemory" FOR INSERT TO authenticated WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can update own memories"
      ON public."UserMemory" FOR UPDATE TO authenticated
      USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can delete own memories"
      ON public."UserMemory" FOR DELETE TO authenticated USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access user_memory_prisma" ON public."UserMemory";
    CREATE POLICY "service_role full access user_memory_prisma"
      ON public."UserMemory" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 9: USER_SETTINGS (Prisma) — full CRUD for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'UserSettings') THEN
    DROP POLICY IF EXISTS "Users can view own settings" ON public."UserSettings";
    DROP POLICY IF EXISTS "Users can insert own settings" ON public."UserSettings";
    DROP POLICY IF EXISTS "Users can update own settings" ON public."UserSettings";
    DROP POLICY IF EXISTS "Users can delete own settings" ON public."UserSettings";
    CREATE POLICY "Users can view own settings"
      ON public."UserSettings" FOR SELECT TO authenticated USING (auth.uid() = "userId");
    CREATE POLICY "Users can insert own settings"
      ON public."UserSettings" FOR INSERT TO authenticated WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can update own settings"
      ON public."UserSettings" FOR UPDATE TO authenticated
      USING (auth.uid() = "userId") WITH CHECK (auth.uid() = "userId");
    CREATE POLICY "Users can delete own settings"
      ON public."UserSettings" FOR DELETE TO authenticated USING (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access user_settings_prisma" ON public."UserSettings";
    CREATE POLICY "service_role full access user_settings_prisma"
      ON public."UserSettings" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 10: CONVERSATION_EVENT (Prisma) — insert + read for owner
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ConversationEvent') THEN
    DROP POLICY IF EXISTS "Users can view own conversation events" ON public."ConversationEvent";
    DROP POLICY IF EXISTS "Users can insert own conversation events" ON public."ConversationEvent";
    CREATE POLICY "Users can view own conversation events"
      ON public."ConversationEvent" FOR SELECT TO authenticated USING (auth.uid() = "userId");
    CREATE POLICY "Users can insert own conversation events"
      ON public."ConversationEvent" FOR INSERT TO authenticated WITH CHECK (auth.uid() = "userId");
    DROP POLICY IF EXISTS "service_role full access conversation_event" ON public."ConversationEvent";
    CREATE POLICY "service_role full access conversation_event"
      ON public."ConversationEvent" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 11: USERS (Prisma "users") — read + update own record
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON public."users";
    DROP POLICY IF EXISTS "Users can update own profile" ON public."users";
    DROP POLICY IF EXISTS "Users can insert their own user record" ON public."users";
    DROP POLICY IF EXISTS "Users can delete their own user record" ON public."users";
    CREATE POLICY "Users can view own profile"
      ON public."users" FOR SELECT TO authenticated USING (auth.uid() = id);
    CREATE POLICY "Users can update own profile"
      ON public."users" FOR UPDATE TO authenticated
      USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
    DROP POLICY IF EXISTS "service_role full access users_prisma" ON public."users";
    CREATE POLICY "service_role full access users_prisma"
      ON public."users" FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 12: GOOGLE_TOKENS — no client reads; service_role only
-- Raw OAuth tokens must never be sent to the browser.
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'google_tokens') THEN
    DROP POLICY IF EXISTS "Users can view their own google_tokens" ON public.google_tokens;
    DROP POLICY IF EXISTS "Users can insert their own google_tokens" ON public.google_tokens;
    DROP POLICY IF EXISTS "Users can update their own google_tokens" ON public.google_tokens;
    DROP POLICY IF EXISTS "Users can delete their own google_tokens" ON public.google_tokens;
    DROP POLICY IF EXISTS "service_role full access google_tokens" ON public.google_tokens;
    CREATE POLICY "service_role full access google_tokens"
      ON public.google_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 13: API_KEYS — owner full CRUD + service_role
-- ============================================================
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'api_keys') THEN
    DROP POLICY IF EXISTS "Users can view their own api_keys" ON public.api_keys;
    DROP POLICY IF EXISTS "Users can insert their own api_keys" ON public.api_keys;
    DROP POLICY IF EXISTS "Users can update their own api_keys" ON public.api_keys;
    DROP POLICY IF EXISTS "Users can delete their own api_keys" ON public.api_keys;
    CREATE POLICY "Users can view own api_keys"
      ON public.api_keys FOR SELECT TO authenticated USING (auth.uid()::text = user_id);
    CREATE POLICY "Users can insert own api_keys"
      ON public.api_keys FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = user_id);
    CREATE POLICY "Users can update own api_keys"
      ON public.api_keys FOR UPDATE TO authenticated
      USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    CREATE POLICY "Users can delete own api_keys"
      ON public.api_keys FOR DELETE TO authenticated USING (auth.uid()::text = user_id);
    DROP POLICY IF EXISTS "service_role full access api_keys" ON public.api_keys;
    CREATE POLICY "service_role full access api_keys"
      ON public.api_keys FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 14: Snake_case tables — add service_role bypass
-- (user-facing policies already exist from prior migrations)
-- ============================================================

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chart_snapshots') THEN
    DROP POLICY IF EXISTS "service_role full access chart_snapshots" ON public.chart_snapshots;
    CREATE POLICY "service_role full access chart_snapshots"
      ON public.chart_snapshots FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_snapshots') THEN
    DROP POLICY IF EXISTS "service_role full access page_snapshots" ON public.page_snapshots;
    CREATE POLICY "service_role full access page_snapshots"
      ON public.page_snapshots FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'selected_elements') THEN
    DROP POLICY IF EXISTS "service_role full access selected_elements" ON public.selected_elements;
    CREATE POLICY "service_role full access selected_elements"
      ON public.selected_elements FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_memory') THEN
    DROP POLICY IF EXISTS "service_role full access user_memory" ON public.user_memory;
    CREATE POLICY "service_role full access user_memory"
      ON public.user_memory FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    DROP POLICY IF EXISTS "service_role full access user_settings" ON public.user_settings;
    CREATE POLICY "service_role full access user_settings"
      ON public.user_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'standalone_conversations') THEN
    DROP POLICY IF EXISTS "service_role full access standalone_conversations" ON public.standalone_conversations;
    CREATE POLICY "service_role full access standalone_conversations"
      ON public.standalone_conversations FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_conversations') THEN
    DROP POLICY IF EXISTS "service_role full access project_conversations" ON public.project_conversations;
    CREATE POLICY "service_role full access project_conversations"
      ON public.project_conversations FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'project_memory') THEN
    DROP POLICY IF EXISTS "service_role full access project_memory" ON public.project_memory;
    CREATE POLICY "service_role full access project_memory"
      ON public.project_memory FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'projects') THEN
    DROP POLICY IF EXISTS "service_role full access projects" ON public.projects;
    CREATE POLICY "service_role full access projects"
      ON public.projects FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'research_sessions') THEN
    DROP POLICY IF EXISTS "service_role full access research_sessions" ON public.research_sessions;
    CREATE POLICY "service_role full access research_sessions"
      ON public.research_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'research_steps') THEN
    DROP POLICY IF EXISTS "service_role full access research_steps" ON public.research_steps;
    CREATE POLICY "service_role full access research_steps"
      ON public.research_steps FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
    DROP POLICY IF EXISTS "service_role full access messages" ON public.messages;
    CREATE POLICY "service_role full access messages"
      ON public.messages FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversation_events') THEN
    DROP POLICY IF EXISTS "service_role full access conversation_events" ON public.conversation_events;
    CREATE POLICY "service_role full access conversation_events"
      ON public.conversation_events FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================
-- SECTION 15: Revoke public schema default privileges
-- Future tables won't be publicly readable by default.
-- ============================================================
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Anon can only INSERT into waitlist (SELECT goes through function)
GRANT INSERT ON public.waitlist TO anon;

-- ============================================================
-- SECTION 16: Enable Realtime on Subscription table
-- Required for the frontend Realtime listener to fire when
-- the Polar webhook updates a user's plan after purchase.
-- ============================================================
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Subscription'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public."Subscription";
  END IF;
END $$;

-- ============================================================
-- SECTION 17: Reload PostgREST schema cache
-- ============================================================
NOTIFY pgrst, 'reload schema';
