import { useLandingStats } from '@/hooks/useLandingStats';
import { Users, FolderOpen, Search, MessageSquare } from 'lucide-react';

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const StatsSection = () => {
  const { stats, loading } = useLandingStats();

  const statItems = [
    {
      label: 'Active Users',
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: 'Projects Created',
      value: stats.totalProjects,
      icon: FolderOpen,
    },
    {
      label: 'Research Sessions',
      value: stats.totalResearchSessions,
      icon: Search,
    },
    {
      label: 'AI Prompts',
      value: stats.totalPrompts,
      icon: MessageSquare,
    },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">
            Community
          </p>
          <h2 className="text-3xl md:text-4xl font-serif">
            Trusted by <span className="text-gradient">thousands</span> of users
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {statItems.map((item, index) => (
            <div
              key={item.label}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-1">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-muted/50 rounded animate-pulse" />
                  ) : (
                    formatNumber(item.value)
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
