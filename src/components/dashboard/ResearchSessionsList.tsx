import type { ResearchSession } from '@/hooks/useDashboardData';
import { cn } from '@/lib/utils';
import { Panel, PanelEmpty } from './Panel';

interface ResearchSessionsListProps {
  sessions: ResearchSession[];
}

/* status as a dot + word — no icon set, no spinner chrome */
const STATUS: Record<string, { label: string; dot: string; pulse?: boolean }> = {
  completed:   { label: 'Completed',   dot: 'bg-green-500' },
  in_progress: { label: 'In progress', dot: 'bg-primary', pulse: true },
  running:     { label: 'In progress', dot: 'bg-primary', pulse: true },
  pending:     { label: 'Queued',      dot: 'bg-muted-foreground/30' },
  failed:      { label: 'Failed',      dot: 'bg-destructive' },
  error:       { label: 'Failed',      dot: 'bg-destructive' },
};

export const ResearchSessionsList = ({ sessions }: ResearchSessionsListProps) => (
  <Panel
    title="Research"
    meta={sessions.length > 0 ? `${sessions.length} recent` : undefined}
    className="h-full"
    bodyClassName="overflow-y-auto max-h-[320px]"
  >
    {sessions.length === 0 ? (
      <PanelEmpty>No research runs yet. Start one from the extension and it'll appear here.</PanelEmpty>
    ) : (
      <ul className="divide-y divide-border/50">
        {sessions.map((session) => {
          const s = STATUS[session.status] ?? { label: session.status, dot: 'bg-muted-foreground/30' };
          return (
            <li key={session.id} className="px-5 py-3.5 transition-colors hover:bg-muted/40">
              <p className="text-[13.5px] leading-snug text-foreground line-clamp-2">{session.query}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', s.dot, s.pulse && 'animate-pulse')} />
                <span className="text-[11px] text-muted-foreground/70">{s.label}</span>
                <span className="ml-auto text-[11px] tabular-nums text-muted-foreground/50">
                  {new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </Panel>
);
