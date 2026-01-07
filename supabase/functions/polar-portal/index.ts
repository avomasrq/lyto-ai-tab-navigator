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

    // Get the user's subscription to find their customer ID
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('polar_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!subscription?.polar_customer_id) {
      throw new Error('No active subscription found');
    }

    console.log('Creating customer portal session for:', subscription.polar_customer_id);

    // Create customer portal session
    const response = await fetch('https://api.polar.sh/v1/customer-portal/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: subscription.polar_customer_id,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API error:', errorText);
      throw new Error(`Polar API error: ${response.status}`);
    }

    const portalData = await response.json();
    console.log('Portal session created');

    return new Response(
      JSON.stringify({ portalUrl: portalData.customer_portal_url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in polar-portal:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
