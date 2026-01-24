import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { useState } from 'react';

const ShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="showcase" className="section-padding px-6 relative overflow-hidden scroll-mt-20" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.span 
            className="text-label"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Experience
          </motion.span>
          <motion.h2 
            className="text-headline font-serif mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See it in <em className="not-italic text-gradient">action</em>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mt-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Watch how Lyto transforms your browsing experience in under 60 seconds.
          </motion.p>
        </div>

        {/* Video frame */}
        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 50 }}
        >
          {/* Glow effect */}
          <div className="absolute -inset-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent rounded-[2rem] blur-2xl" />
          
          {/* Video container */}
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl shadow-foreground/5">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground/50">Lyto AI Demo</span>
              </div>
            </div>
            
            {/* Video area */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted/30 to-muted/10">
                {/* Animated play button */}
                <motion.button 
                  className="group relative mb-6"
                  onClick={() => setIsPlaying(!isPlaying)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Ripple effect */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-primary/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-primary/20"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/40 transition-shadow">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                    ) : (
                      <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                    )}
                  </div>
                </motion.button>
                
                <motion.span 
                  className="text-sm text-muted-foreground"
                  animate={{ opacity: isPlaying ? 0 : 1 }}
                >
                  Demo video coming soon
                </motion.span>
              </div>
            </div>
          </div>

          {/* Floating feature callouts */}
          <motion.div 
            className="absolute -left-4 top-1/3 hidden xl:block"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            <div className="surface-glass rounded-xl p-4 shadow-lg max-w-[180px]">
              <div className="text-xs font-medium text-primary mb-1">Smart Detection</div>
              <div className="text-xs text-muted-foreground">Understands context automatically</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute -right-4 top-2/3 hidden xl:block"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1 }}
          >
            <div className="surface-glass rounded-xl p-4 shadow-lg max-w-[180px]">
              <div className="text-xs font-medium text-primary mb-1">Instant Actions</div>
              <div className="text-xs text-muted-foreground">One click to get things done</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
