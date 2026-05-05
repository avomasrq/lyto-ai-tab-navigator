import { useEffect, useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: null,
    description: 'For trying it out',
    features: [
      '50 Lyto actions per week',
      'Auto-scroll, highlight, focus mode',
      'Quick responses on current page',
      'Basic Lyto actions after limit',
    ],
    highlighted: false,
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
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: null,
    description: 'For organizations',
    features: [
      'Everything in Pro',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const { createCheckout, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.name === 'Enterprise') {
      window.location.href = 'mailto:info@trylyto.com?subject=Enterprise%20Inquiry';
      return;
    }
    if (plan.highlighted) {
      if (isProActive) { navigate('/dashboard'); return; }
      if (!user) { navigate('/auth'); return; }
      createCheckout(POLAR_PRODUCT_IDS.pro_monthly);
      return;
    }
    if (user) navigate('/dashboard');
    else navigate('/auth');
  };

  // Particles canvas
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const setSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect?.width ?? window.innerWidth));
      canvas.height = Math.max(1, Math.floor(rect?.height ?? window.innerHeight));
    };
    setSize();

    type P = { x: number; y: number; v: number; o: number };
    let ps: P[] = [];
    let raf = 0;

    const make = (): P => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(240,240,242,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => { setSize(); init(); });
    ro.observe(canvas.parentElement || document.body);
    init();
    raf = requestAnimationFrame(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section
      id="pricing"
      data-pricing
      className={`relative w-full overflow-hidden scroll-mt-24 py-20 sm:py-28 ${ready ? 'is-ready' : ''}`}
      style={{ background: '#0b0b0c', color: '#f6f7f8', colorScheme: 'dark' }}
    >
      <style>{`
        section[data-pricing]{ color:#f6f7f8; color-scheme:dark }
        .p-accent{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .p-hline,.p-vline{position:absolute;background:#27272a}
        .p-hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%}
        .p-vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%}
        .is-ready .p-hline:nth-of-type(1){top:18%;animation:pDrawX .6s ease .08s forwards}
        .is-ready .p-hline:nth-of-type(2){top:50%;animation:pDrawX .6s ease .16s forwards}
        .is-ready .p-hline:nth-of-type(3){top:82%;animation:pDrawX .6s ease .24s forwards}
        .is-ready .p-vline:nth-of-type(1){left:18%;animation:pDrawY .7s ease .20s forwards}
        .is-ready .p-vline:nth-of-type(2){left:50%;animation:pDrawY .7s ease .28s forwards}
        .is-ready .p-vline:nth-of-type(3){left:82%;animation:pDrawY .7s ease .36s forwards}
        @keyframes pDrawX{to{transform:scaleX(1)}}
        @keyframes pDrawY{to{transform:scaleY(1)}}
        .p-card{background:#111214;border:1px solid #2a2a2e;border-radius:16px}
        .p-card-pop{background:#15161a;border:1px solid #2a2a2e;border-radius:16px;transform:scale(1.02);box-shadow:0 10px 30px rgba(0,0,0,.4)}
        .p-card-animate{opacity:0;transform:translateY(12px)}
        .is-ready .p-card-animate{animation:pFadeUp .6s ease forwards}
        @keyframes pFadeUp{to{opacity:1;transform:translateY(0)}}
        .p-btn-primary{width:100%;border-radius:12px;padding:10px 16px;font-weight:600;font-size:14px;background:#f1f1f3;color:#0c0c0d;transition:filter .15s ease,transform .15s ease}
        .p-btn-primary:hover{filter:brightness(.95)}
        .p-btn-primary:active{transform:translateY(1px)}
        .p-btn-ghost{width:100%;border-radius:12px;padding:10px 16px;font-weight:600;font-size:14px;color:#f6f7f8;border:1px solid #2a2a2e;background:transparent;transition:background .2s ease,transform .15s ease}
        .p-btn-ghost:hover{background:rgba(255,255,255,0.04)}
        .p-btn-ghost:active{transform:translateY(1px)}
      `}</style>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 50% 12%, rgba(255,255,255,0.06), transparent 60%)' }} />

      {/* Accent lines */}
      <div aria-hidden className="p-accent">
        <div className="p-hline" /><div className="p-hline" /><div className="p-hline" />
        <div className="p-vline" /><div className="p-vline" /><div className="p-vline" />
      </div>

      {/* Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.22em]" style={{ color: '#b5b6bb' }}>Pricing</div>
          <h2 className="mb-4 text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#f6f7f8' }}>
            Plans &amp; Pricing
          </h2>
          <p className="text-lg" style={{ color: '#a6a7ac' }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`p-card-animate relative ${plan.highlighted ? 'p-card-pop' : 'p-card'}`}
              style={{ padding: 28, animationDelay: `${0.28 + i * 0.08}s` }}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <div
                    className="flex items-center gap-1.5 rounded-full border px-4 py-1.5"
                    style={{ background: 'rgba(20,20,24,0.8)', borderColor: '#2a2a2e', fontSize: 12, fontWeight: 600, color: '#e6e7ea' }}
                  >
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'rgba(255,255,255,0.7)' }} />
                    {isProActive ? 'Your plan' : 'Most popular'}
                  </div>
                </div>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <h3 className="mb-3 text-xl font-medium" style={{ color: '#f6f7f8' }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold" style={{ color: '#f6f7f8' }}>{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: '#a6a7ac' }}>{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm" style={{ color: '#a6a7ac' }}>{plan.description}</p>
              </div>

              {/* Divider */}
              <div className="mb-6 h-px w-full" style={{ background: '#2a2a2e' }} />

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#8e9096' }} />
                    <span className="text-sm" style={{ color: '#d4d5d9' }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className={plan.highlighted ? 'p-btn-primary' : 'p-btn-ghost'}
                onClick={() => handlePlanClick(plan)}
                disabled={loading}
              >
                {loading && plan.highlighted
                  ? <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  : plan.name === 'Enterprise'
                    ? 'Contact us'
                    : plan.highlighted
                      ? (isProActive ? 'Go to dashboard' : 'Get started')
                      : (isProActive ? 'Downgrade' : 'Get started')}
              </button>

              {plan.highlighted && !isProActive && (
                <p className="mt-3 text-center text-xs" style={{ color: '#6b6c72' }}>Cancel anytime</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
