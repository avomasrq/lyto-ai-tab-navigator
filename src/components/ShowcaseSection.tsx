import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play } from 'lucide-react';

const ShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="showcase" className="section-gap px-6 relative overflow-hidden" ref={ref}>
      <div className="container mx-auto">
        {/* Header - Offset layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label">Experience</span>
          </motion.div>
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-headline font-serif">
              See it in action
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md text-lg">
              60 seconds to understand how Lyto transforms your browser.
            </p>
          </motion.div>
        </div>

        {/* Video container - Full width with dramatic presentation */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative frame */}
          <div className="absolute -inset-4 md:-inset-8 border border-border/30 rounded-3xl" />
          <div className="absolute -inset-8 md:-inset-16 border border-border/10 rounded-[2rem]" />
          
          <div className="relative rounded-2xl overflow-hidden bg-foreground">
            {/* Video area */}
            <div className="relative" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Animated gradient background */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 via-foreground to-foreground"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] 
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
                
                {/* Play button */}
                <motion.button 
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-background/20"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="relative w-24 h-24 rounded-full bg-background flex items-center justify-center shadow-2xl">
                    <Play className="w-8 h-8 text-foreground ml-1" fill="currentColor" />
                  </div>
                </motion.button>
              </div>
              
              {/* Corner accents */}
              <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-background/20" />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-background/20" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
