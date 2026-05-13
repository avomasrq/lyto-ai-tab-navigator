import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';

const BENTO_ITEMS: BentoItem[] = [
  {
    title: 'Full browser control',
    description:
      'Opens tabs, clicks elements, scrolls pages, and fills forms on any website — exactly like a human would, from a single prompt.',
    status: 'Core',
    tags: ['Tabs', 'Clicks', 'Forms'],
    cta: 'Learn more →',
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: 'Native integrations',
    description:
      'Works inside Gmail, Docs, Sheets, Slack, and GitHub — no copy-pasting required.',
    status: '7 apps',
    tags: ['Gmail', 'Slack', 'GitHub'],
    cta: 'See all →',
  },
  {
    title: 'Deep research',
    description:
      'Scans open tabs and the web, then returns a structured report with cited sources in seconds.',
    status: 'AI',
    tags: ['Search', 'Sources', 'Reports'],
    cta: 'Try it →',
  },
  {
    title: 'Document automation',
    description:
      'Drafts emails, fills spreadsheets, and edits documents based on plain-language instructions.',
    tags: ['Drafts', 'Edits', 'Auto-fill'],
    colSpan: 2,
  },
  {
    title: 'Local-first privacy',
    description:
      'Everything runs inside your browser. No browsing data or credentials ever leave your device.',
    status: 'Private',
    tags: ['Local', 'Zero upload'],
  },
  {
    title: 'Live task tracking',
    description:
      "Every action Lyto takes is logged and shown in real time so you always know what's happening.",
    status: 'Live',
    tags: ['Logs', 'Real-time'],
  },
  {
    title: 'One-click install',
    description:
      'Add to Chrome from the Web Store in seconds — no accounts, no configuration, no friction.',
    meta: 'Chrome Web Store',
    tags: ['Free plan', 'Instant'],
    cta: 'Install →',
  },
  {
    title: 'Works on any website',
    description:
      'Reads and interacts with every DOM element on the page, including dynamically loaded content.',
    status: 'Universal',
    tags: ['DOM', 'Dynamic pages'],
    colSpan: 2,
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

        <FadeIn delay={0.1}>
          <BentoGrid items={BENTO_ITEMS} />
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
