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

        // Every purchase starts as a 3-day Polar trial, and subscription.* reports that
        // honestly as 'trialing'. This branch used to hardcode 'active', so whichever of
        // the two events Polar delivered last decided what we stored — and the result was
        // a table where no subscription has ever been 'trialing', making trial→paid
        // conversion impossible to measure from our own data. Checkout still activates
        // Pro instantly (that part was right), it just no longer overwrites a live trial
        // with a status the user has not reached yet.
        const { data: current } = await supabase
          .from('Subscription')
          .select('status')
          .eq('userId', userId)
          .maybeSingle();
        const checkoutStatus = current?.status === 'trialing' ? 'trialing' : 'active';

        console.log('Checkout succeeded for user:', userId, '| status:', checkoutStatus);

        const { error } = await supabase.rpc('upsert_polar_subscription', {
          p_user_id:           userId,
          p_polar_customer_id: data.customer_id ?? null,
          p_polar_sub_id:      data.subscription_id ?? null,
          p_plan:              resolvePlan(data),
          p_status:            checkoutStatus,
          p_period_start:      null,
          p_period_end:        null,
          p_cancel_at_end:     false,
        });

        if (error) console.error('upsert_polar_subscription error (checkout):', error);
        else console.log('Subscription activated via checkout');
        break;
      }

      // ── Subscription created / updated / active / trialing ───────────
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.active': {
        const userId = await resolveUserId(data);
        if (!userId) break;

        const status: string = data.status ?? 'active';
        // treat both 'active' and 'trialing' as a pro plan
        const plan = (status === 'active' || status === 'trialing') ? resolvePlan(data) : 'free';

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

      // ── Subscription canceled / revoked / expired (trial ended no payment) ──
      case 'subscription.canceled':
      case 'subscription.revoked':
      case 'subscription.expired': {
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

      // ── Order created → this is what actually fires on each renewal
      // charge, unlike subscription.updated (which only fires when
      // subscription attributes change). currentPeriodEnd was going stale
      // after the first cycle because nothing refreshed it here — so we
      // pull the authoritative period straight from Polar's API.
      case 'order.created': {
        const subscriptionId = data.subscription_id as string | undefined;
        if (!subscriptionId) { console.log('Order created with no subscription_id, skipping'); break; }

        const userId = await resolveUserId(data);
        if (!userId) break;

        const polarAccessToken = Deno.env.get('POLAR_ACCESS_TOKEN');
        if (!polarAccessToken) { console.error('POLAR_ACCESS_TOKEN not configured, cannot refresh period'); break; }

        const subRes = await fetch(`https://api.polar.sh/v1/subscriptions/${subscriptionId}`, {
          headers: { 'Authorization': `Bearer ${polarAccessToken}` },
        });
        if (!subRes.ok) {
          console.error('Failed to fetch subscription for order.created:', subRes.status, await subRes.text());
          break;
        }
        const sub = await subRes.json();
        const status: string = sub.status ?? 'active';
        const plan = (status === 'active' || status === 'trialing') ? resolvePlan(sub) : 'free';

        console.log('Refreshing period from order.created for user:', userId, '| new period end:', sub.current_period_end);

        const { error } = await supabase.rpc('upsert_polar_subscription', {
          p_user_id:           userId,
          p_polar_customer_id: sub.customer_id ?? data.customer_id ?? null,
          p_polar_sub_id:      subscriptionId,
          p_plan:              plan,
          p_status:            status,
          p_period_start:      sub.current_period_start ?? null,
          p_period_end:        sub.current_period_end ?? null,
          p_cancel_at_end:     sub.cancel_at_period_end ?? false,
        });

        if (error) console.error('upsert_polar_subscription error (order.created):', error);
        else console.log('Period refreshed successfully from order.created');
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
