import { supabase } from '@/integrations/supabase/client';

/**
 * The weekly allowance, read from the backend rather than worked out here.
 *
 * The dashboard used to compute its own number: a hardcoded 25 against
 * `stats.todayRequests`, and later a Monday-to-Sunday `weekRequests` from the same
 * table. Both would now disagree with the thing that actually gates the user — the
 * free window is anchored to that person's OWN signup weekday, which nothing on this
 * side can derive. Two different numbers describing one quota is worse than one
 * stale number: it makes the product look like it does not know its own rules.
 *
 * So there is exactly one source, `/api/me/usage`, and both the extension panel and
 * this dashboard read it.
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://api.tryargos.cc';

export interface Usage {
  plan: 'free' | 'pro';
  usedThisWeek: number;
  weeklyLimit: number;
  remainingThisWeek: number;
  /** ISO instant the free allowance returns. Null on Pro, which has no refill moment. */
  resetsAt: string | null;
  maxSchedules: number;
}

export async function fetchUsage(): Promise<Usage | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) return null;
    const res = await fetch(`${API_URL}/api/me/usage`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const d = await res.json();
    if (typeof d?.weeklyLimit !== 'number') return null;
    return {
      plan: d.plan === 'pro' ? 'pro' : 'free',
      usedThisWeek: d.usedThisWeek ?? 0,
      weeklyLimit: d.weeklyLimit,
      remainingThisWeek: d.remainingThisWeek ?? 0,
      resetsAt: typeof d.resetsAt === 'string' ? d.resetsAt : null,
      maxSchedules: d.maxSchedules ?? 3,
    };
  } catch {
    // Returning null hides the counter. Showing a guessed one would be worse: this
    // number tells someone whether they can keep working.
    return null;
  }
}

/**
 * "Back on Tuesday" beats a date, and both beat nothing. Inside a week the weekday
 * is unambiguous; a bare "you are out" is a dead end, while the same line with a day
 * on it is a choice between waiting and paying.
 */
export function refillLabel(resetsAt: string | null): string | null {
  if (!resetsAt) return null;
  const reset = new Date(resetsAt);
  if (Number.isNaN(reset.getTime())) return null;
  const hours = (reset.getTime() - Date.now()) / 3_600_000;
  if (hours <= 0) return 'in a moment';
  if (hours < 1) return 'within the hour';
  if (hours < 24) return 'tomorrow';
  return reset.toLocaleDateString(undefined, { weekday: 'long' });
}
