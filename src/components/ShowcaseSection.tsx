import { Search, ArrowRight } from 'lucide-react';

const ShowcaseSection = () => {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Browser mockup */}
        <div className="relative bg-card rounded-xl border border-border overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground max-w-xs w-full">
                <Search className="w-3 h-3" />
                <span>lyto.app</span>
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="p-6 md:p-12 min-h-[400px]">
            {/* Mock conversation */}
            <div className="max-w-2xl mx-auto space-y-6">
              {/* User query */}
              <div className="flex justify-end">
                <div className="bg-secondary rounded-2xl rounded-br-sm px-5 py-3 max-w-md">
                  <p className="text-sm text-foreground">
                    Where did I read about the authentication flow?
                  </p>
                </div>
              </div>

              {/* Response */}
              <div className="flex justify-start">
                <div className="space-y-4 max-w-lg">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-5 py-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      Found in your <span className="text-primary font-medium">API Documentation</span> tab. 
                      The authentication section describes the OAuth 2.0 flow with JWT tokens.
                    </p>
                  </div>
                  
                  {/* Source card */}
                  <div className="group flex items-center gap-4 px-4 py-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
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
                      <span className="text-xs text-muted-foreground">Tab 3</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
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
