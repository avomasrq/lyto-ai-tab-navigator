import { Search, Star, MoreHorizontal, Sparkles, MessageSquare, Layers, Settings, Eye, Zap, MousePointer } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 px-6 border-t border-border relative">
      {/* Ambient accent */}
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/3 rounded-full blur-[80px] md:blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 leading-[1.1]">
            Always on,
            <br />
            <span className="italic text-gradient">always ready</span>
          </h2>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed max-w-lg mx-auto">
            Lyto operates directly inside Chrome, turning your browser into an intelligent assistant.
          </p>
        </div>

        {/* Browser Mockup Visualization */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-2xl blur-3xl scale-105" />
            
            {/* Browser window */}
            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                {/* Traffic lights */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                
                {/* URL bar */}
                <div className="flex-1 flex items-center gap-2 mx-4">
                  <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-md border border-border/50">
                    <Search className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">shop.example.com/products/wireless-headphones</span>
                  </div>
                  <Star className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </div>
              </div>
              
              {/* Browser content area */}
              <div className="flex min-h-[350px] md:min-h-[400px]">
                {/* Main content (webpage placeholder) */}
                <div className="flex-1 p-6 bg-background/30 relative">
                  {/* Webpage content skeleton */}
                  <div className="space-y-4">
                    <div className="h-32 bg-muted/30 rounded-lg" />
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-muted/30 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 bg-muted/40 rounded w-3/4" />
                        <div className="h-4 bg-muted/30 rounded w-1/2" />
                        <div className="h-6 bg-primary/20 rounded w-28" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/20 rounded w-full" />
                      <div className="h-3 bg-muted/20 rounded w-5/6" />
                      <div className="h-3 bg-muted/20 rounded w-4/6" />
                    </div>
                  </div>
                  
                  {/* Floating annotation - Always Watching */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-card/90 border border-border rounded-lg shadow-lg">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Always watching your screen</span>
                  </div>
                </div>
                
                {/* Lyto AI Sidebar */}
                <div className="w-[180px] sm:w-[220px] md:w-[260px] border-l border-border bg-card/90 backdrop-blur-sm flex flex-col">
                  {/* Sidebar header */}
                  <div className="px-3 py-3 border-b border-border/50 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Lyto AI</span>
                  </div>
                  
                  {/* Sidebar content */}
                  <div className="flex-1 p-3 space-y-4 overflow-hidden">
                    {/* AI suggestion card with annotation */}
                    <div className="relative">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 shadow-sm">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-foreground leading-tight">
                              Found 3 better prices
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              Save up to $45 on similar items
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Annotation */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card/90 border border-primary/30 rounded-lg shadow-lg whitespace-nowrap">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">Proactive suggestions</span>
                        </div>
                        <div className="w-4 h-px bg-primary/50" />
                      </div>
                    </div>
                    
                    {/* Quick actions */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-foreground">Summarize reviews</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-foreground">Compare products</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* One-click action button */}
                    <div className="relative">
                      <button className="w-full py-2.5 px-3 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-2 shadow-md">
                        <MousePointer className="w-3.5 h-3.5" />
                        Apply best price
                      </button>
                      {/* Annotation */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card/90 border border-primary/30 rounded-lg shadow-lg whitespace-nowrap">
                          <MousePointer className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">One-click action</span>
                        </div>
                        <div className="w-4 h-px bg-primary/50" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Sidebar footer */}
                  <div className="px-3 py-2 border-t border-border/50 flex items-center justify-between">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] text-muted-foreground">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile annotations (shown below on smaller screens) */}
          <div className="lg:hidden mt-8 grid sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <Eye className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Always watching</p>
                <p className="text-xs text-muted-foreground">Understands your screen</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Proactive help</p>
                <p className="text-xs text-muted-foreground">Suggestions in real-time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <MousePointer className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">One-click action</p>
                <p className="text-xs text-muted-foreground">Apply instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;