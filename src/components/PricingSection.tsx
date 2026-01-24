import { Button } from '@/components/ui/button';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const { createCheckout, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For trying it out',
      features: [
        'Up to 5 Lyto actions per day',
        'Auto-scroll, highlight, focus mode',
        'Quick responses on current page',
        'Basic Perplexity answers after limit',
      ],
      cta: 'Get started',
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
      cta: 'Start free trial',
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
      cta: 'Contact sales',
      highlighted: false,
      productId: null,
      isEnterprise: true,
    },
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.isEnterprise) {
      window.location.href = 'mailto:arystan909@yahoo.com?subject=Enterprise%20Inquiry';
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
    <section id="pricing" className="section-padding px-6 relative">
      {/* Section divider */}
      <div className="section-divider mb-16 md:mb-24" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16 lg:mb-20">
          <span className="text-label">Pricing</span>
          <h2 className="text-headline font-serif mt-4">
            Simple,
            <br />
            <em className="not-italic text-gradient">transparent</em> pricing
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative rounded-2xl flex flex-col transition-all duration-500 ${
                plan.highlighted 
                  ? 'bg-foreground text-background p-8 lg:p-10 shadow-2xl shadow-foreground/10 scale-[1.02] lg:-my-3' 
                  : 'surface-interactive p-8 lg:p-10'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-full font-medium shadow-lg">
                  Most popular
                </span>
              )}
              
              <div className="mb-8">
                <h3 className={`text-sm font-medium ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className={`text-4xl font-serif ${plan.highlighted ? 'text-background' : ''}`}>{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? 'text-background/50' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-2 ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3.5 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-primary'}`} />
                    <span className={plan.highlighted ? 'text-background/80' : 'text-foreground/80'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? 'secondary' : 'outline'} 
                className={`w-full group ${plan.highlighted ? 'bg-background text-foreground hover:bg-background/90' : ''}`}
                onClick={() => handlePlanClick(plan)}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          Cancel anytime · No credit card required for free plan
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
