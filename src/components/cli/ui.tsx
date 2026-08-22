import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MeanderBand } from '@/components/ui/greek-tablet';
import { DrawnLabel } from '@/components/ui/drawn-label';

/**
 * The bits the CLI page and the CLI reference both draw with.
 *
 * They were one file until the reference moved to /cli/docs. Copying them would
 * have been the easy split and the wrong one: the command chips are the thing a
 * person copies into a terminal, and two implementations of "copy this exactly"
 * is how one of them quietly stops copying the `$` or starts including it.
 */

/**
 * Scroll-in for this page's cards — unless nobody is looking.
 *
 * framer-motion animates on requestAnimationFrame, and Chrome freezes that in a
 * background tab: a card whose visibility comes from `initial: opacity 0` then
 * stays invisible for as long as the tab sits unfocused. Decided once, at load,
 * because that is when the page either has an audience or does not.
 */
const unattended = typeof document !== 'undefined' && document.hidden;

export const fadeUp = unattended
  ? ({} as const)
  : ({
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-60px' },
      transition: { duration: 0.7, ease: [0.21, 0.6, 0.35, 1] },
    } as const);

/* Stone-tablet chrome — inset rule, meander friezes, corner bosses — dropped
   into an existing card as its first child. The card just needs `relative`
   and `style={greekStoneStyle}` added; this doesn't touch its layout. */
const STONE_BOSS_POS = ['left-[5px] top-[5px]', 'right-[5px] top-[5px]', 'left-[5px] bottom-[5px]', 'right-[5px] bottom-[5px]'] as const;

export function StoneDecor() {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-[6px] rounded-[10px] border border-[#a8946e]/35" />
      <MeanderBand className="pointer-events-none absolute inset-x-3 top-[8px] w-auto opacity-45" color="#8a6d3b" />
      <MeanderBand flip className="pointer-events-none absolute inset-x-3 bottom-[8px] w-auto opacity-45" color="#8a6d3b" />
      {STONE_BOSS_POS.map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={cn('pointer-events-none absolute h-[7px] w-[7px] rotate-45 bg-[#b09a70] dark:bg-[#6a5c44]', pos)}
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(80,60,30,0.3)' }}
        />
      ))}
    </>
  );
}

/**
 * A command chip you can tap to copy. Every command here is meant to be pasted
 * into a terminal, so retyping one from a screenshot-shaped block is the one
 * thing the page should never ask for. The `$` is decorative and stays out of
 * the clipboard.
 */
export const Cmd = ({ children }: { children: string }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked — the text is still selectable */ }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copied ? 'Copied' : 'Click to copy'}
      aria-label={copied ? `Copied: ${children}` : `Copy command: ${children}`}
      className="group/cmd inline-flex max-w-full items-center gap-2 rounded-lg bg-neutral-900 px-3 py-1.5 text-left font-mono text-[12px] leading-relaxed text-neutral-100 shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="min-w-0 break-all">
        <span className="select-none text-green-400">$ </span>{children}
      </span>
      {/* On a phone there is no hover to reveal the affordance, so the glyph stays put;
          pointers get it on hover only, where a permanent icon would be clutter. */}
      <span
        aria-hidden
        className={cn(
          'shrink-0 select-none text-[11px] transition-opacity',
          copied
            ? 'text-green-400 opacity-100'
            : 'text-neutral-500 opacity-70 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/cmd:opacity-100',
        )}
      >
        {copied ? '✓' : '⧉'}
      </span>
    </button>
  );
};

export const SectionHead = ({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) => (
  <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
    <DrawnLabel className="mx-auto mb-4 text-primary" fallbackClassName="text-primary mb-4">
      {eyebrow}
    </DrawnLabel>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric leading-[1.12] tracking-tight text-foreground">{title}</h2>
    {sub && <p className="mt-4 text-muted-foreground text-base leading-relaxed">{sub}</p>}
  </motion.div>
);
