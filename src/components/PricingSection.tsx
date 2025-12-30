import { Button } from '@/components/ui/button';
import { Check, Sparkles, Zap, Building2, Crown } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring Lyto AI',
      icon: Zap,
      features: [
        '10 tabs analyzed',
        '20 searches per day',
        'Basic navigation',
        'Email support',
      ],
      cta: 'Get started',
      highlighted: false,
      gradient: false,
    },
    {
      name: 'Standard',
      price: '$2.99',
      period: '/mo',
      description: 'For everyday power users',
      icon: Sparkles,
      features: [
        '100 tabs analyzed',
        'Unlimited searches',
        'Smart navigation',
        'Priority support',
        'Session memory',
      ],
      cta: 'Start free trial',
      highlighted: true,
      gradient: true,
    },
    {
      name: 'Business',
      price: '$12.99',
      period: '/mo',
      description: 'Advanced features for pros',
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
      gradient: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for teams',
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
      gradient: false,
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-6">
            <span className="w-8 h-px bg-primary/50" />
            Pricing
            <span className="w-8 h-px bg-primary/50" />
          </span>
          <h2 className="text-4xl md:text-6xl font-serif mt-4">
            Choose your <span className="text-gradient">plan</span>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-lg mx-auto text-lg">
            Start free, scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div 
                key={plan.name}
                className={`group relative rounded-2xl p-6 lg:p-8 transition-all duration-500 hover-lift ${
                  plan.highlighted 
                    ? 'bg-gradient-to-b from-primary/20 via-card to-card border-2 border-primary/50 shadow-[0_0_60px_-15px] shadow-primary/30' 
                    : 'bg-card/50 border border-border/50 hover:border-primary/30 hover:bg-card'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-full font-medium shadow-lg shadow-primary/25">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                {/* Icon and name */}
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-colors ${
                    plan.highlighted 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-medium">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8 pb-8 border-b border-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-4xl lg:text-5xl font-serif ${plan.highlighted ? 'text-gradient' : ''}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        plan.highlighted 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      } transition-colors`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant={plan.highlighted ? 'default' : 'outline'} 
                  className={`w-full group/btn transition-all duration-300 ${
                    plan.highlighted 
                      ? 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40' 
                      : 'hover:bg-primary hover:text-primary-foreground hover:border-primary'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Bottom trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
