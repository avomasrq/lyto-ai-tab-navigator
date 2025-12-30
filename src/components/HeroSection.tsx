import { Button } from '@/components/ui/button';
import { ArrowRight, Chrome, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Top badge */}
        <div className="opacity-0 animate-in stagger-1">
          <div className="inline-flex items-center gap-2 bg-card/80 border border-border/50 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Lyto AI — Browser Intelligence
            </span>
          </div>
        </div>

        {/* Main headline - Editorial style */}
        <div className="max-w-5xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif leading-[1.05] tracking-tight opacity-0 animate-in stagger-2">
            Navigate your
            <br />
            <span className="text-gradient italic">open tabs</span> with
            <br />
            natural language
          </h1>
        </div>

        {/* Subtext */}
        <div className="mt-10 max-w-xl opacity-0 animate-in stagger-3">
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stop switching between dozens of tabs. Ask what you're looking for, 
            and find it instantly across everything you have open.
          </p>
        </div>

        {/* CTA Row */}
        <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-in stagger-4">
          <Button variant="primary" size="lg" className="group glow-primary-sm hover:glow-primary">
            <Chrome className="w-5 h-5" />
            Add to Chrome
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="subtle" size="lg">
            See how it works
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-16 opacity-0 animate-in stagger-5">
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-background flex items-center justify-center text-xs"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>2,400+ users</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-4 h-4 text-primary fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
