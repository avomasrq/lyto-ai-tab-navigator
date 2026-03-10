"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import jessicaAvatar from "@/assets/testimonial-jessica.jpeg"

const testimonials = [
  {
    id: 1,
    quote: "I've been using Lyto for 3 days — the exact amount of time it has been launched — and it's made my writing so much quicker and more convenient! As a full-time student with many extracurriculars, work, and academics to do every day, my time to write has been limited. The research portion in writing genuinely takes up almost the time spent actually writing, but Lyto made finding important information and gathering it across different websites so much easier... My research time definitely got reduced by more than half! 100000% recommend",
    author: "Angela Wu",
    role: "Philosopher",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
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
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      {/* Quote Container */}
      <div className="relative text-center px-8">
        <span className="absolute -top-4 -left-2 text-6xl font-serif text-muted-foreground/30 select-none">
          &ldquo;
        </span>

        <p
          className={cn(
            "text-xl sm:text-2xl md:text-3xl font-serif text-foreground leading-relaxed transition-all duration-400",
            isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}
        >
          {displayedQuote}
        </p>

        <span className="absolute -bottom-8 -right-2 text-6xl font-serif text-muted-foreground/30 select-none">
          &rdquo;
        </span>
      </div>

      <div className="flex flex-col items-center gap-6 mt-4">
        {/* Role text */}
        <p
          className={cn(
            "text-sm text-muted-foreground transition-all duration-400",
            isAnimating ? "opacity-0" : "opacity-100"
          )}
        >
          {displayedRole}
        </p>

        {/* Avatar pills */}
        <div className="flex items-center gap-2">
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
                  "relative flex items-center gap-0 rounded-full cursor-pointer",
                  "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                  isActive ? "bg-foreground shadow-lg" : "bg-transparent hover:bg-muted/80",
                  showName ? "pr-4 pl-2 py-2" : "p-0.5"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "relative rounded-full overflow-hidden transition-all duration-500",
                    isActive ? "size-8" : "size-10",
                    !isActive && "ring-2 ring-border"
                  )}
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="size-full object-cover"
                  />
                </div>

                {/* Name label */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    showName ? "max-w-[200px] opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium whitespace-nowrap",
                      isActive ? "text-background" : "text-foreground"
                    )}
                  >
                    {testimonial.author}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
