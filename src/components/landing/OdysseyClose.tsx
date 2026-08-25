import { MythLine } from '@/components/landing/Myth';
import { MeanderBand } from '@/components/ui/greek-tablet';
import { reveal } from '@/lib/reveal';
import { motion } from 'framer-motion';

/**
 * Where the name comes from, once, in the one place it is an argument rather
 * than trivia: Argos is the dog in the Odyssey who waited twenty years and
 * knew Odysseus at the door when nobody else did.
 *
 * Split out of MemoryBand on purpose, so the emotional beat and the "how it
 * works" beat stop competing for the same breath. It still runs directly under
 * the band and shares its black, but as its own quiet panel rather than a
 * footnote tacked onto the end of memory.
 */
export default function OdysseyClose() {
  return (
    <section data-surface="dark" className="relative overflow-hidden bg-neutral-950 py-20 text-white sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(60% 60% at 50% 40%, rgba(255,255,255,0.08), transparent 70%)' }}
      />
      {/* Only the bottom edge fades. MemoryBand sits directly above and is the
          same black, so a top fade to --background drew a white seam across the
          join instead of softening anything. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: 'linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)' }}
      />

      <motion.div {...reveal(0, 18)} className="relative mx-auto max-w-2xl px-5 text-center">
        <MythLine tone="light">Book XVII</MythLine>
        <p className="mx-auto mt-5 max-w-lg text-center text-[13.5px] leading-relaxed text-white/45">
          Argos is the dog in the Odyssey. Twenty years, and he is the only one who knows
          Odysseus at the door — not the servants, not the wife, not the son.
          <span className="text-white/70"> The name was never about fetching.</span>
        </p>
        <MeanderBand className="mx-auto mt-7 w-40 opacity-25" color="#ffffff" />
      </motion.div>
    </section>
  );
}
