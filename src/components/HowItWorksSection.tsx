import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, Eye, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '01',
      icon: Download,
      title: 'Install in seconds',
      description: 'Add Lyto to Chrome with one click. No account needed, no configuration required.',
    },
    {
      number: '02',
      icon: Eye,
      title: 'Lyto observes',
      description: 'It watches what you do—browsing, searching, shopping—and learns your patterns.',
    },
    {
      number: '03',
      icon: Zap,
      title: 'Magic happens',
      description: 'Lyto suggests actions, automates tasks, and helps before you even ask.',
    },
  ];

  return (
    <section id="how" className="section-large px-6 relative overflow-hidden bg-card/30" ref={ref}>
      {/* Background number */}
      <div className="absolute top-0 left-0 number-watermark">02</div>
      
      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="viral-tag mb-6 inline-flex">How it works</span>
          <h2 className="text-section font-serif mt-6">
            Three steps to
            <br />
            <span className="text-gradient-vivid">browser superpowers.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="relative group"
              >
                <div className="viral-card p-8 lg:p-10 h-full">
                  {/* Number */}
                  <div className="text-7xl font-serif text-primary/10 mb-6">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-serif mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 w-12 lg:w-16 h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
