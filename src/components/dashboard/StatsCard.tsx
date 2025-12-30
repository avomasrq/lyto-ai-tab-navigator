import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  number?: string;
}

export const StatsCard = ({ title, value, subtitle, icon, number = '01' }: StatsCardProps) => {
  return (
    <div className="group relative rounded-2xl border border-border bg-card/40 hover:bg-card/70 hover:border-primary/20 transition-all duration-500 overflow-hidden p-6">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Number accent */}
      <div className="absolute -top-2 -right-1 font-serif text-[5rem] text-primary/[0.04] leading-none pointer-events-none group-hover:text-primary/[0.08] transition-colors duration-500">
        {number}
      </div>
      
      <div className="relative flex flex-col h-full">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/15 transition-colors">
          {icon}
        </div>
        
        {/* Content */}
        <div className="mt-auto">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-serif tracking-tight mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
