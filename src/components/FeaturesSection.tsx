const FeaturesSection = () => {
  const features = [
    {
      title: 'Proactive assistance',
      description: "Unlike chatbots that wait for commands, Lyto understands what you're doing and offers to help in real time — before you even ask.",
      number: '01',
      span: 'lg:col-span-2 lg:row-span-2',
      large: true,
    },
    {
      title: 'Smart tab control',
      description: 'Opens, closes, and navigates tabs automatically for you.',
      number: '02',
      span: 'lg:col-span-1',
      large: false,
    },
    {
      title: 'Research & compare',
      description: 'Finds reliable sources and compares products across sites.',
      number: '03',
      span: 'lg:col-span-1',
      large: false,
    },
    {
      title: 'Task automation',
      description: 'Manages workflows and automates repetitive browser tasks so you can focus on what matters.',
      number: '04',
      span: 'lg:col-span-2',
      large: false,
    },
  ];

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      {/* Ambient glow - reduced on mobile */}
      <div className="hidden md:block absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 max-w-xl leading-[1.1]">
              Built to
              <br />
              <span className="italic text-gradient">take action</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
            A browser agent that doesn't just suggest — it does.
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