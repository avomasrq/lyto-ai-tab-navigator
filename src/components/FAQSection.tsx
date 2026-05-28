import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const FAQS = [
  {
    question: 'What can Lyto actually do?',
    answer: 'A lot. Lyto can open and close tabs, scroll, click, fill forms, highlight text, and interact with every element on any webpage. It runs deep research with cited sources, builds mind maps, and generates full websites from a prompt. It integrates with Gmail, Google Docs, Google Sheets, Telegram, WhatsApp, GitHub, Slack, and Figma — so it can send messages, draft documents, create charts, file issues, notify teammates, and push everything to the right place without you lifting a finger.',
  },
  {
    question: 'Does Lyto work with Telegram and WhatsApp?',
    answer: 'Yes. Lyto connects directly to both. On Telegram, it can send messages, run automations inside a VM environment, and analyze any image or photo you share with it. On WhatsApp, it can message any contact or broadcast to multiple contacts at once — and it can attach Word documents with graphs and structured data it generates on the fly.',
  },
  {
    question: 'Does Lyto integrate with GitHub, Slack, and Figma?',
    answer: 'Yes. With GitHub, Lyto can open issues, summarize pull requests, browse repos, and help you track changes without leaving your browser. With Slack, it can send messages, post to channels, and notify your team automatically as part of any workflow. With Figma, it can open designs, extract details, and pull specs directly into your work — no copy-pasting between tabs.',
  },
  {
    question: 'Can Lyto build websites and mind maps?',
    answer: 'Yes. Tell Lyto what you need and it will generate a complete website — structure, content, and styling — ready to preview or export. For brainstorming and planning, Lyto can produce visual mind maps that organize your ideas into a clear, shareable structure.',
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. Lyto processes everything locally inside your browser. Your tab content, browsing activity, and messages never leave your device or get stored on our servers. We have no access to your personal data — full stop.',
  },
  {
    question: 'Can Lyto compare products or prices across tabs?',
    answer: 'Yes. Open several marketplace or product tabs and ask Lyto to find the best deal, filter by price, or summarize the differences. It scans all your open tabs simultaneously and surfaces exactly what you\'re looking for.',
  },
  {
    question: 'Which browsers does Lyto support?',
    answer: 'Lyto currently works on Google Chrome. Support for additional browsers is on the roadmap.',
  },
  {
    question: 'Do I need an account to get started?',
    answer: 'You need a Google account to use Lyto — sign in takes one click and no extra setup. Once connected, you\'re on the free plan immediately. Upgrading to Pro unlocks unlimited requests and full access to all integrations.',
  },
  {
    question: 'What is the free plan limit?',
    answer: 'The free plan includes 50 requests per week, resetting every Monday. Upgrade to Pro for $15/mo (or $12/mo billed annually) for unlimited requests, deeper research, and full access to all integrations — with a 7-day free trial, no credit card required.',
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
