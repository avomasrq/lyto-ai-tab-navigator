import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="min-h-[90svh] flex flex-col justify-center items-center pt-24 pb-16 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-[1.1] tracking-tight opacity-0 animate-in stagger-1">
            Your browser, but actually smart.
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl opacity-0 animate-in stagger-2">
            Lyto AI is a browser-based AI that researches, navigates, analyzes, and acts for you &mdash; using real, verified web data.
          </p>

          {/* CTA Button */}
          <div className="mt-10 opacity-0 animate-in stagger-3">
            <Button variant="default" size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-lg px-6" asChild>
              <Link to="/coming-soon">
                Install the Chrome Extension
              </Link>
            </Button>
          </div>

          {/* Tagline */}
          <div className="mt-24 opacity-0 animate-in stagger-4">
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
              Private by design <span className="text-muted-foreground">&bull;</span> Built for daily use
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
