const ShowcaseSection = () => {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Browser mockup */}
        <div className="relative bg-card rounded-lg border border-border overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-muted rounded px-4 py-1 text-xs text-muted-foreground max-w-xs w-full text-center">
                lyto.app
              </div>
            </div>
          </div>
          
          {/* Content area */}
          <div className="p-8 md:p-12 min-h-[400px] relative">
            {/* Tab indicators */}
            <div className="absolute top-6 right-6 flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-primary' : 'bg-muted'}`} 
                />
              ))}
            </div>

            {/* Mock conversation */}
            <div className="max-w-2xl mx-auto space-y-8">
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
                <div className="space-y-3 max-w-lg">
                  <div className="bg-muted/50 rounded-2xl rounded-bl-sm px-5 py-4">
                    <p className="text-sm text-foreground leading-relaxed">
                      Found in your <span className="text-primary font-medium">API Documentation</span> tab. 
                      The authentication section describes the OAuth 2.0 flow with JWT tokens.
                    </p>
                  </div>
                  
                  {/* Source card */}
                  <div className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs">
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
                    <span className="text-xs text-muted-foreground">Tab 3</span>
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
