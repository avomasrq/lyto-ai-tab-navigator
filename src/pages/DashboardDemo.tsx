/* ────────────────────────────────────────────────────────────────────────────
   /dashboard-demo — the real dashboard components fed with representative
   data, for capturing marketing screenshots. Not linked from anywhere.
   Add ?plan=free to see the free-tier variant.
   ──────────────────────────────────────────────────────────────────────────── */
import { Link, useSearchParams } from 'react-router-dom';
import { Kpi, PanelHead, TrendPill, LINE, SURFACE, PANEL } from '@/components/dashboard/ui';
import { ActivityBars, StepLines } from '@/components/dashboard/charts';
import { RecentPrompts, PlanHealth, ActivityFeed } from '@/components/dashboard/panels';
import { MeanderBand } from '@/components/ui/greek-tablet';

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();
const MIN = 6e4, HOUR = 36e5, DAY = 864e5;

/* a week that climbs, with a realistic dip on the weekend */
const WEEK = [
  { label: 'Mon', requests: 38, tokens: 41_200 },
  { label: 'Tue', requests: 45, tokens: 52_800 },
  { label: 'Wed', requests: 61, tokens: 68_400 },
  { label: 'Thu', requests: 54, tokens: 60_100 },
  { label: 'Fri', requests: 72, tokens: 84_600 },
  { label: 'Sat', requests: 33, tokens: 36_900 },
  { label: 'Sun', requests: 47, tokens: 55_300 },
];

const bars = WEEK.map((d) => ({ label: d.label, value: d.requests }));

let r = 0, t = 0;
const cumulative = WEEK.map((d) => {
  r += d.requests;
  t += d.tokens;
  return { label: d.label, Requests: r, Tokens: Math.round(t / 1000) };
});

const prompts = [
  { id: '1', promptText: 'Turn q2-sales.csv into a PDF report with charts by region', createdAt: ago(9 * MIN), tokensUsed: 4820 },
  { id: '2', promptText: 'Find the cheapest flight ALA to DXB on Friday and open checkout', createdAt: ago(3 * HOUR), tokensUsed: 2140 },
  { id: '3', promptText: 'Sort my Downloads folder into project folders', createdAt: ago(26 * HOUR), tokensUsed: 1960 },
  { id: '4', promptText: 'Summarize every competitor pricing page and flag changes', createdAt: ago(2 * DAY), tokensUsed: 3310 },
  { id: '5', promptText: 'Draft replies to the unread invoices in Gmail', createdAt: ago(4 * DAY), tokensUsed: 2870 },
] as never[];

const projects = [
  { id: 'a', title: 'Competitor watch', description: null, isActive: true, createdAt: ago(11 * HOUR) },
  { id: 'b', title: 'Q2 board report', description: null, isActive: true, createdAt: ago(3 * DAY) },
] as never[];

const research = [
  { id: 'r1', query: 'Best CRM for a five person sales team in 2026', status: 'completed', createdAt: ago(7 * HOUR) },
  { id: 'r2', query: 'Polar vs Stripe billing fees for SaaS', status: 'running', createdAt: ago(2 * DAY) },
] as never[];

export default function DashboardDemo() {
  const [params] = useSearchParams();
  const isPro = params.get('plan') !== 'free';

  const gridBorder = { border: `1px solid ${LINE}` };
  const weekTotal = WEEK.reduce((a, d) => a + d.requests, 0);

  return (
    <div className="min-h-screen" style={{ background: SURFACE }}>
      <header
        className="sticky top-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(244,239,232,0.85)', borderBottom: `1px solid ${LINE}` }}
      >
        <MeanderBand className="absolute inset-x-0 bottom-0 opacity-40" color="#8a6d3b" />
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Link to="/" className="font-geometric text-lg font-medium tracking-tight text-foreground">
              Argos<span className="text-primary">.</span>
            </Link>
            <span className="hidden text-muted-foreground/40 sm:block">/</span>
            <span className="hidden text-sm text-muted-foreground sm:block">Dashboard</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2 hidden text-[12.5px] text-muted-foreground/70 sm:block">{isPro ? 'Pro' : 'Free'}</span>
            <span className="rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted-foreground">Refresh</span>
            <span className="hidden rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted-foreground sm:block">Sign out</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-geometric text-[26px] font-semibold tracking-tight text-foreground sm:text-[30px]">
              Welcome back, Arystan
            </h1>
            <p className="mt-1.5 text-[14px] text-muted-foreground">
              {isPro ? 'Pro plan · no daily cap on requests.' : 'Free plan · 18 of 25 messages left today.'}
            </p>
          </div>
          {isPro ? (
            <span
              className="self-start rounded-full px-4 py-2 text-[13px] font-medium text-muted-foreground sm:self-auto"
              style={gridBorder}
            >
              Manage billing
            </span>
          ) : (
            <span className="self-start rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-white sm:self-auto">
              Upgrade to Pro →
            </span>
          )}
        </div>

        {/* KPIs */}
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ ...gridBorder, background: LINE }}>
          <Kpi label="Requests this week" value={weekTotal.toLocaleString()} pct={28.4} />
          <Kpi label="Requests today" value="47" pct={12.1} deltaSuffix="vs yesterday" />
          <Kpi label="Active projects" value="18" hint="1,240 sessions tracked" />
          <Kpi
            label="Research runs"
            value={isPro ? '5/7' : '1/1'}
            hint={isPro ? 'Resets Aug 12' : 'One per 30 days on Free'}
          />
        </div>

        {/* Charts */}
        <div className="mt-px grid gap-px lg:grid-cols-2" style={{ ...gridBorder, background: LINE, borderTop: 'none' }}>
          <div style={{ background: PANEL }}>
            <PanelHead title="Daily activity" sub="Requests run through Argos, last 7 days." pill={<TrendPill pct={28.4} />} />
            <div className="mt-4"><ActivityBars data={bars} /></div>
          </div>
          <div style={{ background: PANEL }}>
            <PanelHead
              title="Cumulative usage"
              sub="Requests and tokens (thousands) building up over the week."
              pill={<TrendPill pct={34.7} />}
            />
            <div className="mt-4">
              <StepLines
                data={cumulative}
                series={[{ key: 'Requests', color: '#18181b' }, { key: 'Tokens', color: '#a3a3a3', opacity: 0.9 }]}
              />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-px grid gap-px lg:grid-cols-[1.6fr_1fr_1fr]" style={{ ...gridBorder, background: LINE, borderTop: 'none' }}>
          <div style={{ background: PANEL }}><RecentPrompts prompts={prompts} /></div>
          <div style={{ background: PANEL }}>
            <PlanHealth isPro={isPro} remaining={18} limit={25} researchUsed={5} researchLimit={7} />
          </div>
          <div style={{ background: PANEL }}>
            <ActivityFeed prompts={prompts} projects={projects} research={research} />
          </div>
        </div>
      </main>
    </div>
  );
}
