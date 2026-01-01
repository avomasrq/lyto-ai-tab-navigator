import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

const ShowcaseSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Experience
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4">
            See it in <span className="italic">action</span>
          </h2>
        </div>

        {/* Video frame */}
        <div className="relative max-w-5xl mx-auto group">
          {/* Glow effects */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative bg-card rounded-2xl border border-border overflow-hidden group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10">
            {/* Video container with 16:9 aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {isPlaying ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/FBFaOin0gmE?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=0"
                  title="Lyto Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* YouTube thumbnail */}
                  <img
                    src="https://img.youtube.com/vi/FBFaOin0gmE/maxresdefault.jpg"
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play button */}
                  <button
                    onClick={handlePlay}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary shadow-2xl shadow-primary/30">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
