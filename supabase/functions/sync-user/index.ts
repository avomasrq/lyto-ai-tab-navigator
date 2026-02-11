// Sync auth user to public.users (Prisma User model)
// Called by landing after login — ensures users table has latest profile
// Extension & backend only read/upsert; landing initiates via auth

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabaseAuth = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date().toISOString();
    const fullName =
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      null;

    const { error: upsertError } = await supabaseAdmin
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email ?? null,
          fullName,
          avatarUrl: user.user_metadata?.avatar_url ?? null,
          updatedAt: now,
        },
        { onConflict: "id" }
      );

    if (upsertError) {
      console.error("sync-user error:", upsertError);
      return new Response(
        JSON.stringify({ error: "Failed to sync user", details: upsertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Ensure user has a subscription (default: free)
    const { data: existingSub } = await supabaseAdmin
      .from("Subscription")
      .select("id")
      .eq("userId", user.id)
      .maybeSingle();

    if (!existingSub) {
      const subId = `sub_${user.id.slice(0, 8)}_${Date.now()}`;
      const { error: subError } = await supabaseAdmin
        .from("Subscription")
        .insert({
          id: subId,
          userId: user.id,
          plan: "free",
          status: "active",
          createdAt: now,
          updatedAt: now,
        });

      if (subError) {
        console.error("Failed to create default subscription:", subError);
        // Don't fail the whole sync if subscription creation fails
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("sync-user unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
