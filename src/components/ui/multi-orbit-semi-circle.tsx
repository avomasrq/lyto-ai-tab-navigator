import React from 'react';

export interface OrbitIntegration {
  src: string;
  label: string;
}

interface MultiOrbitSemiCircleProps {
  integrations: OrbitIntegration[];
  /** Number of icons currently revealed (0 → integrations.length) */
  visibleCount: number;
}

// Fixed SVG coordinate space
const VW = 560;
const VH = 300;
const CX = 280;   // arc centre x
const CY = 280;   // arc centre y  (near bottom so arc fans upward)
const R  = 230;   // radius

function computePositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const deg   = 180 - (i / (count - 1)) * 180;
    const rad   = (deg * Math.PI) / 180;
    const svgX  = CX + R * Math.cos(rad);
    const svgY  = CY - R * Math.sin(rad);
    return {
      svgX,
      svgY,
      pctX: (svgX / VW) * 100,
      pctY: (svgY / VH) * 100,
    };
  });
}

export function MultiOrbitSemiCircle({ integrations, visibleCount }: MultiOrbitSemiCircleProps) {
  const positions = computePositions(integrations.length);
  const arcPath   = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

  return (
    <div
      className="relative w-full max-w-[560px] mx-auto select-none"
      style={{ paddingTop: `${(VH / VW) * 100}%` }}
    >
      {/* SVG: arc track + connecting lines + pulse rings */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
        viewBox={`0 0 ${VW} ${VH}`}
        aria-hidden="true"
      >
        {/* Dashed orbit track */}
        <path
          d={arcPath}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="5 7"
          opacity="0.5"
        />

        {/* Connecting lines */}
        {positions.map((pos, i) => (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={pos.svgX} y2={pos.svgY}
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            strokeDasharray="4 5"
            style={{
              opacity: i < visibleCount ? 0.4 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        ))}

        {/* Pulse rings around centre */}
        {[56, 44, 34].map((r, k) => (
          <circle
            key={k}
            cx={CX} cy={CY} r={r}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            style={{
              opacity: visibleCount > 0 ? 0.06 * (3 - k) : 0,
              transition: 'opacity 0.6s ease',
            }}
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
            top:  `${pos.pctY}%`,
            transform: `translate(-50%, -50%) scale(${i < visibleCount ? 1 : 0.3})`,
            opacity: i < visibleCount ? 1 : 0,
            transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
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
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground whitespace-nowrap">
            {integrations[i].label}
          </span>
        </div>
      ))}

      {/* Centre Lyto AI node */}
      <div
        className="absolute"
        style={{
          left: `${(CX / VW) * 100}%`,
          top:  `${(CY / VH) * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-14 h-14 rounded-full bg-card border border-border shadow-lg flex items-center justify-center">
          <img src="/Lytoailogo.png" alt="Lyto AI" className="w-8 h-8 object-contain" />
        </div>
      </div>
    </div>
  );
}
