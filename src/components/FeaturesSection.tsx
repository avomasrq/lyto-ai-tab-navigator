import { Search, BarChart3, Layout, Repeat, ShoppingCart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: 'Research (Verified Only)',
      description: 'Lyto reads real websites and gives you accurate answers with sources you can trust.',
      bullets: ['Research topics', 'Compare information', 'Get clean summaries from valid pages'],
    },
    {
      icon: BarChart3,
      title: 'Data Analysis & Visuals',
      description: 'Turn messy information into clear insights.',
      bullets: ['Automatic summaries', 'Bar charts & pie charts', 'Quick analysis directly in your browser'],
      note: 'Perfect for students, research, and work.',
    },
    {
      icon: Layout,
      title: 'Tab & Browser Control',
      description: 'Your browser finally stays organized.',
      bullets: ['Combine and group tabs', 'Open tabs automatically', 'Close useless ones', 'Sort everything for you'],
    },
    {
      icon: Repeat,
      title: 'Automation & Macros',
      description: 'Lyto can act for you.',
      bullets: ['Scroll pages', 'Highlight important elements', 'Click, navigate, and repeat actions'],
      note: 'You tell it what to do - it handles the rest.',
    },
    {
      icon: ShoppingCart,
      title: 'Smart Search & Buying',
      description: 'Lyto finds the best option, not just any option.',
      bullets: ['Finds verified sellers', 'Compares price and quality', 'Looks for better deals', 'Can complete purchases for you'],
      example: '"Find the best NVIDIA GPU, cheaper, from a trusted seller."',
    },
  ];

  return (
    <section id="features" className="py-20 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">
            What you can do with Lyto
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="p-6 rounded-xl border border-border bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary mt-2 shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              {feature.note && (
                <p className="text-sm text-primary/80 mt-4 font-medium">{feature.note}</p>
              )}

              {feature.example && (
                <p className="text-sm text-muted-foreground mt-4 italic border-l-2 border-primary/30 pl-3">
                  {feature.example}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
