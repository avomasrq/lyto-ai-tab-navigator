import { motion } from 'framer-motion';
import { Globe, Laptop, Send } from 'lucide-react';
import { InstallButton } from '@/components/landing/InstallButton';
import { reveal } from '@/lib/reveal';

/**
 * The one thing the competition cannot copy by shipping a feature.
 *
 * Sider, Merlin and Monica are all one-chat-at-a-time: memory would mean an
 * account-wide store and a shared prompt path across every surface, which is an
 * architecture, not a checkbox. It is also the loudest complaint in the reviews
 * of Claude's own extension, no memory of what you were doing, explain it all
 * over again. So it gets the only inverted band on the page.
 *
 * Not a claim, either: formatMemoriesForPrompt in the backend is the single
 * formatter the panel, the Telegram/WhatsApp loop and scheduled tasks all use.
 * One store, one shape, three surfaces.
 */

const SURFACES = [
  { icon: Globe, label: 'In the browser', line: '“like the last one, but for Q3”' },
  { icon: Send, label: 'In Telegram', line: '“send it to Marat when it’s done”' },
  { icon: Laptop, label: 'On your desktop', line: '“same folder as yesterday”' },
];

const REMEMBERED = [
  'Works on Argos, ships on Fridays',
  'Prefers tables over prose',
  'Marat is the client, Aizhan is the designer',
  'Yesterday: pulled the vendor list, wanted it as .xlsx',
];

export default function MemoryBand() {
  return (
    <section data-surface="dark" className="relative overflow-hidden bg-neutral-950 py-28 text-white sm:py-36">
      {/* Herakles, 1st century CE, Met Open Access (public domain), 3000×4000.
          The first pass put a Ptolemaic queen here, serene, delicate, and comic
          next to a paragraph about not making you start over. This one is the
          right register: broken nose, heavy brow, weathered marble.
          It is shot on studio grey, not black, so the grey is masked away
          radially and the whole thing is graded down into the band. */}
      <img
        src="/marble-hercules.jpg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-4%] aspect-[3/4] w-[72%] object-cover object-[52%_22%] opacity-40 sm:right-[-2%] sm:aspect-auto sm:h-[94%] sm:w-[42%] sm:opacity-[0.88]"
        style={{
          filter: 'grayscale(1) brightness(0.82) contrast(1.18)',
          maskImage:
            'radial-gradient(closest-side at 54% 46%, black 52%, rgba(0,0,0,0.35) 78%, transparent 96%), linear-gradient(to left, black 30%, transparent 92%)',
          WebkitMaskImage:
            'radial-gradient(closest-side at 54% 46%, black 52%, rgba(0,0,0,0.35) 78%, transparent 96%), linear-gradient(to left, black 30%, transparent 92%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 50% at 38% 0%, rgba(255,255,255,0.10), transparent 70%)' }}
      />

      {/* The band used to start with a razor edge: white page, then black, in one
          pixel. The top now dissolves into the white section above it.

          There is deliberately no matching fade at the bottom: OdysseyClose is
          black too and butts directly against this, so fading to --background
          there painted a white seam between two black sections. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-36"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--background)) 0%, rgba(10,10,10,0.55) 55%, transparent 100%)' }}
      />

      <div className="relative mx-auto max-w-5xl px-5">
        <motion.h2
          {...reveal(0, 20)}
          className="mx-auto max-w-2xl text-center font-geometric text-[1.9rem] leading-tight tracking-tight sm:text-[2.6rem]"
        >
          It doesn’t make you <span className="italic text-white/55">start over</span>
        </motion.h2>

        <motion.p
          {...reveal(0, 20)}
          className="mx-auto mt-6 max-w-2xl text-center text-[15px] leading-relaxed text-white/60 sm:text-base"
        >
          Most browser assistants forget you between chats. Argos keeps one memory: your projects,
          how you like things done, what you asked yesterday. In the browser, in Telegram, on your
          desktop. <span className="text-white">You explain yourself once.</span>
        </motion.p>

        {/* Light for the glass to stand in. The panes below sit on flat
            neutral-950 and the statue is off to the right, so away from it
            there was nothing behind them at all, blur(20px) over an even black
            field returns the same even black field, and the cards read as
            rectangles. These two pools cost nothing and give the surfaces
            something to be lit by. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 h-[420px] -translate-y-1/4"
          style={{
            background:
              'radial-gradient(45% 60% at 22% 40%, rgba(255,255,255,0.055), transparent 70%),' +
              'radial-gradient(40% 55% at 62% 65%, rgba(255,255,255,0.035), transparent 72%)',
          }}
        />

        {/* three surfaces, one store */}
        <div className="relative mt-16 grid gap-4 sm:grid-cols-3">
          {SURFACES.map(({ icon: Icon, label, line }, i) => (
            <motion.div
              key={label}
              {...reveal(i * 0.08, 18)}
              className="lg-glass-dark-card rounded-2xl p-5"
            >
              <Icon className="h-4 w-4 text-white/50" />
              <div className="mt-3 text-[13px] font-medium text-white/90">{label}</div>
              <div className="mt-1.5 text-[12.5px] leading-relaxed text-white/45">{line}</div>
            </motion.div>
          ))}
        </div>

        {/* the line down into the one place all three read from */}
        <div className="relative mx-auto h-14 w-px bg-gradient-to-b from-white/5 via-white/20 to-white/20">
          <motion.span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-white"
            initial={false}
            animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: 'easeIn' }}
          />
        </div>

        <motion.div
          {...reveal(0, 18)}
          className="lg-glass-dark-card mx-auto max-w-xl rounded-2xl p-6"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            One memory
          </div>
          <ul className="mt-4 space-y-2.5">
            {REMEMBERED.map((fact) => (
              <li key={fact} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-white/80">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/50" />
                {fact}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-14 [&_a]:!bg-white [&_a]:!text-neutral-950">
          <InstallButton size="md" showSignIn={false} />
        </div>
      </div>
    </section>
  );
}
