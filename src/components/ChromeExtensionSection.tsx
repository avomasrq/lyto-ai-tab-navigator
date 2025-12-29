import { Button } from '@/components/ui/button';
import { Chrome, Sparkles, Shield, Cpu } from 'lucide-react';

const ChromeExtensionSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
                <Chrome className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Chrome Extension</span>
              </div>
              
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
                Works Right in
                <br />
                <span className="gradient-text">Your Browser</span>
              </h2>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Install Lyto as a Chrome extension and get instant access to AI-powered tab navigation. No separate app needed – it's always there when you need it.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: Sparkles, text: 'One-click installation' },
                  { icon: Shield, text: 'Privacy-first – data never leaves your browser' },
                  { icon: Cpu, text: 'Lightweight and fast' },
                ].map((benefit) => (
                  <div key={benefit.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="hero" size="lg">
                <Chrome className="w-5 h-5" />
                Add to Chrome – It's Free
              </Button>
            </div>
            
            {/* Visual */}
            <div className="relative">
              <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
                {/* Extension Popup Mock */}
                <div className="bg-card rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">L</span>
                    </div>
                    <div>
                      <div className="font-display font-semibold text-foreground">Lyto AI</div>
                      <div className="text-xs text-muted-foreground">12 tabs analyzed</div>
                    </div>
                  </div>
                  
                  {/* Search Input */}
                  <div className="bg-secondary rounded-lg p-3 mb-4">
                    <div className="text-sm text-muted-foreground">
                      Ask anything about your tabs...
                    </div>
                  </div>
                  
                  {/* Recent Queries */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Recent
                    </div>
                    {[
                      'Where is the API key documentation?',
                      'Find the React state example',
                    ].map((query, i) => (
                      <div key={i} className="text-sm text-foreground p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors">
                        {query}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-2xl blur-2xl animate-float" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChromeExtensionSection;
