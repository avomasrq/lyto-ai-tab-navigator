import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Sparkles, Layers, Search, Repeat, ArrowUpRight } from 'lucide-react';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const features = [
    {
      icon: Sparkles,
      title: 'Proactive assistance',
      description: "Unlike chatbots that wait for commands, Lyto understands what you're doing and offers to help in real time—before you even ask.",
      span: 'md:col-span-2 md:row-span-2',
      featured: true,
      gradient: 'from-orange-500/10 via-orange-400/5 to-transparent',
    },
    {
      icon: Layers,
      title: 'Smart tab control',
      description: 'Opens, closes, and navigates tabs automatically based on your workflow.',
      span: 'md:col-span-1',
      featured: false,
      gradient: 'from-amber-500/10 via-amber-400/5 to-transparent',
    },
    {
      icon: Search,
      title: 'Research & compare',
      description: 'Finds reliable sources and compares products across multiple sites instantly.',
      span: 'md:col-span-1',
      featured: false,
      gradient: 'from-yellow-500/10 via-yellow-400/5 to-transparent',
    },
    {
      icon: Repeat,
      title: 'Task automation',
      description: 'Manages workflows and automates repetitive browser tasks so you can focus on what matters.',
      span: 'md:col-span-2',
      featured: false,
      gradient: 'from-orange-400/10 via-orange-300/5 to-transparent',
    },
  ];

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
    <section id="features" className="section-padding px-6 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      
      {/* Animated orb */}
      <motion.div
        className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none"
        animate={{
          x: [0, 50, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label">Capabilities</span>
            <h2 className="text-headline font-serif mt-4">
              Built to
              <br />
              <em className="not-italic text-gradient">take action</em>
            </h2>
          </motion.div>
          <motion.div 
            className="lg:pt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-body-lg max-w-md">
              A browser agent that doesn't just suggest&mdash;it executes. 
              Designed for those who value their time.
            </p>
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div 
          className="grid md:grid-cols-4 gap-4 lg:gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.div 
                key={feature.title} 
                className={`${feature.span} group relative`}
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`h-full surface-interactive rounded-2xl overflow-hidden ${feature.featured ? 'p-10 lg:p-12' : 'p-8'}`}>
                  {/* Gradient background */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                  
                  {/* Icon */}
                  <div className="relative mb-6">
                    <motion.div 
                      className={`${feature.featured ? 'w-16 h-16' : 'w-12 h-12'} rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className={`${feature.featured ? 'w-7 h-7' : 'w-5 h-5'} text-primary`} strokeWidth={1.5} />
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className={`font-serif mb-3 flex items-center gap-2 ${feature.featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                      {feature.title}
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpRight className="w-5 h-5 text-primary" />
                      </motion.span>
                    </h3>
                    <p className={`text-muted-foreground leading-relaxed ${feature.featured ? 'text-base max-w-md' : 'text-sm'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
