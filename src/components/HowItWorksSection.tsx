import { Layers, MessageCircle, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: Layers,
      title: 'Research as usual',
      description: 'Open tabs while you work. Documentation, articles, tools — whatever you need.',
      accent: 'from-blue-500/20 to-blue-500/5',
    },
    {
      number: '02',
      icon: MessageCircle,
      title: 'Ask in plain English',
      description: "Type what you're looking for. No keywords, no tab switching, just a question.",
      accent: 'from-primary/20 to-primary/5',
    },
    {
      number: '03',
      icon: Zap,
      title: 'Navigate instantly',
      description: 'Jump directly to the answer. The relevant content is highlighted for you.',
      accent: 'from-green-500/20 to-green-500/5',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 border-t border-border relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-4">
              <span className="w-6 h-px bg-primary/50" />
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 max-w-lg leading-tight">
              Three steps to <span className="text-gradient">clarity</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed text-lg">
            Lyto reads your open tabs and creates a searchable memory of everything you're researching.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number} 
                className="group relative bg-card/50 border border-border/50 rounded-2xl p-8 md:p-10 hover:border-primary/30 hover:bg-card transition-all duration-500 hover-lift"
              >
                {/* Gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-b ${step.accent} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  {/* Number and icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-5xl font-serif text-primary/20 group-hover:text-primary/40 transition-colors">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
