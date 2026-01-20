const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Always watching',
      description: "Lyto runs in the background, understanding your screen and what you're trying to accomplish.",
    },
    {
      number: '02',
      title: 'Proactive suggestions',
      description: 'Get real-time help without asking. Lyto offers to research, compare prices, or manage your tabs automatically.',
    },
    {
      number: '03',
      title: 'One-click action',
      description: 'Accept and Lyto does the work - opening tabs, finding sources, comparing products, all hands-free.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 px-5 md:px-6 border-t border-border relative">
      {/* Ambient accent - reduced blur on mobile */}
      <div className="absolute top-0 left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-primary/5 md:bg-primary/3 rounded-full blur-[60px] md:blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-12 md:mb-20">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-primary font-medium">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mt-3 md:mt-4 leading-[1.1]">
            Always on,
            <br />
            <span className="italic text-gradient">always ready</span>
          </h2>
          <p className="text-muted-foreground mt-5 md:mt-8 text-base md:text-lg leading-relaxed max-w-md">
            Lyto operates directly inside Chrome, turning your browser into an intelligent assistant.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="group relative"
            >
              {/* Connection line - desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-6 h-px bg-gradient-to-r from-border to-transparent z-10" />
              )}
              
              <div className="relative h-full p-6 md:p-8 rounded-2xl border border-border bg-card/40 md:bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-500 overflow-hidden">
                {/* Number background */}
                <div className="absolute -top-6 md:-top-8 -right-2 md:-right-4 text-[8rem] md:text-[12rem] font-serif text-primary/[0.04] md:text-primary/[0.03] leading-none pointer-events-none group-hover:text-primary/[0.06] transition-colors duration-500">
                  {step.number}
                </div>
                
                <div className="relative">
                  <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium border border-primary/20 mb-5 md:mb-8">
                    {step.number}
                  </span>
                  
                  <h3 className="text-lg md:text-xl font-serif mb-3 md:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
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