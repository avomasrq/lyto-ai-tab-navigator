import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

/* ── Types ── */
interface OnboardingResponse {
  id: string;
  created_at: string;
  user_id: string;
  email: string | null;
  role: string | null;
  source: string | null;
  use_case: string | null;
}

/* ── Helpers ── */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function capitalize(s: string | null) {
  if (!s) return '—';
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
}

const ADMIN_EMAIL = 'arylovessway@gmail.com';

/* ── Admin page ── */
const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate('/auth'); return; }
    if (user.email !== ADMIN_EMAIL) { navigate('/'); }
  }, [user, loading, navigate]);

  const {
    data: responses,
    isLoading: queryLoading,
    isError,
  } = useQuery<OnboardingResponse[]>({
    queryKey: ['onboarding-responses'],
    queryFn: async () => {
      // Use the edge function — reads with service_role server-side.
      // Direct table access is blocked by RLS for all non-service clients.
      const { data, error } = await supabase.functions.invoke('get-admin-onboarding');
      if (error) throw error;
      return (data?.data ?? []) as OnboardingResponse[];
    },
    enabled: !!user && user.email === ADMIN_EMAIL,
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-muted-foreground text-sm"
        >
          Loading…
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end gap-3"
        >
          <div>
            <h1 className="text-2xl font-serif tracking-tight text-foreground">
              Onboarding Responses
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              All user responses collected during onboarding.
            </p>
          </div>

          {/* Count badge */}
          {responses && (
            <div className="sm:ml-auto flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                {responses.length} {responses.length === 1 ? 'response' : 'responses'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-border/40 bg-card shadow-sm overflow-x-auto"
        >
          {queryLoading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-muted-foreground text-sm"
              >
                Loading responses…
              </motion.div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-destructive">
                Failed to load responses. Check that the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">onboarding_responses</code> table exists.
              </p>
            </div>
          ) : !responses || responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <span className="text-3xl">📭</span>
              <p className="text-sm text-muted-foreground">No responses yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Source</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Use Case</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((row, i) => (
                  <tr
                    key={row.id}
                    className={[
                      'border-b border-border/30 last:border-0 transition-colors',
                      i % 2 === 0 ? 'bg-background' : 'bg-muted/10',
                      'hover:bg-primary/5',
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap tabular-nums text-xs">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-[200px] truncate">
                      {row.email ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {row.role ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                          {capitalize(row.role)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.source ? (
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
                          {capitalize(row.source)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.use_case ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                          {capitalize(row.use_case)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
