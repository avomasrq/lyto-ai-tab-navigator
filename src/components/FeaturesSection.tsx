import { motion } from 'framer-motion';
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
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=500&fit=crop&crop=center',
    hero: true,
  },
  {
    icon: <Brain className="w-4 h-4 text-primary" />,
    title: 'Stop re-explaining yourself',
    description:
      'Lyto remembers your full context across tabs and tools. No more copy-pasting into ChatGPT every time you switch tasks.',
    tags: ['Context memory', 'Cross-tab', 'Workflow continuity'],
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: <GraduationCap className="w-4 h-4 text-primary" />,
    title: 'Your personal tutor, right next to your work',
    description:
      "Studying for the SAT or any exam? Lyto sits beside what you're reading, highlights answers, and gives you a personal explanation on the spot.",
    tags: ['Students', 'SAT prep', 'Real-time explanation'],
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: <FileSpreadsheet className="w-4 h-4 text-primary" />,
    title: 'Reports and spreadsheets on command',
    description:
      'Drop in raw data and get a full Google Sheets table with graphs. Ask for a research summary and get a clean Google Doc. Hours of busywork, automated.',
    tags: ['Google Sheets', 'Google Docs', 'Data viz', 'Reports'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: <Users className="w-4 h-4 text-primary" />,
    title: "Plug it into your team's workflow",
    description:
      'Hand Lyto a repetitive business process and it runs it. From customer ops to internal coordination, it becomes part of how your company operates.',
    tags: ['B2B', 'Workflow automation', 'Teams'],
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: <Search className="w-4 h-4 text-primary" />,
    title: 'Research anything, instantly',
    description:
      'Ask Lyto to research a topic, pull info from sites, or find the cheapest flight — and get the answer straight in your chat. Real research, not just a Google search.',
    tags: ['Deep research', 'Web parsing', 'Data fetching'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: <Code2 className="w-4 h-4 text-primary" />,
    title: 'Dev and design, handled',
    description:
      'Connect GitHub and Lyto reviews your codebase for errors. Connect Figma and it finds designs matching your prompt. Slack keeps your team in sync, automatically.',
    tags: ['GitHub', 'Figma', 'Slack', 'Dev workflows'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&crop=center',
  },
  {
    icon: <CalendarDays className="w-4 h-4 text-primary" />,
    title: 'Start every morning organised',
    description:
      "Lyto sends you a daily agenda at the same time each morning — your schedule, priorities, and reminders — so you never open your laptop wondering what to do first.",
    tags: ['Google Calendar', 'Daily digest', 'Routine'],
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop&crop=center',
  },
];

function FeatureCard({ feature, delay = 0 }: { feature: Feature; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <InfoCard
        className={[
          'h-full transition-shadow duration-300',
          feature.hero
            ? 'border-primary/30 ring-1 ring-primary/15 bg-white'
            : 'border-border/60 bg-white hover:border-border',
        ].join(' ')}
      >
        <InfoCardContent className="gap-3 text-sm h-full">
          {/* Icon + badge */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
              {feature.icon}
            </div>
            {feature.hero && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
                Only Lyto
              </span>
            )}
          </div>

          <InfoCardTitle className="text-[15px] font-semibold leading-snug text-foreground">
            {feature.title}
          </InfoCardTitle>

          <InfoCardDescription className="text-[13px] leading-relaxed">
            {feature.description}
          </InfoCardDescription>

          <InfoCardMedia
            media={[{ src: feature.image, alt: feature.title }]}
            shrinkHeight={feature.hero ? 130 : 100}
            expandHeight={feature.hero ? 220 : 180}
          />

          <InfoCardFooter>
            <div className="flex flex-wrap gap-1 pt-1">
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-muted/70 border border-border/40 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </InfoCardFooter>
        </InfoCardContent>
      </InfoCard>
    </motion.div>
  );
}

const FeaturesSection = () => {
  const [f0, f1, f2, f3, f4, f5, f6, f7] = FEATURES;

  return (
    <section id="features" className="py-8 sm:py-16 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            everything you need to{' '}
            <span className="italic text-gradient">move faster</span>
          </h2>
        </FadeIn>

        {/* Row 1: hero (2 col) + card 2 (1 col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <div className="md:col-span-2"><FeatureCard feature={f0} delay={0} /></div>
          <div><FeatureCard feature={f1} delay={0.08} /></div>
        </div>

        {/* Row 2: 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <FeatureCard feature={f2} delay={0.05} />
          <FeatureCard feature={f3} delay={0.1} />
          <FeatureCard feature={f4} delay={0.15} />
        </div>

        {/* Row 3: card (1 col) + wide card (2 col) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div><FeatureCard feature={f5} delay={0.05} /></div>
          <div className="md:col-span-2"><FeatureCard feature={f6} delay={0.1} /></div>
        </div>

        {/* Row 4: full width last card */}
        <div className="mt-3">
          <FeatureCard feature={f7} delay={0.05} />
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
