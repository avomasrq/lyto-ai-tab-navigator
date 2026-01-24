import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, User, Settings, LogOut, LayoutDashboard, Sparkles, HelpCircle, FileText, Bug, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Book Demo', href: 'https://calendly.com/arylovessway/30min', external: true },
  ];

  const getInitials = () => {
    const name = user?.user_metadata?.full_name;
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-3' 
            : 'py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6">
          <motion.div 
            className={`flex items-center justify-between rounded-full transition-all duration-500 ${
              isScrolled 
                ? 'bg-background/80 backdrop-blur-xl border border-border/50 px-6 py-3 shadow-lg' 
                : 'px-2'
            }`}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif">
                Lyto<span className="text-primary">.</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50 ${
                    link.external ? 'flex items-center gap-1.5' : ''
                  }`}
                >
                  {link.external && <Calendar className="w-3.5 h-3.5" />}
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Avatar className="w-9 h-9 border-2 border-primary/20">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer flex items-center">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/#pricing" className="cursor-pointer flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade plan
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Help
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem asChild>
                            <a href="mailto:support@lytoai.com" className="cursor-pointer flex items-center">
                              <HelpCircle className="w-4 h-4 mr-2" />
                              Help center
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/coming-soon" className="cursor-pointer flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Release notes
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/terms" className="cursor-pointer flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Terms & policies
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href="mailto:bugs@lytoai.com" className="cursor-pointer flex items-center">
                              <Bug className="w-4 h-4 mr-2" />
                              Report Bug
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                    Sign in
                  </Link>
                  <Link to="/coming-soon" className="pill-button-primary pill-button text-sm py-2.5 px-5 group">
                    Get Started
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
            <motion.div 
              className="relative h-full flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  className={`text-3xl font-serif ${link.external ? 'flex items-center gap-2' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {link.external && <Calendar className="w-6 h-6" />}
                  {link.label}
                </motion.a>
              ))}
              
              <motion.div 
                className="flex flex-col items-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {user ? (
                  <>
                    <Link to="/dashboard" className="text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/settings" className="text-lg text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                      Settings
                    </Link>
                    <button onClick={() => { signOut(); setIsMobileMenuOpen(false); }} className="text-lg text-destructive">
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="text-lg text-muted-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign in
                    </Link>
                    <Link to="/coming-soon" className="pill-button-primary pill-button" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
