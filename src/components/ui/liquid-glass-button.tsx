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
      {/* SVG backdrop distortion */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden -z-10 pointer-events-none"
        style={{ backdropFilter: 'blur(10px) saturate(1.5) url("#liquid-glass-filter")' }}
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

      <LiquidGlassFilter />
    </div>
  )
}

function LiquidGlassFilter() {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%" y="0%" width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.06"
            numOctaves="1" seed="3" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise"
            scale="45" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="2" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export { LiquidButton, liquidbuttonVariants }
