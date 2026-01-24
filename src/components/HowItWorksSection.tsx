import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Eye, Lightbulb, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '01',
      icon: Eye,
      title: 'Watches',
      subtitle: 'Always observing',
      description: "Lyto runs silently, understanding your screen and anticipating what you need.",
    },
    {
      number: '02',
      icon: Lightbulb,
      title: 'Suggests',
      subtitle: 'Proactive help',
      description: 'Real-time suggestions to research, compare, or organize—without asking.',
    },
    {
      number: '03',
      icon: Zap,
      title: 'Acts',
      subtitle: 'One click',
      description: 'Accept and watch it work—opening tabs, finding sources, all hands-free.',
    },
  ];

  return (
    <section id="how-it-works" className="section-gap px-6 relative" ref={ref}>
      <div className="divider-fade mb-24" />
      
      <div className="container mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-24">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label">How it works</span>
            <h2 className="text-headline font-serif mt-4">
              Three steps to
              <br />
              <span className="text-gradient">intelligence</span>
            </h2>
          </motion.div>
          <motion.div 
            className="lg:col-span-5 lg:col-start-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-body-xl">
              No setup. No configuration. Just install and let Lyto learn 
              how you work.
            </p>
          </motion.div>
        </div>

        {/* Steps - Horizontal cards with big numbers */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <div className="card-surface rounded-2xl p-8 lg:p-10 grid lg:grid-cols-12 gap-8 items-center">
                  {/* Big number */}
                  <div className="lg:col-span-2">
                    <span className="text-6xl lg:text-8xl font-serif text-primary/10 group-hover:text-primary/20 transition-colors">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="lg:col-span-2">
                    <div className="icon-box">
                      <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div className="lg:col-span-3">
                    <h3 className="text-title font-serif">{step.title}</h3>
                    <p className="text-xs text-primary tracking-wide mt-1">{step.subtitle}</p>
                  </div>
                  
                  {/* Description */}
                  <div className="lg:col-span-5">
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
