import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Sparkles, Layers, Search, Repeat, ArrowUpRight } from 'lucide-react';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: 'Proactive',
      fullTitle: 'Proactive Assistance',
      description: "Lyto doesn't wait for commands. It understands context and offers help before you ask—like a brilliant assistant reading your mind.",
    },
    {
      icon: Layers,
      title: 'Tabs',
      fullTitle: 'Smart Tab Control',
      description: 'Opens, closes, and navigates tabs based on your workflow. No more drowning in a sea of open tabs.',
    },
    {
      icon: Search,
      title: 'Research',
      fullTitle: 'Research & Compare',
      description: 'Finds reliable sources and compares products across sites instantly. Perfect for shopping and deep research.',
    },
    {
      icon: Repeat,
      title: 'Automate',
      fullTitle: 'Task Automation',
      description: 'Automates repetitive browser tasks. Save hours on routine workflows and focus on what matters.',
    },
  ];

  return (
    <section id="features" className="section-gap px-6 relative overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[200px] pointer-events-none" />
      
      <div className="container mx-auto relative">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label">Capabilities</span>
            <h2 className="text-headline font-serif mt-4">
              Built for
              <br />
              <span className="text-gradient">action</span>
            </h2>
          </motion.div>
        </div>

        {/* Features - Split view */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Feature list */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <motion.button
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-500 ${
                    isActive 
                      ? 'bg-foreground text-background border-foreground' 
                      : 'border-border hover:border-primary/30 bg-card/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-primary' : 'bg-primary/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <span className="text-xl font-serif">{feature.title}</span>
                    <ArrowUpRight className={`w-5 h-5 ml-auto transition-all ${
                      isActive ? 'text-primary opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right - Feature detail */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="sticky top-32">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="card-surface rounded-2xl p-10 lg:p-12"
              >
                {/* Large icon */}
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  {(() => {
                    const Icon = features[activeFeature].icon;
                    return <Icon className="w-10 h-10 text-primary" strokeWidth={1.5} />;
                  })()}
                </div>
                
                <h3 className="text-title font-serif mb-4">
                  {features[activeFeature].fullTitle}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {features[activeFeature].description}
                </p>
                
                {/* Decorative number */}
                <div className="absolute bottom-6 right-8 text-8xl font-serif text-primary/5">
                  0{activeFeature + 1}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
