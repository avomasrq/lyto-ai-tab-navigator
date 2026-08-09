import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────────────────────────────────────
   Dashboard primitives — light surface, hairline grid.
   The palette is written out rather than themed so the dashboard grid reads
   identically regardless of the token scheme in play.
   ──────────────────────────────────────────────────────────────────────────── */

/* Warm limestone palette — the dashboard reads as inscribed stone panels to
   match the Argos/Odyssey theme, while staying light enough that the dark-ink
   charts keep full contrast. */
export const SURFACE = '#e7ddca';
export const PANEL = '#f5f0e5';
export const LINE = 'rgba(120,95,55,0.22)';
export const UP = '#16a34a';
export const DOWN = '#e11d48';

/** Hairline grid cell. The parent grid supplies the outer border. */
export const Cell = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('min-w-0 p-5 sm:p-6', className)} style={{ background: PANEL }}>
    {children}
  </div>
);

/** ▲ 3.1% vs last week — green when up, red when down, muted when flat. */
export const Delta = ({ pct, suffix = 'vs last week' }: { pct: number | null; suffix?: string }) => {
  if (pct === null || !Number.isFinite(pct)) {
    return <p className="mt-3 text-[13px] text-muted-foreground/60">No prior data</p>;
  }
  const flat = Math.abs(pct) < 0.05;
  const up = pct > 0;
  const color = flat ? 'rgba(9,9,11,0.45)' : up ? UP : DOWN;
  return (
    <p className="mt-3 flex items-center gap-1.5 text-[13px]">
      {!flat && (
        <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" fill="none" stroke={color} strokeWidth="1.9" aria-hidden>
          {up ? <path d="M1.5 8L6 3.5L10.5 8" strokeLinecap="round" strokeLinejoin="round" />
              : <path d="M1.5 4L6 8.5L10.5 4" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      )}
      <span style={{ color }} className="font-semibold tabular-nums">
        {flat ? 'No change' : `${Math.abs(pct).toFixed(1)}%`}
      </span>
      <span className="text-muted-foreground/70">{suffix}</span>
    </p>
  );
};

/**
 * A KPI shows either a movement (`pct` against the previous period) or, when
 * nothing meaningful can be compared, a plain `hint` — never an empty delta.
 */
export const Kpi = ({
  label, value, pct, deltaSuffix, hint,
}: {
  label: string;
  value: string;
  pct?: number | null;
  deltaSuffix?: string;
  hint?: string;
}) => (
  <Cell>
    <p className="text-[14px] text-muted-foreground">{label}</p>
    <p className="mt-3 font-geometric text-[34px] sm:text-[40px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
      {value}
    </p>
    {pct === undefined
      ? <p className="mt-3 text-[13px] text-muted-foreground/70">{hint ?? ''}</p>
      : <Delta pct={pct} suffix={deltaSuffix} />}
  </Cell>
);

/** The green ↗ 66.9% chip that sits beside a panel title. */
export const TrendPill = ({ pct }: { pct: number | null }) => {
  if (pct === null || !Number.isFinite(pct) || Math.abs(pct) < 0.05) return null;
  const up = pct > 0;
  const color = up ? UP : DOWN;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13px] font-semibold tabular-nums"
      style={{ color, background: up ? 'rgba(22,163,74,0.10)' : 'rgba(225,29,72,0.10)' }}
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke={color} strokeWidth="1.6" aria-hidden>
        {up ? <path d="M2 8.5L5 5.5L7 7.5L10 4M10 4H7.2M10 4V6.8" strokeLinecap="round" strokeLinejoin="round" />
            : <path d="M2 3.5L5 6.5L7 4.5L10 8M10 8H7.2M10 8V5.2" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
};

export const PanelHead = ({
  title, sub, pill,
}: { title: string; sub?: string; pill?: ReactNode }) => (
  <div className="px-5 pt-5 sm:px-6 sm:pt-6">
    <div className="flex items-center gap-2.5">
      <h3 className="font-geometric text-[19px] font-semibold tracking-tight text-foreground">{title}</h3>
      {pill}
    </div>
    {sub && <p className="mt-1.5 text-[14px] leading-snug text-muted-foreground">{sub}</p>}
  </div>
);

/** Bottom-anchored link, e.g. "View all →". */
export const PanelLink = ({ children, to }: { children: ReactNode; to: string }) => (
  <a
    href={to}
    className="group flex items-center justify-center gap-2 px-5 py-4 text-[14px] font-semibold text-foreground/75 transition-colors hover:text-foreground"
  >
    {children}
    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
  </a>
);
