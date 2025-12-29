import { Layers, MessageSquare, Navigation, ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Layers,
      step: '01',
      title: 'Open Multiple Tabs',
      description: 'Browse and research as you normally do. Open articles, docs, and resources across multiple tabs.',
      color: 'from-blue-500 to-cyan-400',
      glow: 'blue-500',
    },
    {
      icon: MessageSquare,
      step: '02',
      title: 'Ask in Natural Language',
      description: "Simply ask Lyto what you're looking for. No need to remember which tab or where you saw it.",
      color: 'from-primary to-orange-400',
      glow: 'primary',
    },
    {
      icon: Navigation,
      step: '03',
      title: 'Navigate Instantly',
      description: 'Lyto finds the exact information across all your tabs and highlights it for you.',
      color: 'from-accent to-pink-400',
      glow: 'accent',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-4">
            <span className="w-8 h-px bg-primary" />
            How It Works
            <span className="w-8 h-px bg-primary" />
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-4 mb-6 tracking-tight">
            Three Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light">
            Lyto seamlessly integrates into your browsing workflow
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="group relative"
            >
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-8 h-8 text-muted-foreground/30" />
                </div>
              )}
              
              <div className="relative h-full">
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="glass-card rounded-3xl p-8 h-full transition-all duration-500 group-hover:border-primary/30 relative overflow-hidden">
                  {/* Step Number - Large Background */}
                  <span className="absolute -top-4 -right-4 text-[120px] font-black text-foreground/[0.02] leading-none select-none">
                    {step.step}
                  </span>
                  
                  {/* Icon */}
                  <div className="relative mb-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-40 group-hover:opacity-60 transition-opacity`} />
                  </div>
                  
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-xs font-bold uppercase tracking-widest bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      Step {step.step}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:gradient-text transition-all">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
