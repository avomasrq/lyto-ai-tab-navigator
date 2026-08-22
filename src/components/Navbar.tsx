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

  const isProActive = subscription?.plan === 'pro' && subscription?.status === 'active';

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
            ? 'max-w-4xl rounded-lg border border-border/40 shadow-sm backdrop-blur-md'
            : 'max-w-full rounded-none border-b border-transparent',
        )}
          /* Inline and literal, both deliberately. Something in the cascade paints
             this element's background and beats every utility class — measured: even
             `bg-white/85` on the element computes to transparent, an inline value does
             not. And a literal rather than hsl(var(--background)/…), which Chrome
             refuses to resolve from an inline declaration. The page is light-only
             (darkMode: class, and nothing ever sets the class), so white is safe.
             Without it the pill is see-through, and over the black memory band the
             dark logo and links disappear completely. */
          style={isScrolled ? { background: 'hsl(0 0% 100% / 0.86)' } : undefined}
        >
          <nav className="flex items-center justify-between p-1.5 max-w-4xl mx-auto">

          {/* Logo */}
          <Link
            to="/"
            // `hover:bg-accent` painted this pill near-black on hover: --accent is
            // 0 0% 9% in this theme, so the wordmark inverted into a black slab while
            // every other item in the bar only shifts its text colour. Same behaviour
            // as the nav links now.
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-foreground/80 transition-colors duration-150 hover:text-foreground"
          >
            <span className="text-base font-geometric tracking-tight">
              Argos<span className="text-primary">.</span>
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
                  'text-muted-foreground hover:text-foreground text-xs gap-1',
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
                  className={cn(
                    'w-64 rounded-2xl border-white/50 p-1.5 text-foreground',
                    'bg-white/80 backdrop-blur-xl',
                    'shadow-[0_10px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.9)]',
                  )}
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
                      <DropdownMenuSubContent
                        className={cn(
                          'rounded-2xl border-white/50 p-1.5 bg-white/80 backdrop-blur-xl',
                          'shadow-[0_10px_40px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.9)]',
                        )}
                      >
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
                <Link to="/auth" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs')}>
                  Sign in
                </Link>
                {/* The primary button installs the product; it used to open /auth.
                    Argos IS the extension — sending the strongest CTA on the page to a
                    sign-up form got people an account and no product, which is where
                    half of them stopped. Signing in stays available, one button over. */}
                <Button size="sm" className="text-xs h-8" asChild>
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
