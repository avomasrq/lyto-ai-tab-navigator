import { Search, ArrowRight } from 'lucide-react';

const ShowcaseSection = () => {
  return (
    <section className="py-24 px-6 border-t border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Browser mockup */}
        <div className="relative bg-card rounded-2xl border border-border overflow-hidden glow-primary-sm animate-glow">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/70 hover:bg-destructive transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-1.5 text-xs text-muted-foreground max-w-xs w-full">
                <Search className="w-3 h-3" />
                <span>lyto.app</span>
              </div>
            </div>
            {/* Tab count */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              <span className="text-primary font-medium">12</span> tabs open
            </div>
          </div>
          
          {/* Content area */}
          <div className="p-6 md:p-12 min-h-[420px] relative bg-gradient-to-b from-card to-background">
            {/* Tab indicators */}
            <div className="absolute top-6 right-6 flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === 3 ? 'bg-primary scale-125 animate-pulse-slow' : 'bg-muted hover:bg-muted-foreground/50'
                  }`} 
                />
              ))}
            </div>

            {/* Mock conversation */}
            <div className="max-w-2xl mx-auto space-y-6">
              {/* User query */}
              <div className="flex justify-end opacity-0 animate-in stagger-1">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-br-sm px-5 py-3 max-w-md backdrop-blur-sm">
                  <p className="text-sm text-foreground">
                    Where did I read about the authentication flow?
                  </p>
                </div>
              </div>

              {/* Response */}
              <div className="flex justify-start opacity-0 animate-in stagger-2">
                <div className="space-y-4 max-w-lg">
                  <div className="glass rounded-2xl rounded-bl-sm px-5 py-4 border border-border/50">
                    <p className="text-sm text-foreground leading-relaxed">
                      Found in your <span className="text-primary font-medium">API Documentation</span> tab. 
                      The authentication section describes the OAuth 2.0 flow with JWT tokens.
                    </p>
                  </div>
                  
                  {/* Source card */}
                  <div className="group flex items-center gap-4 px-4 py-3 border border-border/50 rounded-xl hover:border-primary/50 hover:bg-card transition-all duration-300 cursor-pointer shimmer">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        API Docs - Authentication
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        docs.example.com/auth
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Tab 3</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorative elements */}
            <div className="absolute bottom-6 left-6 hidden md:flex gap-2">
              {['React', 'API', 'Docs'].map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
