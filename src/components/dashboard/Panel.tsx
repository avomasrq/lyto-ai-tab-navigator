import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PanelProps {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

/* The one card shape the dashboard uses: hairline border, serif title, a rule,
   then content that sits directly on the surface — no nested boxes. */
export const Panel = ({ title, meta, children, className, bodyClassName }: PanelProps) => (
  <section className={cn('flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden', className)}>
    <header className="flex items-baseline justify-between gap-3 px-5 py-3.5 border-b border-border/60">
      <h3 className="font-serif text-[15px] tracking-tight text-foreground">{title}</h3>
      {meta && <span className="text-[11px] tabular-nums text-muted-foreground/60 shrink-0">{meta}</span>}
    </header>
    <div className={cn('flex-1 min-h-0', bodyClassName)}>{children}</div>
  </section>
);

/* Empty states read as a quiet sentence, not an icon in a circle. */
export const PanelEmpty = ({ children }: { children: ReactNode }) => (
  <div className="px-5 py-10 text-center">
    <p className="text-[13px] leading-relaxed text-muted-foreground/70 max-w-[26ch] mx-auto">{children}</p>
  </div>
);
