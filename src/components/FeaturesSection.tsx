import { FadeIn } from '@/components/ui/fade-in';
import { BentoGrid, type BentoItem } from '@/components/ui/bento-grid';
import {
  MousePointerClick,
  Layers,
  SearchCode,
  FileText,
  ShieldCheck,
  Zap,
  Activity,
  Chrome,
} from 'lucide-react';

const BENTO_ITEMS: BentoItem[] = [
  {
    title: 'Full browser control',
    description:
      'Opens tabs, clicks elements, scrolls pages, and fills forms on any website — exactly like a human would, from a single prompt.',
    icon: <MousePointerClick className="w-4 h-4 text-primary" />,
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
    icon: <Layers className="w-4 h-4 text-primary" />,
    status: '7 apps',
    tags: ['Gmail', 'Slack', 'GitHub'],
    cta: 'See all →',
  },
  {
    title: 'Deep research',
    description:
      'Scans open tabs and the web, then returns a structured report with cited sources in seconds.',
    icon: <SearchCode className="w-4 h-4 text-primary" />,
    status: 'AI',
    tags: ['Search', 'Sources', 'Reports'],
    cta: 'Try it →',
  },
  {
    title: 'Document automation',
    description:
      'Drafts emails, fills spreadsheets, and edits documents based on plain-language instructions.',
    icon: <FileText className="w-4 h-4 text-primary" />,
    tags: ['Drafts', 'Edits', 'Auto-fill'],
    colSpan: 2,
  },
  {
    title: 'Local-first privacy',
    description:
      'Everything runs inside your browser. No browsing data or credentials ever leave your device.',
    icon: <ShieldCheck className="w-4 h-4 text-primary" />,
    status: 'Private',
    tags: ['Local', 'Zero upload'],
  },
  {
    title: 'Live task tracking',
    description:
      'Every action Lyto takes is logged and shown in real time so you always know what\'s happening.',
    icon: <Activity className="w-4 h-4 text-primary" />,
    status: 'Live',
    tags: ['Logs', 'Real-time'],
  },
  {
    title: 'One-click install',
    description:
      'Add to Chrome from the Web Store in seconds — no accounts, no configuration, no friction.',
    icon: <Chrome className="w-4 h-4 text-primary" />,
    meta: 'Chrome Web Store',
    tags: ['Free plan', 'Instant'],
    cta: 'Install →',
  },
  {
    title: 'Works on any website',
    description:
      'Reads and interacts with every DOM element on the page, including dynamically loaded content.',
    icon: <Zap className="w-4 h-4 text-primary" />,
    status: 'Universal',
    tags: ['DOM', 'Dynamic pages'],
    colSpan: 2,
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-4 leading-tight">
            Built for how you
            <br />
            <span className="italic text-gradient">actually work</span>
          </h2>
          <p className="text-muted-foreground mt-5 text-sm sm:text-base leading-relaxed">
            Lyto lives in your browser, works with your tools, and handles tasks while you focus on what matters.
          </p>
        </FadeIn>

        {/* Bento grid */}
        <FadeIn delay={0.1}>
          <BentoGrid items={BENTO_ITEMS} />
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
