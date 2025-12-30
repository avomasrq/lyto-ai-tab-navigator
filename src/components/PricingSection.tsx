import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For trying it out',
      features: [
        '10 tabs analyzed',
        '20 searches per day',
        'Basic navigation',
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Standard',
      price: '$2.99',
      period: '/mo',
      description: 'For daily use',
      features: [
        '100 tabs analyzed',
        'Unlimited searches',
        'Smart navigation',
        'Session memory',
        'Priority support',
      ],
      cta: 'Start trial',
      highlighted: true,
    },
    {
      name: 'Business',
      price: '$12.99',
      period: '/mo',
      description: 'For power users',
      features: [
        'Unlimited tabs',
        'Everything in Standard',
        'Export history',
        'Advanced analytics',
        'Team features',
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations',
      features: [
        'Everything in Business',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Contact us',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4">
            Simple, <span className="text-gradient">transparent</span> pricing
          </h2>
          <p className="text-muted-foreground mt-4">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted 
                  ? 'bg-foreground text-background border-2 border-foreground' 
                  : 'bg-card/50 border border-border'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Popular
                </span>
              )}
              
              <div className="mb-6">
                <h3 className={`text-sm font-medium ${plan.highlighted ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-serif">{plan.price}</span>
                  {plan.period && (
                    <span className={`text-sm ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-1 ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-primary'}`} />
                    <span className={plan.highlighted ? 'text-background/80' : ''}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? 'secondary' : 'outline'} 
                className={`w-full ${plan.highlighted ? 'bg-background text-foreground hover:bg-background/90' : ''}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Free 14-day trial on all paid plans · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
