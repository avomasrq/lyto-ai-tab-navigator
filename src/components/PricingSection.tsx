import { Button } from '@/components/ui/button';
import { LiquidButton, GlassFilter } from '@/components/ui/liquid-glass-button';
import { Check, Loader2 } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

/* ── Liquid glass card — same technique as LiquidButton, card-shaped ── */
const LiquidGlassCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {/* Glass inset-shadow surface — identical to LiquidButton, rounded-2xl */}
    <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl
      shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]
      dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
    />
    {/* SVG-distorted backdrop blur layer */}
    <div
      className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-2xl"
      style={{ backdropFilter: 'url("#pricing-glass-filter")' }}
    />
    {/* Content */}
    <div className="relative z-10">{children}</div>
  </div>
);

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
    if (isProActive && plan.productId) { navigate('/dashboard'); return; }
    if (!plan.productId) {
      if (user) navigate('/dashboard'); else navigate('/auth');
      return;
    }
    if (!user) { navigate('/auth'); return; }
    createCheckout(plan.productId);
  };

  return (
    <section id="pricing" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      {/* One shared SVG filter for all three cards */}
      <GlassFilter id="pricing-glass-filter" />

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

        <FadeInStagger
          className="grid grid-cols-1 md:grid-cols-3 gap-4 2xl:gap-6 max-w-4xl 2xl:max-w-5xl mx-auto"
          staggerDelay={0.1}
        >
          {plans.map((plan) => (
            <FadeInItem key={plan.name} className={plan.highlighted ? 'order-first md:order-none' : ''}>
              <LiquidGlassCard
                className={`flex flex-col p-5 sm:p-7 transition-all duration-500 ${
                  plan.highlighted ? 'md:scale-[1.02] md:-my-2' : ''
                }`}
              >
                {/* Badge */}
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
                    <h3 className="text-base font-medium text-muted-foreground">{plan.name}</h3>
                    <p className="text-xs sm:hidden text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-serif">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm mt-1 hidden sm:block text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 mb-5 sm:mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlighted ? 'default' : 'outline'}
                  className={`w-full ${plan.highlighted ? 'shadow-lg shadow-primary/20' : ''}`}
                  onClick={() => handlePlanClick(plan)}
                  disabled={loading || (isProActive && !!plan.productId)}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
                </Button>
              </LiquidGlassCard>
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
