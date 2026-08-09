import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import { SvgTextDraw } from '@/components/ui/text-svg-text-draw';

/* Compact static chat snippet — same bubble language as the /cli page's
   PhoneChat, scaled down and non-animated. Proves the "background" claim:
   you send it a task and walk away, it hands back the finished result. */
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
    glyph: '∞',
    title: 'Your agent, working in real time and in the background',
    description:
      'Argos does not wait to be asked. It takes on the complex, overwhelming parts of your work right now while you watch, or quietly in the background while you are somewhere else, then hands you the finished result.',
    status: 'Core to Argos',
    tags: ['Real-time', 'Background tasks', 'Always on'],
    colSpan: 3,
    hasPersistentHover: true,
    visual: <ChatSnippet />,
  },
  {
    glyph: '>_',
    title: 'It also runs on your own computer',
    description:
      'The Argos CLI puts the same agent on your desktop, with real shell access and your real, logged-in browser. Text it from Telegram, from anywhere.',
    tags: ['Desktop agent', 'Shell access', 'Telegram'],
    href: '/cli',
    cta: 'See the CLI →',
  },
  {
    glyph: '◎',
    title: 'Full control over the page, not just a chat window',
    description:
      'Argos opens tabs, scrolls, clicks, fills out forms, and interacts with every element on any page, exactly like you would, just faster.',
    tags: ['Any website', 'Form filling', 'Full browser control'],
  },
  {
    glyph: '▤',
    title: 'Native inside Gmail, Docs, and Sheets',
    description:
      'Draft and send real emails, write full documents, and turn raw data into spreadsheets with charts, all inside your actual Google account.',
    tags: ['Gmail', 'Google Docs', 'Google Sheets'],
  },
];

const FeaturesSection = () => {
  return (
    <section id="use-cases" className="py-14 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        <FadeIn className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <p className="sr-only">Use cases</p>
          <SvgTextDraw aria-hidden speed={1.6} className="h-5 w-auto mx-auto mb-5 text-primary">
            use cases
          </SvgTextDraw>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric leading-tight">
            what it actually does
          </h2>
          <p className="mt-4 text-muted-foreground text-base leading-relaxed">
            The four things Argos is built around.
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
