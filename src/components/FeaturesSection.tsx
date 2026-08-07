import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';

/* Compact static chat snippet for the flagship card — same bubble language
   as the /cli page's PhoneChat, scaled down and non-animated for a bento card. */
const ChatSnippet = () => (
  <div className="w-full sm:w-[210px] shrink-0 space-y-2">
    <div className="ml-auto max-w-[88%] rounded-[16px] rounded-br-[6px] bg-foreground px-3.5 py-2 text-[12px] leading-snug text-background shadow-sm">
      Turn my Q2 sales into a PDF report
    </div>
    <div className="flex items-center gap-2.5 max-w-[92%] rounded-[16px] rounded-bl-[6px] border border-border bg-background px-3 py-2.5 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-[8.5px] font-bold text-primary">
        PDF
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11.5px] font-semibold text-foreground">report.pdf</p>
        <p className="text-[10px] text-muted-foreground">1.2 MB</p>
      </div>
    </div>
  </div>
);

const BENTO_ITEMS: BentoItem[] = [
  {
    glyph: '⇄',
    title: 'Text it from your phone, get a finished file back',
    description:
      "Message Argos on WhatsApp or Telegram. Ask for a report, a chart, a summary — it makes it and sends it back. You don't even need your laptop open.",
    status: 'Only Argos',
    tags: ['WhatsApp', 'Telegram', 'PDF generation', 'Mobile-first'],
    colSpan: 2,
    hasPersistentHover: true,
    visual: <ChatSnippet />,
  },
  {
    glyph: '↺',
    title: "It remembers what you're working on",
    description:
      'No more repeating yourself every time you open a new tab. Argos keeps track of what you\'re doing and picks up right where you left off.',
    tags: ['Remembers context', 'Works across tabs', 'No repeating yourself'],
  },
  {
    glyph: '✎',
    title: 'A tutor that sits right next to your homework',
    description:
      "Studying for an exam? Argos reads along with you, explains the hard parts, and points out the answer — right there on the page.",
    tags: ['Students', 'SAT prep', 'Real-time explanation'],
  },
  {
    glyph: '▤',
    title: 'Turns raw data into reports, instantly',
    description:
      'Give it messy data and get back a clean spreadsheet with charts. Ask for a summary and get a polished document. No more hours of manual work.',
    tags: ['Google Sheets', 'Google Docs', 'Data viz', 'Reports'],
    colSpan: 2,
  },
  {
    glyph: '⌁',
    title: 'Give your team an extra pair of hands',
    description:
      'Show Argos a task your team repeats every day and it takes over. It becomes part of how your business runs — without hiring anyone new.',
    tags: ['B2B', 'Workflow automation', 'Teams'],
  },
  {
    glyph: '⌕',
    title: 'Ask anything, get real answers',
    description:
      'Argos searches the web, reads the pages, and brings back the actual answer — like finding the cheapest flight — not just a list of links.',
    tags: ['Deep research', 'Web parsing', 'Data fetching'],
  },
  {
    glyph: '◈',
    title: 'Keeps your dev and design tools in sync',
    description:
      "Connect GitHub and it checks your code for problems. Connect Figma and it finds the design you're picturing. Connect Slack and your team never misses an update.",
    tags: ['GitHub', 'Figma', 'Slack', 'Dev workflows'],
  },
  {
    glyph: '◐',
    title: 'Start every morning already organized',
    description:
      "Every morning, Argos sends you a short summary — what's on your schedule, what needs attention, what can wait. You know exactly where to start.",
    tags: ['Google Calendar', 'Daily digest', 'Routine'],
    colSpan: 3,
  },
];

const FeaturesSection = () => {
  return (
    <section id="use-cases" className="py-14 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-4">
            Use cases
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
            what it actually does
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            Real things people ask Argos to do, every single day.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <BentoGrid items={BENTO_ITEMS} />
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
