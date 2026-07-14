import { useEffect, useState } from 'react';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const PricingSection = () => {
  const { createCheckout, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

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
      name: 'Pro',
      monthlyPrice: '$15',
      annualPrice: '$12',
      originalPrice: '$15',
      originalMonthlyPrice: '$25',
      period: '/mo' as string | null,
      description: 'For daily use',
      trial: null as string | null,
      badge: isProActive ? 'Your plan' : 'Most popular',
      features: [
        'Full access to the Lyto Chrome extension',
        '400 requests/week · 70 requests/day',
        'Top-up packs available when you hit your limit',
        'Extended page interactions & general requests',
        'Up to 7 deep researches per month',
        'Page monitoring & push notifications',
        'Priority support',
      ],
      cta: isProActive ? 'Current plan' : 'Get Pro',
      highlighted: true,
      productId: (isAnnual ? POLAR_PRODUCT_IDS.pro_annual : POLAR_PRODUCT_IDS.pro_monthly) as string | null,
    },
    {
      name: 'Team',
      monthlyPrice: 'From $120',
      annualPrice: 'From $96',
      originalPrice: '$120',
      period: '/mo' as string | null,
      description: 'For growing teams',
      trial: null as string | null,
      badge: null as string | null,
      features: [
        'Everything in Pro',
        'From 5 to unlimited users',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Get started',
      highlighted: false,
      productId: POLAR_PRODUCT_IDS.team_monthly as string | null,
    },
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (isProActive && plan.highlighted) { navigate('/dashboard'); return; }
    if (!plan.productId) {
      if (user) navigate('/dashboard'); else navigate('/auth');
      return;
    }
    if (!user) { navigate('/auth'); return; }
    createCheckout(plan.productId);
  };

  return (
    <section id="pricing" className="scroll-mt-24 overflow-hidden py-16 sm:py-24 px-4 sm:px-6 text-neutral-800">
      <div className="container mx-auto max-w-6xl">

        {/* Heading */}
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            simple,{' '}
            <span className="italic text-gradient">transparent</span> pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground tracking-tight">
            Try Lyto free. Upgrade when you're ready.
          </p>
        </FadeIn>

        {/* Monthly / Annual toggle */}
        <FadeIn delay={0.1} className="flex flex-col items-center gap-3 mb-16">
          <div className="relative inline-flex items-center rounded-full border border-border p-1">
            {/* Sliding indicator */}
            <div
              className={cn(
                'absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-full bg-white shadow-sm border border-border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                isAnnual ? 'left-[calc(50%+2px)]' : 'left-1',
              )}
            />
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'relative z-10 flex items-center justify-center rounded-full w-[120px] py-2.5 text-sm font-semibold transition-colors duration-200',
                !isAnnual ? 'text-foreground' : 'text-neutral-400 hover:text-neutral-600',
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'relative z-10 flex items-center justify-center rounded-full w-[120px] py-2.5 text-sm font-semibold transition-colors duration-200',
                isAnnual ? 'text-foreground' : 'text-neutral-400 hover:text-neutral-600',
              )}
            >
              Annual
            </button>
          </div>
          {/* -20% badge outside the pill */}
          <div className="flex items-center gap-2 h-5">
            <span className={cn(
              'rounded-full px-2.5 py-0.5 text-[11px] font-bold transition-all duration-200',
              'bg-primary/10 text-primary',
            )}>
              −20% with annual
            </span>
          </div>
          <p className={cn(
            'text-xs text-muted-foreground transition-all duration-300 -mt-1',
            isAnnual ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none',
          )}>
            Billed as one payment per year — save 2 months compared to monthly.
          </p>
        </FadeIn>

        {/* Cards */}
        <div className={cn(
          'flex flex-col md:flex-row gap-6 items-stretch justify-center transition-all duration-500',
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}>
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isDisabled = loading || (isProActive && plan.highlighted);

            if (plan.highlighted) {
              /* ── Gradient Pro card ── */
              return (
                <div key={plan.name} className="relative w-full md:w-[380px] flex flex-col">
                  {/* Badge above card */}
                  {plan.badge && (
                    <div className="flex justify-center mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30">
                        {!isProActive && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80 animate-pulse inline-block" />}
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Gradient border wrapper */}
                  <div
                    className="flex-1 rounded-2xl p-[2px] transform-gpu transition duration-500 hover:-translate-y-2 shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
                    }}
                  >
                    <div className="h-full flex flex-col rounded-[14px] bg-white overflow-hidden">
                      {/* Hero-style ethereal header */}
                      <div className="relative p-8 sm:p-10 overflow-hidden bg-background">
                        <div className="absolute inset-0 z-0 opacity-60">
                          <EtherealShadow
                            color="rgba(249, 115, 22, 1)"
                            noise={{ opacity: 0.5, scale: 1.2 }}
                            sizing="fill"
                          />
                        </div>
                        <div className="relative z-10">
                          <h4 className="mb-4 text-5xl font-serif tracking-tighter text-foreground">{plan.name}</h4>
                          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                            {isAnnual && plan.originalPrice && (
                              <span className="text-xl font-semibold text-foreground/40 line-through">{plan.originalPrice}</span>
                            )}
                            {!isAnnual && (plan as typeof plan & { originalMonthlyPrice?: string }).originalMonthlyPrice && (
                              <span className="text-xl font-semibold text-foreground/40 line-through">{(plan as typeof plan & { originalMonthlyPrice?: string }).originalMonthlyPrice}</span>
                            )}
                            <span className="text-3xl font-bold text-foreground">{price}</span>
                            {plan.period && <span className="text-sm text-foreground/60">{plan.period}</span>}
                          </div>
                          {isAnnual && plan.originalPrice && (
                            <p className="text-xs text-foreground/50 -mt-1 mb-1">billed ${parseInt(plan.originalPrice.replace(/\D/g, '')) * 12 * 0.8}/yr</p>
                          )}
                          <p className="text-sm text-foreground/70 tracking-tight">{plan.description}</p>
                        </div>
                      </div>

                      {/* Features + CTA */}
                      <div className="flex flex-1 flex-col p-8 sm:p-10">
                        <ul className="mb-8 flex-1 space-y-2">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-3 py-0.5">
                              <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                              <span className="text-sm font-medium tracking-tight">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => handlePlanClick(plan)}
                          disabled={isDisabled}
                          className={cn(
                            'w-full rounded-lg border border-neutral-700 bg-transparent px-5 py-3.5 text-center text-sm font-semibold tracking-tight transition duration-200 hover:scale-105 hover:bg-neutral-900 hover:text-white',
                            isDisabled && 'cursor-not-allowed opacity-50',
                          )}
                        >
                          {loading && plan.highlighted
                            ? <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                            : plan.cta}
                        </button>
                        {plan.trial && (
                          <p className="mt-3 text-center text-xs text-neutral-500">
                            ✦ {plan.trial}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            /* ── Plain card (Free / Team) ── */
            return (
              <div key={plan.name} className="w-full md:w-[380px] flex flex-col">
                {/* Spacer to align with Pro badge */}
                <div className="h-8 mb-3" />
                <div className="flex flex-1 flex-col transform-gpu rounded-2xl border border-neutral-300 bg-white transition duration-500 hover:-translate-y-2">
                  <div className="border-b border-neutral-300 p-8 sm:p-10">
                    <h4 className="mb-4 text-5xl font-serif tracking-tighter">{plan.name}</h4>
                    <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                      {isAnnual && plan.originalPrice && (
                        <span className="text-xl font-semibold text-muted-foreground/50 line-through">{plan.originalPrice}</span>
                      )}
                      <span className="text-3xl font-bold tracking-tight">{price}</span>
                      {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                    </div>
                    {isAnnual && plan.originalPrice && (
                      <p className="text-xs text-muted-foreground -mt-1 mb-1">billed ${parseInt(plan.originalPrice.replace(/\D/g, '')) * 12 * 0.8}/yr</p>
                    )}
                    <p className="text-sm tracking-tight text-muted-foreground">{plan.description}</p>
                  </div>
                  <div className="flex flex-1 flex-col p-8 sm:p-10">
                    <ul className="mb-8 flex-1 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 py-0.5">
                          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="text-sm font-medium tracking-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePlanClick(plan)}
                      disabled={isDisabled}
                      className={cn(
                        'w-full rounded-lg border border-neutral-700 bg-transparent px-5 py-3.5 text-center text-sm font-semibold tracking-tight transition duration-200 hover:scale-105 hover:bg-neutral-900 hover:text-white',
                        isDisabled && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Start for free. Cancel anytime.
        </p>

      </div>
    </section>
  );
};

export default PricingSection;
