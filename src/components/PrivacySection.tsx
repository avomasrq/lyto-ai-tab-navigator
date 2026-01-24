import { Lock, Eye, BarChart, ShieldCheck } from 'lucide-react';

const PrivacySection = () => {
  const points = [
    { icon: Lock, text: 'Your data stays local' },
    { icon: Eye, text: 'No hidden tracking' },
    { icon: BarChart, text: 'Full visibility in your dashboard' },
    { icon: ShieldCheck, text: 'Zero data leaks' },
  ];

  return (
    <section className="py-20 px-6 border-t border-border bg-card/30">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">
          Privacy comes first. Always.
        </h2>
        <p className="text-muted-foreground mb-10">
          Lyto AI is built with a strict privacy-first approach.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {points.map((point) => (
            <div 
              key={point.text}
              className="p-4 rounded-xl border border-border bg-background"
            >
              <point.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium">{point.text}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          You control what Lyto sees. Always.
        </p>
      </div>
    </section>
  );
};

export default PrivacySection;
