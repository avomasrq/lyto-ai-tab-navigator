"use client"

import { useState } from "react"
import angelaAvatar from "@/assets/testimonial-angela.jpg"

const testimonials = [
  {
    quote: "I've been using Lyto for 3 days since launch and it already made my writing much faster. Research used to take almost as long as writing, but Lyto cut my research time by more than half.",
    name: "Angela Wu",
    role: "Philosopher",
    image: angelaAvatar,
  },
  {
    quote: "The tab management alone is worth it. But the real-time insights while I work? Absolute game changer.",
    name: "Marcus Johnson",
    role: "Engineer at Vercel",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "Finally an AI that works with my browser instead of replacing it. The attention to detail is unmatched.",
    name: "Elena Rodriguez",
    role: "Founder at Craft",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
]

export function TestimonialsMinimal() {
  const [active, setActive] = useState(0)

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-8 sm:py-16">
      {/* Quote */}
      <div className="relative min-h-[260px] sm:min-h-[120px] mb-16">
        {testimonials.map((t, i) => (
          <p
            key={i}
            className={`
              absolute inset-0 text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-foreground
              transition-all duration-500 ease-out
              ${
                active === i
                  ? "opacity-100 translate-y-0 blur-none"
                  : "opacity-0 translate-y-4 blur-sm pointer-events-none"
              }
            `}
          >
            &ldquo;{t.quote}&rdquo;
          </p>
        ))}
      </div>

      {/* Author Row — stacks vertically on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4">
          {/* Avatars */}
          <div className="flex -space-x-2.5 flex-shrink-0">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`
                  relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-background
                  transition-all duration-300 ease-out focus:outline-none
                  ${active === i ? "z-10 scale-110" : "grayscale hover:grayscale-0 hover:scale-105"}
                `}
                style={{ zIndex: active === i ? 10 : testimonials.length - i }}
                aria-label={t.name}
              >
                <img
                  src={typeof t.image === "string" ? t.image : t.image as unknown as string}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-border flex-shrink-0" />

          {/* Active Author Info */}
          <div className="relative flex-1 min-h-[44px]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`
                  absolute inset-0 flex flex-col justify-center
                  transition-all duration-300 ease-out
                  ${active === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
                `}
              >
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{t.name}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{t.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
