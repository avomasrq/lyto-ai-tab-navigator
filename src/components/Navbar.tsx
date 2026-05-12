import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Menu, LogOut, LayoutDashboard, Settings, Sparkles, HelpCircle, FileText, Bug, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
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
  { label: 'Features',    href: '#features' },
  { label: 'Demo',        href: '#showcase' },
  { label: 'Pricing',     href: '#pricing' },
  { label: 'FAQ',         href: '#faq' },
  { label: 'Book a Demo', href: 'https://calendly.com/arylovessway/30min', external: true },
];

const Navbar = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();

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
    <div className={cn(
      'fixed inset-x-0 z-50 transition-all duration-300',
      isScrolled ? 'top-5 px-4' : 'top-0 px-0',
    )}>
      <header className={cn(
        'mx-auto w-full transition-all duration-300',
        isScrolled
          ? 'max-w-4xl rounded-lg border shadow bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur-lg'
          : 'max-w-full rounded-none border-b border-transparent bg-transparent',
      )}>
        <nav className="flex items-center justify-between p-1.5 max-w-4xl mx-auto">

          {/* Logo */}
          <Link
            to="/"
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 hover:bg-accent duration-100"
          >
            <span className="text-base font-serif tracking-tight">
              Lyto AI<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'text-muted-foreground hover:text-foreground text-xs gap-1',
                )}
              >
                {link.external && <Calendar className="w-3 h-3" />}
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
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity px-2 py-1 rounded-md hover:bg-accent">
                    <span className={cn(
                      'text-[10px] font-medium px-2 py-0.5 rounded-full',
                      isProActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                    )}>
                      {isProActive ? 'Pro' : 'Free'}
                    </span>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/#pricing" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />Upgrade plan
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />Help
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-card border-border">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href="mailto:info@trylyto.com" className="flex items-center">
                            <HelpCircle className="mr-2 h-4 w-4" />Help center
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href="https://chromewebstore.google.com/detail/nalekilafbipfallhlkbpidgfceoabcb" target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />Release notes
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/terms" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />Terms & policies
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href="mailto:info@trylyto.com" className="flex items-center">
                            <Bug className="mr-2 h-4 w-4" />Report bug
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-xs')}>
                  Sign in
                </Link>
                <Button size="sm" className="text-xs h-8" asChild>
                  <Link to="/auth">Get started</Link>
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
                <span className="text-base font-serif tracking-tight">
                  Lyto AI<span className="text-primary">.</span>
                </span>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
                {NAV_LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full justify-start text-sm text-muted-foreground hover:text-foreground gap-2',
                    )}
                  >
                    {link.external && <Calendar className="w-4 h-4 shrink-0" />}
                    {link.label}
                  </a>
                ))}

                {user && (
                  <div className="border-t border-border/40 mt-2 pt-2 space-y-0.5">
                    <Link to="/dashboard" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <LayoutDashboard className="w-4 h-4" />Dashboard
                    </Link>
                    <a href="/#pricing" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <Sparkles className="w-4 h-4" />Upgrade plan
                    </a>
                    <Link to="/settings" onClick={() => setSheetOpen(false)}
                      className={cn(buttonVariants({ variant: 'ghost' }), 'w-full justify-start text-sm text-muted-foreground gap-2')}>
                      <Settings className="w-4 h-4" />Settings
                    </Link>
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
                    <Button asChild className="w-full">
                      <Link to="/auth" onClick={() => setSheetOpen(false)}>Get started</Link>
                    </Button>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>

        </nav>
      </header>
    </div>
  );
};

export default Navbar;
