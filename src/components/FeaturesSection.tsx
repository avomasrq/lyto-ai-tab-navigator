import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Sparkles, Layers, Search, Repeat, Shield, Brain } from 'lucide-react';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: 'Proactive AI',
      description: 'Lyto understands context and offers help before you ask. Like a brilliant assistant reading your mind.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Layers,
      title: 'Tab Control',
      description: 'Opens, closes, and navigates tabs based on your workflow. No more drowning in open tabs.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Search,
      title: 'Smart Research',
      description: 'Finds reliable sources and compares products across sites. Perfect for deep research.',
      color: 'from-yellow-500 to-amber-500',
    },
    {
      icon: Repeat,
      title: 'Task Automation',
      description: 'Automates repetitive browser tasks. Save hours on routine workflows.',
      color: 'from-orange-400 to-rose-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data stays on your device. We never see your browsing history.',
      color: 'from-red-500 to-orange-600',
    },
    {
      icon: Sparkles,
      title: 'Always Learning',
      description: 'Gets smarter the more you use it. Personalized to your unique workflow.',
      color: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <section id="features" className="section-large px-6 relative overflow-hidden" ref={ref}>
      {/* Background number */}
      <div className="absolute top-0 right-0 number-watermark">03</div>
      
      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="viral-tag mb-6 inline-flex">Features</span>
          <h2 className="text-section font-serif mt-6">
            Everything you need.
            <br />
            <span className="text-gradient-vivid">Nothing you don't.</span>
          </h2>
        </motion.div>

        {/* Features grid - Bento style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group"
              >
                <div className="viral-card p-8 h-full relative">
                  {/* Gradient orb on hover */}
                  <motion.div 
                    className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.color} blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                  />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center"
                      animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-serif mb-3 relative">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed relative">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
