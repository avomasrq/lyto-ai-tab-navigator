import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4 bg-background/80 backdrop-blur-md border-b border-border' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="text-xl font-serif tracking-tight">
            Lyto<span className="text-primary">.</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </a>
          <Button variant="primary" size="default">
            Get started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="border-t border-border my-2 pt-4 flex flex-col gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Sign in
              </a>
              <Button variant="primary" className="w-full">
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
