import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create client with anon key to verify user token
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    
    if (userError || !user) {
      console.error("User auth error:", userError);
      return new Response(JSON.stringify({ error: "Invalid token", details: userError?.message }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Authenticated user:", user.id);
    const userId = user.id;

    // Use service role client for inserts (bypasses RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Generate test prompts
    const prompts = [
      { prompt_text: "What is the capital of France?", response_text: "The capital of France is Paris.", tokens_used: 45, prompt_tokens: 12, completion_tokens: 33, model: "gpt-4" },
      { prompt_text: "Explain quantum computing in simple terms", response_text: "Quantum computing uses quantum bits (qubits) that can exist in multiple states simultaneously, enabling parallel processing of complex calculations.", tokens_used: 156, prompt_tokens: 28, completion_tokens: 128, model: "gpt-4" },
      { prompt_text: "Write a haiku about coding", response_text: "Lines of code cascade\nBugs emerge like morning dew\nDebug, compile, run", tokens_used: 67, prompt_tokens: 15, completion_tokens: 52, model: "gpt-3.5-turbo" },
      { prompt_text: "How do I center a div in CSS?", response_text: "You can center a div using flexbox: display: flex; justify-content: center; align-items: center; on the parent container.", tokens_used: 89, prompt_tokens: 18, completion_tokens: 71, model: "gpt-4" },
      { prompt_text: "What are the benefits of TypeScript?", response_text: "TypeScript provides static typing, better IDE support, early error detection, improved code documentation, and enhanced refactoring capabilities.", tokens_used: 112, prompt_tokens: 22, completion_tokens: 90, model: "gpt-4" },
      { prompt_text: "Summarize the book 'Atomic Habits'", response_text: "Atomic Habits by James Clear focuses on building good habits through small, incremental changes. Key concepts include the habit loop, 1% improvements, and identity-based habits.", tokens_used: 134, prompt_tokens: 16, completion_tokens: 118, model: "gpt-4" },
      { prompt_text: "What is machine learning?", response_text: "Machine learning is a subset of AI that enables systems to learn from data and improve over time without being explicitly programmed.", tokens_used: 78, prompt_tokens: 14, completion_tokens: 64, model: "gpt-3.5-turbo" },
      { prompt_text: "Best practices for REST API design", response_text: "Use proper HTTP methods, meaningful URLs, consistent naming, pagination, versioning, proper status codes, and comprehensive documentation.", tokens_used: 145, prompt_tokens: 20, completion_tokens: 125, model: "gpt-4" },
    ];

    // Insert prompts with varying dates
    const promptInserts = prompts.map((p, i) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(i / 2));
      date.setHours(date.getHours() - i);
      return {
        ...p,
        user_id: userId,
        created_at: date.toISOString(),
      };
    });

    const { error: promptsError } = await supabaseAdmin
      .from("prompts")
      .insert(promptInserts);

    if (promptsError) {
      console.error("Prompts insert error:", promptsError);
    }

    // Generate token usage for last 14 days
    const tokenUsageData = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      
      const requests = Math.floor(Math.random() * 15) + 3;
      const promptTokens = Math.floor(Math.random() * 500) + 100;
      const completionTokens = Math.floor(Math.random() * 800) + 200;
      
      tokenUsageData.push({
        user_id: userId,
        date: dateStr,
        total_requests: requests,
        total_tokens: promptTokens + completionTokens,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
      });
    }

    // Upsert token usage (in case data already exists for some dates)
    for (const usage of tokenUsageData) {
      const { error: usageError } = await supabaseAdmin
        .from("token_usage")
        .upsert(usage, { onConflict: "user_id,date" });
      
      if (usageError) {
        console.error("Token usage insert error:", usageError);
      }
    }

    // Create a session
    const { error: sessionError } = await supabaseAdmin
      .from("sessions")
      .insert({
        user_id: userId,
        source: "extension",
        request_count: prompts.length,
        started_at: new Date(Date.now() - 3600000).toISOString(),
        ended_at: new Date().toISOString(),
      });

    if (sessionError) {
      console.error("Session insert error:", sessionError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Test data seeded successfully",
        data: {
          prompts: promptInserts.length,
          tokenUsageDays: tokenUsageData.length,
          sessions: 1
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
