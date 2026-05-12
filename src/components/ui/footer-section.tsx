'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FooterLink {
  title: string;
  href: string;
  external?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

export function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FooterRootProps {
  sections: FooterSection[];
  brand: ReactNode;
  bottom?: ReactNode;
}

export function FooterRoot({ sections, brand, bottom }: FooterRootProps) {
  return (
    <footer className="md:rounded-t-3xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-2xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(colors.primary/8%),transparent)] px-6 py-12 lg:py-16">
      {/* glow line */}
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        {/* Brand slot */}
        <AnimatedContainer className="space-y-4">
          {brand}
        </AnimatedContainer>

        {/* Link columns */}
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0">
          {sections.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                  {section.label}
                </h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="hover:text-foreground inline-flex items-center gap-1 transition-all duration-200"
                      >
                        {link.icon && <link.icon className="size-4" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      {bottom && (
        <AnimatedContainer delay={0.5} className="w-full mt-12 pt-6 border-t border-border/40">
          {bottom}
        </AnimatedContainer>
      )}
    </footer>
  );
}
