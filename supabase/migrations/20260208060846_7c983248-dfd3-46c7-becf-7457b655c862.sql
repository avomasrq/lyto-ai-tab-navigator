-- Enable RLS on all tables
ALTER TABLE public."Prompt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TokenUsage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ResearchSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserMemory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ConversationEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."users" ENABLE ROW LEVEL SECURITY;

-- Prompt: Users can view their own prompts
CREATE POLICY "Users can view own prompts"
ON public."Prompt" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- TokenUsage: Users can view their own token usage
CREATE POLICY "Users can view own token usage"
ON public."TokenUsage" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Project: Users can view their own projects
CREATE POLICY "Users can view own projects"
ON public."Project" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- ResearchSession: Users can view their own research sessions
CREATE POLICY "Users can view own research sessions"
ON public."ResearchSession" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- UserMemory: Users can view their own memories
CREATE POLICY "Users can view own memories"
ON public."UserMemory" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- Subscription: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON public."Subscription" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- UserSettings: Users can view their own settings
CREATE POLICY "Users can view own settings"
ON public."UserSettings" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- ConversationEvent: Users can view their own conversation events
CREATE POLICY "Users can view own conversation events"
ON public."ConversationEvent" FOR SELECT
TO authenticated
USING (auth.uid() = "userId");

-- users: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public."users" FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';