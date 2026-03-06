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
      answer: 'Lyto is an AI assistant that lives directly in your browser. It understands the context of the page you\'re on and can interact with it in real time. You can ask Lyto to research topics, open and organize tabs, scroll pages, highlight elements, and analyze information without leaving your workflow. It works like a conversational assistant where you simply describe what you want and Lyto performs the actions for you.',
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
      answer: 'You can use Lyto for many tasks, including: researching topics, organizing and managing tabs, analyzing information on webpages, highlighting and extracting important content, and automating repetitive browsing actions.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'You can start using Lyto immediately without an account on the free plan. Creating an account unlocks additional features, syncs your preferences, and enables access to premium plans.',
    },
  ];

  return (
    <section id="faq" className="py-32 px-6 border-t border-border dither-overlay">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[8px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
            FAQ
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-serif mt-4 leading-[1.5]">
            Common
            <br />
            <span className="italic text-gradient">questions</span>
          </h2>
          <p className="text-muted-foreground mt-6 text-xs sm:text-sm">
            Everything you need to know about Lyto.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-2xl 2xl:max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors dither-card"
              >
                <AccordionTrigger className="text-left text-xs sm:text-sm font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5 text-xs sm:text-sm">
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