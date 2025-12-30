import { ArrowRight } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Open tabs as you research',
      description: 'Documentation, articles, Stack Overflow, GitHub — keep everything open.',
    },
    {
      number: '02',
      title: 'Ask what you need',
      description: 'Type naturally. "Where was that React hook example?" or "Find the pricing page."',
    },
    {
      number: '03',
      title: 'Jump to the answer',
      description: 'Navigate directly to the relevant section. Content is highlighted for you.',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 leading-tight">
            From chaos to <span className="text-gradient">clarity</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            Lyto indexes your open tabs in real-time, making everything searchable with natural language.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="group relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-8 h-px bg-border z-10" />
              )}
              
              <div className="bg-card/50 border border-border rounded-2xl p-8 h-full hover:border-primary/20 transition-colors">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-6xl font-serif text-primary/15 group-hover:text-primary/25 transition-colors">
                    {step.number}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                </div>
                <h3 className="text-xl font-medium mb-4">
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
