import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePolar } from '@/hooks/usePolar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Trash2, User, Shield, Lock, Mail, Calendar, ExternalLink, CreditCard, Zap, Loader2, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
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

const Settings = () => {
  const { user, loading, deleteAccount } = useAuth();
  const { openCustomerPortal, loading: polarLoading } = usePolar();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete flow state
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
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading settings…</p>
        </div>
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

      <main className="container mx-auto px-4 pt-28 pb-20 max-w-2xl">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-8 -ml-2 text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>

        {/* Profile header */}
        <div className="flex items-center gap-5 mb-10 p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm">
          <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shrink-0">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(user.user_metadata?.full_name || user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-2xl font-serif tracking-tight truncate">
              {user.user_metadata?.full_name || 'Your Account'}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{user.email}</p>
            <span className={cn(
              'inline-flex items-center mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full',
              isProActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
            )}>
              {isProActive ? '✦ Pro' : 'Free'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile */}
          <Section icon={<User className="h-4 w-4" />} title="Profile" description="Your account details">
            <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={user.email ?? ''} />
            <InfoRow
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Member since"
              value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            />
          </Section>

          {/* Subscription */}
          <Section icon={<CreditCard className="h-4 w-4" />} title="Subscription" description="Manage your current plan">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', isProActive ? 'bg-primary/10' : 'bg-muted')}>
                  <Zap className={cn('h-4 w-4', isProActive ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <p className="font-semibold text-sm">{isProActive ? 'Lyto Pro' : 'Free Plan'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isProActive ? 'Full access · 400 req/week' : '50 actions / week'}
                  </p>
                </div>
              </div>
              {isProActive && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                  Active
                </span>
              )}
            </div>

            {isProActive ? (
              <div className="mt-3">
                <Button variant="outline" className="w-full text-sm h-9" onClick={openCustomerPortal} disabled={polarLoading}>
                  {polarLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (
                    <><ExternalLink className="w-3.5 h-3.5 mr-2" />Manage subscription</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">Cancel, pause or update billing from the Polar portal.</p>
              </div>
            ) : (
              <Button className="w-full mt-3 text-sm h-9" onClick={() => navigate('/#pricing')}>
                <Zap className="w-3.5 h-3.5 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </Section>

          {/* Privacy */}
          <Section icon={<Shield className="h-4 w-4" />} title="Privacy & Security" description="How we protect your data">
            <div className="space-y-3">
              <PrivacyItem icon={<Lock className="h-3.5 w-3.5 text-primary" />} title="Your data stays local">
                Browsing history and tab data never leave your device. Only anonymous usage stats are synced.
              </PrivacyItem>
              <PrivacyItem icon={<Shield className="h-3.5 w-3.5 text-primary" />} title="End-to-end encrypted">
                All data transfers use TLS encryption. Your account is protected with secure OAuth.
              </PrivacyItem>
            </div>
            <div className="flex items-center gap-3 pt-2 mt-1">
              <a href="/privacy" className="text-xs text-primary hover:underline flex items-center gap-1">
                Privacy Policy <ExternalLink className="h-2.5 w-2.5" />
              </a>
              <span className="text-border text-xs">·</span>
              <a href="/terms" className="text-xs text-primary hover:underline flex items-center gap-1">
                Terms of Service <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </Section>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/[0.03] p-5">
            <p className="text-sm font-semibold text-destructive/80 mb-1">Danger zone</p>
            <p className="text-xs text-muted-foreground mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              onClick={openDeleteDialog}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete my account
            </Button>
          </div>
        </div>
      </main>

      {/* Delete Account Multi-step Dialog */}
      <Dialog open={deleteOpen} onOpenChange={(o) => { if (!isDeleting) setDeleteOpen(o); }}>
        <DialogContent className="bg-card border-border max-w-md">
          {deleteStep === 1 && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mx-auto mb-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <DialogTitle className="text-center text-xl">Delete your account?</DialogTitle>
                <DialogDescription className="text-center text-sm leading-relaxed">
                  This permanently removes your account, subscription, and all data. There's no going back.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                >
                  Keep my account
                </Button>
                <Button
                  className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => setDeleteStep(2)}
                >
                  Yes, continue
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {deleteStep === 2 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">Why are you leaving?</DialogTitle>
                <DialogDescription className="text-sm">
                  Your feedback helps us improve Lyto for everyone.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-2">
                {DELETE_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => setDeleteReason(reason)}
                    className={cn(
                      'w-full text-left text-sm px-4 py-3 rounded-xl border transition-all duration-150',
                      deleteReason === reason
                        ? 'border-primary bg-primary/5 text-foreground font-medium'
                        : 'border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground',
                    )}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={() => setDeleteStep(1)} className="text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={!deleteReason}
                  onClick={() => setDeleteStep(3)}
                >
                  Next
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {deleteStep === 3 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">How was your experience?</DialogTitle>
                <DialogDescription className="text-sm">
                  One last thing — rate your overall experience with Lyto.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-5">
                {/* Star rating */}
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setDeleteRating(star)}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          'h-8 w-8 transition-colors',
                          star <= deleteRating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30',
                        )}
                      />
                    </button>
                  ))}
                </div>
                {deleteRating > 0 && (
                  <p className="text-center text-xs text-muted-foreground">
                    {deleteRating === 1 && 'We\'re sorry to hear that.'}
                    {deleteRating === 2 && 'We\'ll work to do better.'}
                    {deleteRating === 3 && 'Thanks for the honest feedback.'}
                    {deleteRating === 4 && 'Glad it was mostly good!'}
                    {deleteRating === 5 && 'That means a lot, thank you!'}
                  </p>
                )}

                {/* Optional text */}
                <textarea
                  placeholder="Anything else you'd like to share? (optional)"
                  value={deleteFeedback}
                  onChange={(e) => setDeleteFeedback(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={() => setDeleteStep(2)} className="text-muted-foreground">
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
                </Button>
                <Button
                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteRating === 0 || isDeleting}
                  onClick={handleDeleteAccount}
                >
                  {isDeleting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deleting…</>
                  ) : (
                    'Delete my account'
                  )}
                </Button>
              </div>
            </>
          )}

          {deleteStep === 4 && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
                <CheckCircle2 className="h-7 w-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">Account deleted</p>
                <p className="text-sm text-muted-foreground mt-1">Thanks for using Lyto. Redirecting you home…</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ── Small helper components ── */

function Section({
  icon, title, description, children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/40 bg-muted/20">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/30">
      <div className="text-muted-foreground shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-medium truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function PrivacyItem({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-primary/[0.04] border border-primary/10">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

export default Settings;
