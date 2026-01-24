import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageCircle, ArrowRight } from 'lucide-react';

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const faqs = [
    {
      question: 'How does Lyto work?',
      answer: 'Lyto indexes all your open browser tabs in real-time and uses AI to understand the content. When you ask a question, it searches across all tabs semantically—understanding meaning, not just keywords—and navigates you directly to the relevant section.',
    },
    {
      question: 'Is my data private?',
      answer: "Absolutely. Lyto processes everything locally in your browser. Your browsing data, tab contents, and search queries never leave your device. We don't collect, store, or have access to any of your personal information.",
    },
    {
      question: 'Which browsers are supported?',
      answer: "Lyto currently supports Google Chrome. We're working on adding support for more browsers—stay tuned!",
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
    },
  };

  return (
    <section id="faq" className="section-padding px-6 relative" ref={ref}>
      {/* Section divider */}
      <div className="section-divider mb-20 lg:mb-28" />
      
      <div className="container mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-label">FAQ</span>
            <h2 className="text-headline font-serif mt-4">
              Common
              <br />
              <em className="not-italic text-gradient">questions</em>
            </h2>
          </motion.div>
          <motion.div 
            className="lg:pt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-body-lg max-w-md">
              Everything you need to know about Lyto. 
              Can't find what you're looking for? Reach out.
            </p>
          </motion.div>
        </div>

        {/* FAQ Accordion */}
        <motion.div 
          className="max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem 
                  value={`item-${index}`}
                  className="surface-interactive rounded-xl px-6 data-[state=open]:border-primary/30 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5 [&[data-state=open]>svg]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact prompt */}
        <motion.div 
          className="mt-16 max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="surface-interactive rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
            <motion.div 
              className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <MessageCircle className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="flex-1">
              <h4 className="font-medium mb-1">Still have questions?</h4>
              <p className="text-sm text-muted-foreground">
                Our team is here to help. Get in touch and we'll respond as soon as possible.
              </p>
            </div>
            <a 
              href="mailto:arystan909@yahoo.com" 
              className="text-sm font-medium text-primary hover:text-primary/80 flex-shrink-0 flex items-center gap-1.5 group/link"
            >
              Contact us
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
