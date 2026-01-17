import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: 'How does Lyto work?',
      answer: 'Lyto indexes all your open browser tabs in real-time and uses AI to understand the content. When you ask a question, it searches across all tabs semantically — understanding meaning, not just keywords — and navigates you directly to the relevant section.',
    },
    {
      question: 'Is my data private?',
      answer: 'Absolutely. Lyto processes everything locally in your browser. Your browsing data, tab contents, and search queries never leave your device. We don\'t collect, store, or have access to any of your personal information.',
    },
    {
      question: 'Which browsers are supported?',
      answer: 'Lyto currently supports Google Chrome. We\'re working on adding support for more browsers — stay tuned!',
    },
    {
      question: 'Can Lyto help me find products or compare prices?',
      answer: 'Yes! If you have multiple marketplace tabs open, just ask Lyto to "find the cheapest option" or "show me items under $50" and it will scan all your open tabs to find exactly what you\'re looking for.',
    },
    {
      question: 'How many tabs can Lyto handle?',
      answer: 'The free plan supports up to 10 tabs. Pro users can analyze up to 100 tabs, and Team/Enterprise plans support unlimited tabs. Lyto is optimized for performance even with hundreds of tabs open.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'You can start using Lyto immediately without an account on the free plan. Creating an account unlocks additional features, syncs your preferences, and enables access to premium plans.',
    },
  ];

  return (
    <section id="faq" className="py-32 px-6 border-t border-border">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 leading-[1.1]">
            Common
            <br />
            <span className="italic text-gradient">questions</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            Everything you need to know about Lyto.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact prompt */}
        <p className="text-center text-sm text-muted-foreground mt-12">
          Still have questions?{' '}
          <a href="mailto:arystan909@yahoo.com" className="text-primary hover:underline">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;