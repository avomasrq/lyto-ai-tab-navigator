import { Button } from '@/components/ui/button';
import { ArrowRight, Chrome } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrowserMockup from './BrowserMockup';

const HeroSection = () => {
  return (
    <section className="min-h-[100svh] flex flex-col justify-center pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Minimal ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] glow-ambient" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-24">
          {/* Left side - Text content */}
          <div className="lg:flex-1 max-w-2xl">
            {/* Trust badge */}
            <div className="opacity-0 animate-in stagger-1">
              <div className="badge-primary mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                <span>Backed by Impact Consulting</span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-display font-serif opacity-0 animate-in stagger-2">
              Your browser,
              <br />
              <span className="text-gradient">now intelligent</span>
            </h1>

            {/* Description */}
            <div className="mt-8 opacity-0 animate-in stagger-3">
              <p className="text-body-lg max-w-lg">
                Lyto AI understands what you're doing and helps proactively&mdash;from 
                research and price comparison to tab management, all in real time.
              </p>
            </div>

            {/* CTA Row */}
            <div className="mt-10 flex flex-wrap items-center gap-4 opacity-0 animate-in stagger-4">
              <Button variant="primary" size="lg" className="group" asChild>
                <Link to="/coming-soon">
                  <Chrome className="w-4 h-4 mr-2" />
                  Add to Chrome&mdash;free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Watch demo
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-14 pt-8 border-t border-border opacity-0 animate-in stagger-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-background flex items-center justify-center text-xs font-medium text-primary/60"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">500+</span> early access users
                  <span className="mx-2 text-border">·</span>
                  Your data stays local
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Browser Mockup */}
          <div className="hidden lg:flex lg:flex-1 justify-center items-center opacity-0 animate-in stagger-3">
            <BrowserMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
