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

    // Check if user already has an active pro subscription
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existingSub } = await supabaseAdmin
      .from('Subscription')
      .select('plan, status')
      .eq('userId', user.id)
      .maybeSingle();

    if (existingSub?.plan === 'pro' && existingSub?.status === 'active') {
      return new Response(
        JSON.stringify({ error: 'You already have an active Pro subscription' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { productId, successUrl } = await req.json();
    
    if (!productId) {
      throw new Error('productId is required');
    }

    console.log('Creating Polar checkout for user:', user.id, 'productId:', productId);

    // Create checkout session with Polar API v1
    const response = await fetch('https://api.polar.sh/v1/checkouts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${polarAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        products: [productId],
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
