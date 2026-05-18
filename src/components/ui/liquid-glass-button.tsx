import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const liquidbuttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none select-none transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "text-foreground",
        light: "text-white",
      },
      size: {
        sm:  "h-8 px-4 text-xs",
        default: "h-10 px-6",
        lg:  "h-11 px-7",
        xl:  "h-12 px-8",
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

  return (
    <Comp
      data-slot="button"
      className={cn("relative", liquidbuttonVariants({ variant, size, className }))}
      {...props}
    >
      {/* Backdrop blur + distortion layer */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden -z-10"
        style={{ backdropFilter: 'blur(14px) saturate(1.6) brightness(1.08)' }}
      />
      {/* Glass border & sheen */}
      <div className="absolute inset-0 rounded-full
        bg-white/30
        shadow-[0_0_0_1px_rgba(255,255,255,0.55),0_2px_12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(0,0,0,0.06)]
        transition-shadow duration-200
        hover:shadow-[0_0_0_1px_rgba(255,255,255,0.7),0_4px_18px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.08)]
        pointer-events-none" />
      {/* Top highlight streak */}
      <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent rounded-full pointer-events-none" />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Comp>
  )
}

export function GlassFilter({ id = "liquid-glass-filter" }: { id?: string }) {
  return (
    <svg className="hidden" aria-hidden>
      <defs>
        <filter
          id={id}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export { LiquidButton, liquidbuttonVariants }
