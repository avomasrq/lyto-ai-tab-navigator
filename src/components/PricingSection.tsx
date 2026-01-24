import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2, ArrowRight, Sparkles } from 'lucide-react';
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
    },
  };

  return (
    <section id="pricing" className="section-padding px-6 relative" ref={ref}>
      {/* Section divider */}
      <div className="section-divider mb-20 lg:mb-28" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <motion.span 
            className="text-label"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Pricing
          </motion.span>
          <motion.h2 
            className="text-headline font-serif mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Simple,
            <br />
            <em className="not-italic text-gradient">transparent</em> pricing
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mt-6 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Start free. Upgrade when you need more power.
          </motion.p>
        </div>

        {/* Pricing cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              variants={itemVariants}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="relative"
            >
              <div 
                className={`relative rounded-2xl flex flex-col transition-all duration-500 ${
                  plan.highlighted 
                    ? 'bg-foreground text-background p-8 lg:p-10 shadow-2xl shadow-foreground/15 scale-[1.02] lg:-my-4 z-10' 
                    : 'surface-interactive p-8 lg:p-10'
                }`}
              >
                {plan.highlighted && (
                  <motion.span 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-4 py-1.5 rounded-full font-medium shadow-lg flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Most popular
                  </motion.span>
                )}
                
                <div className="mb-8">
                  <h3 className={`text-sm font-medium ${plan.highlighted ? 'text-background/60' : 'text-muted-foreground'}`}>
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-5xl font-serif ${plan.highlighted ? 'text-background' : ''}`}>{plan.price}</span>
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

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, i) => (
                    <motion.li 
                      key={feature} 
                      className="flex items-start gap-3 text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.4 + (index * 0.1) + (i * 0.05) }}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlighted ? 'bg-primary' : 'bg-primary/10'}`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'}`} />
                      </div>
                      <span className={plan.highlighted ? 'text-background/80' : 'text-foreground/80'}>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button 
                  variant={plan.highlighted ? 'secondary' : 'outline'} 
                  size="lg"
                  className={`w-full group ${plan.highlighted ? 'bg-background text-foreground hover:bg-background/90 shadow-lg' : ''}`}
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
        </motion.div>

        <motion.p 
          className="text-center text-sm text-muted-foreground mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          Cancel anytime · No credit card required for free plan
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
