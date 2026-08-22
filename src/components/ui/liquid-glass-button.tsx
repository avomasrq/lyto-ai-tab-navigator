import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none select-none",
  {
    variants: {
      variant: {
        default: "text-foreground",
        light:   "text-white",
      },
      size: {
        sm:      "h-8  px-4 text-xs",
        default: "h-10 px-6",
        lg:      "h-11 px-7",
        xl:      "h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  /*
   * All decorative layers live on the wrapper <div>, NOT inside Comp.
   * This means Slot always receives exactly one child (the <a> / <Link>),
   * satisfying React.Children.only and avoiding the crash.
   */
  return (
    <div className={cn(
      "relative inline-flex rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]",
      className
    )}>
      {/* Glass backdrop */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden -z-10 pointer-events-none"
        style={{ backdropFilter: 'blur(10px) saturate(1.5)' }}
      />

      {/* Glass shadow ring — works on any background colour */}
      <div className="absolute inset-0 rounded-full pointer-events-none
        bg-white/20
        shadow-[
          0_0_0_1px_rgba(255,255,255,0.50),
          0_2px_8px_rgba(0,0,0,0.12),
          inset_0_1px_0_rgba(255,255,255,0.80),
          inset_0_-1px_0_rgba(0,0,0,0.08),
          inset_2px_2px_4px_rgba(255,255,255,0.25),
          inset_-2px_-2px_4px_rgba(0,0,0,0.06)
        ]" />

      {/* Top-edge shine streak */}
      <div className="absolute top-px inset-x-6 h-px rounded-full pointer-events-none
        bg-gradient-to-r from-transparent via-white/70 to-transparent" />

      {/* The actual interactive element — only child given to Slot */}
      <Comp
        data-slot="button"
        className={cn("relative z-10", liquidbuttonVariants({ variant, size }))}
        {...props}
      >
        {children}
      </Comp>

    </div>
  )
}

export { LiquidButton, liquidbuttonVariants }

/* ────────────────────────────────────────────────────────────────────────────
 * Glass surface, for panels rather than buttons.
 *
 * The refraction comes from an SVG feTurbulence + feDisplacementMap referenced
 * through backdrop-filter. Chrome parses `backdrop-filter: url(#id)` — CSS.supports
 * returns true — but does not reliably render an SVG filter reference there, and a
 * filter list that mixes url() with blur() can drop the whole declaration when the
 * ref is ignored. So the two are deliberately NOT combined: the container carries a
 * plain blur that always works, and the displacement rides on its own layer. If the
 * ref no-ops the surface is still frosted glass, just without the ripple.
 *
 * Do not give these layers a negative z-index. Inside a container that paints its
 * own background they disappear behind it — the same trap the navbar pill hit.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Inner bevel + drop shadow that reads as a thick pane of glass.
 *
 * An inline style, not a shadow-[...] class. Tailwind only emits arbitrary
 * values it can read as complete literal strings in the source, so a class name
 * assembled by concatenation is never generated — measured: the layer came back
 * with boxShadow: none and the panel had no bevel at all.
 */
export const GLASS_EDGE: React.CSSProperties = {
  boxShadow: [
    '0 2px 6px rgba(0,0,0,0.08)',
    '0 8px 32px rgba(0,0,0,0.14)',
    'inset 3px 3px 0.5px -3px rgba(255,255,255,0.9)',
    'inset -3px -3px 0.5px -3px rgba(255,255,255,0.85)',
    'inset 1px 1px 1px -0.5px rgba(255,255,255,0.7)',
    'inset -1px -1px 1px -0.5px rgba(255,255,255,0.5)',
    'inset 0 0 6px 6px rgba(255,255,255,0.10)',
    'inset 0 0 2px 2px rgba(255,255,255,0.06)',
  ].join(', '),
};

/**
 * Decorative layers for any *relatively positioned* rounded container.
 * Render it as the first child; give the real content `relative z-10`.
 */
export function LiquidGlassSurface({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden
        className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
        style={{ backdropFilter: 'url("#container-glass")' }}
      />
      <div aria-hidden className={cn('pointer-events-none absolute inset-0', className)} style={GLASS_EDGE} />
      {/* the lit top edge of a real pane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-px h-px bg-gradient-to-r from-transparent via-white/85 to-transparent"
      />
      <GlassFilter />
    </>
  );
}

/** The turbulence/displacement filter itself. Safe to mount more than once. */
export function GlassFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
