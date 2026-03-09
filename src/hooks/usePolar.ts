import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const POLAR_PRODUCT_IDS = {
  pro_monthly: '9d4ec7e8-fa15-4064-86ee-305ac2d039d1',
  team_monthly: 'ecd28dec-4798-458c-be20-838031f087c4',
};

export const usePolar = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createCheckout = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('polar-checkout', {
        body: {
          productId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

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

  const cancelSubscription = async () => {
    if (!user) {
      toast.error('Please sign in first');
      return false;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {});

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return false;
      }

      toast.success('Subscription canceled successfully');
      return true;
    } catch (error) {
      console.error('Cancel error:', error);
      toast.error('Failed to cancel subscription. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckout,
    openCustomerPortal,
    cancelSubscription,
    loading,
  };
};
