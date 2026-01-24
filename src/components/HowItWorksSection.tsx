const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Install',
      description: 'Install the Lyto Chrome extension',
    },
    {
      number: '02',
      title: 'Ask',
      description: 'Ask Lyto a question or give it a task',
    },
    {
      number: '03',
      title: 'Analyze',
      description: 'Lyto reads real web pages and analyzes data',
    },
    {
      number: '04',
      title: 'Done',
      description: 'You get summaries, visuals, organized tabs, or completed actions',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Simple. Fast. Useful.
        </p>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-px bg-border" />
              )}
              
              <div className="relative">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                  {step.number}
                </span>
                
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
