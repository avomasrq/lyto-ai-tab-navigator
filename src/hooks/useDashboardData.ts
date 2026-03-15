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
  weekRequests: number; // Запросы за текущую календарную неделю (пн-вс)
  weekTokens: number;
  monthRequests: number; // Запросы за текущий календарный месяц
  lastActivity: string | null;
  sessionsCount: number;
  projectsCount: number;
  researchSessionsCount: number;
  // FREE plan limits
  nextMondayReset: string | null; // Дата следующего понедельника
  // Research limits
  lastResearchDate: string | null;
  researchAvailableDate: string | null; // Когда доступен следующий research
  researchUsedInPeriod: number; // Сколько использовано за период
  researchLimitInPeriod: number; // Лимит за период (1 для FREE, 10 для PRO)
  currentPeriodEnd: string | null; // Конец периода подписки (для PRO)
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
    nextMondayReset: null,
    lastResearchDate: null,
    researchAvailableDate: null,
    researchUsedInPeriod: 0,
    researchLimitInPeriod: 1,
    currentPeriodEnd: null,
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
        userResult,
        promptsResult,
        usageResult,
        sessionsResult,
        subscriptionResult,
        projectsResult,
        researchResult,
      ] = await Promise.all([
        supabase
          .from('users')
          .select('createdAt')
          .eq('id', user.id)
          .single(),
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
      const now = new Date();
      
      // ============ Календарная неделя (понедельник-воскресенье) для FREE ============
      const getThisMonday = (): Date => {
        const date = new Date();
        const day = date.getDay(); // 0 = воскресенье, 1 = понедельник
        const diff = day === 0 ? -6 : 1 - day; // Если воскресенье, то -6 дней, иначе к понедельнику
        const monday = new Date(date);
        monday.setDate(date.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
      };

      const getNextMonday = (): Date => {
        const thisMonday = getThisMonday();
        const nextMonday = new Date(thisMonday);
        nextMonday.setDate(thisMonday.getDate() + 7);
        return nextMonday;
      };

      const thisMondayStr = getThisMonday().toISOString().split('T')[0];
      const nextMonday = getNextMonday();
      
      // ============ Календарный месяц (1-е число → последнее число) ============
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split('T')[0];

      const totalRequests = usageData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
      const totalTokens = usageData.reduce((sum, d) => sum + (d.totalTokens || 0), 0);
      const todayData = usageData.find((d) => String(d.date).startsWith(today));
      
      // Запросы за текущую календарную неделю (пн-вс)
      const weekData = usageData.filter((d) => String(d.date) >= thisMondayStr);
      const weekRequests = weekData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);
      const weekTokens = weekData.reduce((sum, d) => sum + (d.totalTokens || 0), 0);
      
      // Запросы за текущий календарный месяц
      const monthData = usageData.filter((d) => String(d.date) >= monthStartStr);
      const monthRequests = monthData.reduce((sum, d) => sum + (d.totalRequests || 0), 0);

      // ============ Research лимиты ============
      const isPro = subscriptionResult.data?.plan === 'pro';
      
      let researchUsedInPeriod = 0;
      let researchLimitInPeriod = isPro ? 10 : 1;
      let lastResearchDate: string | null = null;
      let researchAvailableDate: string | null = null;
      let currentPeriodEnd: string | null = null;

      if (isPro) {
        // PRO: считаем ресерчи за период подписки
        const periodStart = subscriptionResult.data?.currentPeriodStart;
        const periodEnd = subscriptionResult.data?.currentPeriodEnd;
        
        if (periodStart && periodEnd) {
          // Есть период подписки — считаем ресерчи в этом периоде
          currentPeriodEnd = periodEnd;
          researchUsedInPeriod = researchData.filter(
            (r) => r.createdAt >= periodStart && r.createdAt <= periodEnd
          ).length;
        } else {
          // Нет периода — считаем по календарному месяцу
          currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();
          researchUsedInPeriod = researchData.filter(
            (r) => r.createdAt >= monthStartStr
          ).length;
        }
      } else {
        // FREE: 1 ресерч раз в 30 дней
        if (researchData.length > 0) {
          const lastResearch = researchData[0]; // уже отсортировано по createdAt desc
          lastResearchDate = lastResearch.createdAt;
          
          const lastResearchTime = new Date(lastResearch.createdAt).getTime();
          const availableTime = lastResearchTime + 30 * 24 * 60 * 60 * 1000; // +30 дней
          const availableDate = new Date(availableTime);
          
          if (now.getTime() < availableTime) {
            // Ещё не прошло 30 дней — использовано 1/1
            researchUsedInPeriod = 1;
            researchAvailableDate = availableDate.toISOString();
          } else {
            // Прошло 30 дней — доступен новый
            researchUsedInPeriod = 0;
            researchAvailableDate = null;
          }
        } else {
          // Ни разу не использовал — доступен
          researchUsedInPeriod = 0;
          researchAvailableDate = null;
        }
      }

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
        nextMondayReset: nextMonday.toISOString(),
        lastResearchDate,
        researchAvailableDate,
        researchUsedInPeriod,
        researchLimitInPeriod,
        currentPeriodEnd,
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
