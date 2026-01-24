import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does Lyto protect my privacy?',
      answer: 'All processing happens locally on your device. Your browsing data never leaves your computer. We use on-device AI that requires no cloud processing for core features.',
    },
    {
      question: 'Which browsers are supported?',
      answer: 'Currently, Lyto works with Google Chrome and Chromium-based browsers like Edge, Brave, and Arc. Firefox and Safari support is coming soon.',
    },
    {
      question: 'Is there a free version?',
      answer: 'Yes! The free plan includes 50 AI actions per day, which is enough for most casual users. Power users can upgrade to Pro for unlimited actions.',
    },
    {
      question: 'Can I use Lyto for work?',
      answer: 'Absolutely. Lyto is designed for professionals. It helps with research, price comparisons, data entry automation, and much more. Teams use it daily.',
    },
    {
      question: 'How do I get started?',
      answer: 'Click "Get Lyto Free" to install the Chrome extension. No account needed—it works instantly. You can create an account later to sync across devices.',
    },
  ];

  return (
    <section id="faq" className="section-large px-6 relative overflow-hidden bg-card/30" ref={ref}>
      <div className="container mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Header (sticky) */}
          <motion.div 
            className="lg:sticky lg:top-32 lg:self-start"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="viral-tag mb-6 inline-flex">FAQ</span>
            <h2 className="text-section font-serif mt-6">
              Got questions?
              <br />
              <span className="text-gradient-vivid">We've got answers.</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-md">
              Everything you need to know about Lyto. Can't find an answer? 
              <a href="mailto:support@lyto.ai" className="text-primary ml-1 link-underline">
                Reach out
              </a>
            </p>
          </motion.div>

          {/* Right - Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                      isOpen 
                        ? 'bg-background border-primary/30 shadow-lg' 
                        : 'bg-card/50 border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen ? 'bg-primary' : 'bg-muted'
                      }`}>
                        {isOpen ? (
                          <Minus className={`w-4 h-4 ${isOpen ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        ) : (
                          <Plus className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isOpen ? 'auto' : 0,
                        opacity: isOpen ? 1 : 0,
                        marginTop: isOpen ? 16 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
