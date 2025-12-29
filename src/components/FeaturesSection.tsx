import { Brain, Search, Zap, Target } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'Context-Aware Understanding',
      description: 'Lyto comprehends the content and context of every open tab, creating a semantic map of your research.',
    },
    {
      icon: Search,
      title: 'Cross-Tab Semantic Search',
      description: 'Search across all your tabs using natural language. Find concepts, not just keywords.',
    },
    {
      icon: Zap,
      title: 'Instant Navigation',
      description: 'Jump directly to the relevant section and see your answer highlighted automatically.',
    },
    {
      icon: Target,
      title: 'Built for Deep Research',
      description: 'Designed for researchers, developers, and knowledge workers who need to manage complex information.',
    },
  ];

  return (
    <section id="features" className="py-24 px-6 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/30 to-transparent -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Core Features
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-6">
              Intelligence That
              <br />
              <span className="gradient-text">Understands You</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Lyto uses advanced AI to understand not just what's in your tabs, but what you're trying to accomplish.
            </p>
            
            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-orange-400/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Visual */}
          <div className="relative">
            <div className="glass-card rounded-2xl p-6 glow-orange-subtle">
              {/* Mock Browser Tabs */}
              <div className="space-y-3">
                {[
                  { title: 'React Docs - Hooks', url: 'react.dev/hooks', active: false },
                  { title: 'TypeScript Handbook', url: 'typescriptlang.org', active: false },
                  { title: 'API Documentation', url: 'api.example.com/docs', active: true },
                  { title: 'Stack Overflow', url: 'stackoverflow.com', active: false },
                ].map((tab, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      tab.active 
                        ? 'bg-primary/20 border border-primary/30' 
                        : 'bg-secondary/50 hover:bg-secondary'
                    }`}
                  >
                    <div className="w-4 h-4 rounded bg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${tab.active ? 'text-primary' : 'text-foreground'}`}>
                        {tab.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {tab.url}
                      </div>
                    </div>
                    {tab.active && (
                      <div className="text-xs text-primary font-medium">
                        Found
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* AI Response */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-orange-400/10 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-foreground">L</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">
                      Found the API authentication section in your docs tab. The Bearer token format is documented there.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange-400/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
