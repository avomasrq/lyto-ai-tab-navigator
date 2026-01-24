import { GraduationCap, Rocket, Users } from 'lucide-react';

const WhoItsForSection = () => {
  const audiences = [
    {
      icon: GraduationCap,
      title: 'Students',
      description: 'Doing research and analysis',
    },
    {
      icon: Rocket,
      title: 'Founders & Builders',
      description: 'Working in the browser all day',
    },
    {
      icon: Users,
      title: 'Everyone else',
      description: 'Tired of tab chaos and fake AI answers',
    },
  ];

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-4">
          Who Lyto is built for
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          If you live in your browser, Lyto saves time.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <div 
              key={audience.title}
              className="text-center p-6 rounded-xl border border-border bg-card/30"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <audience.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{audience.title}</h3>
              <p className="text-sm text-muted-foreground">{audience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
