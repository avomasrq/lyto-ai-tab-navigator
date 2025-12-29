import { ArrowUpRight } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Semantic understanding',
      description: 'Finds concepts, not just keywords. Ask about ideas and get relevant results.',
      span: 'md:col-span-2',
    },
    {
      title: 'Cross-tab search',
      description: 'Search across all your tabs at once. No more hunting through dozens of windows.',
      span: 'md:col-span-1',
    },
    {
      title: 'Privacy first',
      description: 'Everything stays in your browser. Your data never leaves your machine.',
      span: 'md:col-span-1',
    },
    {
      title: 'Instant navigation',
      description: 'Jump directly to the relevant section. Content is highlighted automatically.',
      span: 'md:col-span-2',
    },
  ];

  return (
    <section id="features" className="py-32 px-6 bg-card border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 max-w-2xl leading-tight">
            Built for deep work
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className={`${feature.span} group relative bg-background border border-border rounded-lg p-8 hover:border-primary/30 transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-medium">
                  {feature.title}
                </h3>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
