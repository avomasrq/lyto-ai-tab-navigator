import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const Footer = () => {
  return (
    <footer className="relative bg-background text-foreground overflow-hidden">

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-10 sm:gap-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4">
            <Link to="/" className="inline-block">
              <span className="text-xl sm:text-2xl font-serif text-foreground">
                Lyto AI<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm sm:text-sm mt-5 max-w-xs leading-relaxed">
              A Chrome extension that gives you full control over your browser — automating tasks, connecting your tools, and keeping everything organized.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://linkedin.com/company/lyto-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://www.instagram.com/lyto.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://x.com/lytoai31786"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-center transition-all duration-300 group"
                aria-label="X / Twitter"
              >
                <Twitter className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-5">Product</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Showcase', href: '#showcase' },
                { label: 'Changelog', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-5">Resources</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Documentation', href: '#' },
                { label: 'Help Center', href: 'mailto:arystan909@yahoo.com' },
                { label: 'Blog', href: '#' },
                { label: 'API', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-5">Legal</h4>
            <ul className="space-y-3.5">
              {[
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Cookie Policy', to: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Lyto AI. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs">
            Built with <span className="text-primary italic">purpose</span> for Chrome power users
          </p>
        </div>
      </div>

      {/* Subtle decorative glow - much softer in light mode */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
    </footer>
  );
};

export default Footer;
