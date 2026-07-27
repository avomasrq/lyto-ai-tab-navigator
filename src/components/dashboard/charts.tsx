import { useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell as BarCell,
} from 'recharts';
import { LINE } from './ui';

const AXIS_TICK = { fill: 'rgba(9,9,11,0.42)', fontSize: 11 } as const;

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid rgba(9,9,11,0.12)',
  borderRadius: 10,
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  padding: '7px 11px',
  fontSize: 12,
  color: '#0a0a0a',
} as const;

const EmptyPlot = ({ label }: { label: string }) => (
  <div className="flex h-full items-center justify-center px-6">
    <p className="text-center text-[13.5px] text-muted-foreground/70">{label}</p>
  </div>
);

/* ── Vertical gradient bars ── */
export function ActivityBars({ data }: { data: { label: string; value: number }[] }) {
  const hasData = data.some((d) => d.value > 0);
  return (
    <div className="h-[240px] w-full px-2 pb-2">
      {!hasData ? (
        <EmptyPlot label="No requests recorded in the last 7 days." />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 14, right: 12, left: 12, bottom: 4 }} barCategoryGap="22%">
            <defs>
              <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3f3f46" />
                <stop offset="100%" stopColor="#a1a1aa" />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} dy={6} />
            <Tooltip
              cursor={{ fill: 'rgba(9,9,11,0.04)' }}
              contentStyle={tooltipStyle}
              labelStyle={{ color: 'rgba(9,9,11,0.5)', marginBottom: 2 }}
              formatter={(v: number) => [v, 'Requests']}
            />
            <Bar dataKey="value" radius={[2, 2, 0, 0]} isAnimationActive={false}>
              {data.map((_, i) => <BarCell key={i} fill="url(#barFill)" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/* ── Stepped lines, one per series ── */
export function StepLines({
  data, series,
}: {
  data: Record<string, string | number>[];
  series: { key: string; color: string; opacity?: number }[];
}) {
  const hasData = useMemo(
    () => data.some((row) => series.some((s) => Number(row[s.key]) > 0)),
    [data, series],
  );

  return (
    <div className="h-[240px] w-full px-2 pb-2">
      {!hasData ? (
        <EmptyPlot label="Not enough activity yet to plot a trend." />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 18, right: 16, left: 12, bottom: 4 }}>
            <CartesianGrid stroke={LINE} vertical={false} />
            <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={false} dy={6} />
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: 'rgba(9,9,11,0.18)' }}
              contentStyle={tooltipStyle}
              labelStyle={{ color: 'rgba(9,9,11,0.5)', marginBottom: 2 }}
            />
            {series.map((s) => (
              <Line
                key={s.key}
                type="stepAfter"
                dataKey={s.key}
                stroke={s.color}
                strokeOpacity={s.opacity ?? 1}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: s.color, stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
