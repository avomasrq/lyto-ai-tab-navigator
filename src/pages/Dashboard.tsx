import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { PromptHistory } from '@/components/dashboard/PromptHistory';
import { ProjectsList } from '@/components/dashboard/ProjectsList';
import { ResearchSessionsList } from '@/components/dashboard/ResearchSessionsList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Activity, 
  Hash, 
  FolderOpen,
  MessageSquare,
  Search,
  Clock,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { 
    prompts, 
    tokenUsage, 
    projects,
    researchSessions,
    subscription,
    stats, 
    loading: dataLoading, 
    error,
    refetch 
  } = useDashboardData();

  // Debug: проверим, что subscription загружается
  useEffect(() => {
    console.log('Dashboard - dataLoading:', dataLoading);
    console.log('Dashboard - subscription:', subscription);
  }, [dataLoading, subscription]);

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
              onClick={refetch}
              disabled={dataLoading}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
            </Button>
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
            <div className="flex items-baseline gap-4">
              <h1 className="text-2xl font-serif">
                Welcome back, <span className="text-gradient">{getUserName()}</span>
              </h1>
              {!dataLoading && (
                <div className="relative flex items-center">
                  {subscription?.plan === 'pro' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-primary/40 text-xs font-semibold tracking-widest text-primary" style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.05))' }}>
                      <Sparkles className="h-2.5 w-2.5" />
                      PRO
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-xs font-medium tracking-widest text-muted-foreground/60">
                      Free
                    </span>
                  )}
                </div>
              )}
            </div>
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

        {/* Stats Grid - Extension Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {dataLoading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : (
            <>
              <StatsCard
                title="Projects"
                value={stats.projectsCount.toLocaleString()}
                subtitle="Extension projects"
                icon={<FolderOpen className="h-4 w-4" />}
              />
              <StatsCard
                title="Sessions"
                value={stats.sessionsCount.toLocaleString()}
                subtitle="Landing & extension"
                icon={<MessageSquare className="h-4 w-4" />}
              />
              <StatsCard
                title="Research"
                value={`${stats.researchUsedInPeriod}/${stats.researchLimitInPeriod}`}
                subtitle={subscription?.plan === 'pro' ? 'This period' : stats.researchUsedInPeriod >= stats.researchLimitInPeriod ? 'Limit reached' : 'Available'}
                icon={<Search className="h-4 w-4" />}
              />
              <StatsCard
                title="API Requests"
                value={stats.totalRequests.toLocaleString()}
                subtitle={`${stats.weekRequests} this week`}
                icon={<Activity className="h-4 w-4" />}
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Extension Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects and Research Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {dataLoading ? (
                <>
                  <Skeleton className="h-[350px] rounded-xl" />
                  <Skeleton className="h-[350px] rounded-xl" />
                </>
              ) : (
                <>
                  <ProjectsList projects={projects} />
                  <ResearchSessionsList sessions={researchSessions} />
                </>
              )}
            </div>

            {/* Usage Overview */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">API Usage</h2>
              <div className="grid md:grid-cols-[1fr_1.5fr] gap-4">
                {dataLoading ? (
                  <>
                    <Skeleton className="h-[280px] rounded-xl" />
                    <Skeleton className="h-[280px] rounded-xl" />
                  </>
                ) : (
                  <>
                    {/* Limits Card */}
                    <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
                      {subscription?.plan === 'pro' ? (
                        // PRO Plan
                        <div className="space-y-6">
                          {/* Requests */}
                          <div className="text-center pb-6 border-b border-border">
                            <p className="text-sm text-muted-foreground mb-2">Requests This Month</p>
                            <p className="text-4xl font-bold text-foreground mb-1">
                              {stats.monthRequests.toLocaleString()}
                            </p>
                            <p className="text-xs text-primary font-medium">Unlimited</p>
                          </div>
                          
                          {/* Research */}
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Research Sessions</p>
                            <p className="text-3xl font-bold text-foreground mb-1">
                              {stats.researchUsedInPeriod} / {stats.researchLimitInPeriod}
                            </p>
                            {stats.currentPeriodEnd && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Resets {new Date(stats.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        // FREE Plan
                        <div className="space-y-6">
                          {/* Requests */}
                          <div className="text-center pb-6 border-b border-border">
                            <p className="text-sm text-muted-foreground mb-2">This Week</p>
                            <p className="text-4xl font-bold text-foreground mb-1">
                              {Math.max(0, 25 - stats.weekRequests)}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">Requests Remaining</p>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                              <span>{stats.weekRequests} used</span>
                              <span>•</span>
                              <span>25 limit</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (stats.weekRequests / 25) * 100)}%` }}
                              />
                            </div>
                            {stats.nextMondayReset && (
                              <p className="text-xs text-muted-foreground/60">
                                Resets {new Date(stats.nextMondayReset).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
                          
                          {/* Research */}
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">Research</p>
                            <p className="text-3xl font-bold text-foreground mb-1">
                              {stats.researchUsedInPeriod} / {stats.researchLimitInPeriod}
                            </p>
                            {stats.researchAvailableDate ? (
                              <p className="text-xs text-muted-foreground mt-2">
                                Next available {new Date(stats.researchAvailableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            ) : (
                              <p className="text-xs text-primary font-medium mt-2">
                                Available now
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Usage Chart */}
                    <UsageChart
                      data={tokenUsage}
                      title="Daily Usage"
                      dataKey="totalRequests"
                      color="hsl(var(--primary))"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Prompt History */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Recent Prompts</h2>
            {dataLoading ? (
              <Skeleton className="h-[600px] rounded-xl" />
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
