import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Twitter } from 'lucide-react';
import { FooterRoot } from '@/components/ui/footer-section';

const FOOTER_SECTIONS = [
  {
    label: 'Product',
    links: [
      { title: 'Features',     href: '/#features' },
      { title: 'Pricing',      href: '/#pricing' },
      { title: 'Demo',         href: '/#showcase' },
      { title: 'Changelog',    href: 'https://chromewebstore.google.com/detail/nalekilafbipfallhlkbpidgfceoabcb', external: true },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'About',        href: '#' },
      { title: 'Contact',      href: 'mailto:info@trylyto.com' },
      { title: 'Book a Demo',  href: 'https://calendly.com/arylovessway/30min', external: true },
    ],
  },
  {
    label: 'Legal',
    links: [
      { title: 'Privacy Policy',    href: '/privacy' },
      { title: 'Terms of Service',  href: '/terms' },
      { title: 'Cookie Policy',     href: '#' },
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
              Lyto AI<span className="text-primary">.</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            A Chrome extension that gives you full control over your browser — automating tasks, connecting your tools, and keeping everything organized.
          </p>
          <a
            href="https://www.producthunt.com/products/lyto/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-lyto"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex items-center gap-2.5 rounded-xl border border-[#c8956c]/30 bg-gradient-to-r from-[#f5e6d8]/60 to-[#f9efe6]/60 px-4 py-2.5 transition-all duration-300 hover:border-[#c8956c]/60 hover:shadow-[0_4px_20px_rgba(200,149,108,0.2)] hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6 shrink-0 text-[#c8956c] transition-transform duration-300 group-hover:scale-110" viewBox="0 0 40 40" fill="none">
              <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="currentColor" fillOpacity="0.15"/>
              <path d="M20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36Z" fill="currentColor" fillOpacity="0.1"/>
              <path d="M22.5 20H17V13H22.5C24.433 13 26 14.567 26 16.5C26 18.433 24.433 20 22.5 20Z" fill="currentColor"/>
              <path d="M17 20H22.5C24.433 20 26 21.567 26 23.5C26 25.433 24.433 27 22.5 27H17V20Z" fill="currentColor" fillOpacity="0.5"/>
              <path d="M14 13H17V27H14V13Z" fill="currentColor" fillOpacity="0.7"/>
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#a07850] leading-none">
                Featured on
              </span>
              <span className="text-sm font-bold text-[#8b6238] leading-tight group-hover:text-[#6d4c2a] transition-colors duration-300">
                Product Hunt
              </span>
            </div>
            <svg className="w-3.5 h-3.5 text-[#c8956c]/50 group-hover:text-[#c8956c] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
      }
      bottom={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Lyto AI. All rights reserved.
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
