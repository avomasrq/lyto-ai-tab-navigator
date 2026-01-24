import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does Lyto work?',
      answer: 'Lyto indexes your open tabs in real-time using AI to understand content semantically. Ask a question and it finds the answer across all tabs instantly.',
    },
    {
      question: 'Is my data private?',
      answer: "Everything processes locally in your browser. Your data never leaves your device. We can't see it even if we wanted to.",
    },
    {
      question: 'Which browsers work?',
      answer: "Currently Chrome only. Firefox and Safari support coming soon.",
    },
    {
      question: 'Can I compare prices?',
      answer: 'Yes! Open multiple product tabs and ask Lyto to find the best price. It scans everything and shows you the winner.',
    },
    {
      question: 'How many tabs?',
      answer: 'Free: 10 tabs. Pro: 100 tabs. Enterprise: Unlimited. Performance stays fast even with hundreds.',
    },
  ];

  return (
    <section id="faq" className="section-gap px-6 relative" ref={ref}>
      <div className="divider-fade mb-24" />
      
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left - Header */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="lg:sticky lg:top-32">
              <span className="text-label">FAQ</span>
              <h2 className="text-headline font-serif mt-4">
                Questions
                <br />
                <span className="text-gradient">answered</span>
              </h2>
              <p className="text-muted-foreground mt-6">
                Still curious?{' '}
                <a href="mailto:arystan909@yahoo.com" className="text-primary hover:underline">
                  Reach out
                </a>
              </p>
            </div>
          </motion.div>

          {/* Right - Accordion */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                      openIndex === index 
                        ? 'bg-foreground text-background border-foreground' 
                        : 'border-border hover:border-primary/30 bg-card/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-medium">{faq.question}</h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        openIndex === index ? 'bg-primary' : 'bg-muted'
                      }`}>
                        {openIndex === index ? (
                          <Minus className={`w-4 h-4 ${openIndex === index ? 'text-primary-foreground' : ''}`} />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: openIndex === index ? 'auto' : 0,
                        opacity: openIndex === index ? 1 : 0,
                        marginTop: openIndex === index ? 16 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className={`leading-relaxed ${openIndex === index ? 'text-background/70' : 'text-muted-foreground'}`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
