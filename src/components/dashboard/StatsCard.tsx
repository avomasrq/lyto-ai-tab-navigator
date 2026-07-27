import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  /** dim the number when the metric doesn't apply on this plan */
  muted?: boolean;
}

/* A stat is type, not a box: small tracked label, big serif figure, quiet hint.
   The row that holds these draws the hairlines between them. */
export const StatsCard = ({ title, value, subtitle, muted }: StatsCardProps) => (
  <div className="px-4 py-5 sm:px-6">
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
      {title}
    </p>
    <p
      className={cn(
        'mt-2.5 font-serif text-[26px] sm:text-[30px] leading-none tracking-tight tabular-nums',
        muted ? 'text-muted-foreground/40' : 'text-foreground',
      )}
    >
      {value}
    </p>
    {subtitle && (
      <p className="mt-2 text-[11.5px] leading-snug text-muted-foreground/60">{subtitle}</p>
    )}
  </div>
);
