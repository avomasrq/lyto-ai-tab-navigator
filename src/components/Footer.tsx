import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="section-large px-6 relative">
        {/* Gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-orb glow-orb-primary animate-pulse-glow" />
        
        <motion.div 
          className="container mx-auto relative text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-hero font-serif mb-8">
            Ready to browse
            <br />
            <span className="text-gradient-vivid">smarter?</span>
          </h2>
          <Link to="/coming-soon" className="pill-button-primary pill-button inline-flex group">
            Get Lyto Free
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Main footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-12 gap-12">
            {/* Brand */}
            <div className="md:col-span-5">
              <Link to="/" className="inline-block">
                <span className="text-4xl font-serif">
                  Lyto<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-muted-foreground mt-4 max-w-xs leading-relaxed">
                AI-powered browser intelligence for people who value their time. 
                Think less, browse more.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-7 grid grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-medium mb-4">Product</h4>
                <ul className="space-y-3">
                  {['Features', 'Pricing', 'How it works', 'Changelog'].map((link) => (
                    <li key={link}>
                      <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-4">Company</h4>
                <ul className="space-y-3">
                  {['About', 'Blog', 'Careers'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-4">Legal</h4>
                <ul className="space-y-3">
                  <li>
                    <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border">
          <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Lyto AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors link-underline">
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
