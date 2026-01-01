import { Play } from 'lucide-react';

const ShowcaseSection = () => {
  // Replace this URL with your actual video URL
  const videoUrl = "";

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
              {videoUrl ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Placeholder when no video is set */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Video demo coming soon
                  </p>
                  <p className="text-muted-foreground/60 text-xs mt-2">
                    Set the videoUrl in ShowcaseSection.tsx
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
