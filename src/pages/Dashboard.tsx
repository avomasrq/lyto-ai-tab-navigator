import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { usePolar } from '@/hooks/usePolar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { PromptHistory } from '@/components/dashboard/PromptHistory';
import { ProjectsList } from '@/components/dashboard/ProjectsList';
import { ResearchSessionsList } from '@/components/dashboard/ResearchSessionsList';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Activity,
  FolderOpen,
  MessageSquare,
  Search,
  Clock,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Crown,
  CreditCard,
  Menu,
  X,
  BarChart2,
  Home,
} from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signOut } = useAuth();
  const { cancelSubscription, openCustomerPortal, loading: polarLoading } = usePolar();
  const [hasCanceled, setHasCanceled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Poll for pro subscription after successful checkout.
  // The Polar webhook can take a few seconds to fire after the user returns
  // from the checkout page. We poll every 2s (up to 30s) until plan === 'pro',
  // then show the success toast. The Realtime listener in useDashboardData will
  // also update state the moment the DB row changes, whichever arrives first.
  useEffect(() => {
    if (searchParams.get('success') !== 'true') return;
    window.history.replaceState({}, '', '/dashboard');

    let attempts = 0;
    const maxAttempts = 15; // 15 × 2s = 30s max wait

    const poll = async () => {
      attempts++;
      await refetch();

      // subscription state is updated by refetch; re-read from Supabase directly
      // so we don't close over a stale `subscription` value
      const { data } = await import('@/integrations/supabase/client').then(
        (m) => m.supabase.from('Subscription').select('plan,status').eq('userId', user?.id ?? '').maybeSingle()
      );

      if (data?.plan === 'pro' && data?.status === 'active') {
        toast.success('🎉 You\'re now on Pro! All features are unlocked.');
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      } else {
        // Webhook took too long — still show success but prompt a refresh
        toast.success('Payment received! If Pro features aren\'t active yet, refresh the page.');
      }
    };

    // Start first poll after 1.5s (give webhook a head start)
    setTimeout(poll, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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

  const isProActive = subscription?.plan === 'pro' && subscription?.status === 'active';
  const isCanceled = subscription?.status === 'canceled';

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

  const handleCancelSubscription = async () => {
    const success = await cancelSubscription();
    if (success) {
      setHasCanceled(true);
      refetch();
    }
  };

  const getUserName = () => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false);
  };

  const NAV_ITEMS = [
    { label: 'Overview', icon: Home, id: 'dash-overview' },
    { label: 'Projects', icon: FolderOpen, id: 'dash-projects' },
    { label: 'Research', icon: Search, id: 'dash-research' },
    { label: 'Usage', icon: BarChart2, id: 'dash-usage' },
    { label: 'Prompts', icon: MessageSquare, id: 'dash-prompts' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-background border-r border-border flex flex-col sm:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                <Link to="/" onClick={() => setSidebarOpen(false)} className="font-serif text-base tracking-tight">
                  Lyto AI<span className="text-primary">.</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User info */}
              <div className="px-5 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {getUserName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{getUserName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                {/* Plan badge */}
                <div className="mt-3">
                  {isProActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      <Crown className="w-3 h-3" /> Pro plan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Free plan · 50 req/week
                    </span>
                  )}
                </div>
              </div>

              {/* Nav items */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ label, icon: Icon, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="px-3 py-4 border-t border-border/50 space-y-1">
                {!isProActive && (
                  <button
                    onClick={() => { scrollTo('dash-usage'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/8 transition-colors text-left"
                  >
                    <Crown className="w-4 h-4 shrink-0" />
                    Upgrade to Pro
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Sign out
                </button>
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                  Back to home
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Subtle background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur-md">
        <div className="container px-4 sm:px-6 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="sm:hidden p-1.5 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="text-lg font-serif tracking-tight">
              Lyto AI<span className="text-primary">.</span>
            </Link>
            <span className="hidden sm:block text-muted-foreground/40">/</span>
            <span className="hidden sm:block text-sm text-muted-foreground">Dashboard</span>
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
              className="hidden sm:flex h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        {/* Page Header */}
        <div id="dash-overview" className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Overview</p>
            <div className="flex items-baseline gap-4">
              <h1 className="text-lg sm:text-2xl font-serif">
                Welcome back, <span className="text-gradient">{getUserName()}</span>
              </h1>
              {!dataLoading && (
                <div className="relative flex items-center">
                  {isProActive ? (
                    <span className="font-serif italic text-xl sm:text-3xl text-foreground tracking-wide">
                      Pro
                    </span>
                  ) : (
                    <span className="font-serif italic text-xl sm:text-3xl text-muted-foreground tracking-wide">
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


        {/* Stats Grid */}
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
                subtitle={isProActive ? 'This period' : stats.researchUsedInPeriod >= stats.researchLimitInPeriod ? 'Limit reached' : 'Available'}
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
          <div className="lg:col-span-2 space-y-6">
            <div id="dash-projects" className="grid md:grid-cols-2 gap-4">
              {dataLoading ? (
                <>
                  <Skeleton className="h-[350px] rounded-xl" />
                  <Skeleton className="h-[350px] rounded-xl" />
                </>
              ) : (
                <>
                  <ProjectsList projects={projects} />
                  <div id="dash-research">
                    <ResearchSessionsList sessions={researchSessions} />
                  </div>
                </>
              )}
            </div>

            <div id="dash-usage">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">API Usage</h2>
              <div className="grid md:grid-cols-[1fr_1.5fr] gap-4">
                {dataLoading ? (
                  <>
                    <Skeleton className="h-[280px] rounded-xl" />
                    <Skeleton className="h-[280px] rounded-xl" />
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
                      {isProActive ? (
                        <div className="space-y-6">
                          <div className="text-center pb-6 border-b border-border">
                            <p className="text-sm text-muted-foreground mb-2">Requests This Month</p>
                            <p className="text-4xl font-bold text-foreground mb-1">
                              {stats.monthRequests.toLocaleString()}
                            </p>
                            <p className="text-xs text-primary font-medium">Unlimited</p>
                          </div>
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
                        <div className="space-y-6">
                          <div className="text-center pb-6 border-b border-border">
                            <p className="text-sm text-muted-foreground mb-2">This Week</p>
                            <p className="text-4xl font-bold text-foreground mb-1">
                              {Math.max(0, 50 - stats.weekRequests)}
                            </p>
                            <p className="text-sm text-muted-foreground mb-3">Requests Remaining</p>
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-2">
                              <span>{stats.weekRequests} used</span>
                              <span>•</span>
                              <span>50 limit</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (stats.weekRequests / 50) * 100)}%` }}
                              />
                            </div>
                            {stats.nextMondayReset && (
                              <p className="text-xs text-muted-foreground/60">
                                Resets {new Date(stats.nextMondayReset).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            )}
                          </div>
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

          <div id="dash-prompts" className="lg:col-span-1">
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
