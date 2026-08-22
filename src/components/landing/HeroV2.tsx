import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExtensionShowcase } from '@/components/ExtensionShowcase';
import { InstallButton } from '@/components/landing/InstallButton';
import { MeanderBand } from '@/components/ui/greek-tablet';
import { ASCII_ART_POSTER } from '@/components/ui/ascii-art';

/**
 * The first screen. Its whole job is five seconds long.
 *
 * Five of eleven people who were asked left without being able to say what the
 * product was, so everything that competed with that sentence is gone: the
 * feature list, the second button, the dashboard screenshot. What is left is one
 * sentence, one button, and the thing itself working.
 *
 * The dressing is not decoration for its own sake. Argos is Argos Panoptes, the
 * hundred-eyed watchman Hera set over Io — the one thing that could watch
 * everything at once and never sleep. That is also, precisely, the pitch: it
 * sees every tab you have open. So the eyes are a texture, the myth is one line
 * of small caps, and neither of them has to be explained to work.
 *
 * The trust line lost "Your data stays local". It was not true — page context is
 * sent to the model, and the Chrome Web Store listing declares exactly that — and
 * a claim anyone can check in one tab is the worst kind to get wrong.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** No entrance for a tab nobody is looking at: Chrome freezes rAF in the
 *  background and the page would sit at opacity 0 until it is focused. */
const enter = (delay: number) =>
  typeof document !== 'undefined' && document.hidden
    ? {}
    : {
        initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        transition: { duration: 0.7, delay, ease: EASE },
      };

export default function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  // The stage drifts up and dims as the page moves — depth, not decoration: it is
  // what makes the screen read as a stage with something on it rather than a card.
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden pb-16 pt-24 sm:pb-20 sm:pt-28">
      {/* ── backdrop ─────────────────────────────────────────────────── */}
      {/* z-0, not -z-10: the page wrapper paints an opaque background, and a
          negative-z child of a section inside it renders BEHIND that background —
          which is why the photograph and the grid were invisible for two rounds. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* The rider approaching the fortress — the site's own image, and the one
            that was here before. A Waterhouse hung here for an afternoon and lost:
            at hero scale it crops down to rigging and elbows, while this reads as a
            whole picture at any crop. */}
        <motion.img
          src={ASCII_ART_POSTER}
          alt=""
          // A band, not a full-height backdrop: the source is 960×538, and stretched
          // over a hero twice as tall as it is wide, object-cover shows a third of its
          // width — clouds, no rider, no fortress. Constrained to roughly the painting's
          // own proportions, the whole scene is in frame.
          style={{ y: artY, objectPosition: '50% 42%', filter: 'grayscale(1) contrast(1.06)' }}
          className="absolute inset-x-0 top-0 h-[640px] w-full object-cover opacity-[0.62]"
        />
        <div
          className="absolute inset-x-0 top-[420px] h-64"
          style={{ background: 'linear-gradient(to bottom, transparent, hsl(var(--background)) 85%)' }}
        />
        {/* graph-paper grid, fading out before it reaches the copy */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)/0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.05) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage: 'radial-gradient(120% 80% at 50% 0%, black 25%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(120% 80% at 50% 0%, black 25%, transparent 72%)',
          }}
        />
        {/* Legibility scrim. Centre-weighted, because the copy is centred — a flat
            low opacity washes the photograph out instead of holding the text. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(56% 30% at 50% 20%, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.68) 45%, hsl(var(--background) / 0.25) 78%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64"
          style={{ background: 'linear-gradient(to top, hsl(var(--background)) 12%, transparent)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5">
        {/* ── the sentence ───────────────────────────────────────────── */}
        <motion.h1
          {...enter(0.05)}
          className="mx-auto max-w-4xl text-balance text-center font-geometric text-[1.7rem] leading-[1.14] tracking-tight sm:text-[2.9rem] lg:text-[3.4rem] lg:leading-[1.1]"
        >
          You ask in plain words.
          <br />
          <span className="text-foreground/45">Argos does the work </span>
          {/* Forced break: unbroken, the italic tail spills across two lines and the
              sentence stops reading as two beats. */}
          <br className="hidden sm:inline" />
          {/* Plain italic below sm on purpose. The gradient is painted with
              background-clip:text, and what an italic puts outside its line box is
              not overflow but unpainted — on a phone the tail came out sliced. */}
          <span className="italic text-foreground sm:text-gradient sm:pb-[0.12em] sm:pr-[0.08em]">on the page you're already on</span>
          <span className="text-foreground/45">.</span>
        </motion.h1>

        <motion.p
          {...enter(0.18)}
          className="mx-auto mt-5 max-w-xl text-center text-[15px] leading-relaxed text-muted-foreground sm:text-base"
        >
          And it doesn't stop when you close the tab. It keeps going in the cloud, on your own
          computer, or from your phone.
        </motion.p>

        {/* ── the button ─────────────────────────────────────────────── */}
        <motion.div {...enter(0.3)} className="mt-8">
          <InstallButton />
        </motion.div>

        <motion.div
          {...enter(0.42)}
          className="mt-6 flex flex-col items-center justify-center gap-2 text-[12.5px] text-muted-foreground/80 sm:flex-row sm:gap-5"
        >
          <span>Works in Chrome</span>
          <span className="hidden h-1 w-1 rounded-full bg-current sm:inline-block" />
          <span>Free to install, no card</span>
          <span className="hidden h-1 w-1 rounded-full bg-current sm:inline-block" />
          {/* True of the extension itself: fill_input refuses password and card
              fields outright (pageActions.ts), so this is a guarantee in code. */}
          <span>Never fills passwords or card numbers</span>
        </motion.div>

        {/* ── the thing itself, working ──────────────────────────────── */}
        <motion.div {...enter(0.55)} style={{ y: stageY }} className="relative mx-auto mt-12 max-w-5xl sm:mt-16">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-[1] h-[80%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-[40px] bg-foreground/[0.16] blur-[90px]"
          />
          <div className="lg-glass rounded-[22px] p-2 shadow-[0_50px_100px_-35px_rgba(0,0,0,0.45)] sm:p-2.5">
            <div className="mb-2 flex items-center gap-1.5 px-1.5 pt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <div className="mx-3 flex h-6 flex-1 items-center rounded-md bg-black/[0.04] px-3">
                <span className="truncate text-[10px] text-muted-foreground/60">
                  sheets.example.com/q3-revenue
                </span>
              </div>
            </div>
            <ExtensionShowcase showCopy={false} />
          </div>
          <p className="mt-4 text-center text-[12px] text-muted-foreground/70">
            Plays by itself. This is the panel doing the work, not a slideshow of screenshots.
          </p>
        </motion.div>
      </div>

      <MeanderBand className="relative z-10 mt-16 w-full opacity-30 sm:mt-20" color="#8a6d3b" />
    </section>
  );
}
