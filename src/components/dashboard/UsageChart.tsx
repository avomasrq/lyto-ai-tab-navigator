import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenUsage } from '@/hooks/useDashboardData';

interface UsageChartProps {
  data: TokenUsage[];
  title: string;
  dataKey: 'totalRequests' | 'totalTokens';
  color?: string;
}

export const UsageChart = ({ data, title, dataKey, color = 'hsl(var(--primary))' }: UsageChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [data]);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <h3 className="text-xs font-medium text-muted-foreground mb-4">{title}</h3>
      
      <div className="h-[200px] w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-2">
                <div className="w-5 h-5 border-2 border-muted-foreground/20 border-dashed rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground">No data yet</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
                labelStyle={{ 
                  color: 'hsl(var(--foreground))',
                  fontWeight: 500,
                  marginBottom: '2px'
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={1.5}
                fill={`url(#gradient-${dataKey})`}
                name={dataKey === 'totalRequests' ? 'Requests' : 'Tokens'}
                dot={false}
                activeDot={{ 
                  r: 4, 
                  fill: color,
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 2
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
