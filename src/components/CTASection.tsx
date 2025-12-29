import { Button } from '@/components/ui/button';
import { Chrome, ArrowRight } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="relative text-center">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-orange-400/20 to-primary/20 blur-3xl -z-10 rounded-full scale-150" />
          
          <div className="glass-card rounded-3xl p-12 md:p-16">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Stop Wasting Time
              <br />
              <span className="gradient-text">Searching Your Tabs</span>
            </h2>
            
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join thousands of researchers, developers, and knowledge workers who save hours every week with Lyto AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl">
                <Chrome className="w-5 h-5" />
                Install Lyto AI
              </Button>
              <Button variant="heroOutline" size="xl">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-sm">
              <span>✓ Free to start</span>
              <span>✓ No credit card required</span>
              <span>✓ Privacy-first</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
