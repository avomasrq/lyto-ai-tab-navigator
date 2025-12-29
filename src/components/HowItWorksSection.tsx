import { Layers, MessageSquare, Navigation } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Layers,
      step: '01',
      title: 'Open Multiple Tabs',
      description: 'Browse and research as you normally do. Open articles, docs, and resources across multiple tabs.',
    },
    {
      icon: MessageSquare,
      step: '02',
      title: 'Ask in Natural Language',
      description: "Simply ask Lyto what you're looking for. No need to remember which tab or where you saw it.",
    },
    {
      icon: Navigation,
      step: '03',
      title: 'Navigate Instantly',
      description: 'Lyto finds the exact information across all your tabs and highlights it for you.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-6">
            Three Simple Steps
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Lyto seamlessly integrates into your browsing workflow
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
              )}
              
              <div className="glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/30 hover:glow-orange-subtle relative z-10">
                {/* Step Number */}
                <span className="text-primary/30 font-display text-6xl font-bold absolute top-4 right-6">
                  {step.step}
                </span>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-orange-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="font-display text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
