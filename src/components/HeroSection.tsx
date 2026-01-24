import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrowserMockup from './BrowserMockup';

const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-50" />
      
      {/* Large decorative number */}
      <motion.div 
        className="absolute top-20 right-0 number-display select-none pointer-events-none hidden lg:block"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        AI
      </motion.div>

      <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-start">
          {/* Left column - Main content */}
          <div className="lg:col-span-7 lg:pr-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="floating-badge">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Backed by Impact Consulting
              </div>
            </motion.div>

            {/* Headline */}
            <div className="relative">
              <motion.div 
                className="accent-line mb-8"
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              
              <motion.h1 
                className="text-display font-serif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.span 
                  className="block"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Your
                </motion.span>
                <motion.span 
                  className="block"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  browser,
                </motion.span>
                <motion.span 
                  className="block text-gradient"
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  intelligent.
                </motion.span>
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p 
              className="text-body-xl max-w-md mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Lyto AI watches what you do and helps before you ask&mdash;research, 
              price comparisons, and tab control, all in real time.
            </motion.p>

            {/* CTA */}
            <motion.div 
              className="flex flex-wrap gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button variant="primary" size="xl" className="group" asChild>
                <Link to="/coming-soon">
                  Add to Chrome&mdash;Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div 
              className="flex gap-12 mt-20 pt-10 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {[
                { value: '500+', label: 'Early users' },
                { value: '10k+', label: 'Actions taken' },
                { value: '100%', label: 'Local data' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
                >
                  <div className="text-3xl font-serif text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 tracking-wide">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right column - Browser mockup */}
          <motion.div 
            className="lg:col-span-5 relative hidden lg:block"
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
          >
            <div className="perspective-1000">
              <BrowserMockup />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4 text-muted-foreground/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
