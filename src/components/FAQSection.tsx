import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { MeanderBand } from '@/components/ui/greek-tablet';

const FAQS = [
  {
    question: 'What is Argos, exactly?',
    answer: 'Argos is an AI assistant that lives in your browser and actually does things for you — clicking buttons, filling out forms, sending messages, and finishing tasks — instead of just chatting and leaving the work to you.',
  },
  {
    question: 'What can Argos actually do?',
    answer: "Almost anything you'd normally do by hand in your browser. It can fill out forms, research a topic and summarize it, write and send messages, build a spreadsheet or document, and work with tools like Gmail, Google Docs, Slack, and GitHub — all without you lifting a finger.",
  },
  {
    question: 'Does Argos work with Telegram and WhatsApp?',
    answer: 'Yes. Text Argos on Telegram or WhatsApp like you would a person, and it gets to work — even sending files like PDFs and spreadsheets straight to your chat.',
  },
  {
    question: 'Does Argos integrate with GitHub and Slack?',
    answer: 'Yes. It can check your code on GitHub and post updates in Slack — all without you switching tabs.',
  },
  {
    question: 'Can Argos build websites and mind maps?',
    answer: 'Yes. Describe what you need and Argos builds a full website for you, ready to use. It can also turn your ideas into a clear visual mind map.',
  },
  {
    question: 'Is my data private?',
    answer: 'Yes. Argos runs inside your own browser. Your tabs, activity, and messages never leave your device or get stored on our servers. We simply don\'t have access to it.',
  },
  {
    question: 'Can Argos compare products or prices across tabs?',
    answer: "Yes. Open a few tabs of the same product on different sites, and ask Argos which one's the best deal. It checks all of them at once and tells you.",
  },
  {
    question: 'Which browsers does Argos support?',
    answer: 'Google Chrome, for now. More browsers are on the way.',
  },
  {
    question: 'Do I need an account to get started?',
    answer: 'Just a Google account — sign in takes one click. You can try Argos for free, then upgrade to Pro whenever you\'re ready for more.',
  },
  {
    question: 'How do I cancel or manage my subscription?',
    answer: 'You\'ll get an email as soon as you subscribe with a direct link to manage, pause, or cancel your plan any time — no need to contact anyone.',
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
    <div className="border-b border-[#a8946e]/25">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 sm:gap-5 py-6 text-left group"
      >
        {/* Number */}
        <span className="text-xs text-primary/50 font-mono mt-1 w-5 shrink-0 select-none">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Question */}
        {/* min-w-0: a flex item defaults to min-width:auto and refuses to shrink below
            its content, which pushed the row a few px past the button on narrow screens. */}
        <span className="min-w-0 flex-1 text-base sm:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200">
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
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-medium mb-3">
            faq
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-geometric leading-tight">
            Got{' '}
            <span className="italic text-gradient">questions?</span>
          </h2>
        </FadeIn>
        <FadeIn>
          <MeanderBand className="mb-1 opacity-40" color="#8a6d3b" />
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
          <MeanderBand flip className="mt-1 opacity-40" color="#8a6d3b" />
        </FadeIn>
        <p className="text-center text-sm text-muted-foreground mt-8">
          Still have questions?{' '}
          <a href="mailto:info@tryargos.cc" className="text-primary hover:underline underline-offset-4">
            Get in touch
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
