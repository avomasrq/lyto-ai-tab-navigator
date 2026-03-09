import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const polarAccessToken = Deno.env.get('POLAR_ACCESS_TOKEN');
    if (!polarAccessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get subscription with service role to find polar IDs
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: subscription } = await supabaseAdmin
      .from('Subscription')
      .select('*')
      .eq('userId', user.id)
      .maybeSingle();

    if (!subscription?.polarSubscriptionId) {
      throw new Error('No active subscription found');
    }

    console.log('Canceling subscription:', subscription.polarSubscriptionId);

    // Cancel via Polar API - revoke immediately
    const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscription.polarSubscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${polarAccessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar cancel error:', errorText);
      throw new Error(`Failed to cancel subscription: ${response.status}`);
    }

    // Update local DB immediately
    await supabaseAdmin
      .from('Subscription')
      .update({
        status: 'canceled',
        plan: 'free',
        updatedAt: new Date().toISOString(),
      })
      .eq('userId', user.id);

    console.log('Subscription canceled successfully for user:', user.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in cancel-subscription:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
