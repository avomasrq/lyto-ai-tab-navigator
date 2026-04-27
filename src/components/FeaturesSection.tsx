import { CyberneticBentoGrid } from '@/components/ui/cybernetic-bento-grid';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';

const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto">
        <FadeInStagger className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
          <FadeInItem>
            <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
              Capabilities
            </span>
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-serif mt-4 max-w-xl 2xl:max-w-2xl leading-[1.5]">
              Everything runs
              <br />
              <span className="italic text-gradient">inside Chrome</span>
            </h2>
          </FadeInItem>
          <FadeInItem>
            <p className="text-muted-foreground max-w-sm 2xl:max-w-md text-sm sm:text-base xl:text-lg leading-relaxed">
              Connecting your favorite tools and keeping your tabs, tasks, and workflow organized in one place.
            </p>
          </FadeInItem>
        </FadeInStagger>

        <FadeIn delay={0.1}>
          <CyberneticBentoGrid />
        </FadeIn>
      </div>
    </section>
  );
};

export default FeaturesSection;
