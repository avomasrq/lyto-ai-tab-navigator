import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// ============ LANDING TABLES (Supabase PascalCase + camelCase columns) ============
// 1. users — создаётся лендингом (auth), extension/backend только читают
// 2. sessions — сессии использования (landing/extension analytics)
// 3. prompts — запросы с лендинга (extension имеет messages отдельно)
// 4. subscriptions — платёжка, лендинг = billing owner
// 5. tokenUsage — лимиты по дням, requests

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

export interface Session {
  id: string;
  startedAt: string;
  endedAt: string | null;
  requestCount: number | null;
  source: string | null;
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

// Extension-only (для совместимости UI, показываем пустые если нет данных)
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

export interface DashboardStats {
  totalRequests: number;
  totalTokens: number;
  todayRequests: number;
  todayTokens: number;
  weekRequests: number;
  weekTokens: number;
  monthRequests: number;
  lastActivity: string | null;
  sessionsCount: number;
  projectsCount: number;
  researchSessionsCount: number;
}

export const useDashboardData = () => {
  const { user, session } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchSessions, setResearchSessions] = useState<ResearchSession[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    totalTokens: 0,
    todayRequests: 0,
    todayTokens: 0,
    weekRequests: 0,
    weekTokens: 0,
    monthRequests: 0,
    lastActivity: null,
    sessionsCount: 0,
    projectsCount: 0,
    researchSessionsCount: 0,
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
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

      const [
        promptsResult,
        usageResult,
        sessionsResult,
        subscriptionResult,
        projectsResult,
        researchResult,
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
          .gte('date', dateStr)
          .order('date', { ascending: true }),
        supabase
          .from('Session')
          .select('*')
          .eq('userId', user.id)
          .order('startedAt', { ascending: false })
          .limit(50),
        supabase
          .from('Subscription')
          .select('*')
          .eq('userId', user.id)
          .maybeSingle(),
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
      ]);

      // 3. prompts — landing prompts
      const promptsData = (promptsResult.data || []).map((p) => ({
        id: p.id,
        promptText: p.promptText ?? '',
        responseText: p.responseText ?? null,
        tokensUsed: p.tokensUsed ?? null,
        promptTokens: p.promptTokens ?? null,
        completionTokens: p.completionTokens ?? null,
        model: p.model ?? null,
        createdAt: p.createdAt ?? '',
      }));
      setPrompts(promptsData);

      // 5. tokenUsage — usage limits
      const usageData = (usageResult.data || []).map((u) => ({
        date: u.date ?? '',
        totalRequests: u.totalRequests ?? null,
        totalTokens: u.totalTokens ?? null,
        promptTokens: u.promptTokens ?? null,
        completionTokens: u.completionTokens ?? null,
      }));
      setTokenUsage(usageData);

      // 2. sessions — landing analytics
      const sessionsData = (sessionsResult.data || []).map((s) => ({
        id: s.id,
        startedAt: s.startedAt ?? '',
        endedAt: s.endedAt ?? null,
        requestCount: s.requestCount ?? null,
        source: s.source ?? null,
      }));
      setSessions(sessionsData);

      // 4. subscriptions — billing
      if (subscriptionResult.data) {
        const s = subscriptionResult.data;
        setSubscription({
          id: s.id,
          plan: s.plan ?? 'free',
          status: s.status ?? 'active',
          polarSubscriptionId: s.polarSubscriptionId ?? null,
          polarCustomerId: s.polarCustomerId ?? null,
          currentPeriodStart: s.currentPeriodStart ?? null,
          currentPeriodEnd: s.currentPeriodEnd ?? null,
          createdAt: s.createdAt ?? '',
        });
      } else {
        setSubscription(null);
      }

      // Extension tables (optional, для unified dashboard)
      const projectsData = (projectsResult.data || []).map((p) => ({
        id: p.id,
        title: p.title ?? '',
        description: p.description ?? null,
        isActive: p.isActive ?? true,
        createdAt: p.createdAt ?? '',
        updatedAt: p.updatedAt ?? '',
      }));
      setProjects(projectsData);

      const researchData = (researchResult.data || []).map((s) => ({
        id: s.id,
        query: s.query ?? '',
        status: s.status ?? '',
        createdAt: s.createdAt ?? '',
        updatedAt: s.updatedAt ?? '',
      }));
      setResearchSessions(researchData);

      // Stats
      const today = new Date().toISOString().split('T')[0];
      const weekAgoStr = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Начало текущего месяца
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartStr = monthStart.toISOString().split('T')[0];

      const totalRequests = usageData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
      const totalTokens = usageData.reduce((sum, d) => sum + (d.totalTokens || 0), 0);
      const todayData = usageData.find((d) => String(d.date).startsWith(today));
      const weekData = usageData.filter((d) => String(d.date) >= weekAgoStr);
      const weekRequests = weekData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
      const weekTokens = weekData.reduce((sum, d) => sum + (d.totalTokens || 0), 0);
      
      // Запросы за текущий месяц (для PRO плана)
      const monthData = usageData.filter((d) => String(d.date) >= monthStartStr);
      const monthRequests = monthData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);

      const lastActivityDate = Math.max(
        ...(promptsData.length > 0 ? [new Date(promptsData[0].createdAt).getTime()] : [0]),
        ...(sessionsData.length > 0 ? [new Date(sessionsData[0].startedAt).getTime()] : [0]),
        ...(researchData.length > 0 ? [new Date(researchData[0].createdAt).getTime()] : [0])
      );
      const lastActivity = lastActivityDate > 0 ? new Date(lastActivityDate).toISOString() : null;

      setStats({
        totalRequests,
        totalTokens,
        todayRequests: todayData?.totalRequests ?? 0,
        todayTokens: todayData?.totalTokens ?? 0,
        weekRequests,
        weekTokens,
        monthRequests,
        lastActivity,
        sessionsCount: sessionsData.length,
        projectsCount: projectsData.filter((p) => p.isActive).length,
        researchSessionsCount: researchData.length,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [user, session?.access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  return {
    prompts,
    tokenUsage,
    sessions,
    subscription,
    projects,
    researchSessions,
    stats,
    loading,
    error,
    refetch: fetchData,
  };
};
