import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye, Lightbulb, Zap, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '01',
      icon: Eye,
      title: 'Always watching',
      description: "Lyto runs quietly in the background, understanding your screen and what you're trying to accomplish.",
      color: 'from-orange-500/20 to-orange-500/5',
    },
    {
      number: '02',
      icon: Lightbulb,
      title: 'Proactive suggestions',
      description: 'Get real-time help without asking. Lyto offers to research, compare prices, or manage tabs automatically.',
      color: 'from-amber-500/20 to-amber-500/5',
    },
    {
      number: '03',
      icon: Zap,
      title: 'One-click action',
      description: 'Accept and Lyto does the work—opening tabs, finding sources, comparing products, all hands-free.',
      color: 'from-yellow-500/20 to-yellow-500/5',
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
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
    <section id="how-it-works" className="section-padding px-6 relative" ref={ref}>
      {/* Section divider */}
      <div className="section-divider mb-20 lg:mb-28" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label">How it works</span>
            <h2 className="text-headline font-serif mt-4">
              Always on,
              <br />
              <em className="not-italic text-gradient">always ready</em>
            </h2>
          </motion.div>
          <motion.div 
            className="lg:pt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-body-lg max-w-md">
              Lyto operates directly inside Chrome, turning your browser into an 
              intelligent assistant that anticipates your needs.
            </p>
          </motion.div>
        </div>

        {/* Steps with connecting line */}
        <motion.div 
          className="relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-28 left-[calc(16.67%-1rem)] right-[calc(16.67%-1rem)] h-px">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="relative h-full surface-interactive rounded-2xl p-8 lg:p-10 overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    {/* Step circle */}
                    <div className="relative mb-8">
                      <motion.div 
                        className="step-circle"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
                      </motion.div>
                      
                      {/* Arrow to next (desktop) */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:flex absolute top-1/2 -right-8 -translate-y-1/2 w-8 items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-primary/30" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative">
                      <span className="text-xs font-semibold text-primary/60 tracking-wider">
                        Step {step.number}
                      </span>
                      <h3 className="text-title font-serif mt-3 mb-4">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
