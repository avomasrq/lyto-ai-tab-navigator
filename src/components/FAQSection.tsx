import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';
import { MeanderBand } from '@/components/ui/greek-tablet';

/**
 * Order is by what actually loses people, not by what is nice to lead with.
 *
 * The browser question was eighth of ten while two people in a single day were
 * lost to exactly it — Opera and Zen, both silent. It is now first.
 *
 * "What is Argos, exactly?" is gone: five of eleven could not answer it after
 * visiting, which means it has to be answered on the first screen, not buried at
 * position one of an accordion nobody opened.
 *
 * The privacy answer used to say tabs and messages "never leave your device".
 * That was false — page context is sent to the model to be worked on, and the
 * Chrome Web Store listing declares it. What IS true is narrower and better: the
 * agent refuses to read or type into password and card fields at all.
 */
const FAQS = [
  {
    question: 'Which browsers does Argos support?',
    answer: 'The panel is built on Chrome\'s side panel API, so it runs in Chrome on a computer, and, being Chromium, in Edge and Brave. Opera, Firefox, Safari and Zen have no such API: the extension would install and then have nowhere to appear. Everything else needs no browser at all. Connect Telegram or install the CLI and you get the same agent, with the same memory.',
  },
  {
    question: 'Does it use my own logged-in accounts?',
    answer: 'Yes, and that is the point. Argos works on the page in front of you, as you: your session, your permissions, your data. There is nothing to connect and no password to hand over for the sites you are already signed in to.',
  },
  {
    question: 'What about my passwords and card numbers?',
    answer: 'It will not type into a password or a card field. That refusal is in the extension itself, not a policy we promise to follow. It does not collect what is typed in them either: those fields are skipped when the page is read.',
  },
  {
    question: 'Is my data private?',
    answer: 'Straight answer: to do the work, the content of the page you point it at is sent to the model, the same way it is with any AI that acts on your screen. It is not sold, not used to train anyone\'s model, and passwords and card fields are excluded outright. What Argos keeps between sessions is the memory you can see and delete: your projects and preferences, not your browsing.',
  },
  {
    question: 'What happens when I close the tab?',
    answer: 'Anything running in the browser stops with it. That is the free tier, and it is genuinely free. Tasks that keep going after you close the laptop run in the cloud, on a schedule, and report back in Telegram; that part is Pro.',
  },
  {
    question: 'What can Argos actually do?',
    answer: "Almost anything you'd normally do by hand in your browser. It can fill out forms, read a table and hand it back as a spreadsheet, research a topic and write it up, build a document or a chart, and work with tools like Gmail, Google Docs, Slack and GitHub.",
  },
  {
    question: 'Does Argos work with Telegram and WhatsApp?',
    answer: 'Yes. Text Argos on Telegram or WhatsApp like you would a person, and it gets to work. It even sends files like PDFs and spreadsheets straight to your chat.',
  },
  {
    question: 'Does Argos integrate with GitHub and Slack?',
    answer: 'Yes. It can check your code on GitHub and post updates in Slack, all without you switching tabs.',
  },
  {
    question: 'Do I need an account to get started?',
    answer: 'Just a Google account. Sign in takes one click. You can try Argos for free, then upgrade to Pro whenever you\'re ready for more.',
  },
  {
    question: 'How do I cancel or manage my subscription?',
    answer: 'You\'ll get an email as soon as you subscribe with a direct link to manage, pause, or cancel your plan any time. No need to contact anyone.',
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
            {/* The "?" was sliced down its right side and the "q" tail cut flat — both are
                ink outside the box, which background-clip:text simply does not paint. */}
            <span className="italic text-foreground sm:text-gradient sm:pr-[0.14em] sm:-mr-[0.14em]">questions?</span>
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
