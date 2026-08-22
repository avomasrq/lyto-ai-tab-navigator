import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ─────────────────────────── Ribbon Field gradient ───────────────────────────
   Animated stripe field (21st.dev "gg" recipe) in Argos black. Canvas-drawn:
   bands along a 38° axis, feathered edges, bent by a cross-axis sine wave whose
   clock advances each frame — a CSS gradient can't do the curve. */

const RIBBON_STOPS = [
  { hex: '#FFFFFF', pos: 18 },   // white
  { hex: '#a3a3a3', pos: 57 },   // light orange
  { hex: '#171717', pos: 60 },   // argos primary
  { hex: '#000000', pos: 100 },  // deep burnt orange
];

const RIBBON_GRAIN =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.21'/></svg>\")";

function buildRibbonLut(): Uint8ClampedArray {
  const stops = RIBBON_STOPS.map((s) => ({
    end: s.pos / 100,
    rgb: [1, 3, 5].map((i) => parseInt(s.hex.slice(i, i + 2), 16)),
  }));
  const softness = 0.24;
  const blendW = softness * 0.2;
  const N = 1024;
  const lut = new Uint8ClampedArray(N * 3);
  for (let n = 0; n < N; n++) {
    const x = n / (N - 1);
    let i = stops.findIndex((s) => x <= s.end);
    if (i === -1) i = stops.length - 1;
    let rgb = stops[i].rgb;
    const dNext = stops[i].end - x;
    const start = i === 0 ? 0 : stops[i - 1].end;
    if (i < stops.length - 1 && dNext < blendW) {
      const t = 1 - dNext / blendW;
      const s = t * t * (3 - 2 * t) * 0.5;
      rgb = rgb.map((c, k) => c + (stops[i + 1].rgb[k] - c) * s);
    } else if (i > 0 && x - start < blendW) {
      const t = 1 - (x - start) / blendW;
      const s = t * t * (3 - 2 * t) * 0.5;
      rgb = rgb.map((c, k) => c + (stops[i - 1].rgb[k] - c) * s);
    }
    lut[n * 3] = rgb[0]; lut[n * 3 + 1] = rgb[1]; lut[n * 3 + 2] = rgb[2];
  }
  return lut;
}

export function RibbonField({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, { margin: '120px' });

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // low-res buffer, upscaled by CSS — the feathered bands hide the stretch
    const W = 240, H = 135;
    canvas.width = W; canvas.height = H;
    const img = ctx.createImageData(W, H);
    const data = img.data;
    const lut = buildRibbonLut();

    const angle = (38 * Math.PI) / 180;
    const ca = Math.cos(angle), sa = Math.sin(angle);
    const scale = 0.68, wave = 0.14;
    const TAU = Math.PI * 2;

    let raf = 0;
    const start = performance.now();
    const draw = (now: number) => {
      const ph = (now - start) / 1000;             // speed 100 → t * 1.0
      const waveClock = 20.75 + ph * 1.2;          // curved-stripe wave clock
      let p = 0;
      for (let y = 0; y < H; y++) {
        const ny = y / H - 0.5;
        for (let x = 0; x < W; x++) {
          const nx = x / W - 0.5;
          const along = (nx * ca + ny * sa) / scale + 0.5;
          const cross = -nx * sa + ny * ca + 0.5;
          let u = along + wave * 0.35 * Math.sin(cross * 2.4 * TAU + waveClock);
          if (u < 0) u = 0; else if (u > 1) u = 1;
          const li = (u * 1023) | 0;
          data[p] = lut[li * 3]; data[p + 1] = lut[li * 3 + 1]; data[p + 2] = lut[li * 3 + 2]; data[p + 3] = 255;
          p += 4;
        }
      }
      ctx.putImageData(img, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={wrapRef} className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: RIBBON_GRAIN, backgroundSize: '120px 120px' }}
      />
    </div>
  );
}
