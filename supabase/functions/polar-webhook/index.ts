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

    // ── Verify webhook signature ──────────────────────────────────────────
    if (webhookSecret) {
      const webhookHeaders = {
        'webhook-id': req.headers.get('webhook-id') || '',
        'webhook-timestamp': req.headers.get('webhook-timestamp') || '',
        'webhook-signature': req.headers.get('webhook-signature') || '',
      };
      const encoder = new TextEncoder();
      const base64Secret = btoa(String.fromCharCode(...encoder.encode(webhookSecret)));
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
    const eventType: string = body.type;
    const data = body.data;

    console.log('Received Polar webhook:', eventType);

    // ── Helper: resolve userId from event data ────────────────────────────
    // Polar sends user_id in metadata if we passed it at checkout.
    // Fallback: look up by polarCustomerId already stored in our DB.
    const resolveUserId = async (d: Record<string, unknown>): Promise<string | null> => {
      const meta = (d.metadata as Record<string, string> | undefined)
        ?? (d.customer_metadata as Record<string, string> | undefined)
        ?? {};

      if (meta.user_id) return meta.user_id as string;

      const customerId = d.customer_id as string | undefined;
      if (customerId) {
        const { data: sub } = await supabase
          .from('Subscription')
          .select('userId')
          .eq('polarCustomerId', customerId)
          .maybeSingle();
        if (sub?.userId) return sub.userId;
      }

      console.warn('Could not resolve userId for event', eventType, 'customer_id:', d.customer_id);
      return null;
    };

    // ── Helper: determine plan from product name ──────────────────────────
    const resolvePlan = (d: Record<string, unknown>): string => {
      const name = ((d.product as Record<string, string> | undefined)?.name ?? '').toLowerCase();
      if (name.includes('team')) return 'team';
      return 'pro';
    };

    switch (eventType) {

      // ── Checkout succeeded → activate pro immediately ─────────────────
      case 'checkout.created':
      case 'checkout.updated': {
        if (data.status !== 'succeeded' && data.status !== 'confirmed') break;

        const userId = await resolveUserId(data);
        if (!userId) break;

        console.log('Checkout succeeded for user:', userId);

        const { error } = await supabase.rpc('upsert_polar_subscription', {
          p_user_id:           userId,
          p_polar_customer_id: data.customer_id ?? null,
          p_polar_sub_id:      data.subscription_id ?? null,
          p_plan:              resolvePlan(data),
          p_status:            'active',
          p_period_start:      null,
          p_period_end:        null,
          p_cancel_at_end:     false,
        });

        if (error) console.error('upsert_polar_subscription error (checkout):', error);
        else console.log('Subscription activated via checkout');
        break;
      }

      // ── Subscription created / updated / active ───────────────────────
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.active': {
        const userId = await resolveUserId(data);
        if (!userId) break;

        const status: string = data.status ?? 'active';
        const plan = status === 'active' ? resolvePlan(data) : 'free';

        console.log('Subscription event for user:', userId, '| plan:', plan, '| status:', status);

        const { error } = await supabase.rpc('upsert_polar_subscription', {
          p_user_id:           userId,
          p_polar_customer_id: data.customer_id ?? null,
          p_polar_sub_id:      data.id ?? null,
          p_plan:              plan,
          p_status:            status,
          p_period_start:      data.current_period_start ?? null,
          p_period_end:        data.current_period_end ?? null,
          p_cancel_at_end:     data.cancel_at_period_end ?? false,
        });

        if (error) console.error('upsert_polar_subscription error (subscription):', error);
        else console.log('Subscription updated successfully');
        break;
      }

      // ── Subscription canceled / revoked ───────────────────────────────
      case 'subscription.canceled':
      case 'subscription.revoked': {
        const userId = await resolveUserId(data);
        if (!userId) break;

        console.log('Canceling subscription for user:', userId);

        const { error } = await supabase.rpc('upsert_polar_subscription', {
          p_user_id:           userId,
          p_polar_customer_id: data.customer_id ?? null,
          p_polar_sub_id:      data.id ?? null,
          p_plan:              'free',
          p_status:            'canceled',
          p_period_start:      data.current_period_start ?? null,
          p_period_end:        data.current_period_end ?? null,
          p_cancel_at_end:     false,
        });

        if (error) console.error('upsert_polar_subscription error (cancel):', error);
        else console.log('Subscription canceled successfully');
        break;
      }

      case 'order.created': {
        console.log('Order created for user:', (data.metadata as Record<string, string>)?.user_id);
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
