import { Globe, Zap, Shield } from 'lucide-react';

const WhatIsLytoSection = () => {
  const points = [
    { icon: Globe, text: 'No copy-pasting' },
    { icon: Zap, text: 'No switching tabs' },
    { icon: Shield, text: 'No fake answers' },
  ];

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-8">
          What is Lyto AI?
        </h2>
        
        <div className="space-y-6 text-center">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Lyto AI is an AI assistant that lives directly in your browser.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            It works like ChatGPT &mdash; but instead of guessing, it reads real web pages, pulls verified information, and actually does things for you.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {points.map((point) => (
            <div 
              key={point.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50"
            >
              <point.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{point.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatIsLytoSection;
