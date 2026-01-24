import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TrustBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const brands = [
    'Stanford', 'YC', 'Google', 'Meta', 'Stripe', 'Notion', 'Figma', 'Linear',
  ];

  return (
    <section ref={ref} className="py-16 relative overflow-hidden border-y border-border/30">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs tracking-[0.2em] text-muted-foreground/60 uppercase">
          Trusted by teams at
        </span>
      </motion.div>
      
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
        
        {/* Marquee */}
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee">
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <div key={i} className="flex-shrink-0 px-10 md:px-16">
                <span className="text-2xl md:text-3xl font-serif text-muted-foreground/20 hover:text-muted-foreground/40 transition-colors duration-300 whitespace-nowrap">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
