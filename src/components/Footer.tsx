import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const links = {
    product: ['Features', 'Pricing', 'How it works', 'Changelog'],
    company: ['About', 'Blog', 'Careers'],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  return (
    <footer ref={ref} className="border-t border-border bg-card/30">
      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-headline font-serif mb-6">
            Ready to make your
            <br />
            browser <span className="text-gradient">smarter</span>?
          </h2>
          <Button variant="primary" size="xl" className="group" asChild>
            <Link to="/coming-soon">
              Get started free
              <ArrowUpRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Main footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <Link to="/" className="inline-block">
                <span className="text-3xl font-serif">
                  Lyto<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-muted-foreground text-sm mt-4 max-w-xs leading-relaxed">
                AI-powered browser intelligence for people who value their time.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-8 grid grid-cols-3 gap-8">
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase mb-4">Product</h4>
                <ul className="space-y-3">
                  {links.product.map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase mb-4">Company</h4>
                <ul className="space-y-3">
                  {links.company.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.3em] text-muted-foreground/50 uppercase mb-4">Legal</h4>
                <ul className="space-y-3">
                  {links.legal.map((link) => (
                    <li key={link.label}>
                      <Link to={link.href} className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground/50">
              © {new Date().getFullYear()} Lyto AI
            </p>
            <div className="flex gap-8">
              {['LinkedIn', 'X', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
