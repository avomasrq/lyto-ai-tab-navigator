import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Menu, LogOut, LayoutDashboard, Settings, Sparkles, HelpCircle, FileText, Bug } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { CHROME_STORE_URL } from '@/lib/store';
import { InstallCta, useInstallEnv } from '@/components/InstallCta';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { isProActive as isProSubscription } from '@/lib/subscription';

const NAV_LINKS = [
  { label: 'Use Cases',   href: '#use-cases' },
  { label: 'Pricing',     href: '#pricing' },
  // Not just "CLI": the page is also where Telegram gets connected, and the
  // people who need that route are the ones who cannot install the extension.
  { label: 'Telegram & CLI', href: '/cli' },
  { label: 'Beta',        href: '/beta' },
];

/* Shared row style for the account menu. Radix drives hover AND keyboard focus
   through data-highlighted, so the tint has to hang off `focus:` to light up for
   both — a plain hover: class leaves arrow-key navigation with no visible cursor. */
// Exact values from .lg-glass in src/index.css, inline rather than the class —
// see the comment on DropdownMenuContent below for why.
//
// This is a hand-copied duplicate of a CSS rule, which means it does not follow
// that rule when it changes: it kept rendering the old flat-white glass for a
// while after `.lg-glass` was rebuilt on the extension panel's recipe, and the
// only symptom was this one menu looking slightly wrong next to everything
// else. If you edit `.lg-glass`, edit this too. It stays inline because
// DropdownMenuContent's own bg-popover/border/shadow-md win the cascade over a
// class name — see below.
// The scrolled navbar pill, on the dashboard panels' material — `.lg-glass-card`
// in index.css, spelled out here because something in the cascade paints this
// element's background and beats every utility class. Measured, not assumed:
// `bg-white/85` on this element computes to transparent.
//
// The fill is 32%, and that number is the whole point. An earlier pass ran this
// at 86% white to protect the contrast of the muted nav links over the black
// memory band — which does protect them, and in exchange the pill stops being
// glass at all: 86% over anything is an opaque slab with a blur behind it that
// nobody can see through. Transmission is the property being paid for here.
//
// The diagonal streak is what keeps the pane visible over a light background,
// where a 32% fill would otherwise have almost nothing to distinguish it from
// the page.
const NAV_GLASS_STYLE: React.CSSProperties = {
  background:
    'linear-gradient(125deg,' +
    ' rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.16) 35%,' +
    ' rgba(255,255,255,0.04) 52%, rgba(255,255,255,0.30) 100%),' +
    ' linear-gradient(0deg,' +
    ' hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07),' +
    ' hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07)),' +
    ' rgba(255,255,255,0.32)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.70)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.95),' +
    ' inset 0 -1px 0 rgba(255,255,255,0.25),' +
    ' inset 1px 0 0 rgba(255,255,255,0.40),' +
    ' inset -1px 0 0 rgba(255,255,255,0.40),' +
    ' 0 2px 10px rgba(15,23,42,0.07),' +
    ' 0 8px 24px rgba(15,23,42,0.05)',
};

// The same pane over a black section — `.lg-glass-dark`'s tones on the card
// recipe's geometry. Not a lighter version of the light pill: over black, white
// at any usable opacity is a fog, whereas a dark pane with a bright rim is what
// glass actually looks like against a dark ground.
const NAV_GLASS_DARK_STYLE: React.CSSProperties = {
  background:
    'linear-gradient(125deg,' +
    ' rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 35%,' +
    ' rgba(255,255,255,0.00) 52%, rgba(255,255,255,0.06) 100%),' +
    ' linear-gradient(0deg,' +
    ' hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.10),' +
    ' hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.10)),' +
    ' rgba(38,38,42,0.55)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.14),' +
    ' inset 0 -1px 0 rgba(255,255,255,0.03),' +
    ' 0 2px 10px rgba(0,0,0,0.35),' +
    ' 0 8px 24px rgba(0,0,0,0.25)',
};

const LG_GLASS_STYLE: React.CSSProperties = {
  position: 'relative',
  background:
    'linear-gradient(0deg,' +
    ' hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07),' +
    ' hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07)),' +
    ' rgba(255, 255, 255, 0.68)',
  backdropFilter: 'blur(26px) saturate(200%)',
  WebkitBackdropFilter: 'blur(26px) saturate(200%)',
  border: '1px solid rgba(255, 255, 255, 0.54)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.85),' +
    ' inset 0 -1px 0 rgba(255,255,255,0.22),' +
    ' inset 1px 0 0 rgba(255,255,255,0.30),' +
    ' inset -1px 0 0 rgba(255,255,255,0.30),' +
    ' 0 2px 16px rgba(0,0,0,0.06)',
};

const MENU_ITEM =
  'cursor-pointer rounded-lg px-2.5 py-2 text-[13px] focus:bg-black/[0.06] focus:text-foreground';

const Navbar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();
  // The sheet below is opened mostly on phones, where "Add to Chrome" cannot work.
  const installEnv = useInstallEnv();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Prefix hash links with '/' when not on the home page so they navigate home first
  const resolveHref = (href: string) =>
    href.startsWith('#') && !isHome ? `/${href}` : href;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Is the bar currently sitting over one of the black sections?
   *
   * This exists because the pill is real glass — 32% fill — and real glass over
   * a black section goes dark. That is correct behaviour and it is the whole
   * reason the material was chosen; what it breaks is the nav links, which are
   * `text-muted-foreground` and disappear against it. The wrong fix, and the
   * one tried first, is to raise the fill until the pane is opaque enough to
   * protect them: that buys legibility by throwing away transmission, which is
   * the property being paid for.
   *
   * So the text adapts instead of the pane. Sections opt in with
   * `data-surface="dark"` rather than being sniffed by class name, so restyling
   * one does not silently switch this off.
   *
   * Cheap by construction: the query runs once, and the scroll handler only
   * compares two rectangles. */
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const darks = Array.from(document.querySelectorAll<HTMLElement>('[data-surface="dark"]'));
    if (darks.length === 0) return;

    // Test the bar's centre line, not whether the section has entered its band
    // at all. The looser test flips the moment a dark section touches the
    // bottom edge of the bar — at which point the pane is still almost entirely
    // over the white section above it, and the links turn white on white for
    // the length of the crossing.
    const check = () => {
      const mid = isScrolled ? 48 : 28;
      setOnDark(darks.some((d) => {
        const r = d.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      }));
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [location.pathname, isScrolled]);

  const { data: subscription } = useQuery({
    queryKey: ['navbar-subscription', user?.id],
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

  const isProActive = isProSubscription(subscription);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Hero gradient bleed — fades out as user scrolls */}
      {!isScrolled && (
        <div
          className="fixed inset-x-0 top-0 z-40 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0,0.10) 0%, transparent 100%)',
          }}
        />
      )}

      <div className={cn(
        'fixed inset-x-0 z-50 transition-all duration-300',
        isScrolled ? 'top-5 px-4' : 'top-0 px-0',
      )}>
        <header className={cn(
          'mx-auto w-full transition-all duration-300 bg-transparent',
          isScrolled
            ? 'max-w-4xl rounded-2xl'
            : 'max-w-full rounded-none border-b border-transparent',
        )}
          /* At rest the bar is transparent over the hero and carries no
             material — restored deliberately after a pass that put glass here
             too. The pill only exists once it has detached from the top. */
          style={isScrolled ? (onDark ? NAV_GLASS_DARK_STYLE : NAV_GLASS_STYLE) : undefined}
        >
          <nav className="flex items-center justify-between p-1.5 max-w-4xl mx-auto">

          {/* Logo */}
          <Link
            to="/"
            // `hover:bg-accent` painted this pill near-black on hover: --accent is
            // 0 0% 9% in this theme, so the wordmark inverted into a black slab while
            // every other item in the bar only shifts its text colour. Same behaviour
            // as the nav links now.
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors duration-150',
              onDark ? 'text-white/85 hover:text-white' : 'text-foreground/80 hover:text-foreground',
            )}
          >
            <span className="text-base font-geometric tracking-tight">
              {/* --primary is 0 0% 9%. On the dark pane the full stop simply
                  vanished and the wordmark read "Argos". */}
              Argos<span className={onDark ? 'text-white' : 'text-primary'}>.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={resolveHref(link.href)}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'text-xs gap-1',
                  onDark
                    ? 'text-white/70 hover:bg-white/10 hover:text-white'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Glass pill, same vocabulary as ui/liquid-glass-button — the
                      navbar sits over a photo, so a frosted trigger reads as part
                      of the surface instead of a grey chip pasted on top. */}
                  <button
                    aria-label="Account menu"
                    className={cn(
                      'group relative flex items-center gap-2 rounded-full py-1 pl-2.5 pr-1',
                      'border border-white/50 bg-white/25 backdrop-blur-md',
                      'shadow-[0_1px_3px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.75)]',
                      'transition-all duration-200 hover:bg-white/40 active:scale-[0.97]',
                      'data-[state=open]:bg-white/50',
                    )}
                  >
                    <span className={cn(
                      'text-[10px] font-semibold tracking-wide',
                      isProActive ? 'text-primary' : 'text-foreground/70',
                    )}>
                      {isProActive ? 'Pro' : 'Free'}
                    </span>
                    <Avatar className="h-6 w-6 ring-1 ring-white/70">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  // Same glass as JobsSection/HeroV2 (.lg-glass in index.css), applied
                  // inline: shadcn's own bg-popover/border/shadow-md on this component
                  // silently won the cascade over the class name, rendering flat opaque
                  // white with a plain shadow — measured via computed style, not a guess.
                  className="w-64 overflow-hidden rounded-2xl p-1.5 text-foreground"
                  style={LG_GLASS_STYLE}
                >
                  {/* Who you're signed in as — the menu used to open with no
                      confirmation of that, which matters on a shared machine. */}
                  <div className="flex items-center gap-2.5 px-2.5 py-2.5">
                    <Avatar className="h-9 w-9 ring-2 ring-white/80">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[11px]">
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold leading-tight">
                        {user.user_metadata?.full_name || 'Your account'}
                      </p>
                      <p className="truncate text-[11.5px] leading-tight text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="mx-1 bg-black/[0.08]" />

                  <DropdownMenuItem asChild className={MENU_ITEM}>
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2.5 h-4 w-4 text-muted-foreground" />Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={MENU_ITEM}>
                    <a href="/#pricing" className="flex items-center">
                      <Sparkles className="mr-2.5 h-4 w-4 text-muted-foreground" />
                      {isProActive ? 'Manage plan' : 'Upgrade plan'}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className={MENU_ITEM}>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    {/* The shadcn default is data-[state=open]:bg-accent, and --accent
                        is 0 0% 9% in this theme — an open Help row painted itself a
                        near-black slab with the label still dark on top of it. Same
                        trap as the logo pill above. */}
                    <DropdownMenuSubTrigger
                      className={cn(MENU_ITEM, 'data-[state=open]:bg-black/[0.06] data-[state=open]:text-foreground')}
                    >
                      <HelpCircle className="mr-2.5 h-4 w-4 text-muted-foreground" />Help
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="overflow-hidden rounded-2xl p-1.5" style={LG_GLASS_STYLE}>
                        <DropdownMenuItem asChild className={MENU_ITEM}>
                          <a href="mailto:info@tryargos.cc" className="flex items-center">
                            <HelpCircle className="mr-2.5 h-4 w-4 text-muted-foreground" />Help center
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className={MENU_ITEM}>
                          <a href="https://chromewebstore.google.com/detail/nalekilafbipfallhlkbpidgfceoabcb" target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <FileText className="mr-2.5 h-4 w-4 text-muted-foreground" />Release notes
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className={MENU_ITEM}>
                          <Link to="/terms" className="flex items-center">
                            <FileText className="mr-2.5 h-4 w-4 text-muted-foreground" />Terms & policies
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className={MENU_ITEM}>
                          <a href="mailto:info@tryargos.cc" className="flex items-center">
                            <Bug className="mr-2.5 h-4 w-4 text-muted-foreground" />Report bug
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator className="mx-1 bg-black/[0.08]" />

                  <DropdownMenuItem
                    onClick={signOut}
                    className={cn(MENU_ITEM, 'text-rose-600 focus:bg-rose-500/10 focus:text-rose-700')}
                  >
                    <LogOut className="mr-2.5 h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/auth"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'text-xs',
                    onDark && 'text-white/85 hover:bg-white/10 hover:text-white',
                  )}
                >
                  Sign in
                </Link>
                {/* The primary button installs the product; it used to open /auth.
                    Argos IS the extension — sending the strongest CTA on the page to a
                    sign-up form got people an account and no product, which is where
                    half of them stopped. Signing in stays available, one button over. */}
                {/* The primary button is near-black on white. On a dark pane
                    that is a black shape on a dark shape — the strongest CTA in
                    the bar becomes the hardest thing in it to see — so it
                    inverts rather than merely lightening. */}
                <Button
                  size="sm"
                  className={cn(
                    'text-xs h-8',
                    onDark && 'bg-white text-neutral-900 hover:bg-white/90',
                  )}
                  asChild
                >
                  <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">Add to Chrome</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setSheetOpen(true)}
              className="md:hidden h-8 w-8"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </Button>

            <SheetContent
              side="left"
              showClose={false}
              className="w-72 bg-background/95 backdrop-blur-lg border-r border-border/60 flex flex-col p-0 gap-0"
            >
              <div className="px-5 pt-6 pb-4 border-b border-border/40">
                <span className="text-base font-geometric tracking-tight">
                  Argos<span className="text-primary">.</span>
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.label}
                    href={resolveHref(link.href)}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start text-sm text-muted-foreground hover:text-foreground gap-2',
                    )}
                  >
                    {link.label}
                  </a>
                ))}

                {user && (
                  <div className="border-t border-border/40 mt-2 pt-2 space-y-0.5">
                    {/* Same five destinations as the desktop menu, so the two
                        don't drift — Help was missing here entirely. */}
                    <Link to="/dashboard" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <LayoutDashboard className="w-4 h-4" />Dashboard
                    </Link>
                    <a href="/#pricing" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <Sparkles className="w-4 h-4" />{isProActive ? 'Manage plan' : 'Upgrade plan'}
                    </a>
                    <Link to="/settings" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <Settings className="w-4 h-4" />Settings
                    </Link>
                    <a href="mailto:info@tryargos.cc" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <HelpCircle className="w-4 h-4" />Help
                    </a>
                  </div>
                )}
              </div>

              <SheetFooter className="flex flex-col gap-2 p-4 border-t border-border/40 bg-muted/20">
                {user ? (
                  <button onClick={() => { signOut(); setSheetOpen(false); }}
                    className={cn(buttonVariants({ variant: 'outline' }), 'w-full gap-2 text-sm')}>
                    <LogOut className="w-4 h-4" />Sign out
                  </button>
                ) : (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/auth" onClick={() => setSheetOpen(false)}>Sign in</Link>
                    </Button>
                    {/* Not the desktop button. This sheet is mostly opened on phones,
                        where "Add to Chrome" cannot succeed — mobile Chrome has no
                        extensions — so InstallCta switches to sending the link to a
                        machine that can install it. */}
                    <InstallCta env={installEnv} email={user?.email ?? null} onInstallClick={() => setSheetOpen(false)} />
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>

          </nav>
        </header>
      </div>
    </>
  );
};

export default Navbar;
