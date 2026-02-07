import { Search, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import type { ResearchSession } from '@/hooks/useDashboardData';

interface ResearchSessionsListProps {
  sessions: ResearchSession[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-3.5 w-3.5 text-primary" />;
    case 'in_progress':
    case 'running':
      return <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />;
    case 'pending':
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
    case 'failed':
    case 'error':
      return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
    default:
      return <Clock className="h-3.5 w-3.5 text-muted-foreground" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
    case 'running':
      return 'In Progress';
    case 'pending':
      return 'Pending';
    case 'failed':
    case 'error':
      return 'Failed';
    default:
      return status;
  }
};

export const ResearchSessionsList = ({ sessions }: ResearchSessionsListProps) => {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Research Sessions</h3>
        </div>
        <p className="text-sm text-muted-foreground">No research sessions yet. Start researching in the extension.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">Recent Research</h3>
        <span className="ml-auto text-xs text-muted-foreground">{sessions.length} recent</span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="group p-3 rounded-lg border border-border/30 bg-background/50 hover:border-primary/30 hover:bg-card transition-all"
          >
            <div className="flex items-start gap-2">
              {getStatusIcon(session.status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{session.query}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-foreground">
                    {getStatusLabel(session.status)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">
                    {new Date(session.created_at).toLocaleDateString()}
                  </span>
                </div>
                {session.summary && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {session.summary}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
