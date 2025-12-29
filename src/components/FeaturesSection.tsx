import { Brain, Search, Zap, Target, Sparkles } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'Context-Aware Understanding',
      description: 'Lyto comprehends the content and context of every open tab, creating a semantic map of your research.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Search,
      title: 'Cross-Tab Semantic Search',
      description: 'Search across all your tabs using natural language. Find concepts, not just keywords.',
      gradient: 'from-primary to-orange-400',
    },
    {
      icon: Zap,
      title: 'Instant Navigation',
      description: 'Jump directly to the relevant section and see your answer highlighted automatically.',
      gradient: 'from-emerald-500 to-teal-400',
    },
    {
      icon: Target,
      title: 'Built for Deep Research',
      description: 'Designed for researchers, developers, and knowledge workers who need to manage complex information.',
      gradient: 'from-blue-500 to-cyan-400',
    },
  ];

  return (
    <section id="features" className="py-32 px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] -z-10" />
      
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              Core Features
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Intelligence That
              <br />
              <span className="gradient-text">Understands You</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed font-light">
              Lyto uses advanced AI to understand not just what's in your tabs, but what you're trying to accomplish.
            </p>
            
            {/* Feature List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group flex gap-5 p-4 -mx-4 rounded-2xl hover:bg-secondary/30 transition-all duration-300"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Visual */}
          <div className="relative">
            {/* Main card */}
            <div className="glass-card-elevated rounded-3xl p-6 relative z-10">
              {/* Mock Browser Tabs */}
              <div className="space-y-3">
                {[
                  { title: 'React Docs - Hooks API', url: 'react.dev/hooks', active: false, icon: '⚛️' },
                  { title: 'TypeScript Handbook', url: 'typescriptlang.org', active: false, icon: '📘' },
                  { title: 'API Documentation', url: 'api.example.com/docs', active: true, icon: '🔧' },
                  { title: 'Stack Overflow - JWT', url: 'stackoverflow.com', active: false, icon: '💬' },
                  { title: 'Medium Article', url: 'medium.com/auth', active: false, icon: '📝' },
                ].map((tab, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      tab.active 
                        ? 'bg-gradient-to-r from-primary/20 to-accent/10 border border-primary/30 shadow-[0_0_20px_hsl(25_95%_53%/0.2)]' 
                        : 'bg-secondary/30 hover:bg-secondary/50 border border-transparent'
                    }`}
                  >
                    <div className="text-xl">{tab.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate ${tab.active ? 'text-primary' : 'text-foreground'}`}>
                        {tab.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {tab.url}
                      </div>
                    </div>
                    {tab.active && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Found
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* AI Response */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                      Lyto AI
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      Found the API authentication section in your docs tab. The Bearer token format is documented in the Authentication section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-[60px] animate-glow-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/30 rounded-full blur-[50px] animate-glow-pulse" style={{ animationDelay: '-1.5s' }} />
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 glass-card rounded-full px-4 py-2 flex items-center gap-2 animate-float">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">0.3s response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
