import { Search, Star, MoreHorizontal, Sparkles, MessageSquare, Layers, Settings } from 'lucide-react';

const BrowserMockup = () => {
  return (
    <div className="relative w-full max-w-[600px] aspect-[4/3]">
      {/* Glow effect behind */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-2xl blur-2xl scale-110" />
      
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
            <Star className="w-4 h-4 text-muted-foreground" />
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        
        {/* Browser content area */}
        <div className="flex h-[280px]">
          {/* Main content (blurred/placeholder) */}
          <div className="flex-1 p-4 bg-background/30">
            <div className="space-y-3">
              <div className="h-24 bg-muted/30 rounded-lg animate-pulse" />
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-muted/30 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/40 rounded w-3/4" />
                  <div className="h-3 bg-muted/30 rounded w-1/2" />
                  <div className="h-5 bg-primary/20 rounded w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted/20 rounded w-full" />
                <div className="h-3 bg-muted/20 rounded w-5/6" />
                <div className="h-3 bg-muted/20 rounded w-4/6" />
              </div>
            </div>
          </div>
          
          {/* Lyto AI Sidebar */}
          <div className="w-[200px] border-l border-border bg-card/90 backdrop-blur-sm flex flex-col">
            {/* Sidebar header */}
            <div className="px-3 py-3 border-b border-border/50 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-xs font-semibold text-foreground">Lyto AI</span>
            </div>
            
            {/* Sidebar content */}
            <div className="flex-1 p-3 space-y-3 overflow-hidden">
              {/* AI suggestion card */}
              <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-medium text-foreground leading-tight">
                      Found 3 better prices
                    </p>
                    <p className="text-[9px] text-muted-foreground leading-tight">
                      Save up to $45 on similar items
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Quick actions */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <MessageSquare className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-foreground">Summarize reviews</span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <Layers className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-foreground">Compare products</span>
                  </div>
                </div>
              </div>
              
              {/* Chat preview */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wide">Chat</p>
                <div className="p-2 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    "Is this product worth buying compared to..."
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sidebar footer */}
            <div className="px-3 py-2 border-t border-border/50 flex items-center justify-between">
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[9px] text-muted-foreground">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserMockup;
