import { Sparkles, Layers, Search, Repeat } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'Proactive assistance',
      description: "Unlike chatbots that wait for commands, Lyto understands what you're doing and offers to help in real time—before you even ask.",
      span: 'md:col-span-2',
      featured: true,
    },
    {
      icon: Layers,
      title: 'Smart tab control',
      description: 'Opens, closes, and navigates tabs automatically based on your workflow.',
      span: 'md:col-span-1',
      featured: false,
    },
    {
      icon: Search,
      title: 'Research & compare',
      description: 'Finds reliable sources and compares products across multiple sites instantly.',
      span: 'md:col-span-1',
      featured: false,
    },
    {
      icon: Repeat,
      title: 'Task automation',
      description: 'Manages workflows and automates repetitive browser tasks so you can focus on what matters.',
      span: 'md:col-span-2',
      featured: false,
    },
  ];

  return (
    <section id="features" className="section-padding px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16 lg:mb-20">
          <div>
            <span className="text-label">Capabilities</span>
            <h2 className="text-headline font-serif mt-4">
              Built to
              <br />
              <em className="not-italic text-gradient">take action</em>
            </h2>
          </div>
          <div className="lg:pt-12">
            <p className="text-body-lg max-w-md">
              A browser agent that doesn't just suggest&mdash;it executes. 
              Designed for those who value their time.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-4 gap-4 lg:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title} 
                className={`${feature.span} group surface-interactive rounded-2xl overflow-hidden ${feature.featured ? 'p-10 lg:p-12' : 'p-8'}`}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className={`${feature.featured ? 'w-16 h-16' : 'w-12 h-12'} rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center group-hover:bg-primary/12 transition-colors`}>
                    <Icon className={`${feature.featured ? 'w-7 h-7' : 'w-5 h-5'} text-primary`} strokeWidth={1.5} />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className={`font-serif mb-3 ${feature.featured ? 'text-2xl lg:text-3xl' : 'text-xl'}`}>
                  {feature.title}
                </h3>
                <p className={`text-muted-foreground leading-relaxed ${feature.featured ? 'text-base max-w-md' : 'text-sm'}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
