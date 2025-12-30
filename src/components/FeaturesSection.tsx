const FeaturesSection = () => {
  const features = [
    {
      title: 'Semantic search',
      description: 'Understands meaning, not just keywords. Ask for concepts and find relevant content across all your open tabs.',
      number: '01',
      span: 'lg:col-span-2 lg:row-span-2',
      large: true,
    },
    {
      title: 'All tabs, one search',
      description: 'Search across every open tab simultaneously.',
      number: '02',
      span: 'lg:col-span-1',
      large: false,
    },
    {
      title: '100% local',
      description: 'Your data never leaves your browser. Ever.',
      number: '03',
      span: 'lg:col-span-1',
      large: false,
    },
    {
      title: 'Auto-highlight',
      description: 'Jumps to and highlights the exact content you asked for — no more scrolling.',
      number: '04',
      span: 'lg:col-span-2',
      large: false,
    },
  ];

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 max-w-xl leading-[1.1]">
              Built for
              <br />
              <span className="italic text-gradient">deep work</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
            Powerful features that stay invisible until you need them.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`${feature.span} group relative rounded-2xl border border-border bg-card/40 hover:bg-card/70 hover:border-primary/20 transition-all duration-500 overflow-hidden ${feature.large ? 'p-10' : 'p-7'}`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Number accent */}
              <div className={`absolute -top-4 -right-2 font-serif text-primary/[0.04] leading-none pointer-events-none group-hover:text-primary/[0.08] transition-colors duration-500 ${feature.large ? 'text-[16rem]' : 'text-[8rem]'}`}>
                {feature.number}
              </div>
              
              <div className="h-full flex flex-col relative">
                <span className={`font-medium text-primary/40 group-hover:text-primary/60 transition-colors ${feature.large ? 'text-sm' : 'text-xs'}`}>
                  {feature.number}
                </span>
                
                <div className={feature.large ? 'mt-auto pt-20' : 'mt-auto pt-10'}>
                  <h3 className={`font-serif mb-3 ${feature.large ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-muted-foreground leading-relaxed ${feature.large ? 'text-base max-w-sm' : 'text-sm'}`}>
                    {feature.description}
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

export default FeaturesSection;