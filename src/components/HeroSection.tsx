import { Button } from '@/components/ui/button';
import { Chrome, Play, ArrowRight, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/15 rounded-full blur-[100px] animate-float-slow" style={{ animationDelay: '-6s' }} />
      
      <div className="container mx-auto text-center max-w-5xl relative z-10">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 glass-card px-5 py-2.5 rounded-full mb-8 opacity-0 animate-fade-up border border-primary/20"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="absolute w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            Powered by advanced AI
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </div>

        {/* Headline */}
        <h1 
          className="text-5xl sm:text-6xl lg:text-8xl font-extrabold leading-[1.05] mb-8 opacity-0 animate-fade-up tracking-tight"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="text-foreground">Your AI Navigator</span>
          <br />
          <span className="text-foreground">for </span>
          <span className="gradient-text">Browser Tabs</span>
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-up font-light"
          style={{ animationDelay: '0.3s' }}
        >
          Lyto understands your open tabs, finds information instantly, 
          and navigates you to exactly what you need.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Button variant="hero" size="xl" className="w-full sm:w-auto group">
            <Chrome className="w-5 h-5" />
            Install Chrome Extension
            <span className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity">— Free</span>
          </Button>
          <Button variant="heroOutline" size="xl" className="w-full sm:w-auto group">
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div 
          className="mt-20 flex flex-wrap items-center justify-center gap-12 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '1M+', label: 'Tabs Analyzed' },
            { value: '99%', label: 'Accuracy Rate' },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-4xl sm:text-5xl font-bold gradient-text group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-2 font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Browser Mockup */}
        <div 
          className="mt-20 relative opacity-0 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          {/* Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 blur-[80px] -z-10 scale-90" />
          
          <div className="glass-card-elevated rounded-3xl p-2 max-w-4xl mx-auto border border-border/50">
            {/* Browser Chrome */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2 bg-secondary/80 rounded-lg px-4 py-1.5 text-sm text-muted-foreground max-w-md w-full">
                  <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="opacity-60">lyto.ai/dashboard</span>
                </div>
              </div>
            </div>
            
            {/* Mock Content */}
            <div className="bg-gradient-to-b from-secondary/30 to-background/50 rounded-2xl p-8 min-h-[320px] flex items-center justify-center relative overflow-hidden">
              {/* Floating elements */}
              <div className="absolute top-8 left-8 glass-card rounded-xl p-3 animate-float opacity-80" style={{ animationDelay: '-2s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs">📄</span>
                  </div>
                  <div className="text-xs">
                    <div className="text-foreground/80 font-medium">React Docs</div>
                    <div className="text-muted-foreground">react.dev</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-16 right-12 glass-card rounded-xl p-3 animate-float opacity-80" style={{ animationDelay: '-4s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <span className="text-xs">📚</span>
                  </div>
                  <div className="text-xs">
                    <div className="text-foreground/80 font-medium">TypeScript</div>
                    <div className="text-muted-foreground">typescriptlang.org</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-12 left-16 glass-card rounded-xl p-3 animate-float opacity-80" style={{ animationDelay: '-6s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <span className="text-xs">🔧</span>
                  </div>
                  <div className="text-xs">
                    <div className="text-foreground/80 font-medium">API Docs</div>
                    <div className="text-muted-foreground">api.example.com</div>
                  </div>
                </div>
              </div>
              
              {/* Center content */}
              <div className="text-center z-10">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-orange-400 to-primary bg-[length:200%_200%] animate-gradient-shift flex items-center justify-center shadow-2xl">
                    <span className="text-4xl font-bold text-primary-foreground">L</span>
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-orange-400 blur-2xl opacity-50 animate-glow-pulse" />
                </div>
                <p className="text-muted-foreground font-medium max-w-xs">
                  "Where did I read about authentication with JWT?"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
