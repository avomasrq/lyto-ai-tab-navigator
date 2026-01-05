import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
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
    },
    {
      name: 'Pro',
      price: '$15',
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
    },
    {
      name: 'Team',
      price: '$50',
      period: '/mo',
      description: 'For teams',
      features: [
        'Everything in Pro for all members',
        'Shared workspace & collections',
        'Shared monitoring & notifications',
        'Centralized billing & management',
        'Usage metrics dashboard',
      ],
      cta: 'Get started',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For organizations',
      features: [
        'Everything in Team',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Contact us',
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6 border-t border-border relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 leading-[1.1]">
            Simple,
            <br />
            <span className="italic text-gradient">transparent</span> pricing
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`relative rounded-2xl p-7 flex flex-col transition-all duration-500 ${
                plan.highlighted 
                  ? 'bg-foreground text-background border-2 border-foreground shadow-2xl shadow-foreground/20 scale-[1.02] lg:-my-2' 
                  : 'bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
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
                <p className={`text-sm mt-2 ${plan.highlighted ? 'text-background/50' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-primary'}`} />
                    <span className={plan.highlighted ? 'text-background/80' : 'text-foreground/80'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                variant={plan.highlighted ? 'secondary' : 'outline'} 
                className={`w-full ${plan.highlighted ? 'bg-background text-foreground hover:bg-background/90 shadow-lg' : 'hover:border-primary/40'}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          14-day free trial on all paid plans · No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default PricingSection;