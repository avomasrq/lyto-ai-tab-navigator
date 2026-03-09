import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Check if a string looks like a valid UUID
function isValidUUID(str: string): boolean {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: subscription } = await supabaseAdmin
      .from('Subscription')
      .select('*')
      .eq('userId', user.id)
      .maybeSingle();

    if (!subscription) {
      throw new Error('No subscription found');
    }

    // If we have a valid Polar subscription ID, cancel via API
    if (subscription.polarSubscriptionId && isValidUUID(subscription.polarSubscriptionId)) {
      console.log('Canceling Polar subscription:', subscription.polarSubscriptionId);

      // Use PATCH to cancel at period end — Polar will send a webhook when it's actually canceled
      const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscription.polarSubscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${polarAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cancel_at_period_end: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Polar cancel error:', response.status, errorText);

        // If subscription not found in Polar (404), do local cleanup
        if (response.status === 404) {
          console.log('Subscription not found in Polar, performing local-only cancellation');
        } else {
          throw new Error(`Failed to cancel subscription in Polar: ${response.status}`);
        }
      } else {
        const canceledSub = await response.json();
        console.log('Polar subscription set to cancel at period end:', canceledSub.cancel_at_period_end);
      }
    } else {
      console.log('No valid Polar subscription ID, performing local-only cancellation');
    }

    // Update local DB to reflect cancellation pending
    // The webhook will finalize the status when the period ends
    await supabaseAdmin
      .from('Subscription')
      .update({
        status: 'canceled',
        plan: 'free',
        updatedAt: new Date().toISOString(),
      })
      .eq('userId', user.id);

    console.log('Subscription canceled for user:', user.id);

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
