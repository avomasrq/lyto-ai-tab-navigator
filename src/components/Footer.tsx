import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const links = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Changelog', href: '#faq' },
    ],
    resources: [
      { label: 'Documentation', href: '#how-it-works' },
      { label: 'Help Center', href: 'mailto:arystan909@yahoo.com' },
      { label: 'Blog', href: '#showcase' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy', internal: true },
      { label: 'Terms', href: '/terms', internal: true },
    ],
  };

  const socials = [
    { label: 'LinkedIn', href: 'https://linkedin.com/company/lyto-ai' },
    { label: 'Instagram', href: 'https://www.instagram.com/lyto.ai' },
    { label: 'X', href: 'https://x.com/lytoai31786' },
  ];

  return (
    <footer className="pt-20 pb-10 px-6 border-t border-border bg-card/50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-serif">
                Lyto<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mt-5 max-w-xs leading-relaxed">
              AI-powered browser intelligence for researchers, developers, and anyone 
              who wants to work smarter online.
            </p>
            
            {/* Social links */}
            <div className="flex gap-6 mt-8">
              {socials.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-8 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-5">Product</h4>
              <ul className="space-y-3.5">
                {links.product.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-5">Resources</h4>
              <ul className="space-y-3.5">
                {links.resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-medium tracking-wider text-muted-foreground/60 uppercase mb-5">Legal</h4>
              <ul className="space-y-3.5">
                {links.legal.map((link) => (
                  <li key={link.label}>
                    {link.internal ? (
                      <Link to={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground/60 text-sm">
            &copy; {new Date().getFullYear()} Lyto AI. All rights reserved.
          </p>
          <a 
            href="https://impactconsulting.kz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground/60 hover:text-muted-foreground transition-colors inline-flex items-center gap-1"
          >
            Backed by Impact Consulting
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
