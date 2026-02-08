import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface LogPromptRequest {
  promptText: string;
  responseText?: string;
  tokensUsed: number;
  promptTokens?: number;
  completionTokens?: number;
  model?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Use the user's JWT to get their ID
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: LogPromptRequest = await req.json();
    const {
      promptText,
      responseText = null,
      tokensUsed,
      promptTokens = 0,
      completionTokens = 0,
      model = null,
    } = body;

    if (!promptText || tokensUsed === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: promptText, tokensUsed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for database operations (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Insert into Prompt (PascalCase, camelCase columns)
    const { data: promptData, error: promptError } = await supabaseAdmin
      .from("Prompt")
      .insert({
        userId: user.id,
        promptText,
        responseText,
        tokensUsed,
        promptTokens,
        completionTokens,
        model,
      })
      .select()
      .single();

    if (promptError) {
      console.error("Error inserting prompt:", promptError);
      return new Response(
        JSON.stringify({ error: "Failed to log prompt", details: promptError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Increment daily token usage using the database function
    const { error: usageError } = await supabaseAdmin.rpc("increment_token_usage", {
      p_user_id: user.id,
      p_tokens: tokensUsed,
      p_prompt_tokens: promptTokens,
      p_completion_tokens: completionTokens,
    });

    if (usageError) {
      console.error("Error updating token usage:", usageError);
      // Don't fail the request, prompt was logged successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        prompt: promptData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
