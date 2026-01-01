import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { PromptHistory } from '@/components/dashboard/PromptHistory';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Activity, 
  Hash, 
  Calendar, 
  Clock, 
  ArrowLeft,
  LogOut,
  Database
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { prompts, tokenUsage, stats, loading: dataLoading, error, refetch } = useDashboardData();
  const [seeding, setSeeding] = useState(false);

  const handleSeedTestData = async () => {
    setSeeding(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in first');
        return;
      }

      const response = await supabase.functions.invoke('seed-test-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast.success('Test data added successfully!');
      refetch();
    } catch (err) {
      console.error('Seeding error:', err);
      toast.error('Failed to add test data');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm">Loading...</span>
        </div>
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

  const getUserName = () => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-lg font-serif tracking-tight">
              Lyto AI<span className="text-primary">.</span>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSeedTestData} 
              disabled={seeding}
              className="h-8 gap-1.5 text-xs"
            >
              <Database className="h-3.5 w-3.5" />
              {seeding ? 'Adding...' : 'Add Test Data'}
            </Button>
            <div className="h-4 w-px bg-border/50" />
            <span className="hidden sm:block text-xs text-muted-foreground max-w-[140px] truncate">
              {user.email}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut} 
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative z-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Overview</p>
            <h1 className="text-2xl font-serif">
              Welcome back, <span className="text-gradient">{getUserName()}</span>
            </h1>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {dataLoading ? (
            [...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <StatsCard
                title="Total Requests"
                value={stats.totalRequests.toLocaleString()}
                subtitle="All time"
                icon={<Activity className="h-4 w-4" />}
              />
              <StatsCard
                title="Total Tokens"
                value={stats.totalTokens.toLocaleString()}
                subtitle="API usage"
                icon={<Hash className="h-4 w-4" />}
              />
              <StatsCard
                title="This Week"
                value={stats.weekRequests.toLocaleString()}
                subtitle={`${stats.weekTokens.toLocaleString()} tokens`}
                icon={<Calendar className="h-4 w-4" />}
              />
              <StatsCard
                title="Last Activity"
                value={formatLastActivity(stats.lastActivity)}
                subtitle={stats.todayRequests > 0 ? `${stats.todayRequests} today` : 'No activity today'}
                icon={<Clock className="h-4 w-4" />}
              />
            </>
          )}
        </div>

        {/* Two Column Layout for Charts and History */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Usage Trends</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {dataLoading ? (
                  <>
                    <Skeleton className="h-[280px] rounded-xl" />
                    <Skeleton className="h-[280px] rounded-xl" />
                  </>
                ) : (
                  <>
                    <UsageChart
                      data={tokenUsage}
                      title="Requests"
                      dataKey="total_requests"
                      color="hsl(var(--primary))"
                    />
                    <UsageChart
                      data={tokenUsage}
                      title="Tokens"
                      dataKey="total_tokens"
                      color="hsl(220, 70%, 55%)"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent Prompts</h2>
            {dataLoading ? (
              <Skeleton className="h-[400px] rounded-xl" />
            ) : (
              <PromptHistory prompts={prompts} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
