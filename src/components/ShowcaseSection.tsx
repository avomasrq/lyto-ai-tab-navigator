import { Search, ArrowUpRight } from 'lucide-react';

const ShowcaseSection = () => {
  return (
    <section className="py-32 px-6 border-t border-border bg-card/30">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mt-3">
              See it in action
            </h2>
          </div>
        </div>

        {/* Browser mockup */}
        <div className="relative">
          {/* Shadow/glow effect */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
          
          <div className="relative bg-background rounded-2xl border border-border overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-foreground/10 hover:bg-destructive/80 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10 hover:bg-yellow-500/80 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-foreground/10 hover:bg-green-500/80 transition-colors cursor-pointer" />
                </div>
                <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="px-3 py-1.5 bg-muted/50 rounded-md">Docs</div>
                  <div className="px-3 py-1.5 bg-muted/50 rounded-md">GitHub</div>
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-md border border-primary/20">API Ref</div>
                  <div className="px-3 py-1.5 bg-muted/50 rounded-md">+9</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 rounded-full px-3 py-1.5 text-xs text-muted-foreground w-48">
                <Search className="w-3 h-3" />
                <span>Ask Lyto...</span>
              </div>
            </div>
            
            {/* Content area */}
            <div className="p-8 md:p-16 min-h-[450px]">
              {/* Conversation */}
              <div className="max-w-2xl mx-auto space-y-8">
                {/* User query */}
                <div className="flex justify-end">
                  <div className="bg-foreground/5 border border-border rounded-2xl rounded-tr-sm px-5 py-3 max-w-sm">
                    <p className="text-sm">
                      Where did I read about OAuth authentication?
                    </p>
                  </div>
                </div>

                {/* Response */}
                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-4 max-w-md">
                    <p className="text-sm leading-relaxed">
                      Found in <span className="text-primary">API Reference</span> — 
                      the authentication section covers OAuth 2.0 with code examples.
                    </p>
                  </div>
                  
                  {/* Source cards */}
                  <div className="flex gap-3">
                    <div className="group flex-1 flex items-center gap-3 px-4 py-3 border border-border rounded-xl hover:border-primary/40 hover:bg-card transition-all cursor-pointer">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        API
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">Authentication</div>
                        <div className="text-xs text-muted-foreground">Section 4.2</div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    
                    <div className="group flex-1 flex items-center gap-3 px-4 py-3 border border-border rounded-xl hover:border-primary/40 hover:bg-card transition-all cursor-pointer opacity-60">
                      <div className="w-9 h-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center text-xs font-medium">
                        GH
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">OAuth Example</div>
                        <div className="text-xs text-muted-foreground">README.md</div>
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
