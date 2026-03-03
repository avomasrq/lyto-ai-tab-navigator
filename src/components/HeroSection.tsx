import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrowserMockup from './BrowserMockup';
import { Suspense, lazy, useState } from 'react';

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
);

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Dithering shader background */}
      <div className="absolute inset-0 z-0 translate-x-[10%] md:translate-x-[25%] scale-125 md:scale-150">
        <Suspense fallback={<div className="w-full h-full bg-background" />}>
          <Dithering
            width={1920}
            height={1080}
            colorBack="#ffffff"
            colorFront="#f97316"
            shape="sphere"
            type="4x4"
            size={2}
            speed={0.6}
            scale={0.5}
          />
        </Suspense>
      </div>

      {/* Light overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/30 via-transparent to-white/40 pointer-events-none" />

      {/* Grid pattern */}
      <div className="hidden md:block absolute inset-0 z-[2] opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '80px 80px'
      }} />

      <div
        className="container mx-auto relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-20">
          {/* Left side - Text content */}
          <div className="lg:flex-1">
            {/* Eyebrow */}
            <div className="opacity-0 animate-in stagger-1">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-card/50 mb-12">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  v1.0.0 Beta
                </span>
              </div>
            </div>

            {/* Main headline */}
            <div className="max-w-5xl lg:max-w-none">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl font-serif leading-[1] tracking-tight opacity-0 animate-in stagger-2 text-foreground">
                Your browser,
                <br />
                <span className="text-gradient">now intelligent</span>
              </h1>
            </div>

            {/* Subtext with line */}
            <div className="mt-14 flex items-start gap-6 opacity-0 animate-in stagger-3">
              <div className="w-16 h-px bg-gradient-to-r from-primary/60 to-transparent mt-3 hidden sm:block" />
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Lyto AI understands what you're doing and proactively helps &mdash; from research
                and price comparison to tab management, all in real time.
              </p>
            </div>

            {/* CTA Row */}
            <div className="mt-12 flex flex-wrap items-center gap-4 opacity-0 animate-in stagger-4">
              <Button variant="primary" size="lg" className="group text-base" asChild>
                <Link to="/coming-soon">
                  Add to Chrome &mdash; it's free
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
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

            <div className="mt-16 opacity-0 animate-in stagger-5">
              <div className="flex items-center gap-8 text-sm text-muted-foreground/60">
                <span>Works with Google Chrome</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-current" aria-hidden="true"></span>
                <span className="hidden sm:inline">Your data stays local</span>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
