import { useState, useEffect, useCallback } from 'react';
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

export interface ExtensionUser {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ResearchSession {
  id: string;
  query: string;
  status: string;
  summary: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface DashboardStats {
  totalRequests: number;
  totalTokens: number;
  todayRequests: number;
  todayTokens: number;
  weekRequests: number;
  weekTokens: number;
  lastActivity: string | null;
  projectsCount: number;
  conversationsCount: number;
  researchSessionsCount: number;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [extensionUser, setExtensionUser] = useState<ExtensionUser | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchSessions, setResearchSessions] = useState<ResearchSession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    totalTokens: 0,
    todayRequests: 0,
    todayTokens: 0,
    weekRequests: 0,
    weekTokens: 0,
    lastActivity: null,
    projectsCount: 0,
    conversationsCount: 0,
    researchSessionsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = user.id;

      // Fetch all data in parallel
      const [
        promptsResult,
        usageResult,
        extensionUserResult,
        projectsResult,
        researchResult,
        conversationsCountResult,
      ] = await Promise.all([
        // Prompts (last 100)
        supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        
        // Token usage for last 30 days
        supabase
          .from('token_usage')
          .select('*')
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('date', { ascending: true }),
        
        // Extension user profile
        supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single(),
        
        // Projects
        supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        
        // Research sessions (last 10)
        supabase
          .from('research_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10),
        
        // Conversations count
        supabase
          .from('standalone_conversations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),
      ]);

      // Handle prompts
      if (promptsResult.error) throw promptsResult.error;
      setPrompts(promptsResult.data || []);

      // Handle token usage
      if (usageResult.error) throw usageResult.error;
      const usageData = usageResult.data || [];
      setTokenUsage(usageData);

      // Handle extension user (may not exist)
      if (extensionUserResult.data) {
        setExtensionUser(extensionUserResult.data);
      }

      // Handle projects
      if (projectsResult.error) throw projectsResult.error;
      setProjects(projectsResult.data || []);

      // Handle research sessions
      if (researchResult.error) throw researchResult.error;
      setResearchSessions(researchResult.data || []);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const weekAgoStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const totalRequests = usageData.reduce((sum, d) => sum + (d.total_requests || 0), 0);
      const totalTokens = usageData.reduce((sum, d) => sum + (d.total_tokens || 0), 0);
      
      const todayData = usageData.find(d => d.date === today);
      const weekData = usageData.filter(d => d.date >= weekAgoStr);
      
      const weekRequests = weekData.reduce((sum, d) => sum + (d.total_requests || 0), 0);
      const weekTokens = weekData.reduce((sum, d) => sum + (d.total_tokens || 0), 0);

      const lastActivity = promptsResult.data && promptsResult.data.length > 0 
        ? promptsResult.data[0].created_at 
        : null;

      setStats({
        totalRequests,
        totalTokens,
        todayRequests: todayData?.total_requests || 0,
        todayTokens: todayData?.total_tokens || 0,
        weekRequests,
        weekTokens,
        lastActivity,
        projectsCount: projectsResult.data?.length || 0,
        conversationsCount: conversationsCountResult.count || 0,
        researchSessionsCount: researchResult.data?.length || 0,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch on window focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  return { 
    prompts, 
    tokenUsage, 
    extensionUser,
    projects,
    researchSessions,
    stats, 
    loading, 
    error, 
    refetch: fetchData 
  };
};
