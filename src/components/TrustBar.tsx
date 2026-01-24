import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const TrustBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const brands = [
    'Stanford', 'Y Combinator', 'Techstars', 'Google', 'Microsoft', 'Amazon',
    'Stanford', 'Y Combinator', 'Techstars', 'Google', 'Microsoft', 'Amazon',
  ];

  return (
    <section ref={ref} className="py-12 border-y border-border/50 overflow-hidden bg-card/30">
      <motion.p 
        className="text-center text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        Trusted by teams at
      </motion.p>
      
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <div className="flex overflow-hidden">
          <div className="flex animate-marquee">
            {brands.map((brand, i) => (
              <div key={i} className="flex-shrink-0 px-12">
                <span className="text-xl font-serif text-muted-foreground/25 hover:text-muted-foreground/40 transition-colors whitespace-nowrap">
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
