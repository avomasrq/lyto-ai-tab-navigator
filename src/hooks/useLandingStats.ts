import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LandingStats {
  totalUsers: number;
  totalProjects: number;
  totalResearchSessions: number;
  totalPrompts: number;
}

export const useLandingStats = () => {
  const [stats, setStats] = useState<LandingStats>({
    totalUsers: 0,
    totalProjects: 0,
    totalResearchSessions: 0,
    totalPrompts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from public tables
        // Note: These queries work if RLS allows anonymous read or has public policies
        const [usersResult, projectsResult, sessionsResult, promptsResult] = await Promise.all([
          supabase.from('users').select('id', { count: 'exact', head: true }),
          supabase.from('Project').select('id', { count: 'exact', head: true }),
          supabase.from('ResearchSession').select('id', { count: 'exact', head: true }),
          supabase.from('Prompt').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalProjects: projectsResult.count || 0,
          totalResearchSessions: sessionsResult.count || 0,
          totalPrompts: promptsResult.count || 0,
        });
      } catch (err) {
        console.error('Error fetching landing stats:', err);
        // Keep default zeros on error
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading };
};

