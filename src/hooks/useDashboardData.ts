import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Prompt {
  id: string;
  prompt_text: string;
  response_text: string | null;
  tokens_used: number;
  prompt_tokens: number;
  completion_tokens: number;
  model: string | null;
  created_at: string;
}

export interface TokenUsage {
  date: string;
  total_requests: number;
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
}

export interface DashboardStats {
  totalRequests: number;
  totalTokens: number;
  todayRequests: number;
  todayTokens: number;
  weekRequests: number;
  weekTokens: number;
  lastActivity: string | null;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    totalTokens: 0,
    todayRequests: 0,
    todayTokens: 0,
    weekRequests: 0,
    weekTokens: 0,
    lastActivity: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch prompts (last 100)
        const { data: promptsData, error: promptsError } = await supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (promptsError) throw promptsError;
        setPrompts(promptsData || []);

        // Fetch token usage for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: usageData, error: usageError } = await supabase
          .from('token_usage')
          .select('*')
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: true });

        if (usageError) throw usageError;
        setTokenUsage(usageData || []);

        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];

        const totalRequests = (usageData || []).reduce((sum, d) => sum + d.total_requests, 0);
        const totalTokens = (usageData || []).reduce((sum, d) => sum + d.total_tokens, 0);
        
        const todayData = (usageData || []).find(d => d.date === today);
        const weekData = (usageData || []).filter(d => d.date >= weekAgoStr);
        
        const weekRequests = weekData.reduce((sum, d) => sum + d.total_requests, 0);
        const weekTokens = weekData.reduce((sum, d) => sum + d.total_tokens, 0);

        const lastActivity = promptsData && promptsData.length > 0 
          ? promptsData[0].created_at 
          : null;

        setStats({
          totalRequests,
          totalTokens,
          todayRequests: todayData?.total_requests || 0,
          todayTokens: todayData?.total_tokens || 0,
          weekRequests,
          weekTokens,
          lastActivity,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, refreshKey]);

  return { prompts, tokenUsage, stats, loading, error, refetch };
};
