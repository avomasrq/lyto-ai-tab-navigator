import { FadeIn } from '@/components/ui/fade-in';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';

const ShowcaseSection = () => {
  return (
    <section id="showcase" className="py-8 sm:py-12 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-5xl">
        <FadeIn delay={0.1}>
          <HeroVideoDialog
            animationStyle="from-center"
            videoSrc="https://www.youtube.com/embed/axihSHSE0cw?autoplay=1"
            thumbnailSrc="https://img.youtube.com/vi/axihSHSE0cw/maxresdefault.jpg"
            thumbnailAlt="Lyto AI Demo"
          />
        </FadeIn>
      </div>
    </section>
  );
};

export default ShowcaseSection;
