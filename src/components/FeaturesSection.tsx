import { ArrowUpRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Semantic search',
      description: 'Understands meaning, not just keywords. Ask for concepts and find relevant content.',
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
      title: 'Local processing',
      description: 'Your data never leaves your browser.',
      number: '03',
      span: 'lg:col-span-1',
      large: false,
    },
    {
      title: 'Auto-highlight',
      description: 'Jumps to and highlights the exact content you asked for.',
      number: '04',
      span: 'lg:col-span-2',
      large: false,
    },
  ];

  return (
    <section id="features" className="py-32 px-6 bg-card/30 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mt-4 max-w-lg leading-tight">
              Built for <span className="text-gradient">focused</span> work
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Powerful features that stay out of your way until you need them.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className={`${feature.span} group relative bg-background border border-border rounded-2xl ${feature.large ? 'p-10' : 'p-6'} hover:border-primary/20 transition-all duration-300`}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-auto">
                  <span className={`font-serif text-primary/20 ${feature.large ? 'text-7xl' : 'text-4xl'}`}>
                    {feature.number}
                  </span>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
                <div className={feature.large ? 'mt-16' : 'mt-8'}>
                  <h3 className={`font-medium mb-3 ${feature.large ? 'text-2xl' : 'text-lg'}`}>
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
