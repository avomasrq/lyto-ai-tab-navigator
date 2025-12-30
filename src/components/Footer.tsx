import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="text-2xl font-serif">
              Lyto<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground text-sm mt-4 max-w-xs leading-relaxed">
              AI-powered tab navigation for researchers, developers, and anyone drowning in browser tabs.
            </p>
            <a 
              href="#" 
              className="inline-flex items-center gap-1.5 text-sm text-primary mt-6 hover:underline"
            >
              Add to Chrome
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-medium mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Lyto AI
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
