import { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────────────────────────────────────
   Dashboard primitives.

   These used to describe a hairline grid: opaque white `Cell`s butted together
   with `gap-px` over a grey `LINE` background, so the seams between them showed
   through as the only separation. That is a fine way to build a data table and
   the wrong way to build this screen — every panel was welded into one slab
   with a single outer radius, and nothing on it could be picked up, reordered,
   or looked at on its own.

   The panels are separate glass cards now, on a page with something behind them
   worth refracting. Two consequences worth knowing before editing:

     · A glass surface needs a background with structure. Over the flat #f4f4f5
       this page used to use, blur(26px) has nothing to blur and the card is
       indistinguishable from a white box — the whole recipe silently becomes an
       expensive no-op. `Backdrop` supplies that structure.
     · Dividers inside a card can no longer be an opaque hairline. LINE was
       rgba(9,9,11,0.08) sitting on solid white; on a translucent surface that
       same value reads as a scratch, so it has been taken down to 0.07.
   ──────────────────────────────────────────────────────────────────────────── */

/** Hairline *inside* a glass card. Deliberately weaker than the old grid seam. */
export const LINE = 'rgba(9,9,11,0.07)';
export const UP = '#16a34a';
export const DOWN = '#e11d48';

/**
 * What the glass is looking at.
 *
 * Three layers: a base tone, a Greek canvas that drifts, and a scrim over it.
 * Fixed rather than scrolled — the cards have to move across the backdrop, not
 * carry it with them, or there is no parallax and the shimmer cancels out.
 *
 * This started as luminance only, on the reasoning that the product's accent is
 * graphite and a dashboard is the last place to reintroduce a hue. Neutral
 * pools turned out to be too little to refract: blur a soft grey gradient and
 * you get the same soft grey gradient. The colour that is here is the painting's
 * own, held at half strength — it is being amplified by the pane's
 * saturate(200%), not competing with the interface on its own account.
 */
export const Backdrop = () => (
  <>
    {/* Base tone under the painting, and the thing that is doing the work if the
        image ever fails to load: the cards are ~68% white, so against a
        near-white page there is nothing for them to be lighter *than* and the
        material collapses into plain white boxes. */}
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#dedee3]" />

    {/* Waterhouse, *Ulysses and the Sirens* — the site's own Greek furniture,
        and picked over the marble bust for a reason that is mechanical rather
        than thematic: what glass refracts is *edges*. The bust is a smooth form
        on a smooth grey ground, and 26px of blur turns it into a flat smudge
        that could be any grey. This canvas is rigging, oars, a mast and a
        sail — a field of hard diagonals at several scales, so the surface has
        something to break up at every card size.

        It drifts. A still image behind glass is just a texture; the shimmer is
        the parallax between a moving backdrop and a stationary pane, and it
        costs one transform. Deliberately slow and deliberately large: fast
        enough to notice is fast enough to annoy on a screen someone reads
        numbers off.

        A CSS animation, not JS — Chrome throttles rather than freezes these in
        a background tab, so the scene never stops with the light parked in a
        corner. (Same reasoning as `jobs-drift` in index.css.) */}
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src="/odyssey.jpg"
        alt=""
        className="dash-drift absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: '50% 42%',
          /* Not grayscale(1). The glass recipe leans on saturate(200%), and
             pulling 200% of nothing is still nothing — some colour has to
             survive for the pane to have anything to amplify. Half-desaturated
             keeps the blues and the red sail present as hue without the canvas
             reading as a full-colour photograph behind a work screen. */
          filter: 'grayscale(0.5) contrast(1.08) brightness(1.04)',
        }}
      />
    </div>

    {/* Legibility scrim. Not a flat wash — it has to be heavy in one band and
        light everywhere else, and getting that backwards is what made the first
        version wrong.

        The only copy sitting directly on the painting is the masthead:
        "Welcome back" and the plan line. Everything below it is on a card with
        its own 68% white. So the veil peaks across the masthead's band and
        thins above and below it.

        Above it especially. The first attempt ran 0.94 at the very top, which
        is exactly where the header bar sits — so the one element with the most
        movement behind it had nothing behind it at all, and .lg-glass rendered
        as a flat opaque strip. A glass bar over a 94% veil is just a bar. It
        opens at 0.50 now: the header's own fill carries its legibility, and
        what it gains is a canvas to refract.

        Percentages are of the viewport, and the layer is fixed, so the heavy
        band stays put on screen rather than tracking the masthead up the page.
        That is deliberate — it means the top of the screen is always the
        legible part, whatever is scrolled under it. */}
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'linear-gradient(to bottom,' +
          ' rgba(244,244,247,0.50) 0%,' +
          ' rgba(244,244,247,0.56) 6%,' +
          ' rgba(244,244,247,0.86) 15%,' +
          ' rgba(244,244,247,0.74) 28%,' +
          ' rgba(244,244,247,0.61) 52%,' +
          ' rgba(244,244,247,0.58) 100%)',
      }}
    />

  </>
);

/**
 * The dashboard chrome, on the same move the marketing navbar makes: full-bleed
 * and edge-to-edge at rest, condensing into an inset floating pane once the page
 * is scrolled. Same 300ms, so the two do not feel like different products.
 *
 * It is worth being clear about what the animation is *for* here, because it is
 * not decoration. At the top of the page the bar has the masthead under it and
 * nothing else, so a full-width pane is the honest shape. Once cards start
 * passing beneath it the bar becomes the only surface on screen with something
 * moving behind it — which is the one condition under which glass actually
 * reads. Pulling it in off the edges is what puts the backdrop on both sides of
 * it and turns it from a header into a pane.
 *
 * Threshold, not a scroll-linked value: a bar whose radius tracks scrollTop
 * continuously repaints a backdrop-filter every frame, and there are already
 * nine of those on this page.
 */
export const DashboardHeader = ({ children }: { children: ReactNode }) => {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const el = document.scrollingElement ?? document.documentElement;
    // 12px rather than 0: a trackpad's rubber-band overscroll sits a pixel or
    // two off the top and would otherwise flip the bar back and forth.
    const onScroll = () => setCondensed(el.scrollTop > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        condensed ? 'px-3 pt-3 sm:px-4' : 'px-0 pt-0',
      )}
    >
      <header
        className={cn(
          // Same material as the panels, not the plain surface — a header made
          // of something else is the seam you notice first. The card variant's
          // specular streak is a corner-to-corner gradient, which is a risk on
          // a bar this wide; at 56px tall it lands as a highlight sliding along
          // the top edge rather than as a wash, and the condensed state is
          // inset to max-w-5xl anyway, where it behaves exactly like a card.
          'lg-glass-card mx-auto transition-all duration-300',
          condensed
            ? 'max-w-5xl rounded-2xl shadow-[0_8px_32px_rgba(15,23,42,0.10)]'
            : 'max-w-full rounded-none border-x-0 border-t-0',
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-14 items-center justify-between transition-all duration-300',
            condensed ? 'max-w-5xl px-4' : 'max-w-[1600px] px-4 sm:px-6',
          )}
        >
          {children}
        </div>
      </header>
    </div>
  );
};

/**
 * The panel surface. One class list in one place: every card on the dashboard
 * is this, so the radius and the rim cannot drift apart panel by panel.
 *
 * `overflow-hidden` matters more than it looks — the rim is drawn by inset
 * shadows on this element, and a child with its own background (a chart, a
 * table row) will paint straight over the bottom corners without it.
 */
export const GlassCard = ({
  children, className, interactive = false, id,
}: { children: ReactNode; className?: string; interactive?: boolean; id?: string }) => (
  <div
    id={id}
    className={cn(
      'lg-glass-card relative flex min-w-0 flex-col overflow-hidden rounded-[22px]',
      interactive && 'lg-glass-hover',
      className,
    )}
  >
    {children}
  </div>
);

/** ▲ 3.1% vs last week — green when up, red when down, muted when flat. */
export const Delta = ({ pct, suffix = 'vs last week' }: { pct: number | null; suffix?: string }) => {
  if (pct === null || !Number.isFinite(pct)) {
    return <p className="mt-3 text-[13px] text-muted-foreground/60">No prior data</p>;
  }
  const flat = Math.abs(pct) < 0.05;
  const up = pct > 0;
  const color = flat ? 'rgba(9,9,11,0.45)' : up ? UP : DOWN;
  return (
    <p className="mt-3 flex items-center gap-1.5 text-[13px]">
      {!flat && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none" stroke={color} strokeWidth="1.9" aria-hidden>
          {up ? <path d="M1.5 8L6 3.5L10.5 8" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M1.5 4L6 8.5L10.5 4" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      )}
      <span style={{ color }} className="font-semibold tabular-nums">
        {flat ? 'No change' : `${Math.abs(pct).toFixed(1)}%`}
      </span>
      <span className="text-muted-foreground/70">{suffix}</span>
    </p>
  );
};

/**
 * A KPI shows either a movement (`pct` against the previous period) or, when
 * nothing meaningful can be compared, a plain `hint` — never an empty delta.
 */
export const Kpi = ({
  label, value, pct, deltaSuffix, hint,
}: {
  label: string;
  value: string;
  pct?: number | null;
  deltaSuffix?: string;
  hint?: string;
}) => (
  <GlassCard interactive className="p-5 sm:p-6">
    <p className="text-[14px] text-muted-foreground">{label}</p>
    <p className="mt-3 font-geometric text-[34px] font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-[40px]">
      {value}
    </p>
    {pct === undefined
      ? <p className="mt-3 text-[13px] text-muted-foreground/70">{hint ?? ''}</p>
      : <Delta pct={pct} suffix={deltaSuffix} />}
  </GlassCard>
);

/** The green ↗ 66.9% chip that sits beside a panel title. */
export const TrendPill = ({ pct }: { pct: number | null }) => {
  if (pct === null || !Number.isFinite(pct) || Math.abs(pct) < 0.05) return null;
  const up = pct > 0;
  const color = up ? UP : DOWN;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold tabular-nums"
      style={{ color, background: up ? 'rgba(22,163,74,0.10)' : 'rgba(225,29,72,0.10)' }}
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
        {up ? <path d="M2 8.5L5 5.5L7 7.5L10 4M10 4H7.2M10 4V6.8" strokeLinecap="round" strokeLinejoin="round" />
            : <path d="M2 3.5L5 6.5L7 4.5L10 8M10 8H7.2M10 8V5.2" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
};

export const PanelHead = ({
  title, sub, pill,
}: { title: string; sub?: string; pill?: ReactNode }) => (
  <div className="px-5 pt-5 sm:px-6 sm:pt-6">
    <div className="flex items-center gap-2.5">
      <h3 className="font-geometric text-[19px] font-semibold tracking-tight text-foreground">{title}</h3>
      {pill}
    </div>
    {sub && <p className="mt-1.5 text-[14px] leading-snug text-muted-foreground">{sub}</p>}
  </div>
);

/** Bottom-anchored link, e.g. "View all →". */
export const PanelLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <a
    href={to}
    className="group flex items-center justify-center gap-2 px-5 py-4 text-[14px] font-semibold text-foreground/75 transition-colors hover:bg-white/40 hover:text-foreground"
  >
    {children}
    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
  </a>
);
