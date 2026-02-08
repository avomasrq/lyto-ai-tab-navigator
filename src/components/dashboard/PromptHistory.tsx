import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { Prompt } from '@/hooks/useDashboardData';

interface PromptHistoryProps {
  prompts: Prompt[];
}

export const PromptHistory = ({ prompts }: PromptHistoryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

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
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-8 pl-8 text-xs bg-background/50 border-border/30"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-2">
        {paginatedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-muted-foreground/40" />
            </div>
            <p className="text-xs text-muted-foreground">
              {prompts.length === 0 ? 'No prompts yet' : 'No results'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {paginatedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="rounded-lg bg-background/40 hover:bg-background/70 p-3 transition-colors"
              >
                <p className="text-xs font-medium leading-relaxed line-clamp-2 mb-2">
                  {prompt.promptText}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                  <span>{formatDate(prompt.createdAt)}</span>
                  {prompt.tokensUsed && prompt.tokensUsed > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Zap className="h-2.5 w-2.5" />
                      {prompt.tokensUsed.toLocaleString()}
                    </span>
                  )}
                  {prompt.model && (
                    <span className="px-1 py-0.5 rounded bg-muted/50 uppercase tracking-wide">
                      {prompt.model.replace('gpt-', '')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-3 py-2 border-t border-border/30 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            {filteredPrompts.length} total
          </p>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="h-6 w-6 p-0"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-[10px] text-muted-foreground px-1.5">
              {page}/{totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="h-6 w-6 p-0"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
