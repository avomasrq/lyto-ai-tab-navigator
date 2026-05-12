import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "I've been using Lyto for 3 days since launch and it already made my writing much faster. Research used to take almost as long as writing, but Lyto cut my research time by more than half.",
    name: 'Angela Wu',
    role: 'Philosopher',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: "The tab management alone is worth it. But the real-time insights while I work? Absolute game changer. I don't know how I managed without it.",
    name: 'Marcus Johnson',
    role: 'Engineer at Vercel',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: "Finally an AI that works with my browser instead of replacing it. The attention to detail is unmatched. It just gets what I'm trying to do.",
    name: 'Elena Rodriguez',
    role: 'Founder at Craft',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: "Lyto handles the repetitive parts of my workflow so I can focus on the thinking. It's like having a junior assistant who never gets tired.",
    name: 'David Park',
    role: 'Product Manager',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: "I use it for sales research every morning. It scans LinkedIn, news, and company sites and gives me a brief before every call. Saves me 45 minutes a day.",
    name: 'Sophie Laurent',
    role: 'Account Executive',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: "The Gmail integration is insane. I dictate what I want to say and Lyto writes and sends it, formatted properly. My inbox is no longer a nightmare.",
    name: 'James Osei',
    role: 'Startup Founder',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <FadeIn className="text-center max-w-xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-4 leading-tight">
            People are loving
            <br />
            <span className="italic text-gradient">Lyto AI</span>
          </h2>
          <p className="text-muted-foreground mt-5 text-sm sm:text-base">
            Thousands of Chrome users have already made Lyto part of their daily workflow.
          </p>
        </FadeIn>

        {/* Card grid */}
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" staggerDelay={0.08}>
          {TESTIMONIALS.map((t) => (
            <FadeInItem key={t.name} direction="up">
              <div className="h-full flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6 backdrop-blur-sm">
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground/80 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground leading-none">{t.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

      </div>
    </section>
  );
};

export default TestimonialsSection;
