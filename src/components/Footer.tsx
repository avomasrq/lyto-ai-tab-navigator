import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 sm:py-20 px-4 sm:px-6 border-t border-border bg-card dither-overlay-dense">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-5">
            <Link to="/" className="inline-block">
              <span className="text-xl sm:text-2xl font-serif">
                Lyto<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-[10px] sm:text-xs mt-4 sm:mt-6 max-w-xs leading-relaxed">
              AI-powered tab navigation for researchers, developers, and anyone drowning in browser tabs.
            </p>
          </div>

          {/* Links */}
          <div className="sm:col-span-2 md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-5">Product</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <a href="#features" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-5">Resources</h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="mailto:arystan909@yahoo.com" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 sm:mb-5">Legal</h4>
              <ul className="space-y-3 sm:space-y-4 flex sm:block gap-6 sm:gap-0">
                <li>
                  <Link to="/privacy" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-border">
          <p className="text-muted-foreground/60 text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Lyto AI. All rights reserved.
          </p>
          <div className="flex gap-6 sm:gap-8">
            <a href="https://linkedin.com/company/lyto-ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground transition-colors text-xs sm:text-sm">
              LinkedIn
            </a>
            <a href="https://www.instagram.com/lyto.ai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground transition-colors text-xs sm:text-sm">
              Instagram
            </a>
            <a href="https://x.com/lytoai31786" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-foreground transition-colors text-xs sm:text-sm">
              X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
