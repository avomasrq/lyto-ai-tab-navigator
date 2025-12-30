import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TokenUsage } from '@/hooks/useDashboardData';

interface UsageChartProps {
  data: TokenUsage[];
  title: string;
  dataKey: 'total_requests' | 'total_tokens';
  color?: string;
}

export const UsageChart = ({ data, title, dataKey, color = 'hsl(24, 95%, 50%)' }: UsageChartProps) => {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));
  }, [data]);

  return (
    <div className="group relative rounded-2xl border border-border bg-card/40 hover:bg-card/60 transition-all duration-500 overflow-hidden p-6">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <h3 className="text-sm font-medium text-muted-foreground mb-6">{title}</h3>
        
        <div className="h-[260px] w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 border-2 border-muted-foreground/20 border-dashed rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">No data yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Start using Lyto AI to see trends</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(220, 15%, 90%)" 
                  vertical={false} 
                  strokeOpacity={0.5}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(0, 0%, 100%)',
                    border: '1px solid hsl(220, 15%, 90%)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  labelStyle={{ 
                    color: 'hsl(220, 20%, 10%)',
                    fontWeight: 500,
                    marginBottom: '4px'
                  }}
                  itemStyle={{
                    color: 'hsl(220, 10%, 45%)',
                    fontSize: '13px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${dataKey})`}
                  name={dataKey === 'total_requests' ? 'Requests' : 'Tokens'}
                  dot={false}
                  activeDot={{ 
                    r: 5, 
                    fill: color,
                    stroke: 'hsl(0, 0%, 100%)',
                    strokeWidth: 2
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
