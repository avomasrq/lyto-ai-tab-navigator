"use client";

import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

/* GreekTablet — a heavy "carved stone stele" card surface for the Argos theme.
   The name is the whole point: Argos is out of the Odyssey, so the product's
   boxes are dressed as inscribed limestone tablets — warm stone fill, chiselled
   inset edges, a double rule, a running meander (Greek key) frieze top and
   bottom, and square corner bosses.

   No external assets: the stone is layered CSS gradients, the frieze is an
   inline SVG background that tiles cleanly left-to-right, so it works at any
   width and in both themes. */

/* Warm limestone, lit from top-left so the inset shadow below reads as carved. */
const STONE_LIGHT =
  'linear-gradient(158deg, #f2ede1 0%, #e7dfcd 52%, #dacfb6 100%)';
const STONE_DARK =
  'linear-gradient(158deg, #2a2620 0%, #211d17 52%, #191510 100%)';

/* One meander unit, tiled via background-repeat. Authored on a 20x10 grid,
   stroke only — colour comes from the element's `color` (currentColor). */
const meanderDataUri = (hex: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='0 0 20 10'><path d='M0 1 H20 M5 1 V6 H15 V1 M5 9 V6' fill='none' stroke='${hex}' stroke-width='1.3'/></svg>`
  )}")`;

/* Reusable stone surface (fill + carved shadow) for components that can't wrap
   their content in <GreekTablet> but still want the tablet look. */
export const greekStoneStyle: CSSProperties = {
  background: STONE_LIGHT,
  boxShadow:
    'inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -4px 10px rgba(120,95,55,0.15), 0 14px 34px rgba(60,45,20,0.13)',
};

interface MeanderProps {
  className?: string;
  color?: string;
  flip?: boolean;
}

/** A horizontal Greek-key frieze band. Tiles across whatever width it's given. */
export function MeanderBand({ className, color = '#8a6d3b', flip }: MeanderProps) {
  return (
    <span
      aria-hidden
      className={cn('block h-[10px] w-full', className)}
      style={{
        backgroundImage: meanderDataUri(color),
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
        transform: flip ? 'scaleY(-1)' : undefined,
      }}
    />
  );
}

interface GreekTabletProps {
  children: ReactNode;
  className?: string;
  /** Extra classes for the inner content wrapper (padding etc.). */
  bodyClassName?: string;
  style?: CSSProperties;
  /** Softer variant: keeps the stone + carve but drops the corner bosses. */
  plainCorners?: boolean;
  id?: string;
}

export function GreekTablet({
  children,
  className,
  bodyClassName,
  style,
  plainCorners,
  id,
}: GreekTabletProps) {
  return (
    <div
      id={id}
      className={cn(
        'greek-tablet relative isolate overflow-hidden rounded-[10px] border',
        'border-[#c8bca0] dark:border-[#3c352a]',
        className
      )}
      style={{
        background: STONE_LIGHT,
        boxShadow:
          'inset 0 2px 0 rgba(255,255,255,0.65), inset 0 -4px 10px rgba(120,95,55,0.16), inset 0 0 0 1px rgba(120,95,55,0.05), 0 14px 34px rgba(60,45,20,0.14)',
        ...style,
      }}
    >
      {/* dark-theme stone fill sits under everything, revealed by the media query
          on the wrapper via a sibling so we don't need JS theme detection */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{ background: STONE_DARK }}
      />

      {/* double inscribed rule */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[7px] rounded-[6px] border border-[#a8946e]/45 dark:border-[#5a4f3c]/50"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[11px] rounded-[4px] border border-[#a8946e]/25 dark:border-[#5a4f3c]/30"
      />

      {/* meander friezes, inset just past the rules */}
      <MeanderBand
        className="pointer-events-none absolute inset-x-[16px] top-[15px] w-auto opacity-55 dark:opacity-40"
        color="#8a6d3b"
      />
      <MeanderBand
        flip
        className="pointer-events-none absolute inset-x-[16px] bottom-[15px] w-auto opacity-55 dark:opacity-40"
        color="#8a6d3b"
      />

      {/* corner bosses — small chiselled studs */}
      {!plainCorners &&
        (['left-[6px] top-[6px]', 'right-[6px] top-[6px]', 'left-[6px] bottom-[6px]', 'right-[6px] bottom-[6px]'] as const).map(
          (pos) => (
            <span
              key={pos}
              aria-hidden
              className={cn('pointer-events-none absolute h-2 w-2 rotate-45 bg-[#b09a70] dark:bg-[#6a5c44]', pos)}
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(80,60,30,0.35)' }}
            />
          )
        )}

      <div className={cn('relative z-10 px-7 py-8 sm:px-9 sm:py-10', bodyClassName)}>{children}</div>
    </div>
  );
}
