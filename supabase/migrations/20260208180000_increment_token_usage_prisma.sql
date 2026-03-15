-- Update increment_token_usage for Prisma schema (TokenUsage table, camelCase columns)
-- Replaces old token_usage (snake_case) if Prisma is the source of truth

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
  INSERT INTO public."TokenUsage" ("userId", "date", "totalRequests", "totalTokens", "promptTokens", "completionTokens", "createdAt", "updatedAt")
  VALUES (p_user_id, CURRENT_DATE::timestamptz, 1, p_tokens, p_prompt_tokens, p_completion_tokens, NOW(), NOW())
  ON CONFLICT ("userId", "date")
  DO UPDATE SET
    "totalRequests" = "TokenUsage"."totalRequests" + 1,
    "totalTokens" = "TokenUsage"."totalTokens" + p_tokens,
    "promptTokens" = "TokenUsage"."promptTokens" + p_prompt_tokens,
    "completionTokens" = "TokenUsage"."completionTokens" + p_completion_tokens,
    "updatedAt" = NOW();
END;
$$;
