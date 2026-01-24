import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: "Lyto changed everything. It's like having a research assistant that never sleeps and knows exactly what I need.",
      author: "Sarah Chen",
      role: "Product Manager",
      avatar: "SC",
    },
    {
      quote: "The proactive suggestions are incredible. I didn't know I needed this until I had it.",
      author: "Marcus Johnson",
      role: "Engineer",
      avatar: "MJ",
    },
    {
      quote: "Finally, AI that does instead of talks. Saved me hours every week on repetitive tasks.",
      author: "Emily Rodriguez",
      role: "Designer",
      avatar: "ER",
    },
  ];

  return (
    <section className="section-gap px-6 relative overflow-hidden" ref={ref}>
      <div className="divider-fade mb-24" />
      
      <div className="container mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-label">Testimonials</span>
          <h2 className="text-headline font-serif mt-4">
            Loved by <span className="text-gradient">early users</span>
          </h2>
        </motion.div>

        {/* Testimonials - Masonry-ish grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.15 }}
              className={`group ${index === 1 ? 'md:-mt-12' : ''}`}
            >
              <div className="card-surface rounded-2xl p-8 lg:p-10 h-full relative overflow-hidden">
                {/* Quote mark */}
                <Quote className="w-10 h-10 text-primary/10 mb-6" />
                
                {/* Quote */}
                <p className="text-lg leading-relaxed mb-8 relative">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                    <span className="text-sm font-medium text-background">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                
                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
