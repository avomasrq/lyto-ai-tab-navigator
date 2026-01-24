import { Eye, Lightbulb, Zap } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      icon: Eye,
      title: 'Always watching',
      description: "Lyto runs quietly in the background, understanding your screen and what you're trying to accomplish.",
    },
    {
      number: '02',
      icon: Lightbulb,
      title: 'Proactive suggestions',
      description: 'Get real-time help without asking. Lyto offers to research, compare prices, or manage your tabs automatically.',
    },
    {
      number: '03',
      icon: Zap,
      title: 'One-click action',
      description: 'Accept and Lyto does the work—opening tabs, finding sources, comparing products, all hands-free.',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding px-6 relative">
      {/* Section divider */}
      <div className="section-divider mb-16 md:mb-24" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-16 lg:mb-20">
          <div>
            <span className="text-label">How it works</span>
            <h2 className="text-headline font-serif mt-4">
              Always on,
              <br />
              <em className="not-italic text-gradient">always ready</em>
            </h2>
          </div>
          <div className="lg:pt-12">
            <p className="text-body-lg max-w-md">
              Lyto operates directly inside Chrome, turning your browser into an 
              intelligent assistant that anticipates your needs.
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number} 
                className="group surface-interactive rounded-2xl p-8 lg:p-10"
              >
                {/* Icon */}
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center group-hover:bg-primary/12 transition-colors">
                    <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Number */}
                <span className="text-xs font-medium text-primary/50 tracking-wider">
                  Step {step.number}
                </span>
                
                {/* Content */}
                <h3 className="text-title font-serif mt-3 mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-4 w-8 lg:w-8">
                    <div className="h-px bg-gradient-to-r from-border to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
