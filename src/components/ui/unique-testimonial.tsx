"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import jessicaAvatar from "@/assets/testimonial-jessica.jpeg"
import angelaAvatar from "@/assets/testimonial-angela.jpg"

const testimonials = [
  {
    id: 1,
    quote: "I've been using Lyto for 3 days since launch, and it's already made my writing much faster. Research used to take almost as long as writing, but Lyto makes finding information across websites easy and cut my research time by more than half. 100000% recommend.",
    author: "Angela Wu",
    role: "Philosopher",
    avatar: angelaAvatar,
  },
  {
    id: 2,
    quote: "The tab management alone is worth it. But the real-time insights while I work? Absolute game changer.",
    author: "Marcus Johnson",
    role: "Engineer at Vercel",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    quote: "Finally an AI that works with my browser instead of replacing it. The attention to detail is unmatched.",
    author: "Elena Rodriguez",
    role: "Founder at Craft",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    quote: "Lyto is the best extension I used for managing my workflow inside Chrome.",
    author: "Zere Mushekbayeva",
    role: "Ex-Founder, Productivity Startup",
    avatar: jessicaAvatar,
  },
]

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayedQuote, setDisplayedQuote] = useState(testimonials[0].quote)
  const [displayedRole, setDisplayedRole] = useState(testimonials[0].role)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (index === activeIndex || isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setDisplayedQuote(testimonials[index].quote)
      setDisplayedRole(testimonials[index].role)
      setActiveIndex(index)
      setTimeout(() => setIsAnimating(false), 400)
    }, 200)
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl mx-auto px-2">
      {/* Quote Container */}
      <div className="relative text-center px-4 sm:px-8">
        <span className="absolute -top-3 sm:-top-4 -left-1 sm:-left-2 text-4xl sm:text-6xl font-serif text-muted-foreground/30 select-none">
          &ldquo;
        </span>

        <p
          className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-serif text-foreground leading-relaxed"
          style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(6px)' : 'translateY(0)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            willChange: 'opacity, transform',
          }}
        >
          {displayedQuote}
        </p>

        <span className="absolute -bottom-6 sm:-bottom-8 -right-1 sm:-right-2 text-4xl sm:text-6xl font-serif text-muted-foreground/30 select-none">
          &rdquo;
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:gap-6 mt-2 sm:mt-4">
        {/* Role text */}
        <p
          className="text-xs sm:text-sm text-muted-foreground"
          style={{
            opacity: isAnimating ? 0 : 1,
            transition: 'opacity 0.35s ease',
            willChange: 'opacity',
          }}
        >
          {displayedRole}
        </p>

        {/* Avatar pills */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-center">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index
            const isHovered = hoveredIndex === index && !isActive
            const showName = isActive || isHovered

            return (
              <button
                key={testimonial.id}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "relative flex items-center rounded-full cursor-pointer",
                  "transition-colors duration-300",
                  isActive ? "bg-foreground shadow-lg" : "bg-transparent hover:bg-muted/80",
                )}
                style={{
                  padding: showName ? '6px 14px 6px 6px' : '4px',
                  gap: showName ? 8 : 0,
                  transition: 'background-color 0.3s ease, padding 0.3s ease, gap 0.3s ease, box-shadow 0.3s ease',
                  willChange: 'transform',
                }}
              >
                {/* Avatar — fixed size, no layout shift */}
                <div className="relative rounded-full overflow-hidden flex-shrink-0 size-8 sm:size-9">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="size-full object-cover"
                    style={{
                      transform: isActive ? 'scale(0.88)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                      willChange: 'transform',
                    }}
                  />
                  {!isActive && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-border pointer-events-none" />
                  )}
                </div>

                {/* Name label — fade + slide only, no width change */}
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden",
                    isActive ? "text-background" : "text-foreground"
                  )}
                  style={{
                    maxWidth: showName ? 160 : 0,
                    opacity: showName ? 1 : 0,
                    transform: showName ? 'translateX(0)' : 'translateX(-6px)',
                    transition: 'max-width 0.3s ease, opacity 0.25s ease, transform 0.25s ease',
                    willChange: 'opacity, transform',
                  }}
                >
                  {testimonial.author}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
