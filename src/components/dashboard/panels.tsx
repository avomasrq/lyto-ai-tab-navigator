import type { Prompt, Project, ResearchSession } from '@/hooks/useDashboardData';
import { LINE, PanelHead, PanelLink } from './ui';

/* Postgres `timestamp` comes back without a zone — parse as UTC, not local. */
const asDate = (s: string) => {
  const hasZone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(s);
  return new Date(hasZone ? s : `${s}Z`);
};

export const relTime = (s: string | null) => {
  if (!s) return '—';
  const diff = Date.now() - asDate(s).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `About ${h}h ago`;
  if (d === 1) return 'Yesterday';
  if (d < 30) return `${d} days ago`;
  return asDate(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Empty = ({ children }: { children: string }) => (
  <div className="flex flex-1 items-center justify-center px-6 py-12">
    <p className="max-w-[28ch] text-center text-[13.5px] leading-relaxed text-muted-foreground/60">{children}</p>
  </div>
);

/* ── Recent prompts, as a table with the tail fading out ── */
export function RecentPrompts({ prompts }: { prompts: Prompt[] }) {
  const rows = prompts.slice(0, 4);

  return (
    <div className="flex h-full flex-col">
      <PanelHead title="Recent prompts" sub="What you last asked Argos to do." />
      {rows.length === 0 ? (
        <Empty>Your conversations with Argos will show up here once you start using the extension.</Empty>
      ) : (
        <>
          <div className="mt-5 flex-1">
            <div
              className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-[13.5px] font-medium text-muted-foreground sm:px-6"
              style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
            >
              <span>Prompt</span>
              <span className="text-right">When</span>
              <span className="w-[68px] text-right">Tokens</span>
            </div>
            {rows.map((p, i) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/45 sm:px-6"
                style={{ borderBottom: `1px solid ${LINE}`, opacity: 1 - i * 0.22 }}
              >
                <span className="truncate text-[14.5px] font-semibold text-foreground">{p.promptText || 'Untitled'}</span>
                <span className="whitespace-nowrap text-right text-[13.5px] text-muted-foreground/70 tabular-nums">
                  {relTime(p.createdAt)}
                </span>
                <span className="w-[68px] text-right text-[14.5px] font-semibold text-foreground tabular-nums">
                  {p.tokensUsed ? p.tokensUsed.toLocaleString() : '—'}
                </span>
              </div>
            ))}
          </div>
          {prompts.length > rows.length && <PanelLink to="#activity">View all</PanelLink>}
        </>
      )}
    </div>
  );
}

/* ── Plan health: the "You're caught up" state, or the quota running low ── */
export function PlanHealth({
  isPro, remaining, limit, researchUsed, researchLimit,
}: {
  isPro: boolean; remaining: number; limit: number; researchUsed: number; researchLimit: number;
}) {
  const low = !isPro && remaining <= 5;
  const out = !isPro && remaining === 0;

  const headline = out ? "You're out for today." : low ? 'Running low.' : "You're all set.";
  const body = out
    ? `You've used all ${limit} free messages. They reset at midnight, or go Pro for no daily cap.`
    : low
      ? `${remaining} of ${limit} messages left today. Pro removes the cap entirely.`
      : isPro
        ? `No limits on requests. ${researchUsed} of ${researchLimit} research runs used this period.`
        : `${remaining} of ${limit} messages left today. Nothing needs your attention.`;

  return (
    <div className="flex h-full flex-col">
      <PanelHead title="Plan health" sub={out || low ? 'Your daily quota needs attention.' : 'Nothing urgent needs your attention.'} />

      <div
        className="mt-5 flex flex-1 flex-col items-center justify-center px-6 py-8 text-center"
        style={{ borderTop: `1px solid ${LINE}` }}
      >
        <span
          className="lg-glass flex h-12 w-12 items-center justify-center rounded-[15px]"
          style={out || low ? { background: 'rgba(225,29,72,0.10)' } : undefined}
        >
          {out || low ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#e11d48" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5" strokeLinecap="round" /><path d="M12 16.2v.3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#18181b" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="9" /><path d="M8.5 12.3l2.4 2.4 4.6-4.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>

        <p className="mt-5 text-[26px] font-bold leading-tight tracking-tight text-foreground">{headline}</p>
        <p className="mt-3 max-w-[30ch] text-[14px] leading-relaxed text-muted-foreground">{body}</p>
      </div>

      <div style={{ borderTop: `1px solid ${LINE}` }}>
        {isPro ? (
          <PanelLink to="/settings">Manage your plan</PanelLink>
        ) : (
          <PanelLink to="/#pricing">Upgrade to Pro</PanelLink>
        )}
      </div>
    </div>
  );
}

/* ── Activity: prompts, projects and research runs merged into one feed ── */
type Item = { id: string; kind: 'prompt' | 'project' | 'research'; text: string; at: string };

const GLYPH: Record<Item['kind'], JSX.Element> = {
  prompt: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M20 15a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2h12a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  research: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" strokeLinecap="round" />
    </svg>
  ),
};

export function ActivityFeed({
  prompts, projects, research,
}: { prompts: Prompt[]; projects: Project[]; research: ResearchSession[] }) {
  const items: Item[] = [
    ...prompts.slice(0, 5).map((p) => ({ id: `p${p.id}`, kind: 'prompt' as const, text: p.promptText || 'Prompt', at: p.createdAt })),
    ...projects.slice(0, 5).map((p) => ({ id: `j${p.id}`, kind: 'project' as const, text: p.title || 'Project', at: p.createdAt })),
    ...research.slice(0, 5).map((r) => ({ id: `r${r.id}`, kind: 'research' as const, text: r.query || 'Research', at: r.createdAt })),
  ]
    .filter((i) => i.at)
    .sort((a, b) => asDate(b.at).getTime() - asDate(a.at).getTime())
    .slice(0, 4);

  return (
    <div className="flex h-full flex-col">
      <PanelHead title="Activity" sub="Latest updates in your workspace." />
      {items.length === 0 ? (
        <Empty>Nothing has happened yet. Activity from the extension and the CLI lands here.</Empty>
      ) : (
        <div className="mt-5 flex-1" style={{ borderTop: `1px solid ${LINE}` }}>
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-white/45 sm:px-6" style={{ borderBottom: `1px solid ${LINE}` }}>
              <span className="lg-glass flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] text-muted-foreground">
                {GLYPH[it.kind]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-semibold text-foreground">{it.text}</span>
                <span className="mt-0.5 block text-[13px] text-muted-foreground/70">{relTime(it.at)}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
