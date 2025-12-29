import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      icon: Zap,
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out Lyto',
      features: [
        'Up to 10 tabs analyzed',
        '20 searches per day',
        'Basic tab navigation',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
      gradient: 'from-slate-500 to-slate-600',
    },
    {
      name: 'Pro',
      icon: Star,
      price: '$12',
      period: '/month',
      description: 'For power users and researchers',
      features: [
        'Unlimited tabs',
        'Unlimited searches',
        'Deep tab understanding',
        'Faster AI responses',
        'Priority support',
        'Cross-session memory',
      ],
      cta: 'Start Free Trial',
      popular: true,
      gradient: 'from-primary to-orange-400',
    },
    {
      name: 'Team',
      icon: Crown,
      price: '$29',
      period: '/user/month',
      description: 'For teams that research together',
      features: [
        'Everything in Pro',
        'Shared research spaces',
        'Team memory & knowledge',
        'Collaboration tools',
        'Admin dashboard',
        'SSO & advanced security',
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-accent to-pink-400',
    },
  ];

  return (
    <section id="pricing" className="py-32 px-6 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30 -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-primary" />
            Pricing
            <span className="w-8 h-px bg-primary" />
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-4 mb-6 tracking-tight">
            Simple, Transparent
            <br />
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            Start for free, upgrade when you need more power
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative group ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {/* Popular glow */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              )}
              
              <div className={`relative h-full glass-card rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? 'border-primary/50 shadow-[0_0_40px_hsl(25_95%_53%/0.2)]'
                  : 'hover:border-muted-foreground/30'
              }`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-400 px-5 py-2 rounded-full text-sm font-bold text-primary-foreground shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <plan.icon className="w-7 h-7 text-white" />
                </div>

                {/* Plan Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-5xl font-extrabold ${plan.popular ? 'gradient-text' : 'text-foreground'}`}>
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-3 font-light">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-primary/20' : 'bg-secondary'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <span className="text-foreground text-sm font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.popular ? 'hero' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-muted-foreground text-sm mt-12">
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
