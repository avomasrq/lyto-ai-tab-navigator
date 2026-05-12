import { FadeIn } from '@/components/ui/fade-in';
import { PricingCard, PricingPlan } from '@/components/ui/pricing-card';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const PricingSection = () => {
  const { createCheckout, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: subscription } = useQuery({
    queryKey: ['pricing-subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('Subscription')
        .select('plan, status')
        .eq('userId', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const isProActive = subscription?.plan === 'pro' && subscription?.status === 'active';

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'For trying it out',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Up to 50 Lyto actions per week',
        'Auto-scroll, highlight, focus mode',
        'Quick responses on current page',
        'Basic Lyto actions after limit',
      ],
      cta: user ? 'Go to dashboard' : 'Get started free',
      highlighted: false,
      disabled: false,
      onSelect: () => {
        if (user) navigate('/dashboard');
        else navigate('/auth');
      },
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For daily power use',
      monthlyPrice: 20,
      yearlyPrice: 16,
      features: [
        'Unlimited AI page interactions',
        'Scroll, highlight, clean noise freely',
        'Deep research with detailed reports',
        'Page monitoring & push notifications',
        'Priority support',
      ],
      cta: isProActive ? 'Current plan' : loading ? 'Loading...' : 'Get Pro',
      highlighted: true,
      disabled: isProActive || loading,
      onSelect: () => {
        if (isProActive) { navigate('/dashboard'); return; }
        if (!user) { navigate('/auth'); return; }
        createCheckout(POLAR_PRODUCT_IDS.pro_monthly);
      },
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For organizations',
      monthlyPrice: null,
      yearlyPrice: null,
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support & SLA',
        'Team management',
      ],
      cta: 'Contact us',
      highlighted: false,
      disabled: false,
      onSelect: () => {
        window.location.href = 'mailto:info@trylyto.com?subject=Enterprise%20Inquiry';
      },
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-4 leading-tight">
            Simple,{' '}
            <span className="italic text-gradient">transparent</span> pricing
          </h2>
          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
            Start free. Upgrade when you need more.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="flex justify-center">
          <PricingCard plans={plans} defaultPlan="pro" />
        </FadeIn>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Cancel anytime · No credit card required for Free
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
