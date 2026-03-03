"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  className?: string;
  style?: React.CSSProperties;
  avatar?: string;
  username?: string;
  handle?: string;
  content?: string;
  date?: string;
  verified?: boolean;
  likes?: number;
  retweets?: number;
  tweetUrl?: string;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  onTap?: () => void;
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg className="size-4 text-[#1d9bf0]" viewBox="0 0 22 22" fill="currentColor">
      <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
    </svg>
  );
}

function TestimonialCard({
  className,
  style,
  avatar,
  username = "PEPE",
  handle = "@PEPE_bigbrother",
  content = "This is amazing! 🔥 Absolutely loving what the team is building here. Can't wait to see what comes next!",
  date = "Jan 5, 2026",
  verified = true,
  likes = 142,
  retweets = 23,
  tweetUrl,
  onHover,
  onLeave,
  isActive,
  onTap,
}: TestimonialCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      if (!isActive) {
        e.preventDefault();
        onTap?.();
      }
    }
  };

  return (
    <a
      href={tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-md transition-all duration-500 ease-out cursor-pointer w-[280px] sm:w-[350px]",
        className
      )}
      style={style}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={username} className="size-full object-cover" />
            ) : (
              <span className="text-lg">🐸</span>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{username}</span>
              {verified && <VerifiedBadge />}
            </div>
            <span className="text-xs text-muted-foreground">{handle}</span>
          </div>
        </div>
        <TwitterIcon className="size-5 text-muted-foreground" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-foreground leading-relaxed">{content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
        <span>{date}</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
            {retweets}
          </span>
        </div>
      </div>
    </a>
  );
}

interface TestimonialsProps {
  cards?: TestimonialCardProps[];
}

export default function Testimonials({ cards }: TestimonialsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getOverrideStyle = (index: number): React.CSSProperties | undefined => {
    const focusedIndex = hoveredIndex ?? activeIndex;
    if (focusedIndex === null || index <= focusedIndex) return undefined;

    const offset = index - focusedIndex;
    const y = 5 + offset * 3;
    const x = 3.5 + offset * 2.5;
    return { transform: `translateX(${x}rem) translateY(${y}rem)` };
  };

  const handleTap = (index: number) => {
    if (activeIndex === index) return;
    setActiveIndex(index);
  };

  const defaultCards: TestimonialCardProps[] = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      username: "Sarah Chen",
      handle: "@sarahchen",
      content: "Lyto AI just saved me 2 hours of research. It pulled together everything I needed without me even asking. This is the future of browsing. 🚀",
      date: "Feb 18, 2026",
      verified: true,
      likes: 214,
      retweets: 47,
      tweetUrl: "https://x.com",
    },
    {
      className:
        "[grid-area:stack] translate-x-8 sm:translate-x-16 translate-y-6 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      username: "Mike Johnson",
      handle: "@mikej_dev",
      content: "The tab management alone is worth it. But the real-time price comparison while I shop? Absolute game changer. Never going back. 💯",
      date: "Feb 12, 2026",
      verified: true,
      likes: 183,
      retweets: 31,
      tweetUrl: "https://x.com",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 sm:translate-x-32 translate-y-12 sm:translate-y-20 hover:translate-y-6 sm:hover:translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      username: "Alex Rivera",
      handle: "@alexrivera",
      content: "I was skeptical about another AI tool, but Lyto genuinely understands context. It knew I was comparing flights and just... helped. Quietly. Brilliantly. ✈️",
      date: "Feb 5, 2026",
      verified: true,
      likes: 156,
      retweets: 23,
      tweetUrl: "https://x.com",
    },
    {
      className:
        "[grid-area:stack] translate-x-24 sm:translate-x-48 translate-y-18 sm:translate-y-30 hover:translate-y-12 sm:hover:translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      username: "Priya Sharma",
      handle: "@priyabuilds",
      content: "Finally an AI that works WITH my browser instead of replacing it. The research sessions feature is insane for content creation. 🔥",
      date: "Jan 28, 2026",
      verified: true,
      likes: 97,
      retweets: 18,
      tweetUrl: "https://x.com",
    },
    {
      className:
        "[grid-area:stack] translate-x-32 sm:translate-x-64 translate-y-24 sm:translate-y-40 hover:translate-y-18 sm:hover:translate-y-30",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
      username: "Jordan Lee",
      handle: "@jordanlee_",
      content: "My workflow before Lyto: 12 tabs, 3 tools, 45 minutes. After Lyto: one tab, one extension, 10 minutes. Not even exaggerating. 🧠",
      date: "Jan 20, 2026",
      verified: true,
      likes: 342,
      retweets: 58,
      tweetUrl: "https://x.com",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayCards.map((cardProps, index) => (
        <TestimonialCard
          key={index}
          {...cardProps}
          style={getOverrideStyle(index)}
          onHover={() => setHoveredIndex(index)}
          onLeave={() => setHoveredIndex(null)}
          isActive={activeIndex === index}
          onTap={() => handleTap(index)}
        />
      ))}
    </div>
  );
}

function Component() {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <Testimonials />
    </div>
  );
}

export { TestimonialCard, Testimonials, Component };
export type { TestimonialCardProps, TestimonialsProps };
