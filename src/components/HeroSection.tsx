import { Button } from '@/components/ui/button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { ArrowRight } from 'lucide-react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const transitionVariants: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, filter: 'blur(12px)', y: 16 },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { type: 'spring', bounce: 0.3, duration: 1.4 },
    },
  },
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const mockupY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const mockupOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-6%']);

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-background">
      {/* Ethereal shadow background */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity: bgOpacity }}>
        <EtherealShadow
          color="rgba(249, 115, 22, 1)"
          noise={{ opacity: 1, scale: 1.2 }}
          sizing="fill"
        />
      </motion.div>
      {/* Content */}
      <motion.div style={{ y: textY }} className="relative z-10 pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-6 pointer-events-auto">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <AnimatedGroup variants={transitionVariants}>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/50 mb-10 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-xs sm:text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Version 2.0 is out now
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.15] tracking-tight text-foreground max-w-4xl mx-auto">
                Full control
                <br />
                <span className="text-gradient italic">over your browser</span>
              </h1>

              {/* Subtext */}
              <p className="mx-auto mt-8 max-w-2xl text-muted-foreground text-base sm:text-base lg:text-lg leading-relaxed">
                A Chrome extension that opens tabs, fills forms, scrolls, clicks, and interacts with
                every DOM element on any webpage. Integrates natively with Google Docs, Gmail, and Sheets.
              </p>
            </AnimatedGroup>

            {/* CTAs */}
            <AnimatedGroup
              variants={{
                container: {
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } },
                },
                item: transitionVariants.item,
              }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <LiquidButton
                  size="xl"
                  className="rounded-full px-8 text-base font-semibold text-primary w-full"
                >
                  Add to Chrome — It's Free
                  <ArrowRight className="w-4 h-4" />
                </LiquidButton>
              </a>
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground hover:text-foreground text-base rounded-xl px-6"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See how it works
              </Button>
            </AnimatedGroup>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs text-muted-foreground/50"
            >
              <span>Works with Google Chrome</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-current" />
              <span>Your data stays local</span>
              <span className="hidden sm:inline w-1 h-1 rounded-full bg-current" />
              <span>Free to install</span>
            </motion.div>
          </div>
        </div>

        {/* App mockup */}
        <AnimatedGroup
          variants={{
            container: {
              hidden: {},
              visible: { transition: { delayChildren: 0.9 } },
            },
            item: {
              hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { type: 'spring', bounce: 0.2, duration: 1.6 },
              },
            },
          }}
        >
          <motion.div
            style={{ y: mockupY, opacity: mockupOpacity }}
            className="relative mt-14 sm:mt-20 -mx-4 sm:mx-0 overflow-hidden px-2 sm:px-0"
          >
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-black/10 ring-1 ring-border">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="w-3 h-3 rounded-full bg-red-400/60" />
                <span className="w-3 h-3 rounded-full bg-green-400/60" />
                <span className="w-3 h-3 rounded-full bg-green-400/60" />
                <div className="flex-1 mx-3 h-6 rounded-md bg-muted/60 flex items-center px-3">
                  <span className="text-[10px] text-muted-foreground/50 truncate">chrome-extension://lyto-ai</span>
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="rounded-xl border border-border/30 overflow-hidden">
                <img
                  src="/lytoaidashboard.png"
                  alt="Lyto AI Dashboard"
                  className="w-full h-auto block"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </AnimatedGroup>
      </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default HeroSection;
