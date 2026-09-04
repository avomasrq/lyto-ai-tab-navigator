"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ArgosReveal, a brand entrance moment: a twelve-ray mark spins in while a
   scrim curtain pulls back off the "Argos" wordmark underneath. Same two-part
   choreography (rotating mark + wipe-reveal wordmark) as a typical logo-reveal
   component, but built for Argos instead of reusing another brand's fixed
   letterforms. The ray mark doubles as a nod to Argos Panoptes, the
   hundred-eyed watcher, always looking, never sleeping. */

function EyeMark({ className }: { className?: string }) {
  const rays = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor" aria-hidden>
      {rays.map((_, i) => (
        <rect key={i} x="47" y="4" width="6" height="30" rx="3" transform={`rotate(${i * 30} 50 50)`} />
      ))}
    </svg>
  );
}

export function ArgosReveal({ className }: { className?: string }) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <motion.div
        initial={{ rotate: -360, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="h-7 w-7 sm:h-8 sm:w-8 text-primary shrink-0"
      >
        <EyeMark className="h-full w-full" />
      </motion.div>

      <div className="relative overflow-hidden">
        <span className="block font-geometric font-medium text-2xl sm:text-3xl tracking-tight text-foreground">
          Argos<span className="text-primary">.</span>
        </span>
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
          style={{ transformOrigin: 'left' }}
          className="absolute inset-0 bg-background"
        />
      </div>
    </div>
  );
}
