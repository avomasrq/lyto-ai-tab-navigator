import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight, MessageSquare, Zap } from 'lucide-react';
import { Prompt } from '@/hooks/useDashboardData';

interface PromptHistoryProps {
  prompts: Prompt[];
}

export const PromptHistory = ({ prompts }: PromptHistoryProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 10;

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
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="glow-box">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-medium">Prompt History</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {paginatedPrompts.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            {prompts.length === 0 ? 'No prompts yet. Start using Lyto AI!' : 'No matching prompts found'}
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {paginatedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/20 hover:bg-card/80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <p className="font-medium text-sm line-clamp-2">{prompt.prompt_text}</p>
                      </div>
                      {prompt.response_text && (
                        <p className="text-sm text-muted-foreground line-clamp-2 pl-6">
                          {prompt.response_text}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
                      <span>{formatDate(prompt.created_at)}</span>
                      {prompt.tokens_used > 0 && (
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {prompt.tokens_used.toLocaleString()} tokens
                        </span>
                      )}
                      {prompt.model && (
                        <span className="rounded bg-muted px-1.5 py-0.5">{prompt.model}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredPrompts.length)} of {filteredPrompts.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
