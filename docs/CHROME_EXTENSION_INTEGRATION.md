# Chrome Extension Integration Guide

This guide shows how to integrate your Chrome extension with the Lyto AI Supabase backend for unified auth and usage tracking.

## 1. Shared Authentication

The Chrome extension and landing page must share the same Supabase session. Here's how:

### Option A: Pass Session from Landing Page to Extension

When a user logs in on the landing page, store the session in `chrome.storage.local`:

```typescript
// In your landing page (after successful login)
import { supabase } from '@/integrations/supabase/client';

const session = await supabase.auth.getSession();
if (session.data.session) {
  // Send session to extension via message
  chrome.runtime.sendMessage(YOUR_EXTENSION_ID, {
    type: 'SET_SESSION',
    session: session.data.session
  });
}
```

### Option B: Login in Extension, Share to Landing Page

In the extension, after Google OAuth login:

```typescript
// extension/background.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hbjnwrzqjwfyjmowkcvr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhiam53cnpxandmeWptb3drY3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODQ2OTgsImV4cCI6MjA4MjU2MDY5OH0.3-Q7EMbUVZKjjR4FecjhA98YSnDy-PJaR-UvOLZtrH4'
);

// Store session in chrome.storage for persistence
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    chrome.storage.local.set({ supabaseSession: session });
  } else {
    chrome.storage.local.remove('supabaseSession');
  }
});

// Restore session on extension load
chrome.storage.local.get('supabaseSession', async ({ supabaseSession }) => {
  if (supabaseSession) {
    await supabase.auth.setSession(supabaseSession);
  }
});
```

## 2. Logging Prompts and Token Usage

Every time a user sends a prompt in the extension sidebar, save it to Supabase:

```typescript
// extension/api.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hbjnwrzqjwfyjmowkcvr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhiam53cnpxandmeWptb3drY3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODQ2OTgsImV4cCI6MjA4MjU2MDY5OH0.3-Q7EMbUVZKjjR4FecjhA98YSnDy-PJaR-UvOLZtrH4'
);

interface PromptPayload {
  promptText: string;
  responseText?: string;
  tokensUsed: number;
  promptTokens?: number;
  completionTokens?: number;
  model?: string;
}

export async function logPrompt(payload: PromptPayload) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User not authenticated');
    return null;
  }

  // 1. Insert the prompt record
  const { data: promptData, error: promptError } = await supabase
    .from('prompts')
    .insert({
      user_id: user.id,
      prompt_text: payload.promptText,
      response_text: payload.responseText || null,
      tokens_used: payload.tokensUsed,
      prompt_tokens: payload.promptTokens || 0,
      completion_tokens: payload.completionTokens || 0,
      model: payload.model || null
    })
    .select()
    .single();

  if (promptError) {
    console.error('Error logging prompt:', promptError);
    return null;
  }

  // 2. Update daily token usage (uses the increment_token_usage function)
  const { error: usageError } = await supabase.rpc('increment_token_usage', {
    p_user_id: user.id,
    p_tokens: payload.tokensUsed,
    p_prompt_tokens: payload.promptTokens || 0,
    p_completion_tokens: payload.completionTokens || 0
  });

  if (usageError) {
    console.error('Error updating token usage:', usageError);
  }

  return promptData;
}
```

## 3. Example: Full Integration in Sidebar

```typescript
// extension/sidebar.tsx
import { logPrompt } from './api';

async function handleUserPrompt(userMessage: string) {
  // 1. Call your AI API (OpenAI, etc.)
  const response = await callOpenAI(userMessage);
  
  // 2. Log to Supabase
  await logPrompt({
    promptText: userMessage,
    responseText: response.content,
    tokensUsed: response.usage.total_tokens,
    promptTokens: response.usage.prompt_tokens,
    completionTokens: response.usage.completion_tokens,
    model: response.model
  });

  // 3. Display response to user
  displayResponse(response.content);
}

async function callOpenAI(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUR_OPENAI_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
    model: data.model
  };
}
```

## 4. Session Tracking (Optional)

Track user sessions for behavior insights:

```typescript
// extension/session.ts
let currentSessionId: string | null = null;

export async function startSession() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data } = await supabase
    .from('sessions')
    .insert({
      user_id: user.id,
      source: 'extension'
    })
    .select()
    .single();

  currentSessionId = data?.id || null;
}

export async function endSession() {
  if (!currentSessionId) return;

  await supabase
    .from('sessions')
    .update({ ended_at: new Date().toISOString() })
    .eq('id', currentSessionId);

  currentSessionId = null;
}

export async function incrementSessionRequests() {
  if (!currentSessionId) return;

  await supabase.rpc('increment_session_request', {
    session_id: currentSessionId
  });
}
```

## 5. Manifest Permissions

Add these to your `manifest.json`:

```json
{
  "permissions": ["storage", "identity"],
  "host_permissions": [
    "https://hbjnwrzqjwfyjmowkcvr.supabase.co/*"
  ]
}
```

## Summary

1. **Auth**: Use `chrome.storage.local` to persist Supabase sessions in the extension
2. **Prompts**: Call `logPrompt()` after every AI request
3. **Tokens**: The `increment_token_usage` function handles daily aggregation
4. **Dashboard**: Users see all their data at `/dashboard` on the landing page
