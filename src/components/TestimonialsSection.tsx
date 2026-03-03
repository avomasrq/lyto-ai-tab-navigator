import { Testimonials } from "@/components/ui/twitter-testimonial-cards";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 md:py-32 relative dither-overlay-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary text-[8px] sm:text-xs font-medium tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif mt-4 leading-[1.5]">
            Loved by creators everywhere
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-xs sm:text-sm">
            See what our users are saying about Lyto AI.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[500px] sm:min-h-[600px]">
          <Testimonials />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
