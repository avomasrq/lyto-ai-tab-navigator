import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const TrustBar = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const brands = [
    'Stanford University',
    'Y Combinator',
    'Techstars',
    'Google for Startups',
    'Microsoft',
    'Amazon',
  ];

  return (
    <section ref={ref} className="py-16 px-6 border-y border-border/50 bg-card/30 overflow-hidden">
      <div className="container mx-auto">
        <motion.p 
          className="text-center text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Trusted by teams at
        </motion.p>
        
        {/* Marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="marquee">
            <div className="marquee-content">
              {[...brands, ...brands].map((brand, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-center px-8 py-4"
                >
                  <span className="text-lg font-medium text-muted-foreground/40 whitespace-nowrap hover:text-muted-foreground/60 transition-colors">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
