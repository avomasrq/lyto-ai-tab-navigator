import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Chrome, MousePointer2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrowserMockup from './BrowserMockup';

const HeroSection = () => {
  return (
    <section className="min-h-[100svh] flex flex-col justify-center pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-300/10 blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* Left side - Text content */}
          <div className="lg:flex-1 max-w-2xl">
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="badge-glow mb-8">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Backed by Impact Consulting</span>
              </div>
            </motion.div>

            {/* Main headline with staggered animation */}
            <motion.h1 
              className="text-display font-serif"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">Your browser,</span>
              <motion.span 
                className="text-gradient block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                now intelligent
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-body-lg max-w-lg mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Lyto AI understands what you're doing and helps proactively&mdash;from 
              research and price comparison to tab management, all in real time.
            </motion.p>

            {/* CTA Row */}
            <motion.div 
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button variant="primary" size="lg" className="group relative overflow-hidden" asChild>
                <Link to="/coming-soon">
                  <span className="relative z-10 flex items-center">
                    <Chrome className="w-4 h-4 mr-2" />
                    Add to Chrome&mdash;free
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="text-muted-foreground hover:text-foreground group"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="animated-underline">Watch demo</span>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div 
              className="mt-16 pt-8 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex flex-wrap gap-8 lg:gap-12">
                <div>
                  <motion.div 
                    className="text-3xl font-serif text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    500+
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-1">Early users</div>
                </div>
                <div>
                  <motion.div 
                    className="text-3xl font-serif text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    10k+
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-1">Actions taken</div>
                </div>
                <div>
                  <motion.div 
                    className="text-3xl font-serif text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    100%
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-1">Data stays local</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Browser Mockup */}
          <motion.div 
            className="hidden lg:flex lg:flex-1 justify-center items-center"
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 50 }}
          >
            <BrowserMockup />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-muted-foreground/60">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MousePointer2 className="w-4 h-4 text-muted-foreground/40 rotate-180" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
