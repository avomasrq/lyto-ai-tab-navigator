import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6">
      <div className="container mx-auto">
        {/* Top label */}
        <div className="opacity-0 animate-in stagger-1">
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
            Lyto AI — Browser Intelligence
          </span>
        </div>

        {/* Main headline - Editorial style */}
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif leading-[1.05] tracking-tight opacity-0 animate-in stagger-2">
            Navigate your
            <br />
            <span className="text-primary italic">open tabs</span> with
            <br />
            natural language
          </h1>
        </div>

        {/* Subtext */}
        <div className="mt-10 max-w-xl opacity-0 animate-in stagger-3">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stop switching between dozens of tabs. Ask what you're looking for, 
            and find it instantly across everything you have open.
          </p>
        </div>

        {/* CTA Row */}
        <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-in stagger-4">
          <Button variant="primary" size="lg" className="group">
            Add to Chrome
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="subtle" size="lg">
            See how it works
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
