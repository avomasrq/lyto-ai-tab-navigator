import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { usePolar, POLAR_PRODUCT_IDS } from '@/hooks/usePolar';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { createCheckout, loading } = usePolar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Try it out',
      features: ['5 actions/day', 'Basic features', 'Local data'],
      cta: 'Start free',
      highlighted: false,
      productId: null,
    },
    {
      name: 'Pro',
      price: '$20',
      period: '/mo',
      description: 'For power users',
      features: ['Unlimited actions', 'Deep research', 'Page monitoring', 'Priority support'],
      cta: 'Go Pro',
      highlighted: true,
      productId: POLAR_PRODUCT_IDS.pro_monthly,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For teams',
      features: ['Everything in Pro', 'Custom integrations', 'SLA guarantee'],
      cta: 'Contact',
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
    <section id="pricing" className="section-gap px-6 relative" ref={ref}>
      <div className="divider-fade mb-24" />
      
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-label">Pricing</span>
          <h2 className="text-headline font-serif mt-4">
            Simple, <span className="text-gradient">honest</span> pricing
          </h2>
          <p className="text-muted-foreground text-lg mt-6">
            No hidden fees. No surprise charges. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="relative"
            >
              {plan.highlighted && (
                <motion.div 
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-foreground text-background text-xs font-medium rounded-full z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  Most popular
                </motion.div>
              )}
              
              <div className={`h-full rounded-2xl p-8 lg:p-10 flex flex-col transition-all duration-500 ${
                plan.highlighted 
                  ? 'bg-foreground text-background ring-4 ring-foreground/10' 
                  : 'card-surface'
              }`}>
                {/* Plan name */}
                <div className="mb-8">
                  <h3 className={`text-sm font-medium ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-5xl font-serif">{plan.price}</span>
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

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlighted ? 'bg-primary' : 'bg-primary/10'
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <span className={plan.highlighted ? 'text-background/80' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.highlighted ? 'secondary' : 'outline'} 
                  size="lg"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
