import { useState } from 'react';
import { Play } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

const ShowcaseSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="showcase" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-24">
      <div className="container mx-auto max-w-5xl 2xl:max-w-6xl">

        {/* Header */}
        <FadeIn className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
            Demo
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-4 leading-tight">
            Watch Lyto
            <br />
            <span className="italic text-gradient">handle it all</span>
          </h2>
          <p className="text-muted-foreground mt-5 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            In this 2-minute walkthrough, see Lyto research a topic, draft an email, and manage tabs — all from a single prompt, without leaving Chrome.
          </p>
        </FadeIn>

        {/* Video */}
        <FadeIn delay={0.15}>
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-2xl shadow-black/10">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {playing ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/axihSHSE0cw?autoplay=1"
                  title="Lyto Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group/play"
                  aria-label="Play demo video"
                >
                  <img
                    src="https://img.youtube.com/vi/axihSHSE0cw/maxresdefault.jpg"
                    alt="Lyto Demo Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/30 group-hover/play:bg-foreground/20 transition-colors" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/40 transition-transform group-hover/play:scale-110">
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-0.5 sm:ml-1" fill="currentColor" />
                    </div>
                    <span className="text-white/90 text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      Watch 2-min demo
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default ShowcaseSection;
