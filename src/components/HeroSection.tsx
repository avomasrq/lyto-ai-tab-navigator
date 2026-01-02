import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />
      
      <div className="container mx-auto relative z-10">
        {/* Eyebrow */}
        <div className="opacity-0 animate-in stagger-1">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-12">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Now available for Chrome
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif leading-[1] tracking-tight opacity-0 animate-in stagger-2">
            Your browser,
            <br />
            <span className="text-gradient">now intelligent</span>
          </h1>
        </div>

        {/* Subtext with line */}
        <div className="mt-14 flex items-start gap-6 opacity-0 animate-in stagger-3">
          <div className="w-16 h-px bg-gradient-to-r from-primary/50 to-transparent mt-3 hidden sm:block" />
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
            Lyto AI understands what you're doing and proactively helps — from research 
            and price comparison to tab management, all in real time.
          </p>
        </div>

        {/* CTA Row */}
        <div className="mt-12 flex flex-wrap items-center gap-4 opacity-0 animate-in stagger-4">
          <Button variant="primary" size="lg" className="group text-base">
            Add to Chrome — it's free
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="ghost" 
            size="lg" 
            className="text-muted-foreground hover:text-foreground text-base"
            onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See how it works
          </Button>
        </div>

        {/* Subtle trust indicators */}
        <div className="mt-16 opacity-0 animate-in stagger-5">
          <div className="flex items-center gap-8 text-sm text-muted-foreground/60">
            <span>Works with Chrome, Edge, Brave, Arc</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Your data stays local</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;