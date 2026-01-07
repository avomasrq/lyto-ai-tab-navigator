import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Replace these with your actual Polar price IDs from your Polar dashboard
export const POLAR_PRICE_IDS = {
  pro_monthly: 'YOUR_PRO_MONTHLY_PRICE_ID',
  team_monthly: 'YOUR_TEAM_MONTHLY_PRICE_ID',
};

export const usePolar = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createCheckout = async (priceId: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('polar-checkout', {
        body: {
          priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
        },
      });

      if (error) throw error;

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('polar-portal', {});

      if (error) throw error;

      if (data?.portalUrl) {
        window.location.href = data.portalUrl;
      }
    } catch (error) {
      console.error('Portal error:', error);
      toast.error('Failed to open customer portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    openCustomerPortal,
    loading,
  };
};
