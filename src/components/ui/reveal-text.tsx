"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ElementType, ReactNode } from 'react';

/* RevealText — the same scrim-wipe choreography as ArgosReveal's wordmark,
   generalized to wrap any element/text. A background-colored curtain sits
   over the real text and retracts left-to-right, revealing it. Works with
   full sentences, punctuation, numbers — anything, since the text underneath
   is real DOM text, not hand-drawn glyph paths. */
export function RevealText({
  children,
  as: Tag = 'span',
  delay = 0,
  duration = 0.7,
  once = true,
  className,
  tagClassName,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  tagClassName?: string;
}) {
  return (
    <span className={cn('relative block w-full overflow-hidden', className)}>
      <Tag className={cn('block', tagClassName)}>{children}</Tag>
      <motion.span
        aria-hidden
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once, margin: '0px 0px -5% 0px' }}
        transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'left' }}
        className="absolute inset-0 bg-background"
      />
    </span>
  );
}
