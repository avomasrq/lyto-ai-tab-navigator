import { Search, Sparkles, MessageSquare, Layers, ArrowRight } from 'lucide-react';

const BrowserMockup = () => {
  return (
    <div className="relative w-full max-w-[520px] animate-float">
      {/* Outer glow */}
      <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      
      {/* Browser window */}
      <div className="relative surface-elevated rounded-xl overflow-hidden shadow-2xl shadow-foreground/10">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
          </div>
          
          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
            <Search className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground/70 font-mono">amazon.com/products/...</span>
          </div>
        </div>

        {/* Browser content - simplified page */}
        <div className="relative flex">
          {/* Main page content (blurred placeholder) */}
          <div className="flex-1 p-5 bg-background/50 min-h-[280px]">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted/60 rounded w-3/4" />
                  <div className="h-2.5 bg-muted/40 rounded w-1/2" />
                  <div className="h-2.5 bg-muted/40 rounded w-2/3" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted/60 rounded w-2/3" />
                  <div className="h-2.5 bg-muted/40 rounded w-1/2" />
                  <div className="h-2.5 bg-muted/40 rounded w-3/4" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted/60 rounded w-1/2" />
                  <div className="h-2.5 bg-muted/40 rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Lyto AI Sidebar */}
          <div className="w-52 border-l border-border bg-card p-4 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium">Lyto AI</span>
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            
            {/* AI suggestion */}
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-4">
              <p className="text-xs text-foreground/80 leading-relaxed">
                I found <span className="font-medium text-primary">3 similar items</span> at 
                lower prices on other sites.
              </p>
              <button className="mt-2.5 text-xs font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
                Compare prices
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            {/* Quick actions */}
            <div className="space-y-2 mt-auto">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs transition-colors text-left">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Summarize reviews</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-xs transition-colors text-left">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Open alternatives</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserMockup;
