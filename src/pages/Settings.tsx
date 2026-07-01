import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePolar } from '@/hooks/usePolar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      setTimeout(() => {
        setDeleteOpen(false);
        navigate('/');
      }, 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 pt-28 pb-24 max-w-xl">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-10 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          ← Back
        </button>

        {/* Profile card */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border/40">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">
              {getInitials(user.user_metadata?.full_name || user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-base truncate">
              {user.user_metadata?.full_name || 'Your Account'}
            </p>
            <p className="text-sm text-muted-foreground truncate mt-0.5">{user.email}</p>
          </div>
          <span className={cn(
            'shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide',
            isProActive
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground',
          )}>
            {isProActive ? 'PRO' : 'FREE'}
          </span>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          {/* Account info */}
          <div>
            <SectionLabel>Account</SectionLabel>
            <div className="mt-3 rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/40">
              <Row label="Email" value={user.email ?? ''} />
              <Row
                label="Member since"
                value={new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              />
            </div>
          </div>

          {/* Subscription */}
          <div>
            <SectionLabel>Subscription</SectionLabel>
            <div className="mt-3 rounded-2xl border border-border/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium">{isProActive ? 'Lyto Pro' : 'Free plan'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isProActive ? '400 requests / week · 70 / day' : '50 actions per week'}
                  </p>
                </div>
                {isProActive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 tracking-wide">
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="px-4 pb-4">
                {isProActive ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-sm"
                    onClick={openCustomerPortal}
                    disabled={polarLoading}
                  >
                    {polarLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Manage subscription →'}
                  </Button>
                ) : (
                  <Button size="sm" className="w-full text-sm" onClick={() => navigate('/#pricing')}>
                    Upgrade to Pro →
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <SectionLabel>Privacy & Security</SectionLabel>
            <div className="mt-3 rounded-2xl border border-border/50 overflow-hidden divide-y divide-border/40">
              <PrivacyRow title="Your data stays local">
                Browsing history and tab data never leave your device. Only anonymous usage stats are synced.
              </PrivacyRow>
              <PrivacyRow title="End-to-end encrypted">
                All transfers use TLS. Your account is secured with OAuth — no password stored.
              </PrivacyRow>
              <div className="px-4 py-3 flex items-center gap-4 bg-muted/10">
                <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                <span className="text-border text-xs">·</span>
                <a href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
                <span className="text-border text-xs">·</span>
                <a href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div>
            <SectionLabel>Danger zone</SectionLabel>
            <div className="mt-3 rounded-2xl border border-destructive/20 bg-destructive/[0.02] px-4 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Delete account</p>
                <p className="text-xs text-muted-foreground mt-0.5">Permanently removes your account and all data.</p>
              </div>
              <button
                onClick={openDeleteDialog}
                className="shrink-0 text-xs font-semibold text-destructive border border-destructive/30 rounded-lg px-3 py-1.5 hover:bg-destructive hover:text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Delete flow dialog ── */}
      <Dialog open={deleteOpen} onOpenChange={(o) => { if (!isDeleting) setDeleteOpen(o); }}>
        <DialogContent className="bg-card border-border p-0 max-w-sm w-full overflow-hidden">

          {/* Step indicator */}
          {deleteStep < 4 && (
            <div className="flex items-center justify-center gap-1.5 pt-6 pb-0">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    s === deleteStep ? 'w-6 bg-foreground' : s < deleteStep ? 'w-3 bg-foreground/40' : 'w-3 bg-border',
                  )}
                />
              ))}
            </div>
          )}

          <div className="px-6 pt-5 pb-6">

            {/* Step 1 — confirm */}
            {deleteStep === 1 && (
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-xl">
                  🗑️
                </div>
                <div>
                  <p className="font-semibold text-lg">Delete your account?</p>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    This permanently removes your account, subscription, and all your data. There's no going back.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-1">
                  <Button variant="outline" className="w-full" onClick={() => setDeleteOpen(false)}>
                    Keep my account
                  </Button>
                  <Button
                    className="w-full bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => setDeleteStep(2)}
                  >
                    Yes, continue →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 — reason */}
            {deleteStep === 2 && (
              <div>
                <p className="font-semibold text-base mb-0.5">Why are you leaving?</p>
                <p className="text-xs text-muted-foreground mb-4">Pick the one that fits best — your feedback helps us improve.</p>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {DELETE_REASONS.map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setDeleteReason(reason)}
                      className={cn(
                        'w-full text-left text-sm px-4 py-3 rounded-xl border transition-all duration-150 flex items-center justify-between',
                        deleteReason === reason
                          ? 'border-foreground/40 bg-foreground/5 font-medium text-foreground'
                          : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground',
                      )}
                    >
                      {reason}
                      {deleteReason === reason && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setDeleteStep(1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
                  >
                    ← Back
                  </button>
                  <Button
                    className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                    disabled={!deleteReason}
                    onClick={() => setDeleteStep(3)}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 — experience */}
            {deleteStep === 3 && (
              <div>
                <p className="font-semibold text-base mb-0.5">How was your experience?</p>
                <p className="text-xs text-muted-foreground mb-6">Rate your overall time with Lyto.</p>

                <div className="flex items-center justify-center gap-3 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setDeleteRating(star)}
                      className="transition-transform active:scale-90 hover:scale-110 focus:outline-none text-2xl leading-none"
                    >
                      {star <= deleteRating ? '★' : '☆'}
                    </button>
                  ))}
                </div>

                <div className="h-5 flex items-center justify-center mb-5">
                  {deleteRating > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      {RATING_LABELS[deleteRating]}
                    </p>
                  )}
                </div>

                <textarea
                  placeholder="Anything else you'd like to share? (optional)"
                  value={deleteFeedback}
                  onChange={(e) => setDeleteFeedback(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-border"
                />

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setDeleteStep(2)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
                  >
                    ← Back
                  </button>
                  <Button
                    className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                    disabled={deleteRating === 0 || isDeleting}
                    onClick={handleDeleteAccount}
                  >
                    {isDeleting
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />Deleting…</>
                      : 'Delete my account'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4 — done */}
            {deleteStep === 4 && (
              <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="text-4xl">👋</div>
                <div>
                  <p className="font-semibold text-base">Account deleted</p>
                  <p className="text-sm text-muted-foreground mt-1">Thanks for using Lyto. Redirecting you home…</p>
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ── Helpers ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{children}</p>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 bg-card/60">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-right max-w-[55%] truncate">{value}</p>
    </div>
  );
}

function PrivacyRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{children}</p>
    </div>
  );
}

export default Settings;
