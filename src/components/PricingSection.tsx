import { Check, Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const GRADIENT_BG =
  "url('https://res.cloudinary.com/eldoraui/image/upload/v1734021310/advanced-gradient_un8eg6.jpg')";

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

  const handleFree = () => {
    if (user) navigate('/dashboard');
    else navigate('/auth');
  };

  const handlePro = () => {
    if (isProActive) { navigate('/dashboard'); return; }
    if (!user) { navigate('/auth'); return; }
    createCheckout(POLAR_PRODUCT_IDS.pro_monthly);
  };

  const handleEnterprise = () => {
    window.location.href = 'mailto:info@trylyto.com?subject=Enterprise%20Inquiry';
  };

  return (
    <section id="pricing" className="overflow-hidden py-20 sm:py-28 scroll-mt-24 text-foreground">
      <div className="container mx-auto px-4">

        {/* Header */}
        <FadeIn className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Pricing</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-serif tracking-tight">
            Simple, <span className="italic text-gradient">transparent</span> pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Start free. Upgrade when you need more.
          </p>
        </FadeIn>

        {/* Cards */}
        <FadeIn delay={0.1}>
          <div className="-m-4 flex flex-wrap *:mx-auto max-w-5xl mx-auto">

            {/* Free */}
            <div className="w-full p-4 md:w-1/2 lg:w-1/3">
              <div className="h-full transform-gpu rounded-2xl border border-border bg-card transition duration-500 hover:-translate-y-2">
                <div className="border-b border-border p-10">
                  <h4 className="mb-5 text-4xl font-serif">Free</h4>
                  <p className="mb-1 text-2xl font-semibold tracking-tight">$0</p>
                  <p className="text-sm text-muted-foreground">For trying it out</p>
                </div>
                <div className="p-10 pb-9">
                  <ul className="mb-10 space-y-3">
                    {[
                      '50 Lyto actions per week',
                      'Auto-scroll, highlight, focus mode',
                      'Quick responses on current page',
                      'Basic Lyto actions after limit',
                    ].map((f) => <FeatureItem key={f}>{f}</FeatureItem>)}
                  </ul>
                  <PricingButton onClick={handleFree} disabled={loading}>
                    {isProActive ? 'Downgrade' : 'Get started'}
                  </PricingButton>
                </div>
              </div>
            </div>

            {/* Pro — gradient */}
            <div className="w-full p-4 md:w-1/2 lg:w-1/3">
              <div
                className="transform-gpu overflow-hidden rounded-2xl p-px transition duration-500 hover:-translate-y-2"
                style={{ backgroundImage: GRADIENT_BG, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
              >
                <div className="h-full rounded-2xl bg-card">
                  <div
                    className="p-10"
                    style={{ backgroundImage: GRADIENT_BG, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
                  >
                    {isProActive && (
                      <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        Your plan
                      </span>
                    )}
                    {!isProActive && (
                      <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        Most popular
                      </span>
                    )}
                    <h4 className="mb-5 text-4xl font-serif text-white">Pro</h4>
                    <p className="mb-1 text-2xl font-semibold tracking-tight text-white">$20<span className="text-base font-normal text-white/70">/mo</span></p>
                    <p className="text-sm text-white/70">For daily use</p>
                  </div>
                  <div className="p-10 pb-9">
                    <ul className="mb-10 space-y-3">
                      {[
                        'Unlimited AI page interactions',
                        'Scroll, highlight, clean noise freely',
                        'Deep research with detailed reports',
                        'Page monitoring & push notifications',
                        'Priority support',
                      ].map((f) => <FeatureItem key={f}>{f}</FeatureItem>)}
                    </ul>
                    <PricingButton
                      onClick={handlePro}
                      disabled={loading}
                      gradient
                    >
                      {loading ? '...' : isProActive ? 'Go to dashboard' : 'Get started'}
                    </PricingButton>
                    {!isProActive && (
                      <p className="mt-3 text-xs text-muted-foreground text-center">Cancel anytime</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Enterprise */}
            <div className="w-full p-4 md:w-1/2 lg:w-1/3">
              <div className="flex h-full transform-gpu flex-col justify-between rounded-2xl border border-border bg-card transition duration-500 hover:-translate-y-2">
                <div className="p-10">
                  <h4 className="mb-5 text-4xl font-serif">Enterprise</h4>
                  <p className="mb-1 text-2xl font-semibold tracking-tight">Custom</p>
                  <p className="text-sm text-muted-foreground">For organizations</p>
                </div>
                <div className="p-10 pb-9">
                  <ul className="mb-10 space-y-3">
                    {[
                      'Everything in Pro',
                      'Custom integrations',
                      'Dedicated support',
                      'SLA guarantee',
                    ].map((f) => <FeatureItem key={f}>{f}</FeatureItem>)}
                  </ul>
                  <PricingButton onClick={handleEnterprise} disabled={loading}>
                    Contact us
                  </PricingButton>
                </div>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const FeatureItem = ({ children }: { children: string }) => (
  <li className="flex items-center gap-3 text-sm">
    <Check className="size-3.5 text-primary flex-shrink-0" />
    <span className="text-foreground/80">{children}</span>
  </li>
);

const PricingButton = ({
  children,
  onClick,
  disabled,
  gradient,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  gradient?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={[
      'inline-flex w-full items-center justify-center rounded-lg border px-5 py-3.5 text-sm font-semibold tracking-tight transition duration-200',
      'disabled:opacity-50 disabled:pointer-events-none',
      gradient
        ? 'border-foreground/20 bg-foreground text-background hover:opacity-90'
        : 'border-border bg-transparent hover:bg-foreground hover:text-background',
    ].join(' ')}
  >
    {disabled ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
  </button>
);

export default PricingSection;
