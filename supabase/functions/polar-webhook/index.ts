import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, webhook-id, webhook-timestamp, webhook-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get('POLAR_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawBody = await req.text();
    
    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      const webhookHeaders = {
        'webhook-id': req.headers.get('webhook-id') || '',
        'webhook-timestamp': req.headers.get('webhook-timestamp') || '',
        'webhook-signature': req.headers.get('webhook-signature') || '',
      };
      
      const wh = new Webhook(webhookSecret);
      try {
        wh.verify(rawBody, webhookHeaders);
        console.log('Webhook signature verified');
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return new Response(
          JSON.stringify({ error: 'Invalid webhook signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const body = JSON.parse(rawBody);
    const eventType = body.type;
    const data = body.data;

    console.log('Received Polar webhook:', eventType);
    console.log('Event data:', JSON.stringify(data, null, 2));

    switch (eventType) {
      case 'checkout.created':
      case 'checkout.updated': {
        // Checkout in progress, no action needed yet
        console.log('Checkout event:', eventType);
        break;
      }

      case 'subscription.created':
      case 'subscription.updated': {
        const userId = data.metadata?.user_id;
        const customerId = data.customer_id;
        const subscriptionId = data.id;
        const status = data.status;
        const currentPeriodStart = data.current_period_start;
        const currentPeriodEnd = data.current_period_end;
        
        // Determine plan from product
        let plan = 'pro';
        if (data.product?.name?.toLowerCase().includes('team')) {
          plan = 'team';
        } else if (data.product?.name?.toLowerCase().includes('enterprise')) {
          plan = 'enterprise';
        }

        if (userId) {
          console.log('Updating subscription for user:', userId, 'plan:', plan, 'status:', status);
          
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              polar_customer_id: customerId,
              polar_subscription_id: subscriptionId,
              plan: plan,
              status: status === 'active' ? 'active' : status,
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

          if (error) {
            console.error('Error updating subscription:', error);
            throw error;
          }
          console.log('Subscription updated successfully');
        } else {
          console.warn('No user_id in subscription metadata');
        }
        break;
      }

      case 'subscription.canceled':
      case 'subscription.revoked': {
        const userId = data.metadata?.user_id;
        
        if (userId) {
          console.log('Canceling subscription for user:', userId);
          
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              plan: 'free',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (error) {
            console.error('Error canceling subscription:', error);
            throw error;
          }
          console.log('Subscription canceled successfully');
        }
        break;
      }

      case 'order.created': {
        // One-time payment completed
        const userId = data.metadata?.user_id;
        console.log('Order created for user:', userId);
        break;
      }

      default:
        console.log('Unhandled event type:', eventType);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
