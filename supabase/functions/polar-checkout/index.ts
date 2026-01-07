import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    
    // Get the user from the authorization header
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

    const { priceId, successUrl, cancelUrl } = await req.json();
    
    if (!priceId) {
      throw new Error('priceId is required');
    }

    console.log('Creating Polar checkout for user:', user.id, 'priceId:', priceId);

    // Create checkout session with Polar API
    const response = await fetch('https://api.polar.sh/v1/checkouts/custom/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_price_id: priceId,
        success_url: successUrl || `${req.headers.get('origin')}/dashboard?success=true`,
        customer_email: user.email,
        metadata: {
          user_id: user.id,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API error:', errorText);
      throw new Error(`Polar API error: ${response.status}`);
    }

    const checkoutData = await response.json();
    console.log('Checkout created:', checkoutData.id);

    return new Response(
      JSON.stringify({ 
        checkoutUrl: checkoutData.url,
        checkoutId: checkoutData.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in polar-checkout:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
