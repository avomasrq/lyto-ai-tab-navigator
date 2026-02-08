# Chrome Extension Integration Guide

This guide shows how to integrate your Chrome extension with the Lyto AI Supabase backend for unified auth and usage tracking.

## 1. Shared Authentication (Universal Auth Architecture)

**Auth flow:** OAuth exists ONLY on the landing website. The extension opens `https://www.trylyto.com/auth` when the user is not logged in.

### Landing Page → Extension (window.postMessage)

The landing page sends the Supabase session to the extension via `window.postMessage` after successful login. The extension must inject a content script on `trylyto.com` to receive it:

```typescript
// Landing page (already implemented in useAuth.tsx)
// After successful Supabase Auth (Google OAuth):
window.postMessage({
  type: "SUPABASE_AUTH",
  access_token: session.access_token,
  refresh_token: session.refresh_token
}, "*");
```

### Extension: Listen for Auth

```typescript
// extension content script on https://www.trylyto.com/*
window.addEventListener("message", async (event) => {
  if (event.data?.type !== "SUPABASE_AUTH") return;

  await supabase.auth.setSession({
    access_token: event.data.access_token,
    refresh_token: event.data.refresh_token
  });

  unlockUI(); // Unlock extension UI
});
```

### Extension: Startup Flow

1. On startup: `const { data } = await supabase.auth.getSession()`
2. If NO session → lock UI and open `https://www.trylyto.com/auth`
3. User logs in on landing → session posted via postMessage
4. Extension receives it, calls `setSession`, unlocks UI

**Important:** The extension must NOT implement OAuth or create users. Supabase Auth is the single source of identity.

## 2. Logging Prompts and Token Usage

Every time a user sends a prompt in the extension sidebar, call the `log-prompt` edge function. This is the **recommended approach** as it handles both prompt logging and token usage tracking atomically.

### Option A: Use the Edge Function (Recommended)

```typescript
// extension/api.ts
interface PromptPayload {
  promptText: string;
  responseText?: string;
  tokensUsed: number;
  promptTokens?: number;
  completionTokens?: number;
  model?: string;
}

export async function logPrompt(payload: PromptPayload) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    console.error('User not authenticated');
    return null;
  }

  try {
    const response = await fetch(
      'https://hbjnwrzqjwfyjmowkcvr.supabase.co/functions/v1/log-prompt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Error logging prompt:', error);
      return null;
    }

    const data = await response.json();
    return data.prompt;
  } catch (error) {
    console.error('Network error logging prompt:', error);
    return null;
  }
}
```

### Option B: Direct Supabase Client (Alternative)

If you prefer using the Supabase client directly:

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
