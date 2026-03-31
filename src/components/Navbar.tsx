import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { GlassFilter } from '@/components/ui/liquid-glass-button';
import { Menu, X, LogOut, LayoutDashboard, Settings, Sparkles, HelpCircle, FileText, Bug, Calendar } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
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

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Book a Demo', href: 'https://calendly.com/arylovessway/30min', external: true },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'py-3 px-4' : 'py-6 px-6'
    }`}>
      <GlassFilter id="navbar-glass" />
      <nav
        className={`mx-auto transition-all duration-500 relative ${
          isScrolled
            ? 'max-w-4xl 2xl:max-w-5xl rounded-full px-6 py-3'
            : 'container bg-transparent'
        }`}
        style={isScrolled ? {
          boxShadow: '0 0 6px rgba(0,0,0,0.03), 0 2px 12px rgba(0,0,0,0.10), inset 3px 3px 0.5px -3px rgba(255,255,255,0.7), inset -3px -3px 0.5px -3px rgba(255,255,255,0.5), inset 1px 1px 1px -0.5px rgba(255,255,255,0.4), inset -1px -1px 1px -0.5px rgba(255,255,255,0.4), inset 0 0 6px 6px rgba(255,255,255,0.08), inset 0 0 2px 2px rgba(255,255,255,0.04)',
          backdropFilter: 'blur(16px) url("#navbar-glass")',
          WebkitBackdropFilter: 'blur(16px)',
          background: 'rgba(255,255,255,0.45)',
          border: '1px solid rgba(255,255,255,0.5)',
        } : undefined}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-serif tracking-tight">
              Lyto AI<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide ${link.external ? 'flex items-center gap-1' : ''}`}
              >
                {link.external && <Calendar className="w-3.5 h-3.5" />}
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      isProActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isProActive ? 'Pro' : 'Free'}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user.user_metadata?.full_name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/#pricing" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade plan
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="bg-card border-border">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href="mailto:arystan909@yahoo.com" className="flex items-center">
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Help center
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href="https://chromewebstore.google.com/detail/nalekilafbipfallhlkbpidgfceoabcb?utm_source=item-share-cb" target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Release notes
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/terms" className="flex items-center">
                            <FileText className="mr-2 h-4 w-4" />
                            Terms & policies
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <a href="mailto:arystan909@yahoo.com" className="flex items-center">
                            <Bug className="mr-2 h-4 w-4" />
                            Report Bug
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </Link>
                <Button variant="primary" size={isScrolled ? 'sm' : 'default'} asChild>
                  <Link to="/auth">Get started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 relative w-9 h-9 flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="absolute"
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  className="absolute"
                >
                  <Menu size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="md:hidden mt-2 mx-4 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`text-muted-foreground hover:text-foreground transition-colors py-2.5 text-sm ${link.external ? 'flex items-center gap-2' : 'block'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.04, duration: 0.2, ease: 'easeOut' }}
                >
                  {link.external && <Calendar className="w-4 h-4" />}
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                className="border-t border-border mt-2 pt-4 flex flex-col gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
              >
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <a
                      href="/#pricing"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Sparkles className="h-4 w-4" />
                      Upgrade plan
                    </a>
                    <Link
                      to="/settings"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="text-muted-foreground hover:text-foreground text-left flex items-center gap-2 text-sm py-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="text-muted-foreground hover:text-foreground text-sm py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Button variant="primary" className="w-full" asChild>
                      <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        Get started
                      </Link>
                    </Button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
