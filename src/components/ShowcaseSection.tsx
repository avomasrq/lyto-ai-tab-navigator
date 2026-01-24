import { Play } from 'lucide-react';

const ShowcaseSection = () => {
  return (
    <section id="showcase" className="section-padding px-6 relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-label">Experience</span>
          <h2 className="text-headline font-serif mt-4">
            See it in <em className="not-italic text-gradient">action</em>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Watch how Lyto transforms your browsing experience in under 60 seconds.
          </p>
        </div>

        {/* Video frame */}
        <div className="relative max-w-4xl mx-auto">
          {/* Subtle shadow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl blur-2xl opacity-50" />
          
          <div className="relative surface-elevated rounded-2xl overflow-hidden">
            {/* Video container with 16:9 aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                {/* Play button */}
                <button className="group relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  </div>
                </button>
                <span className="text-sm text-muted-foreground">Demo video coming soon</span>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -bottom-6 left-8 right-8 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
