import { Button } from '@/components/ui/button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Launch banger — a diagonal marker-circled note hanging off the SIDE of the
 * headline, like something scribbled over the layout. Flies out sideways from
 * under the title, lands tilted; the marker stroke then draws itself twice.
 * On mobile it falls back to a centered tilted note below the headline.
 */
const LaunchBanner = () => (
  <motion.div
    initial={{ x: 120, y: 60, opacity: 0, rotate: 2 }}
    animate={{ x: 0, y: 0, opacity: 1, rotate: -9 }}
    transition={{ type: 'spring', bounce: 0.4, duration: 1.15, delay: 1.0 }}
    className="z-0 mt-6 flex justify-center lg:mt-0 lg:block lg:absolute lg:-left-16 xl:-left-28 lg:-top-16"
  >
    <Link
      to="/cli"
      className="group relative inline-block px-8 py-4 transition-transform duration-300 hover:rotate-[3deg] hover:scale-[1.05]"
    >
      <span className="relative z-10 font-serif text-lg sm:text-[21px] tracking-tight text-foreground whitespace-nowrap">
        The Lyto <span className="italic text-primary">CLI</span> is out
        <ArrowRight className="inline-block w-[17px] h-[17px] ml-2 -mt-1 text-primary transition-transform duration-300 group-hover:translate-x-1.5" />
      </span>

      {/* hand-drawn marker circle — two passes, drawn on arrival */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 320 64"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <motion.path
          d="M28,32 C22,13 92,4 162,4.5 C248,5 305,12 306,29 C307,47 244,59 152,59 C70,59 16,50 15,34 C14.4,22 42,13.5 74,10"
          stroke="hsl(24 95% 50%)"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.9 }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, delay: 1.7, ease: 'easeInOut' }}
        />
        {/* second, looser pass — the impatient double stroke */}
        <motion.path
          d="M36,10 C110,1 250,2 296,18 C316,26 312,44 268,54 C200,66 60,64 24,46 C8,38 14,24 44,15"
          stroke="hsl(24 95% 50%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ opacity: 0.45 }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 2.45, ease: 'easeInOut' }}
        />
      </svg>
    </Link>
  </motion.div>
);

const transitionVariants: { container: Variants; item: Variants } = {
  container: {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
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
      {/* Ethereal shadow */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity: bgOpacity }}>
        <EtherealShadow
          color="rgba(249, 115, 22, 1)"
          noise={{ opacity: 0.5, scale: 1.2 }}
          sizing="fill"
        />
      </motion.div>
      {/* Content */}
      <motion.div style={{ y: textY }} className="relative z-10 pt-28 pb-6 sm:pt-36 sm:pb-8 px-4 sm:px-6 pointer-events-auto">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <AnimatedGroup variants={transitionVariants}>
              {/* Headline + diagonal launch note hanging off its side */}
              <div className="relative max-w-4xl mx-auto">
                <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.15] tracking-tight text-foreground">
                  AI that sees your screen
                  <br />
                  <span className="text-gradient italic">and gets things done</span>
                </h1>
                <LaunchBanner />
              </div>

              {/* Subtext */}
              <p className="mx-auto mt-8 max-w-2xl text-muted-foreground text-base sm:text-base lg:text-lg leading-relaxed">
                Lyto watches your browser, understands what's on screen, and automates the work —
                clicking, filling, researching, and writing so you don't have to.
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
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
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
                  decoding="async"
                  style={{ imageRendering: 'crisp-edges' }}
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
