import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
}

export const StatsCard = ({ title, value, subtitle, icon }: StatsCardProps) => {
  return (
    <div className="group relative rounded-xl border border-border/50 bg-card/50 hover:bg-card/80 hover:border-border transition-all duration-300 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      
      <div>
        <p className="text-2xl font-semibold tracking-tight mb-0.5">
          {value}
        </p>
        <p className="text-xs font-medium text-muted-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
