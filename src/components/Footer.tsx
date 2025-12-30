import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-border bg-card">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-serif">
                Lyto<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mt-6 max-w-xs leading-relaxed">
              AI-powered tab navigation for researchers, developers, and anyone drowning in browser tabs.
            </p>
          </div>

          {/* Links */}
          <div className="md:col-span-7 grid grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Product</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Resources</h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/privacy" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-border">
          <p className="text-muted-foreground/60 text-sm">
            © {new Date().getFullYear()} Lyto AI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-muted-foreground/60 hover:text-foreground transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground/60 hover:text-foreground transition-colors text-sm">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground/60 hover:text-foreground transition-colors text-sm">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;