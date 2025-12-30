const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Research as usual',
      description: 'Open tabs while you work. Documentation, articles, tools — whatever you need.',
    },
    {
      number: '02',
      title: 'Ask in plain English',
      description: "Type what you're looking for. No keywords, no tab switching, just a question.",
    },
    {
      number: '03',
      title: 'Navigate instantly',
      description: 'Jump directly to the answer. The relevant content is highlighted for you.',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 border-t border-border relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 max-w-lg leading-tight">
              Three steps to <span className="text-gradient">clarity</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Lyto reads your open tabs and creates a searchable memory of everything you're researching.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="group relative bg-card/50 border border-border rounded-xl p-8 md:p-10 hover:border-primary/30 hover:bg-card transition-all duration-300"
            >
              <span className="text-5xl font-serif text-primary/20 group-hover:text-primary/40 transition-colors">
                {step.number}
              </span>
              <h3 className="text-xl font-medium mt-6 mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
              
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
