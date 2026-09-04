import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import { FooterRoot } from '@/components/ui/footer-section';

const FOOTER_SECTIONS = [
  {
    label: 'Product',
    links: [
      { title: 'Use Cases',    href: '/#use-cases' },
      { title: 'Pricing',      href: '/#pricing' },
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
            <span className="text-xl font-geometric text-foreground">
              Argos<span className="text-primary">.</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            The AI that does your browser work for you, clicking, filling, and finishing tasks so you don't have to.
          </p>
        </div>
      }
      bottom={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Argos. All rights reserved.
          </span>
          <span className="text-muted-foreground/60 text-xs">
            Built to <span className="text-primary italic">save you hours</span> every week
          </span>
        </div>
      }
    />
  );
};

export default Footer;
