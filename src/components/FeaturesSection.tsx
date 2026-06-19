import { FadeIn } from '@/components/ui/fade-in';
import {
  InfoCard,
  InfoCardContent,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardMedia,
  InfoCardFooter,
} from '@/components/ui/info-card';
import {
  Smartphone,
  Brain,
  GraduationCap,
  FileSpreadsheet,
  Users,
  Search,
  Code2,
  CalendarDays,
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  image: string;
  hero?: boolean;
}

const FEATURES: Feature[] = [
  {
    icon: <Smartphone className="w-4 h-4 text-primary" />,
    title: 'Message from your phone, get a finished file back',
    description:
      'Text Lyto from WhatsApp or Telegram. Ask for a PDF report, a chart, a summary — it builds it and sends it to any contact. No laptop needed. No other browser AI can do this.',
    tags: ['WhatsApp', 'Telegram', 'PDF generation', 'Mobile-first'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop&crop=center',
    hero: true,
  },
  {
    icon: <Brain className="w-4 h-4 text-primary" />,
    title: 'Stop re-explaining yourself',
    description:
      'Lyto remembers your full context across tabs and tools. No more copy-pasting into ChatGPT every time you switch tasks. It knows where you left off.',
    tags: ['Context memory', 'Cross-tab', 'Workflow continuity'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop&crop=center',
  },
  {
    icon: <GraduationCap className="w-4 h-4 text-primary" />,
    title: 'Your personal tutor, right next to your work',
    description:
      "Studying for the SAT or any exam? Lyto sits beside what you're reading, highlights answers, and gives you a personal explanation on the spot. No extra tab, no extra app.",
    tags: ['Students', 'SAT prep', 'Real-time explanation'],
    image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&h=400&fit=crop&crop=center',
  },
  {
    icon: <FileSpreadsheet className="w-4 h-4 text-primary" />,
    title: 'Reports and spreadsheets on command',
    description:
      'Drop in raw data and get a full Google Sheets table with graphs. Ask for a research summary and get a clean Google Doc. The busywork that eats hours, automated.',
    tags: ['Google Sheets', 'Google Docs', 'Data viz', 'Reports'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&crop=center',
  },
  {
    icon: <Users className="w-4 h-4 text-primary" />,
    title: "Plug it into your team's workflow",
    description:
      'Hand Lyto a repetitive business process and it runs it. From customer ops to internal coordination, it becomes part of how your company actually operates.',
    tags: ['B2B', 'Workflow automation', 'Teams'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&crop=center',
  },
  {
    icon: <Search className="w-4 h-4 text-primary" />,
    title: 'Research anything, instantly',
    description:
      'Ask Lyto to research a topic, pull info from sites, or even find the cheapest flight — and get the answer straight in your chat. Real research, not just a Google search.',
    tags: ['Deep research', 'Web parsing', 'Data fetching'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=center',
  },
  {
    icon: <Code2 className="w-4 h-4 text-primary" />,
    title: 'Dev and design, handled',
    description:
      'Connect GitHub and Lyto reviews your codebase for errors. Connect Figma and it finds designs matching your prompt. Slack keeps your team in sync, automatically.',
    tags: ['GitHub', 'Figma', 'Slack', 'Dev workflows'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&crop=center',
  },
  {
    icon: <CalendarDays className="w-4 h-4 text-primary" />,
    title: 'Start every morning organised',
    description:
      "Lyto sends you a daily agenda at the same time each morning — your schedule, priorities, and reminders — so you never open your laptop wondering what to do first.",
    tags: ['Google Calendar', 'Daily digest', 'Routine'],
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=400&fit=crop&crop=center',
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <InfoCard
      className={[
        'h-full border-border/60 bg-card/60 transition-shadow hover:shadow-md',
        feature.hero
          ? 'border-primary/40 ring-1 ring-primary/20 bg-white'
          : 'bg-white',
      ].join(' ')}
    >
      <InfoCardContent className="text-sm gap-2">
        {/* Icon + badge row */}
        <div className="flex items-center justify-between mb-0.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
            {feature.icon}
          </div>
          {feature.hero && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide">
              Only Lyto
            </span>
          )}
        </div>

        <InfoCardTitle className="text-[15px] leading-snug text-foreground font-semibold">
          {feature.title}
        </InfoCardTitle>

        <InfoCardDescription className="text-sm leading-relaxed">
          {feature.description}
        </InfoCardDescription>

        <InfoCardMedia
          media={[{ src: feature.image, alt: feature.title }]}
          shrinkHeight={90}
          expandHeight={180}
        />

        <InfoCardFooter className="mt-1 pt-1">
          <div className="flex flex-wrap gap-1">
            {feature.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-muted/60 border border-border/40 text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </InfoCardFooter>
      </InfoCardContent>
    </InfoCard>
  );
}

const FeaturesSection = () => {
  const [hero, ...rest] = FEATURES;

  return (
    <section id="features" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            everything you need to{' '}
            <span className="italic text-gradient">move faster</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Hero card — spans 2 cols */}
            <div className="md:col-span-2">
              <FeatureCard feature={hero} />
            </div>

            {/* Card 2 */}
            <div>
              <FeatureCard feature={rest[0]} />
            </div>

            {/* Cards 3–5 */}
            {rest.slice(1, 4).map((f) => (
              <div key={f.title}>
                <FeatureCard feature={f} />
              </div>
            ))}

            {/* Cards 6–8 — last one spans 2 cols to balance */}
            <div>
              <FeatureCard feature={rest[4]} />
            </div>
            <div className="md:col-span-2">
              <FeatureCard feature={rest[5]} />
            </div>
            <div className="md:col-span-2">
              <FeatureCard feature={rest[6]} />
            </div>
            <div>
              <FeatureCard feature={rest[7] ?? rest[6]} />
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
