import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';

const BENTO_ITEMS: BentoItem[] = [
  {
    title: 'Text it from your phone, get a finished file back',
    description:
      "Message Argos on WhatsApp or Telegram. Ask for a report, a chart, a summary — it makes it and sends it back. You don't even need your laptop open.",
    status: 'Only Argos',
    tags: ['WhatsApp', 'Telegram', 'PDF generation', 'Mobile-first'],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "It remembers what you're working on",
    description:
      'No more repeating yourself every time you open a new tab. Argos keeps track of what you\'re doing and picks up right where you left off.',
    tags: ['Remembers context', 'Works across tabs', 'No repeating yourself'],
  },
  {
    title: 'A tutor that sits right next to your homework',
    description:
      "Studying for an exam? Argos reads along with you, explains the hard parts, and points out the answer — right there on the page.",
    tags: ['Students', 'SAT prep', 'Real-time explanation'],
  },
  {
    title: 'Turns raw data into reports, instantly',
    description:
      'Give it messy data and get back a clean spreadsheet with charts. Ask for a summary and get a polished document. No more hours of manual work.',
    tags: ['Google Sheets', 'Google Docs', 'Data viz', 'Reports'],
    colSpan: 2,
  },
  {
    title: 'Give your team an extra pair of hands',
    description:
      'Show Argos a task your team repeats every day and it takes over. It becomes part of how your business runs — without hiring anyone new.',
    tags: ['B2B', 'Workflow automation', 'Teams'],
  },
  {
    title: 'Ask anything, get real answers',
    description:
      'Argos searches the web, reads the pages, and brings back the actual answer — like finding the cheapest flight — not just a list of links.',
    tags: ['Deep research', 'Web parsing', 'Data fetching'],
  },
  {
    title: 'Keeps your dev and design tools in sync',
    description:
      "Connect GitHub and it checks your code for problems. Connect Figma and it finds the design you're picturing. Connect Slack and your team never misses an update.",
    tags: ['GitHub', 'Figma', 'Slack', 'Dev workflows'],
  },
  {
    title: 'Start every morning already organized',
    description:
      "Every morning, Argos sends you a short summary — what's on your schedule, what needs attention, what can wait. You know exactly where to start.",
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
            what it actually does
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
