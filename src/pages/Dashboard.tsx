import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { PromptHistory } from '@/components/dashboard/PromptHistory';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Zap, 
  Calendar, 
  Clock, 
  ArrowLeft,
  LogOut,
  BarChart3,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { prompts, tokenUsage, stats, loading: dataLoading, error } = useDashboardData();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const formatLastActivity = (dateStr: string | null) => {
    if (!dateStr) return 'No activity yet';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your Lyto AI usage and activity.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {dataLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total Requests"
                value={stats.totalRequests.toLocaleString()}
                subtitle="All time"
                icon={<Activity className="h-5 w-5" />}
              />
              <StatsCard
                title="Total Tokens"
                value={stats.totalTokens.toLocaleString()}
                subtitle="All time usage"
                icon={<Zap className="h-5 w-5" />}
              />
              <StatsCard
                title="This Week"
                value={stats.weekRequests.toLocaleString()}
                subtitle={`${stats.weekTokens.toLocaleString()} tokens`}
                icon={<Calendar className="h-5 w-5" />}
              />
              <StatsCard
                title="Last Activity"
                value={formatLastActivity(stats.lastActivity)}
                subtitle={stats.todayRequests > 0 ? `${stats.todayRequests} requests today` : 'No activity today'}
                icon={<Clock className="h-5 w-5" />}
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {dataLoading ? (
            <>
              <Skeleton className="h-[360px]" />
              <Skeleton className="h-[360px]" />
            </>
          ) : (
            <>
              <UsageChart
                data={tokenUsage}
                title="Requests Over Time"
                dataKey="total_requests"
                color="hsl(24, 95%, 50%)"
              />
              <UsageChart
                data={tokenUsage}
                title="Token Usage Over Time"
                dataKey="total_tokens"
                color="hsl(220, 70%, 50%)"
              />
            </>
          )}
        </div>

        {/* Prompt History */}
        {dataLoading ? (
          <Skeleton className="h-[400px]" />
        ) : (
          <PromptHistory prompts={prompts} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
