import { Button } from '@/components/ui/button';
import { Chrome, Play } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
      <div className="container mx-auto text-center max-w-5xl">
        {/* Badge */}
        <div 
          className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
          <span className="text-sm text-muted-foreground">
            Now available for Chrome
          </span>
        </div>

        {/* Headline */}
        <h1 
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Your AI Navigator for
          <br />
          <span className="gradient-text">Browser Tabs</span>
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          Lyto understands your open tabs, finds information instantly, and navigates you to exactly what you need.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <Button variant="hero" size="xl" className="w-full sm:w-auto">
            <Chrome className="w-5 h-5" />
            Install Chrome Extension
          </Button>
          <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div 
          className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto opacity-0 animate-fade-up"
          style={{ animationDelay: '0.5s' }}
        >
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '1M+', label: 'Tabs Analyzed' },
            { value: '99%', label: 'Accuracy' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Browser Mockup */}
        <div 
          className="mt-16 relative opacity-0 animate-fade-up"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="glass-card rounded-2xl p-4 max-w-4xl mx-auto glow-orange-subtle">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 bg-secondary rounded-lg px-4 py-2 text-sm text-muted-foreground">
                chrome://extensions
              </div>
            </div>
            
            {/* Mock Content */}
            <div className="bg-secondary/50 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center mx-auto mb-4 animate-float">
                  <span className="text-3xl font-bold text-primary-foreground">L</span>
                </div>
                <p className="text-muted-foreground">
                  Ask Lyto: "Where did I read about that API documentation?"
                </p>
              </div>
            </div>
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30 bg-gradient-to-r from-primary to-orange-400 rounded-full scale-75" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
