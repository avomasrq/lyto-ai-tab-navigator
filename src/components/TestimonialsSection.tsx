import { TestimonialsMinimal } from "@/components/ui/minimal-testimonial";
import { FadeIn } from '@/components/ui/fade-in';

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-12 md:py-20 scroll-mt-24">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-8">
          <span className="text-primary text-xs sm:text-sm font-medium tracking-widest uppercase">
            Testimonials
          </span>
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-serif mt-4 leading-[1.5]">
            Loved by creators everywhere
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-sm sm:text-base">
            See what our users are saying about Lyto AI.
          </p>
        </FadeIn>
        <FadeIn>
          <TestimonialsMinimal />
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialsSection;
