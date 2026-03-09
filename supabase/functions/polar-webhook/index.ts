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
      
      // Standard Webhooks spec requires base64-encoded secret
      const encoder = new TextEncoder();
      const secretBytes = encoder.encode(webhookSecret);
      const base64Secret = btoa(String.fromCharCode(...secretBytes));
      
      const wh = new Webhook(base64Secret);
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

    switch (eventType) {
      case 'checkout.created':
      case 'checkout.updated': {
        // If checkout is confirmed/succeeded, create/update subscription
        if (data.status === 'succeeded' || data.status === 'confirmed') {
          const userId = data.metadata?.user_id || data.customer_metadata?.user_id;
          const customerId = data.customer_id;
          
          if (userId && customerId) {
            console.log('Checkout succeeded for user:', userId, 'customer:', customerId);
            
            // Update subscription with customer ID so portal works
            const { data: existingSub } = await supabase
              .from('Subscription')
              .select('id')
              .eq('userId', userId)
              .maybeSingle();

            if (existingSub) {
              await supabase
                .from('Subscription')
                .update({
                  polarCustomerId: customerId,
                  plan: 'pro',
                  status: 'active',
                  updatedAt: new Date().toISOString(),
                })
                .eq('userId', userId);
            } else {
              const subId = `sub_${userId.slice(0, 8)}_${Date.now()}`;
              await supabase
                .from('Subscription')
                .insert({
                  id: subId,
                  userId,
                  polarCustomerId: customerId,
                  plan: 'pro',
                  status: 'active',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
            }
            console.log('Subscription activated via checkout');
          }
        }
        break;
      }

      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.active': {
        const userId = data.metadata?.user_id || data.customer_metadata?.user_id;
        const customerId = data.customer_id;
        const subscriptionId = data.id;
        const status = data.status;
        const currentPeriodStart = data.current_period_start;
        const currentPeriodEnd = data.current_period_end;
        
        let plan = 'pro';
        if (data.product?.name?.toLowerCase().includes('team')) {
          plan = 'team';
        }

        if (userId) {
          console.log('Updating subscription for user:', userId, 'plan:', plan, 'status:', status);
          
          const { data: existingSub } = await supabase
            .from('Subscription')
            .select('id')
            .eq('userId', userId)
            .maybeSingle();

          const subData = {
            polarCustomerId: customerId,
            polarSubscriptionId: subscriptionId,
            plan: status === 'active' ? plan : 'free',
            status: status === 'active' ? 'active' : status,
            currentPeriodStart: currentPeriodStart,
            currentPeriodEnd: currentPeriodEnd,
            updatedAt: new Date().toISOString(),
          };

          if (existingSub) {
            await supabase.from('Subscription').update(subData).eq('userId', userId);
          } else {
            const subId = `sub_${userId.slice(0, 8)}_${Date.now()}`;
            await supabase.from('Subscription').insert({
              id: subId,
              userId,
              ...subData,
              createdAt: new Date().toISOString(),
            });
          }
          console.log('Subscription updated successfully');
        } else {
          // Try to find user by customer_id
          if (customerId) {
            const { data: existingSub } = await supabase
              .from('Subscription')
              .select('id, userId')
              .eq('polarCustomerId', customerId)
              .maybeSingle();

            if (existingSub) {
              await supabase.from('Subscription').update({
                polarSubscriptionId: subscriptionId,
                plan: status === 'active' ? plan : 'free',
                status: status === 'active' ? 'active' : status,
                currentPeriodStart,
                currentPeriodEnd,
                updatedAt: new Date().toISOString(),
              }).eq('polarCustomerId', customerId);
              console.log('Subscription updated via customer_id');
            }
          }
          console.warn('No user_id in metadata, tried customer_id fallback');
        }
        break;
      }

      case 'subscription.canceled':
      case 'subscription.revoked': {
        const userId = data.metadata?.user_id || data.customer_metadata?.user_id;
        const customerId = data.customer_id;
        
        const updateData = {
          status: 'canceled',
          plan: 'free',
          updatedAt: new Date().toISOString(),
        };

        if (userId) {
          console.log('Canceling subscription for user:', userId);
          await supabase.from('Subscription').update(updateData).eq('userId', userId);
        } else if (customerId) {
          console.log('Canceling subscription for customer:', customerId);
          await supabase.from('Subscription').update(updateData).eq('polarCustomerId', customerId);
        }
        console.log('Subscription canceled successfully');
        break;
      }

      case 'order.created': {
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
