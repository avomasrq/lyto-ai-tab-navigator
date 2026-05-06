import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FadeIn } from '@/components/ui/fade-in';
import { GlassFilter } from '@/components/ui/liquid-glass-button';

const FAQSection = () => {
  const faqs = [
    {
      question: 'How does Lyto work?',
      answer: 'Lyto is a Chrome extension that gives you full control over your browser. It can open and close tabs, scroll, click, highlight, fill forms, and interact with every DOM element on any webpage. It integrates natively with Google Docs, Gmail, and Google Sheets to make your workflow smoother and faster. Need to research anything? Lyto finds sources, compares data, and presents results with graphs and structured visuals in one click. Everything runs directly inside Chrome, connecting your favorite tools and keeping your tabs, tasks, and workflow organized in one place.',
    },
    {
      question: 'Is my data private?',
      answer: 'Absolutely. Lyto processes everything locally in your browser. Your browsing data, tab contents, and search queries never leave your device. We don\'t collect, store, or have access to any of your personal information.',
    },
    {
      question: 'Which browsers are supported?',
      answer: 'Lyto currently supports Google Chrome. We\'re working on adding support for more browsers - stay tuned!',
    },
    {
      question: 'Can Lyto help me find products or compare prices?',
      answer: 'Yes! If you have multiple marketplace tabs open, just ask Lyto to "find the cheapest option" or "show me items under $50" and it will scan all your open tabs to find exactly what you\'re looking for.',
    },
    {
      question: 'What can I use Lyto for?',
      answer: 'You can use Lyto for many tasks, including: full browser control (opening/closing tabs, scrolling, clicking, highlighting, filling forms), working natively with Google Docs, Gmail, and Google Sheets, researching topics with sources and visual data comparisons, and automating repetitive browser tasks like form filling, sales outreach, and working through question banks.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'You can start using Lyto immediately without an account on the free plan. Creating an account unlocks additional features, syncs your preferences, and enables access to premium plans.',
    },
  ];

  return (
    <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto">
        {/* Header */}
        <FadeIn className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-serif mt-4 leading-[1.5]">
            Common
            <br />
            <span className="italic text-gradient">questions</span>
          </h2>
          <p className="text-muted-foreground mt-4 sm:mt-6 text-sm sm:text-base">
            Everything you need to know about Lyto.
          </p>
        </FadeIn>

        {/* FAQ Accordion */}
        <GlassFilter id="faq-glass-filter" />
        <FadeIn delay={0.1} className="max-w-2xl 2xl:max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="relative">
                {/* Glass inset-shadow surface */}
                <div className="pointer-events-none absolute inset-0 z-0 rounded-xl
                  shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]
                  dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
                />
                {/* SVG-distorted backdrop blur */}
                <div
                  className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-xl"
                  style={{ backdropFilter: 'url("#faq-glass-filter")' }}
                />
                <AccordionItem
                  value={`item-${index}`}
                  className="relative z-10 bg-transparent border-none rounded-xl px-4 sm:px-6"
                >
                  <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline py-4 sm:py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-5 text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </FadeIn>

        {/* Contact prompt */}
        <p className="text-center text-sm sm:text-base text-muted-foreground mt-8 sm:mt-12">
          Still have questions?{' '}
          <a href="mailto:info@trylyto.com" className="text-primary hover:underline">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
