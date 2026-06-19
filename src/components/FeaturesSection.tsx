import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';

const BENTO_ITEMS: BentoItem[] = [
  {
    title: 'Message from your phone, get a finished file back',
    description:
      'Text Lyto from WhatsApp or Telegram. Ask for a PDF report, a chart, a summary — it builds it and sends it to any contact. No laptop needed. No other browser AI can do this.',
    status: 'Only Lyto',
    tags: ['WhatsApp', 'Telegram', 'PDF generation', 'Mobile-first'],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: 'Stop re-explaining yourself',
    description:
      'Lyto remembers your full context across tabs and tools. No more copy-pasting into ChatGPT every time you switch tasks. It knows where you left off.',
    tags: ['Context memory', 'Cross-tab', 'Workflow continuity'],
  },
  {
    title: 'Your personal tutor, right next to your work',
    description:
      "Studying for the SAT or any exam? Lyto sits beside what you're reading, highlights answers, and gives you a personal explanation on the spot.",
    tags: ['Students', 'SAT prep', 'Real-time explanation'],
  },
  {
    title: 'Reports and spreadsheets on command',
    description:
      'Drop in raw data and get a full Google Sheets table with graphs. Ask for a research summary and get a clean Google Doc. Hours of busywork, automated.',
    tags: ['Google Sheets', 'Google Docs', 'Data viz', 'Reports'],
    colSpan: 2,
  },
  {
    title: "Plug it into your team's workflow",
    description:
      'Hand Lyto a repetitive business process and it runs it. From customer ops to internal coordination, it becomes part of how your company operates.',
    tags: ['B2B', 'Workflow automation', 'Teams'],
  },
  {
    title: 'Research anything, instantly',
    description:
      'Ask Lyto to research a topic, pull info from sites, or find the cheapest flight — and get the answer straight in your chat. Real research, not just a Google search.',
    tags: ['Deep research', 'Web parsing', 'Data fetching'],
  },
  {
    title: 'Dev and design, handled',
    description:
      'Connect GitHub and Lyto reviews your codebase for errors. Connect Figma and it finds designs matching your prompt. Slack keeps your team in sync, automatically.',
    tags: ['GitHub', 'Figma', 'Slack', 'Dev workflows'],
  },
  {
    title: 'Start every morning organised',
    description:
      "Lyto sends you a daily agenda at the same time each morning — your schedule, priorities, and reminders — so you never open your laptop wondering what to do first.",
    tags: ['Google Calendar', 'Daily digest', 'Routine'],
    colSpan: 2,
  },
];

const FeaturesSection = () => {
  return (
    <section id="use-cases" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            use cases
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <BentoGrid items={BENTO_ITEMS} />
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
