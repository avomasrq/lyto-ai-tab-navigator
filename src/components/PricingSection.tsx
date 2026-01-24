import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Check, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { createCheckout, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '50 AI actions per day',
        'Basic tab management',
        'Simple automations',
        'Community support',
      ],
      cta: 'Start Free',
      featured: false,
      productId: null,
    },
    {
      name: 'Pro',
      price: '$12',
      period: '/month',
      description: 'For power users',
      features: [
        'Unlimited AI actions',
        'Advanced tab control',
        'Complex automations',
        'Priority support',
        'Custom workflows',
        'Team features',
      ],
      cta: 'Go Pro',
      featured: true,
      productId: POLAR_PRODUCT_IDS.pro_monthly,
    },
  ];

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (!plan.productId) {
      navigate(user ? '/dashboard' : '/auth');
      return;
    }
    if (!user) {
      navigate('/auth');
      return;
    }
    createCheckout(plan.productId);
  };

  return (
    <section id="pricing" className="section-large px-6 relative overflow-hidden" ref={ref}>
      {/* Background number */}
      <div className="absolute top-0 right-0 number-watermark">05</div>
      
      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="viral-tag mb-6 inline-flex">Pricing</span>
          <h2 className="text-section font-serif mt-6">
            Simple pricing.
            <br />
            <span className="text-gradient-vivid">Powerful results.</span>
          </h2>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="group"
            >
              <div className={`relative h-full rounded-3xl p-8 lg:p-10 ${
                plan.featured 
                  ? 'bg-foreground text-background' 
                  : 'viral-card'
              }`}>
                {/* Featured badge */}
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-6">
                  <h3 className="text-xl font-serif mb-2">{plan.name}</h3>
                  <p className={plan.featured ? 'text-background/60' : 'text-muted-foreground'}>
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-serif">{plan.price}</span>
                  <span className={plan.featured ? 'text-background/60' : 'text-muted-foreground'}>
                    {plan.period}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.featured ? 'bg-primary' : 'bg-primary/10'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.featured ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <span className={plan.featured ? 'text-background/80' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button 
                  onClick={() => handlePlanClick(plan)}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-medium transition-all group ${
                    plan.featured 
                      ? 'bg-primary text-primary-foreground hover:opacity-90' 
                      : 'bg-foreground text-background hover:opacity-90'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p 
          className="text-center text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
