import { FadeIn } from '@/components/ui/fade-in';

const VideoSection = () => {
  return (
    <section id="demo" className="py-12 sm:py-20 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-4xl">
        <FadeIn className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-3">
            See it in action
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight">
            Watch Lyto{' '}
            <span className="italic text-gradient">work its magic</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl bg-black"
            style={{ aspectRatio: '16/9' }}>
            <iframe
              src="https://www.youtube.com/embed/nciGjppyqTI?rel=0&modestbranding=1"
              title="Lyto AI Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default VideoSection;
