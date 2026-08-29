import { useEffect, useState } from 'react';
import { CheckIcon, Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { MythLine } from '@/components/landing/Myth';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

/**
 * A picture for each plan, chosen by what the plan IS rather than by what looked
 * classical. Two earlier passes failed on exactly that: museum object shots (a
 * head on studio grey) read as a catalogue, and daguerreotypes of ruins read as
 * an archaeology paper.
 *
 *  Free — Alma-Tadema's "A Reading from Homer": the one with the scroll, reading.
 *         (Goltzius's Mercury sat here first and was, fairly, called creepy —
 *         a bare-chested god staring out of a small card is not "starting out".)
 *  Pro  — David's Leonidas at Thermopylae: the warrior, holding the line.
 *         (It was a photograph of a statue's back, which put one photo between two
 *         paintings and made the middle card look like a different product.)
 *  Team — Pericles addressing the assembly: one voice, many people.
 *
 * All public domain (Philadelphia Museum of Art / Rijksmuseum via Wikimedia).
 */
const PLAN_ART: Record<string, { src: string; pos: string }> = {
  Free: { src: '/plan-free.jpg', pos: '58% 38%' },
  Team: { src: '/plan-team.jpg', pos: '52% 34%' },
  Pro: { src: '/plan-pro.jpg', pos: '46% 34%' },
};

const PricingSection = () => {
  const { createCheckout, switchPlan, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  // Billing interval isn't stored, so an active Pro user viewing the Annual tab
  // is offered a switch (handled in Polar's portal — a fresh checkout would
  // create a duplicate subscription instead of changing the interval).
  const proSwitchToAnnual = isProActive && isAnnual;

  const plans = [
    {
      name: 'Free',
      monthlyPrice: '$0',
      annualPrice: '$0',
      originalPrice: null as string | null,
      period: null as string | null,
      description: 'The whole product, metered',
      trial: null as string | null,
      badge: null as string | null,
      // Free lists what it HAS, and it has nearly everything — including the parts
      // that make Argos different from a chatbot. Half a product hidden behind locks
      // explains itself worse, and a feature nobody has seen cannot be wanted. The
      // ceiling is volume, and the single closed door is named outright at the end
      // rather than left to be discovered.
      features: [
        '50 tasks a week',
        'Up to 3 scheduled tasks',
        'The extension, Telegram, and the cloud agent',
        'Integrations: Google, Gmail, GitHub, Slack & more',
        'Full long-term memory, web search, file generation',
        'No agent on your own computer',
      ],
      cta: 'Get started',
      highlighted: false,
      productId: null as string | null,
    },
    {
      name: 'Pro',
      monthlyPrice: '$15',
      annualPrice: '$12',
      originalPrice: '$15',
      originalMonthlyPrice: '$25',
      period: '/mo' as string | null,
      description: 'For daily use',
      trial: '3-day free trial' as string | null,
      badge: isProActive ? 'Your plan' : 'Most popular',
      // Pro is the same product without the ceiling, plus the one thing Free cannot
      // have. The old list repeated features Free already includes, which made the
      // page argue with itself, and it advertised "400 requests/week · 70/day" —
      // a limit printed on the plan sold as unlimited. Those caps exist to protect
      // margin; they are not a feature and nobody should meet them.
      features: [
        'Everything in Free, with no weekly limit',
        'An agent on your own computer: your files, your apps, your logins',
        'Connect more than one machine',
        'Unlimited scheduled tasks',
        'Deep research, page monitoring, and instant alerts',
        'WhatsApp, on top of Telegram',
        'Priority support',
      ],
      cta: proSwitchToAnnual ? 'Switch to annual' : isProActive ? 'Current plan' : 'Start 3-day free trial',
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
      cta: 'Contact us',
      highlighted: false,
      productId: POLAR_PRODUCT_IDS.team_monthly as string | null,
    },
  ];

  const handlePlanClick = async (plan: typeof plans[0]) => {
    if (plan.name === 'Free') {
      navigate(user ? '/dashboard' : '/auth');
      return;
    }
    if (!plan.highlighted) {
      // Team
      window.location.href = 'mailto:info@tryargos.cc?subject=Argos Team Plan';
      return;
    }
    if (proSwitchToAnnual) {
      const ok = await switchPlan(POLAR_PRODUCT_IDS.pro_annual);
      if (ok) queryClient.invalidateQueries({ queryKey: ['subscription', user?.id] });
      return;
    }
    if (isProActive) { navigate('/dashboard'); return; }
    if (!user) { navigate('/auth'); return; }
    createCheckout(plan.productId!);
  };

  /* Gutter comes from the inner wrapper and from nowhere else, matching
     JobsSection and the hero. This section used to set `px-4 sm:px-6` on the
     <section> and then wrap the content in `container`, whose configured
     padding is 1.5rem, 2rem at xl and 3rem at 2xl — so the two stacked, and the
     amount they stacked to changed with the breakpoint. Content started 28px
     right of every other section on a wide screen and a different distance on
     a narrow one. */
  return (
    <section id="pricing" className="scroll-mt-24 overflow-hidden py-16 sm:py-24 text-neutral-800">
      <div className="mx-auto max-w-6xl px-5">

        {/* Heading */}
        <FadeIn className="mx-auto mb-14 max-w-2xl text-center">
          <MythLine className="mb-5">Δραχμαί · what it costs</MythLine>
          <h2 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-geometric leading-tight">
            simple,{' '}
            {/* pr widens the painted box past the italic "t"; -mr cancels it in layout so
                the space before "pricing" stays a single space. */}
            <span className="italic text-foreground sm:text-gradient sm:pr-[0.14em] sm:-mr-[0.14em]">transparent</span> pricing
          </h2>
          {/* The line, in words. A feature table tells you what you get; it does not
              tell you where the wall is, and people were reading the wall wrong —
              two of them planned around a CLI they thought was free. */}
          <p className="mx-auto max-w-lg text-base sm:text-lg text-foreground/80 tracking-tight">
            Free is everything that happens while your browser is open.
            <br className="hidden sm:inline" />{' '}
            Pro is everything that happens when it isn’t.
          </p>
          <p className="mt-3 text-sm text-muted-foreground tracking-tight">
            Start free, no card. Pro comes with a 3-day free trial. Cancel anytime.
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
            Billed as one payment per year. Save 2 months compared to monthly.
          </p>
        </FadeIn>

        {/* Cards */}
        <div className={cn(
          'flex flex-col lg:flex-row gap-6 items-stretch justify-center transition-all duration-500',
          ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}>
          {plans.map((plan) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            // Active Pro stays "current plan" (disabled) on Monthly, but the
            // Annual tab must remain clickable so they can switch.
            const isDisabled = loading || (isProActive && plan.highlighted && !proSwitchToAnnual);

            if (plan.highlighted) {
              /* ── Gradient Pro card ── */
              return (
                <div key={plan.name} className="relative w-full lg:flex-1 lg:max-w-[360px] flex flex-col">
                  {/* Badge above card */}
                  {plan.badge && (
                    <div className="flex items-center justify-center h-8 mb-3">
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
                      background: 'linear-gradient(135deg, #171717 0%, #525252 50%, #a3a3a3 100%)',
                    }}
                  >
                    <div className="h-full flex flex-col rounded-[14px] bg-white overflow-hidden">
                      {/* Hero-style ethereal header */}
                      <div className="relative p-8 sm:p-10 overflow-hidden bg-background">
                        <img
                          src={PLAN_ART[plan.name]?.src}
                          alt=""
                          aria-hidden
                          className="absolute inset-0 z-0 h-full w-full object-cover"
                          style={{
                            objectPosition: PLAN_ART[plan.name]?.pos,
                            // Same grade as the other two cards, so the three read as one set.
                            filter: 'grayscale(1) brightness(0.5) contrast(1.3)',
                          }}
                        />
                        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
                          <EtherealShadow
                            color="rgba(0, 0, 0, 1)"
                            noise={{ opacity: 0.5, scale: 1.2 }}
                            sizing="fill"
                          />
                        </div>
                        <div className="relative z-10">
                          <h4 className="mb-4 text-5xl font-geometric tracking-tighter text-white">{plan.name}</h4>
                          <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                            {isAnnual && plan.originalPrice && (
                              <span className="text-xl font-semibold text-white/40 line-through">{plan.originalPrice}</span>
                            )}
                            {!isAnnual && (plan as typeof plan & { originalMonthlyPrice?: string }).originalMonthlyPrice && (
                              <span className="text-xl font-semibold text-white/40 line-through">{(plan as typeof plan & { originalMonthlyPrice?: string }).originalMonthlyPrice}</span>
                            )}
                            <span className="text-3xl font-bold text-white">{price}</span>
                            {plan.period && <span className="text-sm text-white/60">{plan.period}</span>}
                          </div>
                          {isAnnual && plan.originalPrice && (
                            <p className="text-xs text-white/50 -mt-1 mb-1">billed ${parseInt(plan.originalPrice.replace(/\D/g, '')) * 12 * 0.8}/yr</p>
                          )}
                          <p className="text-sm text-white/70 tracking-tight">{plan.description}</p>
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
              <div key={plan.name} className="w-full lg:flex-1 lg:max-w-[360px] flex flex-col">
                {/* Spacer to align with Pro badge */}
                <div className="h-8 mb-3" />
                <div className="flex flex-1 flex-col transform-gpu overflow-hidden rounded-2xl border border-neutral-300 bg-white transition duration-500 hover:-translate-y-2">
                  {/* Pro had a photographic header and the other two had white paper,
                      which read as "the real plan and its two footnotes". Same marble
                      treatment on all three; the badge and the gradient border still
                      say which one is being sold. Met Open Access, public domain:
                      a portrait for the single seat, a crowd for the team. */}
                  <div className="relative overflow-hidden border-b border-neutral-300 p-8 sm:p-10">
                    <img
                      src={PLAN_ART[plan.name]?.src}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 z-0 h-full w-full object-cover"
                      style={{
                        objectPosition: PLAN_ART[plan.name]?.pos,
                        filter: 'grayscale(1) brightness(0.5) contrast(1.3)',
                      }}
                    />
                    <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
                      <EtherealShadow color="rgba(0, 0, 0, 1)" noise={{ opacity: 0.5, scale: 1.2 }} sizing="fill" />
                    </div>
                    <div className="relative z-10">
                      <h4 className="mb-4 text-5xl font-geometric tracking-tighter text-white">{plan.name}</h4>
                      <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                        {isAnnual && plan.originalPrice && (
                          <span className="text-xl font-semibold text-white/40 line-through">{plan.originalPrice}</span>
                        )}
                        <span className="text-3xl font-bold tracking-tight text-white">{price}</span>
                        {plan.period && <span className="text-sm text-white/60">{plan.period}</span>}
                      </div>
                      {isAnnual && plan.originalPrice && (
                        <p className="text-xs text-white/50 -mt-1 mb-1">billed ${parseInt(plan.originalPrice.replace(/\D/g, '')) * 12 * 0.8}/yr</p>
                      )}
                      <p className="text-sm tracking-tight text-white/70">{plan.description}</p>
                    </div>
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
          Free forever, no card. Pro includes a 3-day free trial. Cancel anytime.
        </p>

      </div>
    </section>
  );
};

export default PricingSection;
