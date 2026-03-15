import { ArrowRight } from "lucide-react"
import { useState, Suspense, lazy } from "react"

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12">
      <div
        className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-primary/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-card" />}>
            <div className="w-full h-full">
              <Dithering
                width={1280}
                height={720}
                colorBack="#000000"
                colorFront="#00b3ff"
                shape="sphere"
                type="4x4"
                size={2}
                speed={isHovered ? 2 : 1}
                scale={0.6}
              />
            </div>
          </Suspense>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-8 py-16 sm:px-12 sm:py-20">
          <div className="h-px w-12 bg-primary/50 mb-8" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-medium text-white/80">AI-Powered Writing</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Your words,{" "}
            <br />
            <span className="text-white/70">delivered perfectly.</span>
          </h2>

          {/* Description */}
          <p className="mt-6 text-white/60 text-base sm:text-lg max-w-md leading-relaxed">
            Join 2,847 founders using the only AI that understands the nuance of your voice.
            Clean, precise, and uniquely yours.
          </p>

          {/* Button */}
          <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/90 transition-all duration-300 group">
            Start Typing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
