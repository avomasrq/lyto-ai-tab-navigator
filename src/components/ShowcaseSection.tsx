const ShowcaseSection = () => {
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
        <div className="relative max-w-5xl mx-auto">
          {/* Glow effects */}
          <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-[2rem] blur-3xl animate-pulse-soft" />
          <div className="absolute -inset-px bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
          
          <div className="relative bg-card rounded-2xl border border-border overflow-hidden glow-box">
            {/* Video container with 16:9 aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/FBFaOin0gmE"
                title="Lyto Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
