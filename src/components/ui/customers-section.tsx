import React from 'react';
import { DrawnLabel } from '@/components/ui/drawn-label';

export interface CustomerLogo {
  src?: string;
  alt: string;
  height?: number;
  text?: string;
  circular?: boolean;
}

interface CustomersSectionProps {
  customers: CustomerLogo[];
  label?: string;
  className?: string;
}

export function CustomersSection({
  customers = [],
  label = 'Trusted by teams at',
  className,
}: CustomersSectionProps) {
  return (
    <section className={`py-10 px-6 ${className ?? ''}`}>
      <DrawnLabel
        className="mx-auto mb-8 text-muted-foreground/60"
        fallbackClassName="text-center text-muted-foreground/60 mb-8"
      >
        {label}
      </DrawnLabel>
      <div className="flex items-center justify-center gap-10 flex-wrap">
        {customers.map((logo, i) =>
          logo.src ? (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: logo.height ?? 36,
                width: logo.circular ? logo.height ?? 36 : undefined,
              }}
              className={`object-cover opacity-70 hover:opacity-100 transition-opacity duration-200 ${
                logo.circular
                  ? 'rounded-full'
                  : 'w-auto [mix-blend-mode:multiply] dark:[mix-blend-mode:screen]'
              }`}
            />
          ) : (
            <span
              key={i}
              className="text-base font-semibold tracking-tight text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 select-none"
            >
              {logo.text ?? logo.alt}
            </span>
          )
        )}
      </div>
    </section>
  );
}
