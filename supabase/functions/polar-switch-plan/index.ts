import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { productId } = await req.json();
    if (!productId) {
      throw new Error('productId is required');
    }

    // Service-role client to read the subscription regardless of RLS
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: subscription } = await supabaseAdmin
      .from('Subscription')
      .select('polarSubscriptionId, plan, status')
      .eq('userId', user.id)
      .maybeSingle();

    if (!subscription?.polarSubscriptionId) {
      throw new Error('No active subscription found');
    }
    if (subscription.plan !== 'pro' || subscription.status !== 'active') {
      throw new Error('An active Pro subscription is required to switch plans');
    }

    console.log('Switching subscription', subscription.polarSubscriptionId, 'to product', productId);

    // Polar's "update subscription" endpoint changes the product on an
    // existing subscription directly — the hosted customer portal doesn't
    // expose an interval switch, so this is the only reliable path.
    const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscription.polarSubscriptionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${polarAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API error:', errorText);
      throw new Error(`Polar API error: ${response.status} - ${errorText}`);
    }

    const updated = await response.json();
    console.log('Subscription updated:', updated.id);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in polar-switch-plan:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
