import { Button } from '@/components/ui/button';
import { Chrome, ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        <div className="relative text-center">
          {/* Animated background blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 rounded-full blur-[120px] animate-morph" />
          </div>
          
          <div className="glass-card-elevated rounded-[40px] p-12 md:p-20 border border-border/50 relative overflow-hidden">
            {/* Decorative sparkles */}
            <Sparkles className="absolute top-8 left-8 w-6 h-6 text-primary/40 animate-float" />
            <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-accent/40 animate-float" style={{ animationDelay: '-3s' }} />
            <Sparkles className="absolute top-1/2 right-12 w-5 h-5 text-primary/30 animate-float" style={{ animationDelay: '-6s' }} />
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                Stop Wasting Time
                <br />
                <span className="gradient-text">Searching Your Tabs</span>
              </h2>
              
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                Join thousands of researchers, developers, and knowledge workers who save hours every week with Lyto AI.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" className="group">
                  <Chrome className="w-5 h-5" />
                  Install Lyto AI
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="heroOutline" size="xl">
                  Schedule Demo
                </Button>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-muted-foreground text-sm">
                {[
                  '✓ Free to start',
                  '✓ No credit card required',
                  '✓ Privacy-first',
                  '✓ Cancel anytime',
                ].map((badge) => (
                  <span key={badge} className="flex items-center gap-2">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
