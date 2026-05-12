import { FadeIn } from '@/components/ui/fade-in';

const FEATURES = [
  {
    label: 'Browser control',
    heading: 'Your AI that actually uses Chrome',
    body: 'Lyto doesn\'t just suggest — it acts. It opens tabs, scrolls pages, clicks buttons, fills forms, and navigates the web exactly like a human would, all from a single instruction.',
    bullets: [
      'Open, close & switch between tabs',
      'Click, scroll & fill any form',
      'Works on every website',
    ],
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden p-4">
        <div className="text-xs text-muted-foreground mb-3 font-mono">lyto is working...</div>
        <div className="space-y-2">
          {[
            { icon: '🔍', text: 'Opening Google search…', done: true },
            { icon: '📋', text: 'Filling in your query…', done: true },
            { icon: '↩️', text: 'Pressing Enter…', done: true },
            { icon: '📄', text: 'Reading top 3 results…', done: false },
          ].map((step, i) => (
            <div key={i} className={`flex items-center gap-2.5 text-sm ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>
              <span className="text-base leading-none">{step.icon}</span>
              <span>{step.text}</span>
              {step.done && <span className="ml-auto text-primary text-xs">✓</span>}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
          4 actions completed · 0.8s
        </div>
      </div>
    ),
  },
  {
    label: 'Native integrations',
    heading: 'Works inside the tools you already use',
    body: 'No copy-pasting between apps. Lyto reads and writes directly inside Gmail, Google Docs, Sheets, Slack, and GitHub — understanding context and taking action without you leaving the page.',
    bullets: [
      'Reply to emails with one prompt',
      'Edit Docs & Sheets by description',
      'Summarise Slack threads instantly',
    ],
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden p-5">
        <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">Works with</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { src: '/gmaillogo.webp', label: 'Gmail' },
            { src: '/googledocs.png', label: 'Docs' },
            { src: '/googlesheets.png', label: 'Sheets' },
            { src: '/googlecalendar.png', label: 'Calendar' },
            { src: '/slack.png', label: 'Slack' },
            { src: '/github.png', label: 'GitHub' },
            { src: '/whatsapp.png', label: 'WhatsApp' },
          ].map(({ src, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-center p-1.5">
                <img src={src} alt={label} className="w-full h-full object-contain" />
              </div>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Deep research',
    heading: 'Research that takes seconds, not hours',
    body: 'Ask Lyto to research any topic and it searches the web, reads through sources, and returns a structured report — with citations, comparisons, and key takeaways — right inside your browser.',
    bullets: [
      'Search & synthesise multiple sources',
      'Compare products, prices & data',
      'Cite sources automatically',
    ],
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden p-4">
        <div className="text-xs text-muted-foreground mb-3">Research summary</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-medium text-foreground mb-1">Key finding</div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              Based on 6 sources, the top option is 34% cheaper with better reviews across all categories.
            </div>
          </div>
          <div className="border-t border-border/40 pt-3">
            <div className="text-xs font-medium text-foreground mb-1.5">Sources</div>
            <div className="space-y-1">
              {['techcrunch.com', 'reddit.com/r/…', 'g2.com'].map(src => (
                <div key={src} className="flex items-center gap-1.5 text-xs text-primary">
                  <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                  {src}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: 'Privacy-first',
    heading: 'Everything stays in your browser',
    body: 'Lyto runs entirely inside Chrome. Your browsing data, tab contents, messages, and credentials never leave your device. No cloud processing, no data collection — just local AI that you fully control.',
    bullets: [
      'Zero data sent to external servers',
      'Works fully offline',
      'Open, auditable extension code',
    ],
    visual: (
      <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden p-5 flex flex-col items-center justify-center gap-4 min-h-[160px]">
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Your data stays yours</p>
          <p className="text-xs text-muted-foreground mt-1">Processed locally · Never uploaded</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-lg px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-medium">Local processing active</span>
        </div>
      </div>
    ),
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 sm:py-28 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-20 sm:mb-28">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-4 leading-tight">
            Built for how you
            <br />
            <span className="italic text-gradient">actually work</span>
          </h2>
          <p className="text-muted-foreground mt-5 text-sm sm:text-base leading-relaxed">
            Lyto isn't a chatbot you switch to. It lives in your browser, works with your tools, and handles tasks while you focus on what matters.
          </p>
        </FadeIn>

        {/* Alternating feature blocks */}
        <div className="space-y-24 sm:space-y-32">
          {FEATURES.map((feature, i) => {
            const isEven = i % 2 === 0;
            return (
              <FadeIn key={feature.label} direction={isEven ? 'right' : 'left'}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${isEven ? '' : 'md:[&>*:first-child]:order-last'}`}>
                  {/* Text */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground/50 tabular-nums w-5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                        {feature.label}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif leading-snug">
                      {feature.heading}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {feature.body}
                    </p>
                    <ul className="space-y-2.5 mt-1">
                      {feature.bullets.map(b => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="w-full">
                    {feature.visual}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
