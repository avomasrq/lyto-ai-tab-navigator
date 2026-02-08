import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Prompt {
  id: string;
  promptText: string;
  responseText: string | null;
  tokensUsed: number | null;
  promptTokens: number | null;
  completionTokens: number | null;
  model: string | null;
  createdAt: string;
}

export interface TokenUsage {
  date: string;
  totalRequests: number | null;
  totalTokens: number | null;
  promptTokens: number | null;
  completionTokens: number | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchSession {
  id: string;
  query: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  polarSubscriptionId: string | null;
  polarCustomerId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  theme: string;
  defaultLanguage: string;
  writingStyle: string;
  maxTokens: number;
}

export interface UserMemory {
  id: string;
  kind: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
  memoriesCount: number;
}

export const useDashboardData = () => {
  const { user, session } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchSessions, setResearchSessions] = useState<ResearchSession[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [userMemories, setUserMemories] = useState<UserMemory[]>([]);
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
    memoriesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user || !session?.access_token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all data from Supabase tables in parallel
      const [
        promptsResult,
        usageResult,
        projectsResult,
        sessionsResult,
        subscriptionResult,
        settingsResult,
        memoriesResult,
        conversationsResult,
      ] = await Promise.all([
        supabase
          .from('Prompt')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false })
          .limit(100),
        supabase
          .from('TokenUsage')
          .select('*')
          .eq('userId', user.id)
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('date', { ascending: true }),
        supabase
          .from('Project')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false }),
        supabase
          .from('ResearchSession')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false })
          .limit(10),
        supabase
          .from('Subscription')
          .select('*')
          .eq('userId', user.id)
          .single(),
        supabase
          .from('UserSettings')
          .select('*')
          .eq('userId', user.id)
          .single(),
        supabase
          .from('UserMemory')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false })
          .limit(50),
        supabase
          .from('ConversationEvent')
          .select('id')
          .eq('userId', user.id),
      ]);

      // Handle prompts
      if (promptsResult.error && promptsResult.error.code !== 'PGRST116') {
        console.error('Prompts error:', promptsResult.error);
      }
      const promptsData = (promptsResult.data || []).map(p => ({
        id: p.id,
        promptText: p.promptText,
        responseText: p.responseText,
        tokensUsed: p.tokensUsed,
        promptTokens: p.promptTokens,
        completionTokens: p.completionTokens,
        model: p.model,
        createdAt: p.createdAt,
      }));
      setPrompts(promptsData);

      // Handle token usage
      if (usageResult.error && usageResult.error.code !== 'PGRST116') {
        console.error('TokenUsage error:', usageResult.error);
      }
      const usageData = (usageResult.data || []).map(u => ({
        date: u.date,
        totalRequests: u.totalRequests,
        totalTokens: u.totalTokens,
        promptTokens: u.promptTokens,
        completionTokens: u.completionTokens,
      }));
      setTokenUsage(usageData);

      // Handle projects
      if (projectsResult.error && projectsResult.error.code !== 'PGRST116') {
        console.error('Projects error:', projectsResult.error);
      }
      const projectsData = (projectsResult.data || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setProjects(projectsData);

      // Handle research sessions
      if (sessionsResult.error && sessionsResult.error.code !== 'PGRST116') {
        console.error('ResearchSessions error:', sessionsResult.error);
      }
      const sessionsData = (sessionsResult.data || []).map(s => ({
        id: s.id,
        query: s.query,
        status: s.status,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));
      setResearchSessions(sessionsData);

      // Handle subscription (can be null if not found)
      if (subscriptionResult.data) {
        setSubscription({
          id: subscriptionResult.data.id,
          plan: subscriptionResult.data.plan,
          status: subscriptionResult.data.status,
          polarSubscriptionId: subscriptionResult.data.polarSubscriptionId,
          polarCustomerId: subscriptionResult.data.polarCustomerId,
          currentPeriodStart: subscriptionResult.data.currentPeriodStart,
          currentPeriodEnd: subscriptionResult.data.currentPeriodEnd,
          createdAt: subscriptionResult.data.createdAt,
        });
      }

      // Handle user settings (can be null if not found)
      if (settingsResult.data) {
        setUserSettings({
          userId: settingsResult.data.userId,
          theme: settingsResult.data.theme,
          defaultLanguage: settingsResult.data.defaultLanguage,
          writingStyle: settingsResult.data.writingStyle,
          maxTokens: settingsResult.data.maxTokens,
        });
      }

      // Handle user memories
      if (memoriesResult.error && memoriesResult.error.code !== 'PGRST116') {
        console.error('UserMemories error:', memoriesResult.error);
      }
      const memoriesData = (memoriesResult.data || []).map(m => ({
        id: m.id,
        kind: m.kind,
        content: m.content,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }));
      setUserMemories(memoriesData);

      // Calculate stats from token usage
      const today = new Date().toISOString().split('T')[0];
      const weekAgoStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const totalRequests = usageData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
      const totalTokens = usageData.reduce((sum, d) => sum + (d.totalTokens || 0), 0);
      
      const todayData = usageData.find(d => d.date.startsWith(today));
      const weekData = usageData.filter(d => d.date >= weekAgoStr);
      
      const weekRequests = weekData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
      const weekTokens = weekData.reduce((sum, d) => sum + (d.totalTokens || 0), 0);

      const lastActivity = promptsData.length > 0 
        ? promptsData[0].createdAt 
        : null;

      const conversationsCount = conversationsResult.data?.length || 0;

      setStats({
        totalRequests,
        totalTokens,
        todayRequests: todayData?.totalRequests || 0,
        todayTokens: todayData?.totalTokens || 0,
        weekRequests,
        weekTokens,
        lastActivity,
        projectsCount: projectsData.length,
        conversationsCount,
        researchSessionsCount: sessionsData.length,
        memoriesCount: memoriesData.length,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [user, session?.access_token]);

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
    projects,
    researchSessions,
    subscription,
    userSettings,
    userMemories,
    stats, 
    loading, 
    error, 
    refetch: fetchData 
  };
};
