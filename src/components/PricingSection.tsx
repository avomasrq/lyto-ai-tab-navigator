import { Button } from '@/components/ui/button';
import { LiquidButton, GlassFilter } from '@/components/ui/liquid-glass-button';
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
      if (user) navigate('/dashboard');
      else navigate('/auth');
      return;
    }
    if (!user) { navigate('/auth'); return; }
    createCheckout(plan.productId);
  };

  return (
    <section id="pricing" className="relative py-12 sm:py-20 px-4 sm:px-6 scroll-mt-24 overflow-hidden">

      {/* Background blobs — give the glass something to refract */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[55%] h-[60%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[50%] rounded-full bg-orange-400/15 blur-[100px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[40%] rounded-full bg-primary/10 blur-[80px]" />
      </div>

      {/* Shared glass displacement filter for cards */}
      <GlassFilter id="pricing-card-glass" />

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
          {[...plans].sort((a, b) => (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0)).map((plan) => (
            <FadeInItem key={plan.name} className={plan.highlighted ? 'md:order-none -order-1' : ''}>
              <div
                className={`relative rounded-2xl flex flex-col p-5 sm:p-7 transition-all duration-500 ${
                  plan.highlighted ? 'md:scale-[1.02] md:-my-2' : ''
                }`}
                style={{
                  background: plan.highlighted
                    ? 'rgba(249,115,22,0.10)'
                    : 'rgba(255,255,255,0.04)',
                  border: plan.highlighted
                    ? '1px solid rgba(249,115,22,0.35)'
                    : '1px solid rgba(255,255,255,0.10)',
                  boxShadow: plan.highlighted
                    ? '0 8px 40px rgba(249,115,22,0.12), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.15), inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(0,0,0,0.08)'
                    : '0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.12), inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.06)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                }}
              >
                {/* Subtle inner highlight rim */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.04) 100%)',
                  }}
                />

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

                <div className="mb-5 sm:mb-8 mt-2 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-medium text-foreground/70">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:hidden text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-serif text-foreground">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm mt-1 hidden sm:block text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-5 sm:mb-8 flex-1 relative z-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative z-10">
                  <Button
                    variant={plan.highlighted ? 'default' : 'outline'}
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-white/5 border-white/15 hover:bg-white/10 hover:border-white/25 text-foreground'
                    }`}
                    onClick={() => handlePlanClick(plan)}
                    disabled={loading || (isProActive && !!plan.productId)}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : plan.cta}
                  </Button>
                </div>
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
