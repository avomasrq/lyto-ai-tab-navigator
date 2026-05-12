import { FadeIn } from '@/components/ui/fade-in';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Research used to take almost as long as writing. Lyto cut my research time by more than half.",
    name: 'Angela Wu',
    role: 'Philosopher',
    flag: '🇺🇸',
  },
  {
    quote: "The tab management alone is worth it. The real-time insights while I work are an absolute game changer.",
    name: 'Marcus Johnson',
    role: 'Engineer at Vercel',
    flag: '🇬🇧',
  },
  {
    quote: "Finally an AI that works with my browser instead of replacing it. The attention to detail is unmatched.",
    name: 'Elena Rodriguez',
    role: 'Founder at Craft',
    flag: '🇪🇸',
  },
  {
    quote: "Lyto handles the repetitive parts of my workflow so I can focus on the thinking. Game changer.",
    name: 'David Park',
    role: 'Product Manager',
    flag: '🇰🇷',
  },
  {
    quote: "I use it for sales research every morning. Saves me 45 minutes a day, every single day.",
    name: 'Sophie Laurent',
    role: 'Account Executive',
    flag: '🇫🇷',
  },
  {
    quote: "The Gmail integration is insane. I dictate what I want to say and Lyto writes and sends it.",
    name: 'James Osei',
    role: 'Startup Founder',
    flag: '🇬🇭',
  },
  {
    quote: "I don't know how I managed without it. It just gets what I'm trying to do before I finish typing.",
    name: 'Priya Nair',
    role: 'UX Designer',
    flag: '🇮🇳',
  },
  {
    quote: "I stopped copy-pasting between tabs. Lyto pulls everything together and I just review the result.",
    name: 'Luca Romano',
    role: 'Freelance Writer',
    flag: '🇮🇹',
  },
];

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
        <span className="text-base leading-none">{t.flag}</span>
        <div>
          <p className="text-sm font-medium text-foreground leading-none">{t.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

const TestimonialsSection = () => {
  // Duplicate cards for seamless loop
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="testimonials" className="py-16 sm:py-24 scroll-mt-24 overflow-hidden">
      <div className="px-4 sm:px-6">
        <FadeIn className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
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
      </div>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-40 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-40 z-10 bg-gradient-to-l from-background to-transparent" />

        <div
          className="flex gap-4 w-max"
          style={{
            animation: 'marquee-scroll 45s linear infinite',
          }}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
