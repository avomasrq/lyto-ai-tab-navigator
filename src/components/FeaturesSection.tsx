import { ArrowUpRight, Brain, Search, Shield, Navigation } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Semantic understanding',
      description: 'Finds concepts, not just keywords. Ask about ideas and get relevant results.',
      icon: Brain,
      span: 'md:col-span-2',
      gradient: 'from-purple-500/10 to-transparent',
    },
    {
      title: 'Cross-tab search',
      description: 'Search across all your tabs at once. No more hunting through dozens of windows.',
      icon: Search,
      span: 'md:col-span-1',
      gradient: 'from-blue-500/10 to-transparent',
    },
    {
      title: 'Privacy first',
      description: 'Everything stays in your browser. Your data never leaves your machine.',
      icon: Shield,
      span: 'md:col-span-1',
      gradient: 'from-green-500/10 to-transparent',
    },
    {
      title: 'Instant navigation',
      description: 'Jump directly to the relevant section. Content is highlighted automatically.',
      icon: Navigation,
      span: 'md:col-span-2',
      gradient: 'from-primary/10 to-transparent',
    },
  ];

  return (
    <section id="features" className="py-32 px-6 bg-card/50 border-t border-border relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-4">
            <span className="w-6 h-px bg-primary/50" />
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 max-w-2xl leading-tight">
            Built for <span className="text-gradient">deep work</span>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-lg text-lg">
            Powerful features designed to help you focus on what matters, not on finding information.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className={`${feature.span} group relative bg-background/50 border border-border/50 rounded-2xl p-8 hover:border-primary/30 transition-all duration-500 hover-lift overflow-hidden`}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
