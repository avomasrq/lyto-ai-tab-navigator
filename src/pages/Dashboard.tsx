import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { usePolar } from '@/hooks/usePolar';
import { Kpi, PanelHead, TrendPill, LINE, SURFACE, PANEL } from '@/components/dashboard/ui';
import { ActivityBars, StepLines } from '@/components/dashboard/charts';
import { RecentPrompts, PlanHealth, ActivityFeed } from '@/components/dashboard/panels';
import { toast } from 'sonner';

const FREE_DAILY_LIMIT = 25;

/** % change of the last `span` days against the `span` days before them. */
const trendPct = (values: number[], span = 7): number | null => {
  if (values.length < span + 1) return null;
  const recent = values.slice(-span).reduce((a, b) => a + b, 0);
  const prior = values.slice(-span * 2, -span).reduce((a, b) => a + b, 0);
  if (prior === 0) return recent > 0 ? 100 : null;
  return ((recent - prior) / prior) * 100;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signOut } = useAuth();
  const { openCustomerPortal } = usePolar();
  const {
    prompts, tokenUsage, projects, researchSessions, subscription, stats,
    loading: dataLoading, error, refetch,
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

      const { data } = await import('@/integrations/supabase/client').then(
        (m) => m.supabase.from('Subscription').select('plan,status').eq('userId', user?.id ?? '').maybeSingle()
      );

      if (data?.plan === 'pro' && data?.status === 'active') {
        toast.success('🎉 You\'re now on Pro! All features are unlocked.');
        return;
      }
      if (attempts < maxAttempts) setTimeout(poll, 2000);
      else toast.success('Payment received! If Pro features aren\'t active yet, refresh the page.');
    };

    setTimeout(poll, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const isProActive = subscription?.plan === 'pro' && subscription?.status === 'active';

  /* ── derive every series and delta from the 30 days of TokenUsage ── */
  const derived = useMemo(() => {
    // fill the last 14 calendar days so gaps read as zero rather than collapsing
    const byDate = new Map(tokenUsage.map((u) => [String(u.date).slice(0, 10), u]));
    const days: { key: string; label: string; requests: number; tokens: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const row = byDate.get(key);
      days.push({
        key,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        requests: row?.totalRequests ?? 0,
        tokens: row?.totalTokens ?? 0,
      });
    }

    const requests = days.map((d) => d.requests);
    const last7 = days.slice(-7);

    // cumulative curves over the last 7 days, for the step chart
    let runReq = 0, runTok = 0;
    const cumulative = last7.map((d) => {
      runReq += d.requests;
      runTok += d.tokens;
      return { label: d.label, Requests: runReq, Tokens: Math.round(runTok / 1000) };
    });

    // today vs yesterday, so the second KPI moves on its own timescale
    const today = days[days.length - 1]?.requests ?? 0;
    const yesterday = days[days.length - 2]?.requests ?? 0;
    const dayTrend = yesterday === 0 ? (today > 0 ? 100 : null) : ((today - yesterday) / yesterday) * 100;

    return {
      bars: last7.map((d) => ({ label: d.label, value: d.requests })),
      cumulative,
      requestsTrend: trendPct(requests),
      tokensTrend: trendPct(days.map((d) => d.tokens)),
      weekTotal: last7.reduce((a, d) => a + d.requests, 0),
      dayTrend,
    };
  }, [tokenUsage]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: SURFACE }}>
        <span className="text-sm text-muted-foreground/70">Loading…</span>
      </div>
    );
  }
  if (!user) return null;

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
  const remaining = Math.max(0, FREE_DAILY_LIMIT - stats.todayRequests);
  const gridBorder = { border: `1px solid ${LINE}` };

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen" style={{ background: SURFACE }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(250,250,250,0.85)', borderBottom: `1px solid ${LINE}` }}
      >
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="font-serif text-lg tracking-tight text-foreground">
              Argos<span className="text-primary">.</span>
            </Link>
            <span className="hidden text-muted-foreground/40 sm:block">/</span>
            <span className="hidden text-sm text-muted-foreground sm:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2 hidden text-[12.5px] text-muted-foreground/70 sm:block">
              {isProActive ? 'Pro' : 'Free'}
            </span>
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

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9">
        {/* Masthead */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-foreground sm:text-[30px]">
              Welcome back, {userName}
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              {isProActive
                ? 'Pro plan · no daily cap on requests.'
                : `Free plan · ${remaining} of ${FREE_DAILY_LIMIT} messages left today.`}
            </p>
          </div>
          {isProActive ? (
            <button
              onClick={openCustomerPortal}
              className="self-start rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
              style={gridBorder}
            >
              Manage billing
            </button>
          ) : (
            <Link
              to="/#pricing"
              className="self-start rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-primary/90 sm:self-auto"
            >
              Upgrade to Pro →
            </Link>
          )}
        </div>

        {error && (
          <div
            className="mb-5 rounded-xl px-4 py-3 text-sm"
            style={{ border: '1px solid rgba(225,29,72,0.28)', background: 'rgba(225,29,72,0.06)', color: '#e11d48' }}
          >
            {error}
          </div>
        )}

        {dataLoading ? (
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ ...gridBorder, background: LINE }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[150px] animate-pulse" style={{ background: PANEL }} />
            ))}
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ ...gridBorder, background: LINE }}>
              <Kpi
                label="Requests this week"
                value={derived.weekTotal.toLocaleString()}
                pct={derived.requestsTrend}
              />
              <Kpi
                label="Requests today"
                value={stats.todayRequests.toLocaleString()}
                pct={derived.dayTrend}
                deltaSuffix="vs yesterday"
              />
              <Kpi
                label="Active projects"
                value={stats.projectsCount.toLocaleString()}
                hint={`${stats.sessionsCount.toLocaleString()} sessions tracked`}
              />
              <Kpi
                label="Research runs"
                value={`${stats.researchUsedInPeriod}/${stats.researchLimitInPeriod}`}
                hint={
                  isProActive
                    ? stats.currentPeriodEnd
                      ? `Resets ${new Date(stats.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      : 'This billing period'
                    : 'One per 30 days on Free'
                }
              />
            </div>

            {/* Charts */}
            <div className="mt-px grid gap-px lg:grid-cols-2" style={{ ...gridBorder, background: LINE, borderTop: 'none' }}>
              <div style={{ background: PANEL }}>
                <PanelHead
                  title="Daily activity"
                  sub="Requests run through Argos, last 7 days."
                  pill={<TrendPill pct={derived.requestsTrend} />}
                />
                <div className="mt-4">
                  <ActivityBars data={derived.bars} />
                </div>
              </div>
              <div style={{ background: PANEL }}>
                <PanelHead
                  title="Cumulative usage"
                  sub="Requests and tokens (thousands) building up over the week."
                  pill={<TrendPill pct={derived.tokensTrend} />}
                />
                <div className="mt-4">
                  <StepLines
                    data={derived.cumulative}
                    series={[
                      { key: 'Requests', color: '#18181b' },
                      { key: 'Tokens', color: '#a3a3a3', opacity: 0.9 },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div
              className="mt-px grid gap-px lg:grid-cols-[1.6fr_1fr_1fr]"
              style={{ ...gridBorder, background: LINE, borderTop: 'none' }}
            >
              <div style={{ background: PANEL }}><RecentPrompts prompts={prompts} /></div>
              <div style={{ background: PANEL }}>
                <PlanHealth
                  isPro={!!isProActive}
                  remaining={remaining}
                  limit={FREE_DAILY_LIMIT}
                  researchUsed={stats.researchUsedInPeriod}
                  researchLimit={stats.researchLimitInPeriod}
                />
              </div>
              <div style={{ background: PANEL }} id="activity">
                <ActivityFeed prompts={prompts} projects={projects} research={researchSessions} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
