import { useState, useMemo } from 'react';
import { Prompt } from '@/hooks/useDashboardData';
import { Panel, PanelEmpty } from './Panel';

interface PromptHistoryProps {
  prompts: Prompt[];
}

export const PromptHistory = ({ prompts }: PromptHistoryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filteredPrompts = useMemo(() => {
    if (!search.trim()) return prompts;
    const searchLower = search.toLowerCase();
    return prompts.filter(
      p =>
        p.promptText.toLowerCase().includes(searchLower) ||
        (p.responseText && p.responseText.toLowerCase().includes(searchLower))
    );
  }, [prompts, search]);

  const totalPages = Math.ceil(filteredPrompts.length / perPage);
  const paginatedPrompts = filteredPrompts.slice((page - 1) * perPage, page * perPage);

  const formatDate = (dateStr: string) => {
    // Postgres `timestamp` comes back with no zone → parse as UTC, not local time.
    const hasZone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(dateStr);
    const date = new Date(hasZone ? dateStr : `${dateStr}Z`);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Panel
      title="Recent prompts"
      meta={prompts.length > 0 ? `${filteredPrompts.length}` : undefined}
      className="h-full"
      bodyClassName="flex flex-col"
    >
      {prompts.length > 0 && (
        <div className="px-5 py-3 border-b border-border/50">
          <input
            placeholder="Search…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/45 outline-none"
          />
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto">
        {paginatedPrompts.length === 0 ? (
          <PanelEmpty>
            {prompts.length === 0
              ? 'Your conversations with Lyto will be listed here.'
              : 'Nothing matches that search.'}
          </PanelEmpty>
        ) : (
          <ul className="divide-y divide-border/50">
            {paginatedPrompts.map((prompt) => (
              <li key={prompt.id} className="px-5 py-3.5 transition-colors hover:bg-muted/40">
                <p className="text-[13px] leading-relaxed text-foreground/90 line-clamp-3">
                  {prompt.promptText}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[11px] tabular-nums text-muted-foreground/50">
                  <span>{formatDate(prompt.createdAt)}</span>
                  {prompt.tokensUsed && prompt.tokensUsed > 0 && (
                    <>
                      <span className="text-muted-foreground/25">·</span>
                      <span>{prompt.tokensUsed.toLocaleString()} tokens</span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-border/50">
          <span className="text-[11px] tabular-nums text-muted-foreground/50">
            {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              ←
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
};
