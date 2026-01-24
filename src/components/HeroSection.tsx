import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="min-h-[85svh] flex flex-col justify-center pt-24 pb-16 px-6 relative">
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="opacity-0 animate-in stagger-1">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/50 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Chrome Extension
              </span>
            </div>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-[1.1] tracking-tight opacity-0 animate-in stagger-2 mb-6">
            Your browser,
            <br />
            <span className="text-gradient">but actually smart.</span>
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl mx-auto opacity-0 animate-in stagger-3 mb-10">
            Lyto AI is a browser-based AI that researches, navigates, analyzes, and acts for you &mdash; using real, verified web data.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 opacity-0 animate-in stagger-4">
            <Button variant="primary" size="lg" className="group text-base" asChild>
              <Link to="/coming-soon">
                Install the Chrome Extension
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Private by design <span className="mx-2">&middot;</span> Built for daily use
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
