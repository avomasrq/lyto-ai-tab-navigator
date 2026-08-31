import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { usePolar } from '@/hooks/usePolar';
import { fetchUsage, refillLabel, type Usage } from '@/lib/usage';
import { Kpi, PanelHead, TrendPill, GlassCard, Backdrop, DashboardHeader, LINE } from '@/components/dashboard/ui';
import { ActivityBars, StepLines } from '@/components/dashboard/charts';
import { RecentPrompts, PlanHealth, ActivityFeed } from '@/components/dashboard/panels';
import { InstallCta, useInstallEnv } from '@/components/InstallCta';
import { PANEL_SHORTCUT, canInstallExtension, isChrome } from '@/lib/store';
import { toast } from 'sonner';

/**
 * The free allowance is no longer a number this page knows.
 *
 * It was 25 a day, hardcoded here and compared against today's requests. The plan is
 * now 50 tasks a week counted from each user's own signup weekday, which this side
 * cannot derive — so the numbers come from /api/me/usage, the same source the
 * extension panel reads. Until they arrive, nothing about a quota is shown.
 */

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

  /**
   * Signed up, never ran anything. For this account the usual dashboard is a wall
   * of zeroes and empty charts whose only call to action is "Upgrade to Pro" —
   * an upsell to someone who has not used the product once. Half of everyone who
   * finishes onboarding is in this state, so it gets the screen that tells them
   * what is actually missing: the extension.
   */
  const neverUsed = !dataLoading && stats.totalRequests === 0 && !stats.lastActivity;

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
      <div className="relative flex min-h-screen items-center justify-center">
        <Backdrop />
        <span className="text-sm text-muted-foreground/70">Loading…</span>
      </div>
    );
  }
  if (!user) return null;

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';
  const [usage, setUsage] = useState<Usage | null>(null);
  useEffect(() => {
    let alive = true;
    void fetchUsage().then((u) => { if (alive) setUsage(u); });
    return () => { alive = false; };
  }, []);
  const remaining = usage ? usage.remainingThisWeek : null;
  const weeklyLimit = usage?.weeklyLimit ?? null;

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="relative min-h-screen">
      <Backdrop />
      <DashboardHeader>
          <div className="flex items-center gap-2.5">
            <Link to="/" className="font-geometric text-lg font-medium tracking-tight text-foreground">
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
      </DashboardHeader>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9">
        {/* Masthead */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-geometric text-[26px] font-semibold tracking-tight text-foreground sm:text-[30px]">
              Welcome back, {userName}
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              {isProActive
                ? 'Pro plan · no limits.'
                : remaining !== null && weeklyLimit
                  ? `Free plan · ${remaining} of ${weeklyLimit} tasks left this week.`
                  : 'Free plan'}
            </p>
          </div>
          {isProActive ? (
            <button
              onClick={openCustomerPortal}
              className="lg-glass self-start rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
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

        {/* No outer container. The panels used to live inside one rounded,
            bordered box with gap-px seams between them, which is what made the
            screen read as a single slab — one shape, one shadow, nothing on it
            separable from anything else. They are free-standing cards now and
            the gaps are real gaps, so the page has a rhythm instead of a grid. */}
        {dataLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i} className="h-[150px] animate-pulse">{null}</GlassCard>
            ))}
          </div>
        ) : neverUsed ? (
          <NotInstalledYet email={user?.email} />
        ) : (
          <>
            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <GlassCard>
                <PanelHead
                  title="Daily activity"
                  sub="Requests run through Argos, last 7 days."
                  pill={<TrendPill pct={derived.requestsTrend} />}
                />
                <div className="mt-4">
                  <ActivityBars data={derived.bars} />
                </div>
              </GlassCard>
              <GlassCard>
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
              </GlassCard>
            </div>

            {/* Bottom row */}
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
              <GlassCard><RecentPrompts prompts={prompts} /></GlassCard>
              <GlassCard>
                <PlanHealth
                  isPro={!!isProActive}
                  remaining={remaining}
                  limit={weeklyLimit ?? 0}
                  refill={refillLabel(usage?.resetsAt ?? null)}
                  researchUsed={stats.researchUsedInPeriod}
                  researchLimit={stats.researchLimitInPeriod}
                />
              </GlassCard>
              <GlassCard className="scroll-mt-24" id="activity">
                <ActivityFeed prompts={prompts} projects={projects} research={researchSessions} />
              </GlassCard>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

/**
 * Spec §6 — the fallback runway. Someone can close the tab on the install screen
 * and come back tomorrow; they used to land on empty charts and an offer to buy
 * Pro. Same copy as the onboarding finale, same four states, so the answer does
 * not change depending on which door they came through.
 */
function NotInstalledYet({ email }: { email?: string | null }) {
  const env = useInstallEnv();

  const steps = [
    { n: '1', title: 'Add Argos to Chrome', body: 'It installs from the Chrome Web Store in a couple of clicks.' },
    { n: '2', title: 'Pin it to your toolbar', body: 'Click the puzzle icon in Chrome, then the pin next to Argos.' },
    { n: '3', title: 'Open the panel on any page', body: `Ask it to fill the form, tidy your tabs, or pull what you need off the page. ${PANEL_SHORTCUT} opens it anywhere.` },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <GlassCard className="px-6 py-7 sm:px-8 sm:py-9">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">Start here</p>
        <h2 className="mt-2 font-geometric text-[22px] font-semibold tracking-tight text-foreground sm:text-[26px]">
          {env.installed
            ? "You're all set"
            : !canInstallExtension(env.device)
              ? 'Argos runs in Chrome on a computer'
              : !isChrome(env.browser)
                ? 'Argos needs Chrome'
                : "Your account is ready — Argos isn't installed yet"}
        </h2>
        <div className="mt-3 max-w-sm">
          <InstallCta env={env} email={email} />
        </div>
      </GlassCard>

      <GlassCard className="px-6 py-7 sm:px-8 sm:py-9">
        <ol className="space-y-5">
          {steps.map((s) => (
            <li key={s.n} className="flex gap-3.5">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-muted-foreground"
                style={{ border: `1px solid ${LINE}` }}
              >
                {s.n}
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-foreground">{s.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </GlassCard>
    </div>
  );
}

export default Dashboard;
