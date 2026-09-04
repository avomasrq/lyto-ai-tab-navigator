import { useState, useEffect, useRef } from 'react';
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
import { MeanderBand } from '@/components/ui/greek-tablet';
import { MythLine } from '@/components/landing/Myth';
import { isProActive as isProSubscription } from '@/lib/subscription';

/**
 * Two-column layout — sticky identity + jump nav on the left, sections on the
 * right — carried over from the previous rebuild. What changed here is the
 * surface language: this used to run its own bespoke glass (an SVG turbulence
 * filter nothing else in the app uses). It now runs on `.lg-glass`, the site's
 * actual recipe — the same class JobsSection and HeroV2 use — so a settings
 * page and the homepage read as the same product instead of two different
 * demos glued together.
 *
 * The graph-paper grid is the hero's backdrop, faded down; MythLine and
 * MeanderBand are the homepage's own furniture (see landing/Myth.tsx) reused
 * as pure texture, no new mythology invented for a utility page. Section
 * headers take the mono numbered-label treatment from JobsSection's "01/02"
 * rather than a bare icon caption.
 */

const NAV = [
  { n: '01', id: 'account', label: 'Account', icon: User },
  { n: '02', id: 'subscription', label: 'Subscription', icon: CreditCard },
  { n: '03', id: 'desktop-agent', label: 'Desktop Agent', icon: Terminal },
  { n: '04', id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck },
  { n: '05', id: 'danger', label: 'Delete account', icon: Trash2 },
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
  const [activeSection, setActiveSection] = useState<string>(NAV[0].id);

  // Highlight whichever section is currently under the header as you scroll,
  // so the left nav isn't just a set of static links.
  useEffect(() => {
    const sections = NAV.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2 | 3 | 4>(1);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteRating, setDeleteRating] = useState(0);
  const [deleteFeedback, setDeleteFeedback] = useState('');

  // Redirect out in an effect, not mid-render. Calling navigate() during render
  // queues a router state update while this component is still rendering, which
  // React warns about and which can re-enter the guard before the redirect lands.
  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = deleteOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [deleteOpen]);

  // Keyboard access for the delete modal: this was a hand-rolled overlay with none
  // — no Escape, no focus trap, focus never returned to the button that opened it.
  // On the single most destructive action in the app, that's not a nice-to-have.
  const modalRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!deleteOpen) return;
    openerRef.current = document.activeElement as HTMLElement;
    // Focus lands inside on open; the modal renders after this effect runs on the
    // same tick as `deleteOpen` flipping, so the node is already in the DOM.
    modalRef.current?.querySelector<HTMLElement>('button, [href], input, textarea')?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isDeleting) setDeleteOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusables = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteOpen]);

  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('Subscription')
        // currentPeriodEnd is what the Polar webhook keeps fresh; a subscription
        // page that cannot say when it renews is missing the one date people
        // actually open it to check.
        .select('plan, status, currentPeriodStart, currentPeriodEnd')
        .eq('userId', user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const isProActive = isProSubscription(subscription);

  // Formatted in UTC on purpose. The billing period is stored as a UTC instant, and
  // rendering it in the viewer's zone shifted the date a full day earlier for anyone
  // west of UTC — a renewal date that is off by one is worse than none at all.
  const fmtDate = (d: string | null | undefined) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : null;

  const periodEnd = fmtDate(subscription?.currentPeriodEnd);
  // Read off `status` only. The upsert migration does write a cancelAtPeriodEnd
  // column, but the generated Supabase types don't expose it, so selecting it here
  // would be untyped and would break if that migration isn't live. Consequence: a
  // subscription cancelled mid-period still reads "Renews" until Polar flips the
  // status. Worth revisiting once the types are regenerated.
  const isCancelling = subscription?.status === 'canceled';

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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <div className="relative min-h-screen bg-background">
        {/* Same texture as the hero, faded down: a settings page under it reads
            as the same product instead of a different demo bolted on. Fixed so
            it does not slide under the cards while scrolling. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(hsl(var(--foreground)/0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.05) 1px, transparent 1px)',
            backgroundSize: '52px 52px',
            maskImage: 'radial-gradient(90% 60% at 50% 0%, black 20%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(90% 60% at 50% 0%, black 20%, transparent 75%)',
          }}
        />

        <div className="relative">
          {/* Header — same chrome as the dashboard, so the app doesn't change
              personality the moment you open a settings page. */}
          <header className="lg-glass sticky top-0 z-40">
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
              /* -ml-2 px-2 py-2.5 keeps it visually flush while giving it a real
                 touch target; as a bare inline row it was 20px tall on a phone. */
              className="-ml-2 mb-6 flex items-center gap-1.5 px-2 py-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            <MythLine className="mb-5 justify-start">Οἶκος · your account</MythLine>

            <h1 className="font-geometric text-[28px] font-semibold leading-tight tracking-tight text-foreground sm:text-[34px]">
              Settings
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Your account, subscription, and desktop agent, in one place.
            </p>

            {/* Mobile quick-nav — the sidebar nav only shows at lg+, so smaller
                screens need their own way to jump to a section. */}
            <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
              {NAV.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={scrollToSection(id)}
                  className="lg-glass flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </a>
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:mt-10 lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
              {/* ── Left: identity + jump nav ── */}
              <div className="space-y-4 lg:sticky lg:top-24">
                <div className="lg-glass overflow-hidden rounded-2xl">
                  <div className="h-1.5 bg-gradient-to-r from-primary/70 via-primary/30 to-transparent" />
                  <div className="flex flex-col items-center p-6 text-center">
                    <div className="relative">
                      <Avatar className="h-16 w-16 shadow-sm ring-4 ring-background">
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

                <nav className="lg-glass hidden overflow-hidden rounded-2xl lg:block">
                  {NAV.map(({ id, label, icon: Icon }) => {
                    const active = activeSection === id;
                    return (
                      <a
                        key={id}
                        href={`#${id}`}
                        onClick={scrollToSection(id)}
                        className={cn(
                          'relative flex items-center gap-2.5 border-b border-foreground/[0.06] px-4 py-3 text-[13px] transition-colors last:border-b-0',
                          active ? 'bg-foreground/[0.04] font-medium text-foreground' : 'text-muted-foreground hover:bg-foreground/[0.03] hover:text-foreground',
                        )}
                      >
                        {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-primary" />}
                        <Icon className={cn('h-3.5 w-3.5 shrink-0', active && 'text-primary')} />
                        {label}
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* ── Right: sections ── */}
              <div className="space-y-6">

                <SettingsSection n="01" id="account" icon={User} label="Account">
                  <Row label="Email" value={user.email ?? ''} />
                  <Row
                    label="Member since"
                    value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    last
                  />
                </SettingsSection>

                <SettingsSection n="02" id="subscription" icon={CreditCard} label="Subscription">
                  <div className="flex items-center justify-between px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-foreground">{isProActive ? 'Argos Pro' : 'Free plan'}</p>
                      <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                        {isProActive ? 'No limits' : '50 tasks a week'}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide',
                        isCancelling
                          ? 'border-amber-600/25 bg-amber-600/10 text-amber-700'
                          : isProActive
                            ? 'border-emerald-600/25 bg-emerald-600/10 text-emerald-700'
                            : 'border-border bg-muted text-muted-foreground',
                      )}
                    >
                      {isCancelling ? 'ENDING' : isProActive ? 'ACTIVE' : 'FREE'}
                    </span>
                  </div>
                  {periodEnd && (
                    <Row
                      label={isCancelling ? 'Access until' : 'Renews'}
                      value={periodEnd}
                      last
                    />
                  )}
                  <div className="border-t border-foreground/[0.06] px-5 py-4 sm:px-6">
                    {isProActive ? (
                      <button
                        onClick={openCustomerPortal}
                        disabled={polarLoading}
                        className="w-full rounded-xl border border-foreground/10 bg-background py-2.5 text-[13.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted disabled:opacity-50"
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
                <SettingsSection n="03" id="desktop-agent" icon={Terminal} label="Desktop Agent">
                  <div className="flex items-center gap-2.5 px-5 py-4 sm:px-6">
                    <Terminal className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-foreground">Argos CLI</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                        Run Argos on your own machine, with your own key.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-foreground/[0.06] px-5 py-4 sm:px-6">
                    <button
                      onClick={() => navigate('/cli')}
                      className="w-full rounded-xl border border-foreground/10 bg-background py-2.5 text-[13.5px] font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
                    >
                      Set up & manage →
                    </button>
                  </div>
                </SettingsSection>

                <SettingsSection n="04" id="privacy" icon={ShieldCheck} label="Privacy & Security">
                  <div className="border-b border-foreground/[0.06] px-5 py-4 sm:px-6">
                    <p className="text-[14px] font-semibold text-foreground">Never reads or fills passwords</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      That refusal is in the extension itself. Card fields are skipped the same way.
                    </p>
                  </div>
                  <div className="border-b border-foreground/[0.06] px-5 py-4 sm:px-6">
                    <p className="text-[14px] font-semibold text-foreground">Signed in with OAuth</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">
                      All transfers use TLS. There is no password stored on our side to leak.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-4 py-2 sm:px-5">
                    <a href="/privacy" className="px-2 py-2.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">Privacy</a>
                    <span className="text-muted-foreground/30">·</span>
                    <a href="/terms" className="px-2 py-2.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">Terms</a>
                    <span className="text-muted-foreground/30">·</span>
                    <a href="/cookies" className="px-2 py-2.5 text-[12.5px] text-muted-foreground transition-colors hover:text-foreground">Cookies</a>
                  </div>
                </SettingsSection>

                {/* Danger — kept on the site's plain (non-glass) surface deliberately.
                    Frosting the one card that ends your account read as decoration on
                    the wrong control; a flat rose card says "this one is different"
                    the way the glass elsewhere says "this one is normal." */}
                <div id="danger" className="scroll-mt-24 overflow-hidden rounded-2xl border border-rose-600/25 shadow-sm">
                  <div className="flex items-center gap-2 bg-rose-600/[0.06] px-5 py-3 sm:px-6">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-600/10 text-rose-600">
                      <Trash2 className="h-3 w-3" />
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-rose-600/70">05</span>
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

            <MeanderBand className="mx-auto mt-16 w-40 opacity-25" color="#8a6d3b" />
          </main>
        </div>
      </div>

      {/* ── Delete modal ── */}
      {deleteOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setDeleteOpen(false); }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={deleteStep === 4 ? 'Account deleted' : 'Delete your account'}
            className="lg-glass relative flex w-full max-w-sm flex-col rounded-2xl p-6"
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
  n, id, icon: Icon, label, children,
}: { n: string; id: string; icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-2.5 flex items-center gap-2.5 px-1">
        <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground/45">{n}</span>
        <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70">{label}</p>
      </div>
      <div className="lg-glass overflow-hidden rounded-2xl">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn('flex items-center justify-between px-5 py-4 sm:px-6', !last && 'border-b border-foreground/[0.06]')}>
      <p className="text-[13.5px] text-muted-foreground">{label}</p>
      <p className="max-w-[55%] truncate text-right text-[13.5px] font-medium text-foreground">{value}</p>
    </div>
  );
}

export default Settings;
