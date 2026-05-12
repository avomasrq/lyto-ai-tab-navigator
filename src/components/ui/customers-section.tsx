import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AnimatedGroup } from '@/components/ui/animated-group';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export interface CustomerLogo {
  src: string;
  alt: string;
  height: number;
}

interface CustomersSectionProps {
  customers: CustomerLogo[];
  label?: string;
  href?: string;
  className?: string;
}

export function CustomersSection({
  customers = [],
  label = 'Trusted by teams at',
  href,
  className,
}: CustomersSectionProps) {
  return (
    <section className={`bg-background ${className ?? ''}`}>
      <div className="group relative m-auto max-w-5xl px-6">
        {/* "Meet our customers" hover overlay */}
        {href && (
          <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
            <Link
              to={href}
              className="block text-sm duration-150 hover:opacity-75"
            >
              <span>Meet our customers</span>
              <ChevronRight className="ml-1 inline-block size-3" />
            </Link>
          </div>
        )}

        {/* Label */}
        <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-6">
          {label}
        </p>

        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="group-hover:blur-xs mx-auto flex flex-wrap gap-x-10 gap-y-6 transition-all duration-500 group-hover:opacity-50 items-center justify-center"
        >
          {customers.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                className="mx-auto h-auto w-fit opacity-75 transition-all duration-300 hover:opacity-100 [mix-blend-mode:multiply] dark:[mix-blend-mode:screen]"
                src={logo.src}
                alt={logo.alt}
                height={logo.height}
                width="auto"
                style={{ maxHeight: logo.height }}
              />
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
