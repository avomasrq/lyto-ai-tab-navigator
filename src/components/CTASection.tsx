import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-40 px-6 border-t border-border relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(hsl(var(--foreground)) 1.5px, transparent 1.5px)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-[0.95]">
            Stop hunting.
            <br />
            <span className="text-gradient italic">Start finding.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl mt-12 max-w-md mx-auto leading-relaxed">
            Navigate your browser the way you think — with natural language.
          </p>
          
          <div className="mt-12">
            <Button variant="primary" size="xl" className="group text-base shadow-2xl shadow-primary/20">
              Get Lyto for Chrome
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground/60 mt-8">
            Free forever · Works with all Chromium browsers
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;