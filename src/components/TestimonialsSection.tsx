import { Testimonials } from "@/components/ui/twitter-testimonial-cards";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
            Loved by creators everywhere
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            See what our users are saying about Lyto AI.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <Testimonials />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
