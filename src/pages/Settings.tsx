import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePolar } from '@/hooks/usePolar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Loader2, Terminal, ArrowLeft, User, CreditCard, ShieldCheck, Trash2, type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

/**
 * Rebuilt as a proper two-column settings page: a sticky identity card + in-
 * page nav on the left, the actual sections on the right. The previous pass
 * was a single narrow stacked column — every card the same shape, no way to
 * jump to a section, and a lot of unused space on anything wider than a
 * phone. Same theme tokens (bg-card/border-border) as that pass, same logic
 * and delete flow throughout, just restructured.
 */

const NAV = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'desktop-agent', label: 'Desktop Agent', icon: Terminal },
  { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
  { id: 'danger', label: 'Delete account', icon: Trash2 },
] as const;

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
  const { user, loading, deleteAccount, signOut } = useAuth();
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

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) { navigate('/auth'); return null; }

  return (
    <>
      <div className="min-h-screen bg-muted/40">
        {/* Header — same chrome as the dashboard, so the app doesn't change
            personality the moment you open a settings page. */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <Link to="/" className="font-geometric text-lg font-medium tracking-tight text-foreground">
                Argos<span className="text-primary">.</span>
              </Link>
              <span className="hidden text-muted-foreground/40 sm:block">/</span>
              <span className="hidden text-sm text-muted-foreground sm:block">Settings</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Dashboard
              </button>
              <button
                onClick={handleSignOut}
                className="hidden rounded-lg px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:block"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-9 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>

          <h1 className="font-geometric text-[26px] font-semibold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Your account, subscription, and desktop agent, in one place.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
            {/* ── Left: identity + jump nav ── */}
            <div className="space-y-4 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="relative">
                    <Avatar className="h-16 w-16 ring-4 ring-background">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 font-geometric text-lg font-semibold text-primary">
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    {isProActive && (
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm ring-2 ring-card">
                        <span className="text-[8px] font-black text-white">P</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 truncate font-geometric text-[15px] font-semibold text-foreground">
                    {user.user_metadata?.full_name || 'Your Account'}
                  </p>
                  <p className="mt-0.5 max-w-full truncate text-[12.5px] text-muted-foreground">{user.email}</p>
                  <span
                    className={cn(
                      'mt-2.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest',
                      isProActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {isProActive ? 'Pro' : 'Free'}
                  </span>
                </div>
              </div>

              <nav className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:block">
                {NAV.map(({ id, label, icon: Icon }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2.5 border-b border-border px-4 py-3 text-[13px] text-muted-foreground transition-colors last:border-b-0 hover:bg-muted hover:text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </a>
                ))}
              </nav>
            </div>

            {/* ── Right: sections ── */}
            <div className="space-y-6">

              <SettingsSection id="account" icon={User} label="Account">
                <Row label="Email" value={user.email ?? ''} />
                <Row
                  label="Member since"
                  value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  last
                />
              </SettingsSection>

              <SettingsSection id="subscription" icon={CreditCard} label="Subscription">
                <div className="flex items-center justify-between px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">{isProActive ? 'Argos Pro' : 'Free plan'}</p>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                      {isProActive ? '400 req / week · 70 per day' : '25 messages per day'}
                    </p>
                  </div>
                  {isProActive && (
                    <span className="rounded-full border border-emerald-600/25 bg-emerald-600/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="border-t border-border px-5 py-4 sm:px-6">
                  {isProActive ? (
                    <button
                      onClick={openCustomerPortal}
                      disabled={polarLoading}
                      className="w-full rounded-xl border border-border bg-background py-2.5 text-[13.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {polarLoading ? <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin" /> : 'Manage subscription →'}
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/#pricing')}
                      className="w-full rounded-xl bg-primary py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      Upgrade to Pro →
                    </button>
                  )}
                </div>
              </SettingsSection>

              {/* Desktop Agent — a pointer, not a second console. Pairing, status, the
                  install one-liner and unpair all live on /cli; a trimmed copy here only
                  split the flow in two and showed a status the page next door contradicts. */}
              <SettingsSection id="desktop-agent" icon={Terminal} label="Desktop Agent">
                <div className="flex items-center gap-2.5 px-5 py-4 sm:px-6">
                  <Terminal className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">Argos CLI</p>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                      Run Argos on your own machine, with your own key.
                    </p>
                  </div>
                </div>
                <div className="border-t border-border px-5 py-4 sm:px-6">
                  <button
                    onClick={() => navigate('/cli')}
                    className="w-full rounded-xl border border-border bg-background py-2.5 text-[13.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                  >
                    Set up & manage →
                  </button>
                </div>
              </SettingsSection>

              <SettingsSection id="privacy" icon={ShieldCheck} label="Privacy & Security">
                <div className="border-b border-border px-5 py-4 sm:px-6">
                  <p className="text-[14px] font-semibold text-foreground">Never reads or fills passwords</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    That refusal is in the extension itself. Card fields are skipped the same way.
                  </p>
                </div>
                <div className="border-b border-border px-5 py-4 sm:px-6">
                  <p className="text-[14px] font-semibold text-foreground">Signed in with OAuth</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                    All transfers use TLS. There is no password stored on our side to leak.
                  </p>
                </div>
                <div className="flex items-center gap-3 px-5 py-3.5 sm:px-6">
                  <a href="/privacy" className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">Privacy</a>
                  <span className="text-muted-foreground/30">·</span>
                  <a href="/terms" className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">Terms</a>
                  <span className="text-muted-foreground/30">·</span>
                  <a href="/cookies" className="text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">Cookies</a>
                </div>
              </SettingsSection>

              {/* Danger */}
              <div id="danger" className="scroll-mt-24 overflow-hidden rounded-2xl border border-rose-600/20 shadow-sm">
                <div className="flex items-center gap-2.5 bg-rose-600/5 px-5 py-3.5 sm:px-6">
                  <Trash2 className="h-4 w-4 shrink-0 text-rose-600" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-rose-600">Danger zone</p>
                </div>
                <div className="flex items-center justify-between bg-card px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">Delete account</p>
                    <p className="mt-0.5 text-[12.5px] text-muted-foreground">Permanently removes your account and all data.</p>
                  </div>
                  <button
                    onClick={openDeleteDialog}
                    className="shrink-0 rounded-xl border border-rose-600/30 px-3.5 py-2 text-[12.5px] font-semibold text-rose-600 transition-all hover:bg-rose-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* ── Delete modal ── */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setDeleteOpen(false); }}
        >
          <div
            className="flex w-full max-w-sm flex-col rounded-2xl border border-border bg-card p-6 shadow-2xl"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Step dots */}
            {deleteStep < 4 && (
              <div className="mb-7 flex items-center justify-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      'h-[3px] rounded-full transition-all duration-300',
                      s === deleteStep ? 'w-8 bg-foreground' : s < deleteStep ? 'w-4 bg-foreground/40' : 'w-4 bg-foreground/15',
                    )}
                  />
                ))}
              </div>
            )}

            {/* Step 1 */}
            {deleteStep === 1 && (
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 select-none items-center justify-center rounded-2xl border border-rose-600/20 bg-rose-600/5 text-2xl">
                  🗑️
                </div>
                <p className="mb-2 font-geometric text-xl font-semibold text-foreground">Delete your account?</p>
                <p className="mb-7 text-[13.5px] leading-relaxed text-muted-foreground">
                  This permanently removes your account, subscription, and all your data. There's no going back.
                </p>
                <div className="flex w-full flex-col gap-2.5">
                  <button
                    onClick={() => setDeleteOpen(false)}
                    className="w-full rounded-xl bg-black/[0.05] py-3 text-[13.5px] font-semibold text-foreground transition-colors hover:bg-black/[0.08]"
                  >
                    Keep my account
                  </button>
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="w-full rounded-xl bg-rose-600 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-rose-700"
                  >
                    Yes, continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {deleteStep === 2 && (
              <div className="flex flex-col items-center">
                <p className="mb-1.5 text-center font-geometric text-xl font-semibold text-foreground">Why are you leaving?</p>
                <p className="mb-5 text-center text-[13.5px] text-muted-foreground">Pick one, helps us improve.</p>
                <div className="flex w-full flex-col gap-2">
                  {DELETE_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setDeleteReason(reason)}
                      className={cn(
                        'w-full rounded-xl border px-4 py-3 text-center text-[13.5px] transition-all duration-150',
                        deleteReason === reason
                          ? 'border-foreground bg-foreground font-medium text-background'
                          : 'border-black/10 bg-black/[0.02] text-foreground/80 hover:border-black/25 hover:text-foreground',
                      )}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex w-full items-center gap-3">
                  <button
                    onClick={() => setDeleteStep(1)}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setDeleteStep(3)}
                    disabled={!deleteReason}
                    className="flex-1 rounded-xl bg-rose-600 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {deleteStep === 3 && (
              <div className="flex flex-col items-center">
                <p className="mb-1.5 text-center font-geometric text-xl font-semibold text-foreground">How was your experience?</p>
                <p className="mb-7 text-center text-[13.5px] text-muted-foreground">Rate your overall time with Argos.</p>

                <div className="mb-3 flex items-center justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setDeleteRating(star)}
                      className="transition-transform hover:scale-125 focus:outline-none active:scale-90"
                      style={{ fontSize: '2.2rem', lineHeight: 1, color: star <= deleteRating ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground) / 0.25)' }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div className="mb-4 flex h-7 items-center justify-center">
                  <p className={cn('text-[13.5px] font-medium text-muted-foreground transition-opacity duration-200', deleteRating > 0 ? 'opacity-100' : 'opacity-0')}>
                    {RATING_LABELS[deleteRating] ?? ''}
                  </p>
                </div>

                <textarea
                  placeholder="Anything else you'd like to share? (optional)"
                  value={deleteFeedback}
                  onChange={(e) => setDeleteFeedback(e.target.value)}
                  rows={3}
                  className="mb-5 w-full resize-none rounded-xl border border-black/10 bg-white/60 px-4 py-3 text-[13.5px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/30"
                />

                <div className="flex w-full items-center gap-3">
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteRating === 0 || isDeleting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {isDeleting ? 'Deleting…' : 'Delete my account'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 — done */}
            {deleteStep === 4 && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="select-none text-5xl">👋</div>
                <div>
                  <p className="font-geometric text-lg font-semibold text-foreground">Account deleted</p>
                  <p className="mt-1 text-[13.5px] text-muted-foreground">Thanks for using Argos. Redirecting you home…</p>
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

function SettingsSection({
  id, icon: Icon, label, children,
}: { id: string; icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-2 flex items-center gap-2 px-1">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">{label}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between px-5 py-4 sm:px-6', !last && 'border-b border-border')}>
      <p className="text-[13.5px] text-muted-foreground">{label}</p>
      <p className="max-w-[55%] truncate text-right text-[13.5px] font-medium text-foreground">{value}</p>
    </div>
  );
}

export default Settings;
