import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/fade-in';

const VIDEO_ID = 'nciGjppyqTI';

const VideoSection = () => {
  const [playing, setPlaying] = useState(false);

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
          {/* Outer glow ring */}
          <div className="relative p-[1.5px] rounded-2xl"
            style={{ background: 'linear-gradient(135deg, hsl(24 95% 53% / 0.6), hsl(20 90% 48% / 0.2), transparent 60%)' }}>

            {/* Frame */}
            <div className="rounded-2xl overflow-hidden bg-[#0f0f0f] shadow-2xl">

              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#1a1a1a]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-[#2a2a2a] rounded-md px-3 py-1 flex items-center gap-2 max-w-xs mx-auto">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 flex-shrink-0" />
                    <span className="text-[11px] text-white/30 font-mono truncate">trylyto.com</span>
                  </div>
                </div>
              </div>

              {/* Video area */}
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                {playing ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                    title="Lyto AI Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <>
                    {/* Thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
                      alt="Lyto AI Demo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        onClick={() => setPlaying(true)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.96 }}
                        className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full cursor-pointer"
                        style={{
                          background: 'linear-gradient(135deg, hsl(24 95% 53%), hsl(20 90% 48%))',
                          boxShadow: '0 0 0 8px rgba(249,115,22,0.2), 0 8px 32px rgba(249,115,22,0.4)',
                        }}
                      >
                        {/* Pulse ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ background: 'rgba(249,115,22,0.3)' }}
                          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        {/* Play triangle */}
                        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Bottom label */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <span className="text-xs text-white/60 font-medium tracking-wide">
                        2 min demo
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default VideoSection;
