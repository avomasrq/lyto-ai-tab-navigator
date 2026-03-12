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
    <section id="how-it-works" className="py-20 sm:py-32 px-4 sm:px-6 border-t border-border relative dither-overlay">
      {/* Ambient accent */}
      <div className="absolute top-0 left-1/4 w-[200px] sm:w-[300px] md:w-[500px] h-[200px] sm:h-[300px] md:h-[500px] bg-primary/3 rounded-full blur-[60px] sm:blur-[80px] md:blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-20">
          <span className="text-[8px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
            How it works
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-serif mt-4 leading-[1.5]">
            Always on,
            <br />
            <span className="italic text-gradient">always ready</span>
          </h2>
          <p className="text-muted-foreground mt-6 sm:mt-8 text-xs sm:text-sm xl:text-base leading-relaxed max-w-md xl:max-w-lg">
            Lyto operates directly inside Chrome, turning your browser into an intelligent assistant.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 2xl:gap-8">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="group relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-6 h-px bg-gradient-to-r from-border to-transparent z-10" />
              )}
              
              <div className="relative h-full p-6 sm:p-8 rounded-2xl border border-border bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-500 overflow-hidden dither-card">
                {/* Number background */}
                <div className="absolute -top-8 -right-4 text-[8rem] sm:text-[12rem] font-serif text-primary/[0.03] leading-none pointer-events-none group-hover:text-primary/[0.06] transition-colors duration-500">
                  {step.number}
                </div>
                
                <div className="relative">
                  <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-6 sm:mb-8">
                    {step.number}
                  </span>
                  
                  <h3 className="text-xs sm:text-sm md:text-base font-serif mb-3 sm:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
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
