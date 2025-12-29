import { Button } from '@/components/ui/button';
import { Chrome, Sparkles, Shield, Cpu, Download, Check } from 'lucide-react';

const ChromeExtensionSection = () => {
  const benefits = [
    { icon: Sparkles, text: 'One-click installation', color: 'text-primary' },
    { icon: Shield, text: 'Privacy-first — data stays in your browser', color: 'text-emerald-400' },
    { icon: Cpu, text: 'Lightweight and blazing fast', color: 'text-blue-400' },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="relative">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20 rounded-[40px] blur-[100px] -z-10" />
          
          <div className="glass-card-elevated rounded-[32px] p-10 md:p-16 relative overflow-hidden border border-border/50">
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }} />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 border border-primary/20">
                  <Chrome className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold gradient-text">Chrome Extension</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.1]">
                  Works Right in
                  <br />
                  <span className="gradient-text">Your Browser</span>
                </h2>
                
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-light">
                  Install Lyto as a Chrome extension and get instant access to AI-powered tab navigation. No separate app needed.
                </p>
                
                {/* Benefits */}
                <div className="space-y-4 mb-10">
                  {benefits.map((benefit) => (
                    <div key={benefit.text} className="flex items-center gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-secondary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <span className="text-foreground font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="xl" className="group">
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    Add to Chrome — Free
                  </Button>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              
              {/* Visual */}
              <div className="relative">
                {/* Extension popup mockup */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-3xl blur-2xl" />
                  
                  <div className="glass-card rounded-2xl p-1 relative">
                    <div className="bg-card rounded-xl p-5 shadow-2xl">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center shadow-lg">
                          <Sparkles className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground text-lg">Lyto AI</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            12 tabs analyzed
                          </div>
                        </div>
                      </div>
                      
                      {/* Search Input */}
                      <div className="bg-secondary/80 rounded-xl p-4 mb-5 border border-border/50">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Search className="w-4 h-4" />
                          Ask anything about your tabs...
                        </div>
                      </div>
                      
                      {/* Recent Queries */}
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
                          Recent
                        </div>
                        {[
                          'Where is the API key documentation?',
                          'Find the React state example',
                          'JWT authentication flow',
                        ].map((query, i) => (
                          <div 
                            key={i} 
                            className="text-sm text-foreground p-3 rounded-lg bg-secondary/50 hover:bg-secondary cursor-pointer transition-colors flex items-center gap-3"
                          >
                            <span className="text-muted-foreground">→</span>
                            {query}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Orbiting elements */}
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="absolute animate-orbit opacity-60">
                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
                      📄
                    </div>
                  </div>
                  <div className="absolute animate-orbit opacity-60" style={{ animationDelay: '-8s' }}>
                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
                      🔗
                    </div>
                  </div>
                  <div className="absolute animate-orbit opacity-60" style={{ animationDelay: '-16s' }}>
                    <div className="w-8 h-8 rounded-lg glass-card flex items-center justify-center">
                      💡
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

// Add missing import
const Search = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

export default ChromeExtensionSection;
