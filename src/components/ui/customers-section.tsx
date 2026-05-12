import React from 'react';

export interface CustomerLogo {
  src: string;
  alt: string;
  height: number;
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
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-8">
        {label}
      </p>
      <div className="flex items-center justify-center gap-10 flex-wrap">
        {customers.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            style={{ height: logo.height }}
            className="w-auto object-contain [mix-blend-mode:multiply] dark:[mix-blend-mode:screen] opacity-75 hover:opacity-100 transition-opacity duration-200"
          />
        ))}
      </div>
    </section>
  );
}
