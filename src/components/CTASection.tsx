import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-24 md:py-40 px-5 md:px-6 border-t border-border relative overflow-hidden">
      {/* Ambient glow - reduced on mobile */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[800px] h-[300px] md:h-[600px] bg-primary/15 md:bg-primary/10 rounded-full blur-[60px] md:blur-[150px] pointer-events-none" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(hsl(var(--foreground)) 1.5px, transparent 1.5px)`,
        backgroundSize: '32px 32px'
      }} />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-[0.95]">
            Work faster.
            <br />
            <span className="text-gradient italic">Think less.</span>
          </h2>
          
          <p className="text-muted-foreground text-base md:text-xl mt-8 md:mt-12 max-w-md mx-auto leading-relaxed">
            Let Lyto handle the busywork while you focus on what matters.
          </p>
          
          <div className="mt-8 md:mt-12">
            <Button variant="primary" size="xl" className="group text-sm md:text-base shadow-2xl shadow-primary/20 w-full sm:w-auto" asChild>
              <Link to="/coming-soon">
                Get Lyto for Chrome
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <p className="text-xs md:text-sm text-muted-foreground/60 mt-6 md:mt-8">
            Free forever <span className="mx-1" aria-hidden="true">&middot;</span> Works with all Chromium browsers
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;