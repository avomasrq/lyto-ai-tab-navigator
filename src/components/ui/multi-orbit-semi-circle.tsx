import React, { useRef, useEffect, useState } from 'react';
import { useScroll } from 'framer-motion';

export interface OrbitIntegration {
  src: string;
  label: string;
}

interface MultiOrbitSemiCircleProps {
  integrations: OrbitIntegration[];
  /** How tall the scroll-locked section is (default 280vh) */
  sectionHeight?: string;
}

// SVG coordinate space
const VW = 560;
const VH = 310;
const CX = 280;    // arc center x
const CY = 285;    // arc center y (near bottom so arc fans upward)
const R  = 240;    // arc radius

function computePositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (180 - (i / (count - 1)) * 180) * (Math.PI / 180);
    return {
      svgX: CX + R * Math.cos(angle),
      svgY: CY - R * Math.sin(angle),
      pctX: ((CX + R * Math.cos(angle)) / VW) * 100,
      pctY: ((CY - R * Math.sin(angle)) / VH) * 100,
    };
  });
}

export function MultiOrbitSemiCircle({
  integrations,
  sectionHeight = '280vh',
}: MultiOrbitSemiCircleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      const count = Math.min(
        Math.floor(v * (integrations.length + 1.5)),
        integrations.length,
      );
      setVisibleCount(count);
    });
  }, [scrollYProgress, integrations.length]);

  const positions = computePositions(integrations.length);
  const arcPath = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

  return (
    <div ref={containerRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Orbit canvas */}
        <div
          className="relative w-full max-w-[560px] mx-auto"
          style={{ paddingTop: `${(VH / VW) * 100}%` }}
        >
          {/* SVG layer — arc path + connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox={`0 0 ${VW} ${VH}`}
            aria-hidden="true"
          >
            {/* Dashed orbit arc */}
            <path
              d={arcPath}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="5 7"
              opacity="0.5"
            />

            {/* Connecting lines from center to each icon */}
            {positions.map((pos, i) => (
              <line
                key={i}
                x1={CX} y1={CY}
                x2={pos.svgX} y2={pos.svgY}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="4 5"
                style={{
                  opacity: i < visibleCount ? 0.35 : 0,
                  transition: 'opacity 0.5s ease',
                }}
              />
            ))}

            {/* Center pulse rings */}
            {[1.8, 1.4, 1].map((scale, k) => (
              <circle
                key={k}
                cx={CX} cy={CY}
                r={28 * scale}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                opacity={visibleCount > 0 ? 0.08 * (3 - k) : 0}
                style={{ transition: 'opacity 0.6s ease' }}
              />
            ))}
          </svg>

          {/* Integration icon nodes */}
          {positions.map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${pos.pctX}%`,
                top: `${pos.pctY}%`,
                transform: `translate(-50%, -50%) scale(${i < visibleCount ? 1 : 0.4})`,
                opacity: i < visibleCount ? 1 : 0,
                transition: 'opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                transitionDelay: `${i * 30}ms`,
              }}
            >
              <div
                title={integrations[i].label}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-card border border-border/70 shadow-md flex items-center justify-center p-1.5 sm:p-2"
              >
                <img
                  src={integrations[i].src}
                  alt={integrations[i].label}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              {/* Label tooltip */}
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap opacity-70">
                {integrations[i].label}
              </span>
            </div>
          ))}

          {/* Center Lyto AI node */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{
              left: `${(CX / VW) * 100}%`,
              top: `${(CY / VH) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-14 h-14 rounded-full bg-card border border-border shadow-lg flex flex-col items-center justify-center gap-0">
              <img
                src="/Lytoailogo.png"
                alt="Lyto AI"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mt-6 sm:mt-8">
          {integrations.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i < visibleCount ? '20px' : '6px',
                backgroundColor: i < visibleCount ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        {visibleCount < integrations.length && (
          <p className="text-xs text-muted-foreground/50 mt-3 animate-pulse select-none">
            scroll to connect
          </p>
        )}
      </div>
    </div>
  );
}
