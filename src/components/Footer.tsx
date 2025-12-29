const Footer = () => {
  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Resources: ['Documentation', 'Support', 'Blog', 'Community'],
    Company: ['About', 'Careers', 'Privacy', 'Terms'],
  };

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-xl font-serif">
              Lyto<span className="text-primary">.</span>
            </span>
            <p className="text-muted-foreground text-sm mt-4 max-w-xs leading-relaxed">
              Navigate your browser with natural language. Find anything across your open tabs instantly.
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Lyto. All rights reserved.
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
