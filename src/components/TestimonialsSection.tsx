import { FadeIn } from '@/components/ui/fade-in';
import { Marquee } from '@/components/ui/3d-testimonials';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import angelaAvatar from '@/assets/testimonial-angela.jpg';

interface Testimonial {
  name: string;
  username: string;
  body: string;
  img: string;
  country: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Angela Wu',
    username: '@angelawu',
    body: "I've been using Lyto for 3 days since launch and it already made my writing much faster. Research used to take almost as long as writing, but Lyto cut my research time by more than half.",
    img: angelaAvatar as unknown as string,
    country: '🇺🇸 USA',
  },
  {
    name: 'Marcus Johnson',
    username: '@marcusj',
    body: "The tab management alone is worth it. But the real-time insights while I work? Absolute game changer. I don't know how I managed without it.",
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    country: '🇬🇧 UK',
  },
  {
    name: 'Elena Rodriguez',
    username: '@elenard',
    body: "Finally an AI that works with my browser instead of replacing it. The attention to detail is unmatched. It just gets what I'm trying to do.",
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    country: '🇪🇸 Spain',
  },
  {
    name: 'David Park',
    username: '@davidpark',
    body: "Lyto handles the repetitive parts of my workflow so I can focus on the thinking. It's like having a junior assistant who never gets tired.",
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    country: '🇰🇷 Korea',
  },
  {
    name: 'Sophie Laurent',
    username: '@sophiel',
    body: "I use it for sales research every morning. It scans LinkedIn, news, and company sites and gives me a brief before every call. Saves me 45 minutes a day.",
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
    country: '🇫🇷 France',
  },
  {
    name: 'James Osei',
    username: '@jamesosei',
    body: "The Gmail integration is insane. I dictate what I want to say and Lyto writes and sends it, formatted properly. My inbox is no longer a nightmare.",
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    country: '🇬🇭 Ghana',
  },
  {
    name: 'Priya Nair',
    username: '@priyanair',
    body: "I stopped copy-pasting between tabs. Lyto pulls everything together and I just review the result. Huge time saver every single day.",
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
    country: '🇮🇳 India',
  },
  {
    name: 'Luca Romano',
    username: '@lucaromano',
    body: "For freelance writing, Lyto is a cheat code. Research, outline, source-checking — all handled in minutes instead of hours.",
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    country: '🇮🇹 Italy',
  },
  {
    name: 'Hana Kim',
    username: '@hanakim',
    body: "Impressive performance even with 30+ tabs open. Lyto never slows Chrome down and finds exactly what I need in seconds.",
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
    country: '🇯🇵 Japan',
  },
  {
    name: 'Tom Brennan',
    username: '@tombrennan',
    body: "I pitched this to my whole team. We all switched in a week. The shared context across tabs is something no other tool does.",
    img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=face',
    country: '🇮🇪 Ireland',
  },
  {
    name: 'Yara Al-Rashid',
    username: '@yaraar',
    body: "As a student doing heavy research, Lyto is a lifesaver. It connects dots between papers and sources automatically. My grades improved.",
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    country: '🇸🇦 Saudi Arabia',
  },
  {
    name: 'Noah Fischer',
    username: '@noahfischer',
    body: "I tested 6 AI browser tools this quarter. Lyto is the only one that doesn't feel like a bolt-on. It's native to how you already work.",
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face',
    country: '🇩🇪 Germany',
  },
  {
    name: 'Chloe Dubois',
    username: '@chloed',
    body: "I run three client accounts and Lyto keeps me context-switched without losing my place. It remembers what I was doing even when I don't.",
    img: 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=80&h=80&fit=crop&crop=face',
    country: '🇧🇪 Belgium',
  },
  {
    name: 'Ravi Shankar',
    username: '@ravishankar',
    body: "The document automation feature is wild. I asked it to pull competitor pricing from three sites and compile a table. Done in 20 seconds.",
    img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face',
    country: '🇮🇳 India',
  },
  {
    name: 'Mei Lin',
    username: '@meilin',
    body: "My favourite part is that it never asks me to switch apps. Everything happens right where I am. Zero friction, massive output.",
    img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face',
    country: '🇨🇳 China',
  },
];

function TestimonialCard({ img, name, username, body, country }: Testimonial) {
  return (
    <Card className="w-full border-border/60 bg-card">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8 flex-shrink-0">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="text-xs">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <figcaption className="text-sm font-medium text-foreground flex items-center gap-1.5 leading-none">
              <span className="truncate">{name}</span>
              <span className="text-xs flex-shrink-0">{country}</span>
            </figcaption>
            <p className="text-xs text-muted-foreground mt-0.5">{username}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 mt-2.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 fill-primary text-primary" />
          ))}
        </div>
        <blockquote className="mt-2 text-sm text-foreground/75 leading-relaxed line-clamp-3">
          {body}
        </blockquote>
      </CardContent>
    </Card>
  );
}

const col1 = TESTIMONIALS.filter((_, i) => i % 3 === 0);
const col2 = TESTIMONIALS.filter((_, i) => i % 3 === 1);
const col3 = TESTIMONIALS.filter((_, i) => i % 3 === 2);

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn delay={0.1}>
          <div className="relative h-[500px] sm:h-[580px] w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/10">
            {/* Perspective wrapper */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '800px' }}>
              <div
                className="flex flex-row gap-3"
                style={{
                  transform: 'rotateX(20deg) rotateZ(18deg)',
                  width: '160%',
                  height: '160%',
                }}
              >
                {/* Column 1 — scrolls down */}
                <Marquee vertical pauseOnHover repeat={4} className="flex-1 [--duration:28s]">
                  {col1.map((t) => <TestimonialCard key={t.username} {...t} />)}
                </Marquee>

                {/* Column 2 — scrolls up */}
                <Marquee vertical pauseOnHover reverse repeat={4} className="flex-1 [--duration:34s]">
                  {col2.map((t) => <TestimonialCard key={t.username} {...t} />)}
                </Marquee>

                {/* Column 3 — scrolls down */}
                <Marquee vertical pauseOnHover repeat={4} className="flex-1 [--duration:24s]">
                  {col3.map((t) => <TestimonialCard key={t.username} {...t} />)}
                </Marquee>

                {/* Column 4 — scrolls up */}
                <Marquee vertical pauseOnHover reverse repeat={4} className="flex-1 [--duration:31s]">
                  {[...col1].reverse().map((t) => <TestimonialCard key={t.username + '-r'} {...t} />)}
                </Marquee>
              </div>
            </div>

            {/* Gradient fade masks — softer on sides */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default TestimonialsSection;
