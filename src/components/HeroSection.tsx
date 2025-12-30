import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 relative">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="container mx-auto relative z-10">
        {/* Top label */}
        <div className="opacity-0 animate-in stagger-1">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-primary" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Browser Extension
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-serif leading-[0.95] tracking-tight opacity-0 animate-in stagger-2">
            Navigate your
            <br />
            <span className="text-gradient italic">open tabs</span>
            <br />
            <span className="text-muted-foreground/60">with natural language</span>
          </h1>
        </div>

        {/* Subtext */}
        <div className="mt-12 max-w-md opacity-0 animate-in stagger-3">
          <p className="text-muted-foreground leading-relaxed">
            Stop switching between dozens of tabs. Ask what you're looking for, 
            and find it instantly.
          </p>
        </div>

        {/* CTA Row */}
        <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-in stagger-4">
          <Button variant="primary" size="lg" className="group">
            Add to Chrome
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-foreground">
            How it works
          </Button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
