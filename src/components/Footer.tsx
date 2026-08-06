import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import { FooterRoot } from '@/components/ui/footer-section';
import { AwardBadge } from '@/components/ui/award-badge';

const FOOTER_SECTIONS = [
  {
    label: 'Product',
    links: [
      { title: 'Use Cases',    href: '/#use-cases' },
      { title: 'Pricing',      href: '/#pricing' },
      { title: 'Demo',         href: '/#demo' },
      { title: 'Changelog',    href: 'https://chromewebstore.google.com/detail/nalekilafbipfallhlkbpidgfceoabcb', external: true },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'About',        href: '#' },
      { title: 'Contact',      href: 'mailto:info@tryargos.cc' },
      { title: 'Book a Demo',  href: 'https://calendly.com/arylovessway/30min', external: true },
    ],
  },
  {
    label: 'Legal',
    links: [
      { title: 'Privacy Policy',    href: '/privacy' },
      { title: 'Terms of Service',  href: '/terms' },
      { title: 'Cookie Policy',     href: '/cookies' },
    ],
  },
  {
    label: 'Social',
    links: [
      { title: 'LinkedIn',   href: 'https://linkedin.com/company/lyto-ai',  external: true, icon: Linkedin },
      { title: 'Instagram',  href: 'https://www.instagram.com/lyto.ai',     external: true, icon: Instagram },
      { title: 'X / Twitter', href: 'https://x.com/lytoai31786',            external: true, icon: Twitter },
    ],
  },
];

const Footer = () => {
  return (
    <FooterRoot
      sections={FOOTER_SECTIONS}
      brand={
        <div className="space-y-4">
          <Link to="/" className="block w-fit">
            <span className="text-xl font-serif text-foreground">
              Argos<span className="text-primary">.</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            A Chrome extension that gives you full control over your browser — automating tasks, connecting your tools, and keeping everything organized.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <AwardBadge
              type="featured"
              link="https://www.producthunt.com/products/lyto?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-argos"
            />
            <a
              href="https://www.producthunt.com/products/lyto?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_campaign=badge-argos"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[180px] sm:w-[250px]"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=1182460&theme=light&period=daily"
                alt='Argos - "One AI agent across your browser, tools, and messages" | Product Hunt'
                width={250}
                height={54}
                loading="lazy"
                className="h-auto w-full"
              />
            </a>
          </div>
        </div>
      }
      bottom={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Argos. All rights reserved.
          </span>
          <span className="text-muted-foreground/60 text-xs">
            Built with <span className="text-primary italic">purpose</span> for Chrome power users
          </span>
        </div>
      }
    />
  );
};

export default Footer;
