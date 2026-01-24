import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: "Lyto changed how I work. It's like having a research assistant that never sleeps and knows exactly what I need.",
      author: "Sarah Chen",
      role: "Product Manager at Stripe",
      rating: 5,
    },
    {
      quote: "The proactive suggestions are incredible. I didn't know I needed this until I had it. Game changer.",
      author: "Marcus Johnson",
      role: "Senior Engineer at Google",
      rating: 5,
    },
    {
      quote: "Finally, AI that does instead of talks. Saved me hours every week on repetitive browser tasks.",
      author: "Emily Rodriguez",
      role: "Designer at Figma",
      rating: 5,
    },
  ];

  return (
    <section className="section-large px-6 relative overflow-hidden bg-card/30" ref={ref}>
      {/* Background number */}
      <div className="absolute top-0 left-0 number-watermark">04</div>
      
      <div className="container mx-auto relative">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="viral-tag mb-6 inline-flex">Testimonials</span>
          <h2 className="text-section font-serif mt-6">
            Loved by people who
            <br />
            <span className="text-gradient-vivid">value their time.</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className={`group ${index === 1 ? 'md:-mt-8' : ''}`}
            >
              <div className="viral-card p-8 lg:p-10 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                
                {/* Quote */}
                <blockquote className="text-lg leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                    <span className="text-sm font-medium text-background">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
