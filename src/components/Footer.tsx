import { Sparkles } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Product: ['Features', 'Pricing', 'Chrome Extension', 'Roadmap', 'Changelog'],
    Resources: ['Documentation', 'API Reference', 'Blog', 'Support', 'Community'],
    Company: ['About Us', 'Careers', 'Press Kit', 'Privacy', 'Terms'],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'Discord', href: '#' },
    { name: 'LinkedIn', href: '#' },
  ];

  return (
    <footer className="py-20 px-6 border-t border-border/50 relative">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-6 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-foreground">Lyto</span>
                <span className="gradient-text ml-1">AI</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6 font-light">
              Your AI navigator for browser tabs. Find information instantly across all your open tabs with semantic search.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 text-xs font-semibold"
                  aria-label={social.name}
                >
                  {social.name.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-foreground mb-5 text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm font-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-light">
            © {new Date().getFullYear()} Lyto AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-light">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-light">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-light">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
