import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePolar } from '@/hooks/usePolar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

const DELETE_REASONS = [
  "I'm switching to another tool",
  "It's too expensive",
  "I don't use it enough",
  "Missing features I need",
  "Privacy concerns",
  "Just testing / temporary",
  "Other",
];

const RATING_LABELS: Record<number, string> = {
  1: "Pretty bad, honestly",
  2: "Could be better",
  3: "It was alright",
  4: "Mostly good!",
  5: "Loved it ✦",
};

const Settings = () => {
  const { user, loading, deleteAccount } = useAuth();
  const { openCustomerPortal, loading: polarLoading } = usePolar();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3 | 4>(1);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteRating, setDeleteRating] = useState(0);
  const [deleteFeedback, setDeleteFeedback] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = deleteOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [deleteOpen]);

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('Subscription')
        .select('plan, status')
        .eq('userId', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const isProActive = subscription?.plan === 'pro' && subscription?.status === 'active';

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const openDeleteDialog = () => {
    setDeleteStep(1);
    setDeleteReason('');
    setDeleteRating(0);
    setDeleteFeedback('');
    setDeleteOpen(true);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { error } = await deleteAccount();
    if (error) {
      toast.error('Failed to delete account. Please try again.');
      setIsDeleting(false);
    } else {
      setDeleteStep(4);
      setIsDeleting(false);
      setTimeout(() => { setDeleteOpen(false); navigate('/'); }, 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) { navigate('/auth'); return null; }

  return (
    <>
      {/* ── Page ── */}
      <div className="min-h-screen bg-[#fafaf9] text-foreground relative overflow-x-hidden">
        {/* Ambient blobs */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-100 opacity-50 blur-[100px]" />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full bg-amber-50 opacity-60 blur-[80px]" />
        </div>

        <Navbar />

        <main className="relative z-10 container mx-auto px-4 pt-28 pb-24 max-w-lg">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 text-sm text-neutral-400 hover:text-neutral-700 transition-colors flex items-center gap-1.5"
          >
            ← Back
          </button>

          {/* Profile hero card */}
          <div
            className="relative mb-6 rounded-3xl border border-white/70 p-6 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 4px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)' }}
          >
            {/* Subtle inner gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-transparent to-transparent pointer-events-none rounded-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-2 ring-white shadow-md">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-lg">
                    {getInitials(user.user_metadata?.full_name || user.email)}
                  </AvatarFallback>
                </Avatar>
                {isProActive && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                    <span className="text-white text-[8px] font-black">P</span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base text-neutral-900 truncate">
                  {user.user_metadata?.full_name || 'Your Account'}
                </p>
                <p className="text-sm text-neutral-400 truncate mt-0.5">{user.email}</p>
                <span className={cn(
                  'inline-block mt-1.5 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase',
                  isProActive ? 'bg-orange-100 text-orange-600' : 'bg-neutral-100 text-neutral-500',
                )}>
                  {isProActive ? 'Pro' : 'Free'}
                </span>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-3">

            {/* Account */}
            <GlassCard label="Account">
              <FieldRow label="Email" value={user.email ?? ''} />
              <FieldRow
                label="Member since"
                value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                last
              />
            </GlassCard>

            {/* Subscription */}
            <GlassCard label="Subscription">
              <div className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{isProActive ? 'Lyto Pro' : 'Free plan'}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {isProActive ? '400 req / week · 70 per day' : '25 messages per day'}
                  </p>
                </div>
                {isProActive
                  ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200 tracking-wide">ACTIVE</span>
                  : null}
              </div>
              <div className="px-5 pb-4">
                {isProActive ? (
                  <button
                    onClick={openCustomerPortal}
                    disabled={polarLoading}
                    className="w-full py-2.5 rounded-xl text-sm font-medium text-neutral-600 border border-neutral-200 bg-white/70 hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {polarLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" /> : 'Manage subscription →'}
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/#pricing')}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Upgrade to Pro →
                  </button>
                )}
              </div>
            </GlassCard>

            {/* Privacy */}
            <GlassCard label="Privacy & Security">
              <div className="px-5 py-4 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-800">Your data stays local</p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Browsing history and tab data never leave your device. Only anonymous usage stats are synced.</p>
              </div>
              <div className="px-5 py-4 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-800">End-to-end encrypted</p>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">All transfers use TLS. Your account is secured with OAuth — no password stored.</p>
              </div>
              <div className="px-5 py-3 flex items-center gap-3">
                <a href="/privacy" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Privacy</a>
                <span className="text-neutral-200">·</span>
                <a href="/terms" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Terms</a>
                <span className="text-neutral-200">·</span>
                <a href="/cookies" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">Cookies</a>
              </div>
            </GlassCard>

            {/* Danger */}
            <div
              className="rounded-3xl border border-red-100 px-5 py-4 flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
            >
              <div>
                <p className="text-sm font-semibold text-neutral-800">Delete account</p>
                <p className="text-xs text-neutral-400 mt-0.5">Permanently removes your account and all data.</p>
              </div>
              <button
                onClick={openDeleteDialog}
                className="shrink-0 text-xs font-semibold text-red-500 border border-red-200 rounded-xl px-3.5 py-2 hover:bg-red-500 hover:text-white transition-all"
              >
                Delete
              </button>
            </div>

          </div>
        </main>
      </div>

      {/* ── Delete modal (custom, guaranteed centered) ── */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setDeleteOpen(false); }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Step dots */}
            {deleteStep < 4 && (
              <div className="flex items-center justify-center gap-2 mb-7">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'h-[3px] rounded-full transition-all duration-300',
                      s === deleteStep ? 'w-8 bg-neutral-800' : s < deleteStep ? 'w-4 bg-neutral-400' : 'w-4 bg-neutral-200',
                    )}
                  />
                ))}
              </div>
            )}

            {/* Step 1 */}
            {deleteStep === 1 && (
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-2xl mb-5 select-none">
                  🗑️
                </div>
                <p className="font-semibold text-xl text-neutral-900 mb-2">Delete your account?</p>
                <p className="text-sm text-neutral-500 leading-relaxed mb-7">
                  This permanently removes your account, subscription, and all your data. There's no going back.
                </p>
                <div className="flex flex-col gap-2.5 w-full">
                  <button
                    onClick={() => setDeleteOpen(false)}
                    className="w-full py-3 rounded-2xl text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  >
                    Keep my account
                  </button>
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="w-full py-3 rounded-2xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    Yes, continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {deleteStep === 2 && (
              <div className="flex flex-col items-center">
                <p className="font-semibold text-xl text-neutral-900 text-center mb-1.5">Why are you leaving?</p>
                <p className="text-sm text-neutral-400 text-center mb-5">Pick one — helps us improve.</p>
                <div className="flex flex-col gap-2 w-full">
                  {DELETE_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setDeleteReason(reason)}
                      className={cn(
                        'w-full text-center text-sm py-3 px-4 rounded-2xl border transition-all duration-150',
                        deleteReason === reason
                          ? 'border-neutral-800 bg-neutral-900 text-white font-medium'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-800 bg-white/60',
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-5 w-full">
                  <button
                    onClick={() => setDeleteStep(1)}
                    className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setDeleteStep(3)}
                    disabled={!deleteReason}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {deleteStep === 3 && (
              <div className="flex flex-col items-center">
                <p className="font-semibold text-xl text-neutral-900 text-center mb-1.5">How was your experience?</p>
                <p className="text-sm text-neutral-400 text-center mb-7">Rate your overall time with Lyto.</p>

                <div className="flex items-center justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setDeleteRating(star)}
                      className="transition-transform hover:scale-125 active:scale-90 focus:outline-none"
                      style={{ fontSize: '2.2rem', lineHeight: 1, color: star <= deleteRating ? '#f59e0b' : '#e5e7eb' }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div className="h-7 flex items-center justify-center mb-4">
                  <p className={cn('text-sm font-medium text-neutral-500 transition-opacity duration-200', deleteRating > 0 ? 'opacity-100' : 'opacity-0')}>
                    {RATING_LABELS[deleteRating] ?? ''}
                  </p>
                </div>

                <textarea
                  placeholder="Anything else you'd like to share? (optional)"
                  value={deleteFeedback}
                  onChange={(e) => setDeleteFeedback(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-neutral-200 bg-white/70 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-neutral-400 mb-5"
                />

                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="text-sm text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteRating === 0 || isDeleting}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isDeleting ? 'Deleting…' : 'Delete my account'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 — done */}
            {deleteStep === 4 && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="text-5xl select-none">👋</div>
                <div>
                  <p className="font-semibold text-lg text-neutral-900">Account deleted</p>
                  <p className="text-sm text-neutral-400 mt-1">Thanks for using Lyto. Redirecting you home…</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ── Helpers ── */

function GlassCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">{label}</p>
      <div
        className="rounded-3xl border border-white/70 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 2px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)' }}
      >
        {children}
      </div>
    </div>
  );
}

function FieldRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between px-5 py-4', !last && 'border-b border-neutral-100')}>
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-sm font-medium text-neutral-800 text-right max-w-[55%] truncate">{value}</p>
    </div>
  );
}

export default Settings;
