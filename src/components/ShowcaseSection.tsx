import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play } from 'lucide-react';
import BrowserMockup from './BrowserMockup';

const ShowcaseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="demo" className="section-large px-6 relative overflow-hidden" ref={ref}>
      {/* Background number */}
      <div className="absolute top-0 right-0 number-watermark">01</div>
      
      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div 
          className="max-w-3xl mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="viral-tag mb-6 inline-flex">See it work</span>
          <h2 className="text-section font-serif mt-6">
            One minute to
            <br />
            <span className="text-gradient-vivid">understand everything.</span>
          </h2>
        </motion.div>

        {/* Browser mockup with video */}
        <motion.div 
          className="relative max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 60, rotateX: 10 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="perspective-1000">
            <div className="browser-chrome">
              {/* Browser header */}
              <div className="flex items-center gap-2 p-4 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white/10 rounded-lg h-8 max-w-md mx-auto flex items-center px-4">
                    <span className="text-white/40 text-sm">lyto.ai</span>
                  </div>
                </div>
              </div>
              
              {/* Video area */}
              <div className="relative aspect-video bg-gradient-to-br from-foreground via-foreground to-foreground/90">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Animated rings */}
                  <motion.div 
                    className="absolute w-40 h-40 rounded-full border border-primary/20"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute w-40 h-40 rounded-full border border-primary/20"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  
                  {/* Play button */}
                  <motion.button 
                    className="relative z-10 w-20 h-20 rounded-full bg-primary flex items-center justify-center group"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  </motion.button>
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-6 left-6 w-16 h-16 border-l border-t border-white/10" />
                <div className="absolute bottom-6 right-6 w-16 h-16 border-r border-b border-white/10" />
              </div>
            </div>
          </div>
          
          {/* Floating badge */}
          <motion.div 
            className="absolute -bottom-6 -right-6 md:right-12 bg-background border border-border rounded-2xl px-6 py-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">60 sec demo</div>
                <div className="text-xs text-muted-foreground">No signup required</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
