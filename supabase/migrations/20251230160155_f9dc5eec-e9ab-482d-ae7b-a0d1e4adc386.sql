-- Create prompts table to store user prompt history
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  response_text TEXT,
  tokens_used INTEGER DEFAULT 0,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  model TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create token_usage table for daily aggregated stats
CREATE TABLE public.token_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_requests INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create sessions table for activity tracking
CREATE TABLE public.sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  request_count INTEGER DEFAULT 0,
  source TEXT DEFAULT 'extension'
);

-- Enable RLS on all tables
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for prompts
CREATE POLICY "Users can view own prompts" ON public.prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for token_usage
CREATE POLICY "Users can view own token usage" ON public.token_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own token usage" ON public.token_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own token usage" ON public.token_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for sessions
CREATE POLICY "Users can view own sessions" ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to increment daily token usage (upsert)
CREATE OR REPLACE FUNCTION public.increment_token_usage(
  p_user_id UUID,
  p_tokens INTEGER,
  p_prompt_tokens INTEGER DEFAULT 0,
  p_completion_tokens INTEGER DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.token_usage (user_id, date, total_requests, total_tokens, prompt_tokens, completion_tokens)
  VALUES (p_user_id, CURRENT_DATE, 1, p_tokens, p_prompt_tokens, p_completion_tokens)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    total_requests = token_usage.total_requests + 1,
    total_tokens = token_usage.total_tokens + p_tokens,
    prompt_tokens = token_usage.prompt_tokens + p_prompt_tokens,
    completion_tokens = token_usage.completion_tokens + p_completion_tokens,
    updated_at = now();
END;
$$;

-- Trigger to update token_usage updated_at
CREATE TRIGGER update_token_usage_updated_at
  BEFORE UPDATE ON public.token_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();