import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight">
            Stop searching.
            <br />
            <span className="text-primary italic">Start finding.</span>
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
          
          <p className="text-xs text-muted-foreground mt-6">
            Free forever for basic use. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
