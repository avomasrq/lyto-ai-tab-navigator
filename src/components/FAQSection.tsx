import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const FAQS = [
  {
    question: 'How does Lyto work?',
    answer: 'Lyto is a Chrome extension that gives you full control over your browser. It can open and close tabs, scroll, click, highlight, fill forms, and interact with every DOM element on any webpage. It integrates natively with Google Docs, Gmail, and Google Sheets — and can research topics, compare data, and present results with graphs and structured visuals in one click.',
  },
  {
    question: 'Is my data private?',
    answer: 'Absolutely. Lyto processes everything locally in your browser. Your browsing data, tab contents, and search queries never leave your device. We don\'t collect, store, or have access to any of your personal information.',
  },
  {
    question: 'Which browsers are supported?',
    answer: 'Lyto currently supports Google Chrome. Support for more browsers is on the roadmap — stay tuned.',
  },
  {
    question: 'Can Lyto help me compare products or prices?',
    answer: 'Yes. If you have multiple marketplace tabs open, just ask Lyto to find the cheapest option or show items under a certain price — it scans all your open tabs and surfaces exactly what you\'re looking for.',
  },
  {
    question: 'What can I use Lyto for?',
    answer: 'Browser automation, deep research with cited sources, writing and sending emails via Gmail, editing Google Docs, filling forms, sales outreach, tab management, page monitoring — and a lot more. If it happens in a browser, Lyto can help.',
  },
  {
    question: 'Do I need an account to get started?',
    answer: 'No. Install the extension and start using Lyto immediately on the free plan. Creating an account unlocks synced preferences and access to Pro features.',
  },
  {
    question: 'What is the free plan limit?',
    answer: 'The free plan includes 50 requests per week. Once you hit the limit, you can upgrade to Pro for unlimited requests — or wait for your weekly limit to reset.',
  },
];

function FAQItem({ question, answer, index, isOpen, onToggle }: {
  question: string;
  answer: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border/50">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-5 py-6 text-left group"
      >
        {/* Number */}
        <span className="text-xs text-muted-foreground/40 font-mono mt-1 w-5 shrink-0 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Question */}
        <span className="flex-1 text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200">
          {question}
        </span>

        {/* Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="shrink-0 mt-0.5"
        >
          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <p className="pl-10 pb-6 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-3xl">
        <FadeIn className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight">
            Got{' '}
            <span className="italic text-gradient">questions?</span>
          </h2>
        </FadeIn>
        <FadeIn className="border-t border-border/50">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              index={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </FadeIn>
        <p className="text-center text-sm text-muted-foreground mt-8">
          Still have questions?{' '}
          <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
