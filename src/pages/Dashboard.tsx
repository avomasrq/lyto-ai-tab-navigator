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
import { Panel } from '@/components/dashboard/Panel';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FREE_DAILY_LIMIT = 25;

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signOut } = useAuth();
  const { openCustomerPortal, loading: polarLoading } = usePolar();
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
    refetch,
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
        <span className="text-sm text-muted-foreground/60">Loading…</span>
      </div>
    );
  }

  if (!user) return null;

  const isProActive = subscription?.plan === 'pro' && subscription?.status === 'active';

  const formatLastActivity = (dateStr: string | null) => {
    if (!dateStr) return '—';
    const diffMs = Date.now() - new Date(dateStr).getTime();
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

  const getUserName = () =>
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false);
  };

  const NAV_ITEMS = [
    { label: 'Overview', id: 'dash-overview' },
    { label: 'Usage', id: 'dash-usage' },
    { label: 'Projects', id: 'dash-projects' },
    { label: 'Research', id: 'dash-research' },
    { label: 'Prompts', id: 'dash-prompts' },
  ];

  const usedToday = stats.todayRequests;
  const remaining = Math.max(0, FREE_DAILY_LIMIT - usedToday);
  const usedPct = Math.min(100, (usedToday / FREE_DAILY_LIMIT) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm sm:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex w-[17rem] flex-col border-r border-border bg-background sm:hidden"
            >
              <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
                <Link to="/" onClick={() => setSidebarOpen(false)} className="font-serif text-base tracking-tight">
                  Lyto AI<span className="text-primary">.</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="-mr-1 rounded-lg px-2 py-1 text-lg leading-none text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close menu"
                >
                  ×
                </button>
              </div>

              <div className="border-b border-border/60 px-5 py-4">
                <p className="truncate font-serif text-[17px] tracking-tight">{getUserName()}</p>
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground/70">{user.email}</p>
                <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                  {isProActive ? 'Pro plan' : `Free · ${FREE_DAILY_LIMIT}/day`}
                </p>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                {NAV_ITEMS.map(({ label, id }) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className="w-full rounded-xl px-3 py-2.5 text-left text-[14px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <div className="border-t border-border/60 px-3 py-4">
                {!isProActive && (
                  <Link
                    to="/#pricing"
                    onClick={() => setSidebarOpen(false)}
                    className="mb-1 block rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-primary transition-colors hover:bg-primary/8"
                  >
                    Upgrade to Pro
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-[14px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Sign out
                </button>
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-[14px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Back to home
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="-ml-1 rounded-lg px-1.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
              aria-label="Open menu"
            >
              <span className="block h-[9px] w-[18px] border-y border-current" />
            </button>
            <Link to="/" className="font-serif text-lg tracking-tight">
              Lyto AI<span className="text-primary">.</span>
            </Link>
            <span className="hidden text-muted-foreground/30 sm:block">/</span>
            <span className="hidden text-sm text-muted-foreground sm:block">Dashboard</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={refetch}
              disabled={dataLoading}
              className="rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
            >
              {dataLoading ? 'Refreshing…' : 'Refresh'}
            </button>
            <button
              onClick={handleSignOut}
              className="hidden rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 sm:px-6 sm:py-10">
        {/* Masthead */}
        <div id="dash-overview" className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              Overview
            </p>
            <h1 className="font-serif text-[28px] leading-[1.1] tracking-tight sm:text-[38px]">
              Welcome back,{' '}
              <span className="text-gradient italic">{getUserName()}</span>
            </h1>
            <p className="mt-2.5 text-[13.5px] text-muted-foreground">
              {isProActive
                ? 'You\'re on Pro — everything is unlocked.'
                : `Free plan · ${remaining} of ${FREE_DAILY_LIMIT} messages left today.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isProActive ? (
              <button
                onClick={openCustomerPortal}
                disabled={polarLoading}
                className="rounded-full border border-border px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground disabled:opacity-50"
              >
                Manage billing
              </button>
            ) : (
              <Link
                to="/#pricing"
                className="rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Stat band — figures separated by hairlines, no boxes. 2-up, 3-up, then
            a single row; the last cell stretches to fill the gap an odd count leaves. */}
        {dataLoading ? (
          <Skeleton className="mb-8 h-[116px] rounded-2xl sm:mb-10" />
        ) : (
          <div className="mb-8 grid grid-cols-2 divide-x divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card sm:mb-10 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0 [&>*:last-child]:col-span-2 lg:[&>*:last-child]:col-span-1">
            <StatsCard
              title="Projects"
              value={stats.projectsCount.toLocaleString()}
              subtitle="From the extension"
            />
            <StatsCard
              title="Sessions"
              value={stats.sessionsCount.toLocaleString()}
              subtitle="Landing & extension"
            />
            <StatsCard
              title="Research"
              value={isProActive ? `${stats.researchUsedInPeriod}/${stats.researchLimitInPeriod}` : '—'}
              subtitle={isProActive ? 'This period' : 'Pro only'}
              muted={!isProActive}
            />
            <StatsCard
              title="Requests"
              value={stats.totalRequests.toLocaleString()}
              subtitle={`${stats.weekRequests} this week`}
            />
            <StatsCard
              title="Last active"
              value={formatLastActivity(stats.lastActivity)}
              subtitle={stats.todayRequests > 0 ? `${stats.todayRequests} today` : 'Nothing today'}
            />
          </div>
        )}

        {/* Usage */}
        <div id="dash-usage" className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)]">
          {dataLoading ? (
            <>
              <Skeleton className="h-[290px] rounded-2xl" />
              <Skeleton className="h-[290px] rounded-2xl" />
            </>
          ) : (
            <>
              <Panel title={isProActive ? 'This month' : 'Today'}>
                <div className="px-5 py-6">
                  {isProActive ? (
                    <>
                      <p className="font-serif text-[52px] leading-none tracking-tight tabular-nums">
                        {stats.monthRequests.toLocaleString()}
                      </p>
                      <p className="mt-3 text-[13px] text-muted-foreground">
                        requests · <span className="font-medium text-primary">unlimited</span>
                      </p>

                      <div className="mt-6 border-t border-border/60 pt-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/55">
                          Research
                        </p>
                        <p className="mt-2 font-serif text-[26px] leading-none tracking-tight tabular-nums">
                          {stats.researchUsedInPeriod}
                          <span className="text-muted-foreground/40"> / {stats.researchLimitInPeriod}</span>
                        </p>
                        {stats.currentPeriodEnd && (
                          <p className="mt-2 text-[12px] text-muted-foreground/60">
                            Resets{' '}
                            {new Date(stats.currentPeriodEnd).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-[52px] leading-none tracking-tight tabular-nums">
                        {remaining}
                      </p>
                      <p className="mt-3 text-[13px] text-muted-foreground">
                        {remaining === 1 ? 'message left' : 'messages left'} today
                      </p>

                      <div className="mt-6">
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              usedPct >= 90 ? 'bg-destructive' : 'bg-primary',
                            )}
                            style={{ width: `${usedPct}%` }}
                          />
                        </div>
                        <div className="mt-2.5 flex items-baseline justify-between text-[11.5px] tabular-nums text-muted-foreground/60">
                          <span>{usedToday} used</span>
                          <span>resets at midnight</span>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-border/60 pt-5">
                        <p className="text-[13px] leading-relaxed text-muted-foreground">
                          Pro removes the daily cap and unlocks deep research, the cloud agent and the desktop CLI.
                        </p>
                        <Link
                          to="/#pricing"
                          className="mt-3 inline-block text-[13px] font-semibold text-primary hover:underline"
                        >
                          See what's in Pro →
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </Panel>

              <UsageChart
                data={tokenUsage}
                title="Daily activity"
                dataKey="totalRequests"
                color="hsl(var(--primary))"
              />
            </>
          )}
        </div>

        {/* Lists */}
        <div className="grid gap-4 lg:grid-cols-3">
          {dataLoading ? (
            <>
              <Skeleton className="h-[360px] rounded-2xl" />
              <Skeleton className="h-[360px] rounded-2xl" />
              <Skeleton className="h-[360px] rounded-2xl" />
            </>
          ) : (
            <>
              <div id="dash-projects">
                <ProjectsList projects={projects} />
              </div>
              <div id="dash-research">
                <ResearchSessionsList sessions={researchSessions} />
              </div>
              <div id="dash-prompts">
                <PromptHistory prompts={prompts} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
