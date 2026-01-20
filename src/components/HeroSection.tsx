import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrowserMockup from './BrowserMockup';

const HeroSection = () => {
  return (
    <section className="min-h-[100svh] flex flex-col justify-center pt-20 md:pt-24 pb-12 md:pb-16 px-5 md:px-6 relative overflow-hidden">
      {/* Ambient glow - optimized for mobile */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[300px] md:h-[600px] bg-primary/15 md:bg-primary/10 rounded-full blur-[60px] md:blur-[150px] pointer-events-none" />
      <div className="hidden md:block absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid pattern - hidden on mobile for performance */}
      <div className="hidden md:block absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-20">
          {/* Left side - Text content */}
          <div className="lg:flex-1">
            {/* Eyebrow */}
            <div className="opacity-0 animate-in stagger-1">
              <div className="inline-flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-8 md:mb-12">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                <span className="text-[10px] md:text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Now available for Chrome
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div className="max-w-5xl lg:max-w-none">
              <h1 className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-serif leading-[1.05] tracking-tight opacity-0 animate-in stagger-2">
                Your browser,
                <br />
                <span className="text-gradient">now intelligent</span>
              </h1>
            </div>

            {/* Subtext with line */}
            <div className="mt-8 md:mt-14 flex items-start gap-4 md:gap-6 opacity-0 animate-in stagger-3">
              <div className="w-12 md:w-16 h-px bg-gradient-to-r from-primary/50 to-transparent mt-3 hidden sm:block" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
                Lyto AI understands what you're doing and proactively helps &mdash; from research 
                and price comparison to tab management, all in real time.
              </p>
            </div>

            {/* CTA Row */}
            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 opacity-0 animate-in stagger-4">
              <Button variant="primary" size="lg" className="group text-base w-full sm:w-auto justify-center" asChild>
                <Link to="/coming-soon">
                  Add to Chrome &mdash; it's free
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-muted-foreground hover:text-foreground text-base w-full sm:w-auto justify-center"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                See how it works
              </Button>
            </div>

            <div className="mt-10 md:mt-16 opacity-0 animate-in stagger-5">
              <div className="flex items-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground/60">
                <span>Works with Google Chrome</span>
                <span className="w-1 h-1 rounded-full bg-current" aria-hidden="true"></span>
                <span>Your data stays local</span>
              </div>
            </div>
          </div>

          {/* Right side - Browser Mockup (desktop only) */}
          <div className="hidden lg:flex lg:flex-1 justify-center items-center opacity-0 animate-in stagger-3">
            <BrowserMockup />
          </div>
        </div>
        
        {/* Mobile feature preview - only on small screens */}
        <div className="mt-12 lg:hidden opacity-0 animate-in stagger-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="relative p-4 rounded-2xl bg-card/60 border border-border backdrop-blur-sm text-center group hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground/80">Smart AI</span>
            </div>
            <div className="relative p-4 rounded-2xl bg-card/60 border border-border backdrop-blur-sm text-center group hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground/80">Always On</span>
            </div>
            <div className="relative p-4 rounded-2xl bg-card/60 border border-border backdrop-blur-sm text-center group hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground/80">Instant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;