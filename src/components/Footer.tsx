import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';

const links = [
  {
    group: 'Product',
    items: [
      { title: 'Features', href: '/#features' },
      { title: 'Pricing', href: '/#pricing' },
      { title: 'Showcase', href: '/#showcase' },
      { title: 'Changelog', href: '#' },
    ],
  },
  {
    group: 'Company',
    items: [
      { title: 'About', href: '#' },
      { title: 'Contact', href: 'mailto:info@trylyto.com' },
    ],
  },
  {
    group: 'Legal',
    items: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Cookie Policy', href: '#' },
    ],
  },
];

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/lyto-ai',
    icon: <Linkedin className="size-5" />,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/lyto.ai',
    icon: <Instagram className="size-5" />,
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/lytoai31786',
    icon: <Twitter className="size-5" />,
  },
];

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/40 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-5">

          {/* Brand + socials */}
          <div className="space-y-6 md:col-span-2">
            <Link to="/" aria-label="go home" className="block size-fit">
              <span className="text-xl font-serif text-foreground">
                Lyto AI<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A Chrome extension that gives you full control over your browser — automating tasks, connecting your tools, and keeping everything organized.
            </p>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-muted-foreground hover:text-primary transition-colors duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="col-span-3 grid gap-8 sm:grid-cols-3">
            {links.map((group) => (
              <div key={group.group} className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  {group.group}
                </span>
                <div className="flex flex-col gap-3">
                  {group.items.map((item) =>
                    item.href.startsWith('/') ? (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <a
                        key={item.title}
                        href={item.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
                      >
                        {item.title}
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Lyto AI. All rights reserved.
          </span>
          <span className="text-muted-foreground/60 text-xs">
            Built with <span className="text-primary italic">purpose</span> for Chrome power users
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
