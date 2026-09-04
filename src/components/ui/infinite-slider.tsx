"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";

interface InfiniteSliderProps {
  children: ReactNode;
  className?: string;
  direction?: "horizontal" | "vertical";
  /** Seconds for one full loop */
  speed?: number;
  /** Seconds for one full loop while hovered, omit to keep it constant */
  speedOnHover?: number;
  reverse?: boolean;
  gap?: number;
}

/**
 * Seamless marquee: the children are rendered twice back to back, then the
 * track is animated by exactly -50% of its own size, since that's precisely
 * the length of one (un-duplicated) copy, the loop point is invisible.
 */
export function InfiniteSlider({
  children,
  className,
  direction = "horizontal",
  speed = 30,
  speedOnHover,
  reverse = false,
  gap = 16,
}: InfiniteSliderProps) {
  const [hovering, setHovering] = useState(false);
  const duration = hovering && speedOnHover ? speedOnHover : speed;
  const axis = direction === "vertical" ? "y" : "x";
  // Forward: 0 → -50% (repeat snaps back to 0, identical to -50% since the
  // track is duplicated). Reverse needs the mirror image of that, not just
  // the opposite target, starting at 0 and animating to +50% reveals blank
  // space above/left of the track, which doesn't exist. Instead start
  // pre-offset at -50% and animate back to 0, so it's always cycling
  // through the two duplicated copies.
  const initial = reverse ? "-50%" : "0%";
  const target = reverse ? "0%" : "-50%";

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        className={cn("flex w-max", direction === "vertical" && "flex-col")}
        style={{ gap }}
        initial={{ [axis]: initial }}
        animate={{ [axis]: target }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className={cn("flex shrink-0", direction === "vertical" ? "flex-col" : "flex-row")}
            style={{ gap }}
            aria-hidden={copy === 1}
          >
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
