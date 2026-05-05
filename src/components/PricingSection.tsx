import { Button } from '@/components/ui/button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { Check, Loader2 } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
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
    queryKey: ['subscription', user?.id],
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

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For trying it out',
      features: [
        'Up to 50 Lyto actions per week',
        'Auto-scroll, highlight, focus mode',
        'Quick responses on current page',
        'Basic Lyto actions after limit',
      ],
      cta: isProActive ? 'Current via downgrade' : 'Get started',
      highlighted: false,
      productId: null,
    },
    {
      name: 'Pro',
      price: '$20',
      period: '/mo',
      description: 'For daily use',
      features: [
        'Unlimited AI page interactions',
        'Scroll, highlight, clean noise freely',
        'Deep research with detailed reports',
        'Page monitoring & push notifications',
        'Priority support',
      ],
      cta: isProActive ? 'Current plan' : 'Get started',
      highlighted: true,
      productId: POLAR_PRODUCT_IDS.pro_monthly,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations',
      features: [
        'Everything in Pro',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Contact us',
      highlighted: false,
      productId: null,
      isEnterprise: true,
    },
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.isEnterprise) {
      window.location.href = 'mailto:info@trylyto.com?subject=Enterprise%20Inquiry';
      return;
    }
    if (isProActive && plan.productId) {
      navigate('/dashboard');
      return;
    }
    if (!plan.productId) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
      return;
    }
    if (!user) {
      navigate('/auth');
      return;
    }
    createCheckout(plan.productId);
  };

  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto">
        <FadeIn className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            Pricing
          </span>
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-serif mt-4 leading-[1.5]">
            Simple,
            <br />
            <span className="italic text-gradient">transparent</span> pricing
          </h2>
          <p className="text-muted-foreground mt-4 sm:mt-6 text-sm sm:text-base">
            Start free. Upgrade when you need more.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-6 max-w-4xl 2xl:max-w-5xl mx-auto" staggerDelay={0.1}>
          {[...plans].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0)).map((plan) => (
            <FadeInItem key={plan.name} className={plan.highlighted ? 'md:order-none -order-1' : ''}>
            <div
              className={`relative rounded-2xl flex flex-col transition-all duration-500 ${
                plan.highlighted
                  ? 'bg-foreground text-background border-2 border-foreground shadow-2xl shadow-foreground/20 md:scale-[1.02] md:-my-2 p-5 sm:p-7'
                  : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 p-5 sm:p-7'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <LiquidButton
                    size="sm"
                    className="rounded-full px-4 text-xs font-semibold text-primary pointer-events-none"
                  >
                    {isProActive ? 'Your plan' : 'Most popular'}
                  </LiquidButton>
                </div>
              )}
              
              <div className="mb-5 sm:mb-8 mt-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-base font-medium ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs sm:hidden ${plan.highlighted ? 'text-background/50' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-3xl sm:text-4xl font-serif ${plan.highlighted ? 'text-background' : ''}`}>{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? 'text-background/50' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 hidden sm:block ${plan.highlighted ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-5 sm:mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-primary'}`} />
                    <span className={plan.highlighted ? 'text-background/80' : 'text-foreground/80'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? 'secondary' : 'outline'} 
                className={`w-full ${plan.highlighted ? 'bg-background text-foreground hover:bg-background/90 shadow-lg' : 'hover:border-primary/40'}`}
                onClick={() => handlePlanClick(plan)}
                disabled={loading || (isProActive && !!plan.productId)}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
              </Button>
            </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <p className="text-center text-sm sm:text-base text-muted-foreground mt-8 sm:mt-12">
          Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
