import { useLandingStats } from '@/hooks/useLandingStats';
import { Users, FolderOpen, Search, MessageSquare } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const StatsSection = () => {
  const { stats, loading } = useLandingStats();

  const statItems = [
    { label: 'Active Users',       value: stats.totalUsers,            icon: Users },
    { label: 'Projects Created',   value: stats.totalProjects,         icon: FolderOpen },
    { label: 'Research Sessions',  value: stats.totalResearchSessions, icon: Search },
    { label: 'AI Prompts',         value: stats.totalPrompts,          icon: MessageSquare },
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <FadeIn className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary font-medium mb-3">Community</p>
          <h2 className="text-3xl md:text-4xl font-serif">
            Trusted by <span className="text-gradient">thousands</span> of users
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto" staggerDelay={0.1}>
          {statItems.map((item) => (
            <FadeInItem key={item.label}>
              <div className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-1">
                    {loading
                      ? <span className="inline-block w-12 h-8 bg-muted/50 rounded animate-pulse" />
                      : formatNumber(item.value)
                    }
                  </div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
};

export default StatsSection;
