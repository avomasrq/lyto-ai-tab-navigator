import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
import {
  Globe,
  Search,
  Activity,
  Chrome,
  ShieldCheck,
  Zap,
  FileText,
  MousePointer2,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Globe,
    name: 'Full browser control',
    description: 'Opens tabs, scrolls pages, clicks elements, and fills forms on any website — exactly like a human would.',
  },
  {
    icon: MousePointer2,
    name: 'DOM interaction',
    description: 'Reads and interacts with every DOM element on the page, including dynamically loaded content.',
  },
  {
    icon: Zap,
    name: 'Native integrations',
    description: 'Works seamlessly inside Gmail, Google Docs, Sheets, Slack, GitHub, and WhatsApp without extra setup.',
  },
  {
    icon: Search,
    name: 'Deep research',
    description: 'Scans your open tabs, searches the web, and compiles structured reports with cited sources in seconds.',
  },
  {
    icon: FileText,
    name: 'Document automation',
    description: 'Drafts emails, fills in spreadsheets, and edits documents based on plain-language instructions.',
  },
  {
    icon: Activity,
    name: 'Live task tracking',
    description: 'Every action Lyto takes is logged and shown in real time so you always know what\'s happening.',
  },
  {
    icon: ShieldCheck,
    name: 'Local-first privacy',
    description: 'Everything runs inside your browser. No browsing data, messages, or credentials ever leave your device.',
  },
  {
    icon: Chrome,
    name: 'One-click install',
    description: 'Add to Chrome from the Web Store in seconds — no accounts, no configuration, no friction.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <FadeInStagger className="mb-16">
          <FadeInItem>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif mt-4 leading-snug">
              Everything runs
              <br />
              <span className="italic text-gradient">inside Chrome</span>
            </h2>
          </FadeInItem>
        </FadeInStagger>

        {/* Feature list */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const isLastRow = i >= FEATURES.length - 2;
              const isOdd = i % 2 === 1;
              return (
                <div
                  key={feature.name}
                  className={[
                    'flex items-start gap-4 py-6 px-2',
                    'border-t border-border',
                    isOdd ? 'sm:pl-10 sm:border-l' : '',
                    isLastRow ? '' : '',
                  ].join(' ')}
                >
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg border border-border bg-muted/40 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">{feature.name}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom border */}
          <div className="border-t border-border" />
        </FadeIn>

      </div>
    </section>
  );
};

export default FeaturesSection;
