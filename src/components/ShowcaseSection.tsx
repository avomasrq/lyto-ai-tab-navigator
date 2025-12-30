import { Search, ArrowUpRight, Command } from 'lucide-react';

const ShowcaseSection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Experience
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4">
            See it in <span className="italic">action</span>
          </h2>
        </div>

        {/* Browser mockup */}
        <div className="relative max-w-5xl mx-auto">
          {/* Glow effects */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-[2rem] blur-3xl animate-pulse-soft" />
          <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
          
          <div className="relative bg-background rounded-2xl border border-border overflow-hidden glow-box">
            {/* Browser chrome */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-8">
                {/* Window controls */}
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted hover:bg-destructive transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-muted hover:bg-yellow-500 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-muted hover:bg-green-500 transition-colors cursor-pointer" />
                </div>
                
                {/* Tabs */}
                <div className="hidden md:flex items-center gap-1">
                  <div className="px-4 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                    Docs
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                    GitHub
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-primary/15 text-xs text-primary border border-primary/20 cursor-pointer">
                    API Reference
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-muted/50 text-xs text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
                    +12 more
                  </div>
                </div>
              </div>
              
              {/* Search trigger */}
              <div className="flex items-center gap-2 bg-muted/50 hover:bg-muted rounded-lg px-4 py-2 text-xs text-muted-foreground cursor-pointer transition-colors border border-transparent hover:border-border">
                <Command className="w-3 h-3" />
                <span className="hidden sm:inline">Ask Lyto...</span>
                <kbd className="hidden sm:inline ml-2 px-1.5 py-0.5 rounded bg-background text-[10px] border border-border">⌘K</kbd>
              </div>
            </div>
            
            {/* Content area */}
            <div className="p-8 md:p-12 lg:p-16 min-h-[500px] relative">
              {/* Subtle grid */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }} />
              
              {/* Conversation */}
              <div className="max-w-2xl mx-auto space-y-8 relative">
                {/* User query */}
                <div className="flex justify-end animate-float" style={{ animationDelay: '0s' }}>
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-md px-6 py-4 max-w-sm">
                    <p className="text-sm font-medium">
                      Where did I read about OAuth authentication?
                    </p>
                  </div>
                </div>

                {/* Response */}
                <div className="space-y-5">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-md px-6 py-5 max-w-lg shadow-lg shadow-black/10">
                    <p className="text-sm leading-relaxed">
                      Found in <span className="text-primary font-medium">API Reference</span> — 
                      the authentication section covers OAuth 2.0 implementation with code examples and best practices.
                    </p>
                  </div>
                  
                  {/* Source cards */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="group flex-1 flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer glow-box-hover">
                      <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center text-xs font-bold border border-primary/20">
                        API
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">Authentication</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Section 4.2 · OAuth 2.0</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    
                    <div className="group flex-1 flex items-center gap-4 px-5 py-4 bg-card/50 border border-border rounded-xl hover:border-border hover:bg-card/80 transition-all cursor-pointer opacity-70">
                      <div className="w-10 h-10 rounded-lg bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold">
                        GH
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">OAuth Example</div>
                        <div className="text-xs text-muted-foreground mt-0.5">examples/auth.ts</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;