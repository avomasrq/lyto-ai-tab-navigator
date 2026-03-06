const ShowcaseSection = () => {
  return (
    <section id="showcase" className="py-32 px-6 relative overflow-hidden scroll-mt-20 dither-overlay-light">
      {/* Background accent - simpler gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-card/50 to-background" />
      
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-[8px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
            Experience
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-serif mt-4">
            See it in <span className="italic">action</span>
          </h2>
        </div>

        {/* Video frame */}
        <div className="relative max-w-5xl 2xl:max-w-6xl mx-auto group">
          {/* Glow effects - reduced blur on mobile */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-[2rem] blur-xl md:blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="hidden md:block absolute -inset-px bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative bg-card rounded-2xl border border-border overflow-hidden group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10">
            {/* Empty video container with 16:9 aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/axihSHSE0cw"
                title="Lyto Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
