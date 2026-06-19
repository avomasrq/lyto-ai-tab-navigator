import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
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

const HERO_ITEM: BentoItem = {
  title: 'Message from your phone, get a finished file back',
  description:
    'Text Lyto from WhatsApp or Telegram. Ask for a PDF report, a chart, a summary — it builds it and sends it to any contact. No laptop needed. No other browser AI can do this.',
  icon: <Smartphone className="w-4 h-4 text-primary" />,
  status: 'Only Lyto',
  tags: ['WhatsApp', 'Telegram', 'PDF generation', 'Mobile-first'],
  colSpan: 2,
  hasPersistentHover: true,
};

const GRID_ITEMS: BentoItem[] = [
  {
    title: 'Stop re-explaining yourself',
    description:
      'Lyto remembers your full context across tabs and tools. No more copy-pasting into ChatGPT every time you switch tasks. It knows where you left off.',
    icon: <Brain className="w-4 h-4 text-primary" />,
    tags: ['Context memory', 'Cross-tab', 'Workflow continuity'],
  },
  {
    title: 'Your personal tutor, right next to your work',
    description:
      'Studying for the SAT or any exam? Lyto sits beside what you\'re reading, highlights answers, and gives you a personal explanation on the spot. No extra tab, no extra app.',
    icon: <GraduationCap className="w-4 h-4 text-primary" />,
    tags: ['Students', 'SAT prep', 'Real-time explanation'],
  },
  {
    title: 'Reports and spreadsheets on command',
    description:
      'Drop in raw data and get a full Google Sheets table with graphs. Ask for a research summary and get a clean Google Doc. The busywork that eats hours, automated.',
    icon: <FileSpreadsheet className="w-4 h-4 text-primary" />,
    tags: ['Google Sheets', 'Google Docs', 'Data viz', 'Reports'],
    colSpan: 2,
  },
  {
    title: 'Plug it into your team\'s workflow',
    description:
      'Hand Lyto a repetitive business process and it runs it. From customer ops to internal coordination, it becomes part of how your company actually operates.',
    icon: <Users className="w-4 h-4 text-primary" />,
    tags: ['B2B', 'Workflow automation', 'Teams'],
  },
  {
    title: 'Research anything, instantly',
    description:
      'Ask Lyto to research a topic, pull info from sites, or even find the cheapest flight — and get the answer straight in your chat. Real research, not just a Google search.',
    icon: <Search className="w-4 h-4 text-primary" />,
    tags: ['Deep research', 'Web parsing', 'Data fetching'],
  },
  {
    title: 'Dev and design, handled',
    description:
      'Connect GitHub and Lyto reviews your codebase for errors. Connect Figma and it finds designs matching your prompt. Slack keeps your team in sync, automatically.',
    icon: <Code2 className="w-4 h-4 text-primary" />,
    tags: ['GitHub', 'Figma', 'Slack', 'Dev workflows'],
  },
  {
    title: 'Start every morning organised',
    description:
      'Lyto sends you a daily agenda at the same time each morning — your schedule, priorities, and reminders — so you never open your laptop wondering what to do first.',
    icon: <CalendarDays className="w-4 h-4 text-primary" />,
    tags: ['Google Calendar', 'Daily digest', 'Routine'],
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            everything you need to{' '}
            <span className="italic text-gradient">move faster</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1} className="space-y-3">
          {/* Hero card — full width with orange accent */}
          <div className="relative rounded-2xl overflow-hidden p-[1.5px]"
            style={{ background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(20 90% 48% / 0.4))' }}>
            <div className="relative rounded-[14px] p-5 bg-card/95 overflow-hidden">
              {/* Dot grid */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[length:4px_4px]" />
              {/* Orange glow */}
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, hsl(24 95% 53%), transparent 70%)' }} />
              <div className="relative flex flex-col sm:flex-row sm:gap-8 space-y-3.5 sm:space-y-0">
                <div className="flex-1 flex flex-col space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20">
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      Only Lyto
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-foreground tracking-tight text-[17px] leading-snug">
                      {HERO_ITEM.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                      {HERO_ITEM.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {HERO_ITEM.tags?.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-primary/8 border border-primary/20 text-primary/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the grid */}
          <BentoGrid items={GRID_ITEMS} />
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
