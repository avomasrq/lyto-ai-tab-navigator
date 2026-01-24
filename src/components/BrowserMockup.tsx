import { Search, Sparkles, MessageSquare, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const BrowserMockup = () => {
  return (
    <div className="relative w-full max-w-[500px]">
      {/* Shadow */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-foreground/10 blur-2xl rounded-full" />
      
      {/* Browser window */}
      <motion.div 
        className="relative rounded-xl overflow-hidden border border-border bg-background shadow-2xl shadow-foreground/10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50">
            <Search className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground/50 font-mono">amazon.com/product/...</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Main page placeholder */}
          <div className="flex-1 p-4 space-y-3 min-h-[240px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-14 h-14 rounded bg-muted/50" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-2.5 bg-muted/50 rounded w-3/4" />
                  <div className="h-2 bg-muted/30 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Lyto sidebar */}
          <div className="w-44 border-l border-border bg-card p-3 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs font-medium">Lyto AI</span>
              <motion.div 
                className="w-1.5 h-1.5 rounded-full bg-green-500 ml-auto"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            {/* Suggestion */}
            <motion.div 
              className="bg-primary/5 border border-primary/10 rounded-lg p-2.5 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-[10px] text-foreground/80 leading-relaxed">
                Found <span className="text-primary font-medium">3 cheaper</span> alternatives
              </p>
              <div className="flex items-center gap-1 mt-2 text-primary text-[10px] font-medium">
                Compare <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </motion.div>
            
            {/* Actions */}
            <div className="space-y-1.5 mt-auto">
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-muted/30 text-[10px]">
                <MessageSquare className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Summarize</span>
              </button>
              <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-muted/30 text-[10px]">
                <Layers className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Compare</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BrowserMockup;
