import { useState } from 'react';
import { Play } from 'lucide-react';

const ShowcaseSection = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="showcase" className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden scroll-mt-20 dither-overlay-light">
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[8px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Experience
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-serif mt-4">
            See it in <span className="italic">action</span>
          </h2>
        </div>

        <div className="relative max-w-5xl 2xl:max-w-6xl mx-auto group">
          <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl sm:rounded-[2rem] blur-xl md:blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="hidden md:block absolute -inset-px bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10">
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
                  <div className="absolute inset-0 bg-foreground/20 group-hover/play:bg-foreground/30 transition-colors" />
                  <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 transition-transform group-hover/play:scale-110">
                    <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground ml-0.5 sm:ml-1" fill="currentColor" />
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
