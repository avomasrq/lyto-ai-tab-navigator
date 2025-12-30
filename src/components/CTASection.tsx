import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-32 px-6 border-t border-border relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            Stop searching.
            <br />
            <span className="text-gradient italic">Start finding.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg mt-8 max-w-lg mx-auto leading-relaxed">
            Join researchers and developers who navigate their browser with natural language.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" className="group">
              Get Lyto free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            Free forever for basic use. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
