import { Search, Star, MoreHorizontal, Sparkles, Layers, Settings, Brain, MousePointer, Zap, Globe } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      {/* Ambient glow */}
      <div className="hidden md:block absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 leading-[1.1]">
            Built to
            <br />
            <span className="italic text-gradient">take action</span>
          </h2>
          <p className="text-muted-foreground mt-8 text-lg leading-relaxed max-w-lg mx-auto">
            A browser agent that doesn't just suggest &mdash; it does.
          </p>
        </div>

        {/* Browser Mockup with Feature Annotations */}
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
                
                {/* Tabs */}
                <div className="flex-1 flex items-center gap-1 mx-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 rounded-t-md border border-border/50 border-b-0">
                    <div className="w-3 h-3 rounded bg-blue-500/50" />
                    <span className="text-[10px] text-foreground truncate max-w-[80px]">Research</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-t-md">
                    <div className="w-3 h-3 rounded bg-green-500/50" />
                    <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">Compare</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-t-md">
                    <div className="w-3 h-3 rounded bg-purple-500/50" />
                    <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">Results</span>
                  </div>
                </div>
                
                <Star className="w-4 h-4 text-muted-foreground hidden sm:block" />
                <MoreHorizontal className="w-4 h-4 text-muted-foreground hidden sm:block" />
              </div>
              
              {/* URL bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border-b border-border/50">
                <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-background/50 rounded-md border border-border/50">
                  <Search className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">docs.example.com/getting-started</span>
                </div>
              </div>
              
              {/* Browser content area */}
              <div className="flex min-h-[380px] md:min-h-[420px]">
                {/* Main content (webpage placeholder) */}
                <div className="flex-1 p-6 bg-background/30 relative">
                  {/* Webpage content skeleton */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-muted/40 rounded w-2/3" />
                        <div className="h-4 bg-muted/30 rounded w-full" />
                        <div className="h-4 bg-muted/30 rounded w-5/6" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-24 bg-muted/20 rounded-lg" />
                      <div className="h-24 bg-muted/20 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted/20 rounded w-full" />
                      <div className="h-3 bg-muted/20 rounded w-4/5" />
                      <div className="h-3 bg-muted/20 rounded w-3/5" />
                    </div>
                  </div>
                  
                  {/* Floating annotation - Smart Tab Control */}
                  <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-2 bg-card/90 border border-border rounded-lg shadow-lg">
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">Smart tab control</span>
                  </div>
                </div>
                
                {/* Lyto AI Sidebar */}
                <div className="w-[180px] sm:w-[220px] md:w-[280px] border-l border-border bg-card/90 backdrop-blur-sm flex flex-col">
                  {/* Sidebar header */}
                  <div className="px-3 py-3 border-b border-border/50 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Lyto AI</span>
                  </div>
                  
                  {/* Sidebar content */}
                  <div className="flex-1 p-3 space-y-4 overflow-hidden">
                    {/* Proactive Assistance */}
                    <div className="relative">
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-foreground leading-tight">
                              I noticed you're researching...
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              Want me to find related sources and compare options?
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Annotation */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card/90 border border-primary/30 rounded-lg shadow-lg whitespace-nowrap">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">Proactive assistance</span>
                        </div>
                        <div className="w-4 h-px bg-primary/50" />
                      </div>
                    </div>
                    
                    {/* Research & Compare */}
                    <div className="relative">
                      <div className="space-y-2">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Research Results</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                            <Globe className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs text-foreground truncate">Source 1: docs.dev</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/30">
                            <Globe className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-foreground truncate">Source 2: guide.io</span>
                          </div>
                        </div>
                      </div>
                      {/* Annotation */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card/90 border border-primary/30 rounded-lg shadow-lg whitespace-nowrap">
                          <Globe className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">Research & compare</span>
                        </div>
                        <div className="w-4 h-px bg-primary/50" />
                      </div>
                    </div>
                    
                    {/* Task Automation */}
                    <div className="relative">
                      <div className="space-y-2">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Automation</p>
                        <button className="w-full py-2.5 px-3 bg-primary text-primary-foreground rounded-lg text-xs font-medium flex items-center justify-center gap-2 shadow-md">
                          <Zap className="w-3.5 h-3.5" />
                          Run workflow
                        </button>
                      </div>
                      {/* Annotation */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-card/90 border border-primary/30 rounded-lg shadow-lg whitespace-nowrap">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium">Task automation</span>
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
          <div className="lg:hidden mt-8 grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <Brain className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Proactive assistance</p>
                <p className="text-xs text-muted-foreground">Helps before you ask</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <Layers className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Smart tab control</p>
                <p className="text-xs text-muted-foreground">Manages tabs for you</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <Globe className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Research & compare</p>
                <p className="text-xs text-muted-foreground">Finds and compares sources</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-medium">Task automation</p>
                <p className="text-xs text-muted-foreground">Automates workflows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;