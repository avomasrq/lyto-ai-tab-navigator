import { useMemo } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenUsage } from '@/hooks/useDashboardData';
import { Panel, PanelEmpty } from './Panel';

interface UsageChartProps {
  data: TokenUsage[];
  title: string;
  dataKey: 'totalRequests' | 'totalTokens';
  color?: string;
}

export const UsageChart = ({ data, title, dataKey, color = 'hsl(var(--primary))' }: UsageChartProps) => {
  const chartData = useMemo(
    () => data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })),
    [data],
  );

  const total = useMemo(
    () => data.reduce((sum, d) => sum + (Number(d[dataKey]) || 0), 0),
    [data, dataKey],
  );

  return (
    <Panel
      title={title}
      meta={chartData.length > 0 ? `${total.toLocaleString()} total` : undefined}
      className="h-full"
    >
      {chartData.length === 0 ? (
        <PanelEmpty>No activity recorded in this period.</PanelEmpty>
      ) : (
        <div className="h-[214px] w-full px-2 pt-5 pb-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 12, left: 12, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10.5, opacity: 0.6 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={28}
                dy={6}
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  padding: '7px 11px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', fontWeight: 400, marginBottom: '2px' }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={1.75}
                fill={`url(#gradient-${dataKey})`}
                name={dataKey === 'totalRequests' ? 'Requests' : 'Tokens'}
                dot={false}
                activeDot={{ r: 3.5, fill: color, stroke: 'hsl(var(--background))', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
};
