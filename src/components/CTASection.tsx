import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-40 px-6 border-t border-border relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '24px 24px'
      }} />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95]">
            Stop hunting.
            <br />
            <span className="text-gradient italic">Start finding.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mt-10 max-w-md mx-auto leading-relaxed">
            Navigate your browser the way you think — with natural language.
          </p>
          
          <div className="mt-10">
            <Button variant="primary" size="xl" className="group">
              Get Lyto for Chrome
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Free forever · Works with Chrome, Edge, Brave, Arc
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
