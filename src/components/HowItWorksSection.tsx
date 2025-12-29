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
    <section id="how-it-works" className="py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 max-w-lg leading-tight">
              Three steps to clarity
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm leading-relaxed">
            Lyto reads your open tabs and creates a searchable memory of everything you're researching.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="bg-background p-8 md:p-10 group hover:bg-card transition-colors duration-300"
            >
              <span className="text-4xl font-serif text-primary/40 group-hover:text-primary transition-colors">
                {step.number}
              </span>
              <h3 className="text-xl font-medium mt-6 mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
