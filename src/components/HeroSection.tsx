import { Button } from '@/components/ui/button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { ASCII_ART_POSTER } from '@/components/ui/ascii-art';
import { AnnouncementBanner } from '@/components/ui/upgrade-banner';
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
          color="rgba(0, 0, 0, 1)"
          noise={{ opacity: 0.5, scale: 1.2 }}
          sizing="fill"
        />
      </motion.div>
      {/* Backdrop art — a lone rider approaching a fortress at sunset, grayscaled
          to fit the theme. Constrained to the viewport height (not the full,
          content-driven section height) — otherwise cover-scale zooms in hard
          enough to push the rider hundreds of pixels below the visible fold.
          Positioned past the solid-black cliff edge so the rider silhouette
          stays in frame instead of a flat dark block. Kept strong enough to
          actually read as a photo — a center-weighted white vignette (not a
          flat low opacity) is what keeps the text legible. */}
      <div className="absolute inset-x-0 top-0 h-[100svh] z-[1] pointer-events-none overflow-hidden">
        <img
          src={ASCII_ART_POSTER}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-[0.55] dark:opacity-[0.28]"
          style={{ objectPosition: '32% 50%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 42%, hsl(var(--background) / 0.92) 0%, hsl(var(--background) / 0.55) 45%, transparent 75%)',
          }}
        />
      </div>
      {/* Content */}
      <motion.div style={{ y: textY }} className="relative z-10 pt-28 pb-6 sm:pt-36 sm:pb-8 px-4 sm:px-6 pointer-events-auto">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <AnimatedGroup variants={transitionVariants}>
              {/* Badge — leads with the strongest true objection-killer (free, no card) and nudges toward pricing */}
              <AnnouncementBanner
                buttonText="Start free"
                description="no credit card required"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="mb-6"
              />

              {/* Headline — first line fades top-to-bottom for depth, second line keeps the brand gradient */}
              <div className="relative max-w-4xl mx-auto">
                <h1 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.15] tracking-tight">
                  <span className="bg-gradient-to-b from-foreground via-foreground to-foreground/55 bg-clip-text text-transparent">
                    The AI that acts
                  </span>
                  <br />
                  <span className="text-gradient italic">as you, not just for you</span>
                </h1>
              </div>

              {/* Subtext */}
              <p className="mx-auto mt-8 max-w-2xl text-muted-foreground text-base sm:text-base lg:text-lg leading-relaxed">
                Most AI just tells you what to do. Argos actually does it: clicking, typing,
                filling out forms, and finishing tasks right inside your browser, using your own logged-in accounts.
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
                  Add to Chrome · It's Free
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
      </motion.div>

      {/* App mockup */}
      <motion.div
        style={{ y: mockupY, opacity: mockupOpacity }}
        className="relative mt-14 sm:mt-20 -mx-4 sm:mx-0 overflow-hidden px-2 sm:px-0"
      >
        {/* Soft glow spotlighting the mockup — CSS only, no external asset */}
        <div
              className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/10 blur-[100px]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-border bg-card p-3 shadow-2xl shadow-black/10 ring-1 ring-border">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="w-3 h-3 rounded-full bg-red-400/60" />
                <span className="w-3 h-3 rounded-full bg-green-400/60" />
                <span className="w-3 h-3 rounded-full bg-green-400/60" />
                <div className="flex-1 mx-3 h-6 rounded-md bg-muted/60 flex items-center px-3">
                  <span className="text-[10px] text-muted-foreground/50 truncate">chrome-extension://argos</span>
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="rounded-xl border border-border/30 overflow-hidden">
                {/* 1768×1480 capture, shown as a 3:2 slice from the top — the
                    intrinsic size is kept so it stays sharp on retina. */}
                <img
                  src="/newdash.png"
                  alt="The Argos dashboard: weekly request volume, daily activity and usage charts, and a feed of recent agent tasks"
                  width={1768}
                  height={1480}
                  className="block w-full"
                  style={{ aspectRatio: '1768 / 1480', objectFit: 'contain', objectPosition: 'center', filter: 'grayscale(100%)' }}
                  loading="eager"
                  decoding="async"
                  // @ts-expect-error — valid HTML attribute, not yet in React's types
                  fetchpriority="high"
                />
              </div>
            </div>
        </motion.div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default HeroSection;
