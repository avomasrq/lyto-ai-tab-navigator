import { Button } from '@/components/ui/button';
import { Check, Zap, Building2, Crown } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For getting started',
      icon: Zap,
      features: [
        '10 tabs analyzed',
        '20 searches per day',
        'Basic navigation',
        'Email support',
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Standard',
      price: '$2.99',
      period: '/mo',
      description: 'For everyday users',
      icon: Zap,
      features: [
        '100 tabs analyzed',
        'Unlimited searches',
        'Smart navigation',
        'Priority support',
        'Session memory',
      ],
      cta: 'Start free trial',
      highlighted: true,
    },
    {
      name: 'Business',
      price: '$12.99',
      period: '/mo',
      description: 'For power users',
      icon: Building2,
      features: [
        'Everything in Standard',
        'Unlimited tabs',
        'Deep understanding',
        'Export history',
        'Advanced analytics',
        'Team collaboration',
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions',
      icon: Crown,
      features: [
        'Everything in Business',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        'Custom feature requests',
        'Priority development',
      ],
      cta: 'Contact us',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4">
            Simple pricing
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Start free, upgrade when you need more
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative rounded-lg p-8 ${
                plan.highlighted 
                  ? 'bg-card border-2 border-primary' 
                  : 'bg-background border border-border'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
                  Popular
                </span>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-medium">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-serif">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? 'default' : 'outline'} 
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
