import { Button } from '@/components/ui/button';
import { ArrowRight, Chrome, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-32 px-6 border-t border-border relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Free forever for basic use</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif leading-tight">
            Stop searching.
            <br />
            <span className="text-gradient italic">Start finding.</span>
          </h2>
          
          <p className="text-muted-foreground text-lg md:text-xl mt-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of researchers and developers who navigate their browser with natural language.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="xl" className="group glow-primary">
              <Chrome className="w-5 h-5" />
              Get Lyto free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-8 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No credit card required • Works with Chrome, Edge, Brave
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
