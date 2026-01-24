import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      quote: "Lyto completely changed how I research online. It's like having a brilliant assistant that knows exactly what I need before I ask.",
      author: "Sarah Chen",
      role: "Product Manager",
      company: "Startup",
      rating: 5,
    },
    {
      quote: "The tab management alone saves me hours every week. But the proactive suggestions? That's where the magic happens.",
      author: "Marcus Johnson",
      role: "Software Engineer",
      company: "Tech Corp",
      rating: 5,
    },
    {
      quote: "Finally, an AI tool that actually does things instead of just talking about them. Game changer for my workflow.",
      author: "Emily Rodriguez",
      role: "Freelance Designer",
      company: "Self-employed",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
    },
  };

  return (
    <section className="section-padding px-6 relative overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span 
            className="text-label"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Testimonials
          </motion.span>
          <motion.h2 
            className="text-headline font-serif mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Loved by <em className="not-italic text-gradient">early users</em>
          </motion.h2>
        </div>

        {/* Testimonials grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              variants={itemVariants}
              className="group"
            >
              <div className="h-full surface-interactive rounded-2xl p-8 relative overflow-hidden">
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-primary" />
                </div>
                
                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-foreground/90 leading-relaxed mb-8 relative">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
