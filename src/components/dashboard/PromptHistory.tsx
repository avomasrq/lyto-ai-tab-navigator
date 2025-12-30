import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, MessageSquare, Zap, Sparkles } from 'lucide-react';
import { Prompt } from '@/hooks/useDashboardData';

interface PromptHistoryProps {
  prompts: Prompt[];
}

export const PromptHistory = ({ prompts }: PromptHistoryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filteredPrompts = useMemo(() => {
    if (!search.trim()) return prompts;
    const searchLower = search.toLowerCase();
    return prompts.filter(
      p => 
        p.prompt_text.toLowerCase().includes(searchLower) ||
        (p.response_text && p.response_text.toLowerCase().includes(searchLower))
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

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            <Input
              placeholder="Search your prompts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/30 transition-colors"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredPrompts.length} {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {paginatedPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-medium mb-1">
              {prompts.length === 0 ? 'No prompts yet' : 'No matching prompts'}
            </p>
            <p className="text-sm text-muted-foreground/60">
              {prompts.length === 0 
                ? 'Start using Lyto AI to see your history here' 
                : 'Try a different search term'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {paginatedPrompts.map((prompt, index) => (
              <div
                key={prompt.id}
                className="group relative rounded-xl border border-transparent hover:border-border bg-background/30 hover:bg-background/60 p-4 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm leading-relaxed line-clamp-2 mb-1">
                      {prompt.prompt_text}
                    </p>
                    {prompt.response_text && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {prompt.response_text}
                      </p>
                    )}
                  </div>
                  
                  {/* Meta */}
                  <div className="shrink-0 flex flex-col items-end gap-1 text-xs text-muted-foreground/70">
                    <span>{formatDate(prompt.created_at)}</span>
                    {prompt.tokens_used > 0 && (
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {prompt.tokens_used.toLocaleString()}
                      </span>
                    )}
                    {prompt.model && (
                      <span className="px-1.5 py-0.5 rounded bg-muted/50 text-[10px] uppercase tracking-wide">
                        {prompt.model.replace('gpt-', '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredPrompts.length)} of {filteredPrompts.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
