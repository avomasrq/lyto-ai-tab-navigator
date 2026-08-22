import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Brain, Check } from 'lucide-react';

/**
 * One loop of the extension doing work worth watching, and the text that says why.
 *
 * It used to fill a sign-up form. That was legible but small: filling in your own
 * name and email is a chore, not a reason to install anything. This is the same
 * mechanic — the agent's cursor moving over a real page — pointed at something a
 * person would actually pay to skip: a sheet with a missing column, filled in and
 * then charted.
 *
 * Everything is derived from a single clock `t` (seconds inside the loop) rather
 * than from a dozen independent animations. Two earlier versions taught that the
 * hard way: separate animations drift out of phase after the first repeat, and
 * each one freezes on its own first keyframe when Chrome parks the tab —
 * measured, not guessed: visibilityState "hidden" and clip-path stuck at
 * inset(0 100% 0 0), so a person who tabbed away came back to an empty form. One
 * clock keeps the beats in step, and a hidden tab is pinned to FROZEN_AT — the
 * finished frame — instead of the empty one.
 *
 * The cut back to the start is hard on purpose. Unwinding the scene smoothly
 * reads as a glitch: it looks like something is deleting the work.
 */

/* ── the storyboard, in seconds ─────────────────────────────────────── */
const T = {
  /** Nothing moves. The eye needs this to take in the composition first. */
  still: 0.8,
  typeEnd: 1.9,
  /** Request leaves the input, work indicator appears. */
  sent: 2.0,
  /** It says where the answer is coming from before the first number lands. */
  recall: 2.15,
  cells: 2.5,
  perCell: 0.55,
  travel: 0.26,
  /** Cursor leaves the column and the chart is dropped into the sheet. */
  chartAt: 5.3,
  chartGrow: 0.9,
  done: 6.6,
  loop: 7.6,
};

/** The frame a backgrounded tab is pinned to: everything done, nothing missing. */
const FROZEN_AT = 7.0;

const QUERY = 'fill in Q3 revenue and chart it';

const ROWS = [
  { month: 'July', units: '1,240', revenue: '$61,000', bar: 0.62 },
  { month: 'August', units: '1,610', revenue: '$79,400', bar: 0.81 },
  { month: 'September', units: '1,980', revenue: '$97,200', bar: 1 },
  { month: 'October', units: '1,120', revenue: '$54,800', bar: 0.56 },
  { month: 'November', units: '1,470', revenue: '$72,300', bar: 0.74 },
];

const CAPABILITIES: { line: string; pro?: boolean }[] = [
  { line: 'Remembers your projects and how you work, everywhere' },
  { line: 'Clicks, types and fills forms for you' },
  { line: 'Reads every tab you have open and pulls the data out, into a sheet' },
  { line: 'Builds real files: .docx, .xlsx, .pdf, charts' },
  { line: 'Rebuilds pages: bigger type, no clutter, undo anytime' },
  { line: "Keeps working on a schedule while you're away", pro: true },
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

type Point = { x: number; y: number };
const lerp = (a: Point, b: Point, p: number): Point => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
});

/** When the cursor should be sitting on which measured element. */
const WAYPOINTS: { at: number; key: string }[] = [
  { at: 0, key: 'input' },
  { at: T.sent, key: 'input' },
  { at: T.sent + 0.15, key: 'send' },
  { at: T.cells - 0.05, key: 'send' },
  ...ROWS.map((_, i) => ({ at: T.cells + i * T.perCell + T.travel, key: `c${i}` })),
  { at: T.chartAt, key: 'chart' },
  { at: T.loop, key: 'chart' },
];

export function ExtensionShowcase({
  className = '',
  /** The hero shows the scene alone: the page around it already carries the copy. */
  showCopy = true,
}: { className?: string; showCopy?: boolean }) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(FROZEN_AT);

  /* ── the clock ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (reduce) {
      setT(FROZEN_AT);
      return;
    }
    let raf = 0;
    let origin = performance.now();

    const tick = (now: number) => {
      setT(((now - origin) / 1000) % T.loop);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      origin = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        setT(FROZEN_AT); // never leave a hidden tab on a half-built frame
      } else {
        start();
      }
    };

    if (document.hidden) setT(FROZEN_AT);
    else start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce]);

  /* ── where the cursor can go ───────────────────────────────────────── */
  const stageRef = useRef<HTMLDivElement>(null);
  const marks = useRef<Record<string, HTMLElement | null>>({});
  const [points, setPoints] = useState<Record<string, Point>>({});

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const base = stage.getBoundingClientRect();
      const next: Record<string, Point> = {};
      for (const [key, el] of Object.entries(marks.current)) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        next[key] = { x: r.left - base.left + 14, y: r.top - base.top + r.height / 2 };
      }
      setPoints(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const cursorAt = (): Point | null => {
    let i = 0;
    while (i < WAYPOINTS.length - 2 && t > WAYPOINTS[i + 1].at) i++;
    const from = WAYPOINTS[i];
    const to = WAYPOINTS[i + 1];
    const a = points[from.key];
    const b = points[to.key];
    if (!a || !b) return null;
    const span = to.at - from.at;
    return span <= 0 ? b : lerp(a, b, easeInOut(clamp01((t - from.at) / span)));
  };

  /* ── derived state, all from t ─────────────────────────────────────── */
  const typed = QUERY.slice(0, Math.round(clamp01((t - T.still) / (T.typeEnd - T.still)) * QUERY.length));
  const sent = t >= T.sent;
  const recalling = t >= T.recall;
  const working = sent && t < T.done;
  const done = t >= T.done;
  const caretOn = !sent && t >= T.still && Math.floor(t * 2.5) % 2 === 0;
  const chart = clamp01((t - T.chartAt) / T.chartGrow);
  const cursor = cursorAt();

  const cellState = (i: number) => {
    const start = T.cells + i * T.perCell;
    return {
      fill: clamp01((t - start - T.travel) / (T.perCell - T.travel)),
      active: t >= start + T.travel * 0.6 && t < start + T.perCell + 0.1,
    };
  };

  return (
    <div className={className}>
      {/* ── the scene ───────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative overflow-hidden rounded-[20px] border border-black/[0.07] bg-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.09)]"
        style={{ backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}
      >
        {/* tab strip — "it works in the tabs you already have", said by being there */}
        <div className="flex items-end gap-1.5 border-b border-black/[0.06] bg-black/[0.02] px-3 pt-3">
          {['Q3 plan', 'Analytics', 'Revenue.sheet'].map((tab, i) => (
            <div
              key={tab}
              className="flex items-center gap-2 rounded-t-lg px-3 py-2"
              style={{ background: i === 2 ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.5)' }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
              <span className="text-[11.5px] font-medium text-neutral-600">{tab}</span>
            </div>
          ))}
        </div>

        <div className="flex">
          {/* the sheet being worked on */}
          <div className="flex-1 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-[12px] font-semibold text-neutral-700">Q3 revenue</span>
              <span className="text-[10.5px] text-neutral-400">· 5 rows</span>
            </div>

            {/* header row */}
            <div className="flex border-b border-black/[0.08] pb-1.5 text-[9.5px] uppercase tracking-wider text-neutral-400">
              <span className="flex-1">Month</span>
              <span className="w-[68px] text-right">Units</span>
              <span className="w-[86px] text-right">Revenue</span>
            </div>

            {ROWS.map((row, i) => {
              const { fill, active } = cellState(i);
              return (
                <div key={row.month} className="flex items-center border-b border-black/[0.045] py-[7px]">
                  <span className="flex-1 text-[12px] text-neutral-700">{row.month}</span>
                  <span className="w-[68px] text-right text-[12px] tabular-nums text-neutral-500">{row.units}</span>
                  {/* The empty column is the whole point: this is the work. */}
                  <span
                    ref={(el) => { marks.current[`c${i}`] = el; }}
                    className="ml-2 flex h-[22px] w-[86px] items-center justify-end rounded-[5px] px-1.5"
                    style={{
                      background: active ? 'rgba(18,18,18,0.04)' : 'transparent',
                      boxShadow: active ? 'inset 0 0 0 1.5px rgba(18,18,18,0.5)' : 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                    }}
                  >
                    <span
                      className="whitespace-nowrap text-[12px] font-medium tabular-nums text-neutral-800"
                      style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }}
                    >
                      {row.revenue}
                    </span>
                  </span>
                </div>
              );
            })}

            {/* the chart it drops into the sheet when the column is full */}
            <div
              ref={(el) => { marks.current.chart = el; }}
              className="mt-3 rounded-lg border p-2.5"
              style={{
                borderColor: chart > 0 ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.04)',
                background: chart > 0 ? '#fff' : 'rgba(0,0,0,0.015)',
                boxShadow: chart > 0 ? '0 6px 18px -8px rgba(0,0,0,0.25)' : 'none',
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-neutral-500" style={{ opacity: chart }}>
                  Revenue by month
                </span>
                <span className="text-[9.5px] text-neutral-300" style={{ opacity: 1 - chart }}>
                  chart
                </span>
              </div>
              <div className="flex h-[58px] items-end gap-2 border-b border-black/[0.08] pb-px">
                {ROWS.map((row, i) => (
                  <span key={row.month} className="flex-1 rounded-t-[3px] bg-neutral-900" style={{
                    // Each bar starts a beat after the one before it, and the whole
                    // set rests at full height so a frozen frame shows a real chart.
                    height: `${row.bar * 100 * clamp01((chart - i * 0.08) / 0.5)}%`,
                    opacity: 0.82 - i * 0.04,
                  }} />
                ))}
              </div>
              <div className="mt-1 flex gap-2">
                {ROWS.map((row) => (
                  <span key={row.month} className="flex-1 text-center text-[8.5px] text-neutral-400" style={{ opacity: chart }}>
                    {row.month.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* the panel: where the request is made and the work is reported */}
          <div className="flex w-[188px] shrink-0 flex-col border-l border-black/[0.06] bg-black/[0.015] p-3">
            {/* The same mark as the panel itself and the site tab — the first time
                most people see it attached to a thing doing work. */}
            <div className="mb-3 flex items-center gap-1.5">
              <img src="/favicon-512.png" alt="" aria-hidden className="h-4 w-4 rounded-[5px]" />
              <span className="text-[10px] font-semibold tracking-[0.14em] text-neutral-700">ARGOS</span>
            </div>

            <div className="flex flex-1 flex-col justify-end gap-2">
              <div
                className="ml-auto w-fit max-w-full rounded-lg rounded-br-sm bg-neutral-900 px-2.5 py-1.5 text-[11.5px] leading-snug text-white"
                style={{ opacity: sent ? 1 : 0 }}
              >
                {QUERY}
              </div>

              {recalling && (
                <div className="flex items-start gap-1.5 pl-0.5 text-[11px] leading-snug text-neutral-500">
                  <Brain className="mt-[1px] h-3 w-3 shrink-0" strokeWidth={2} />
                  <span>using last quarter’s numbers</span>
                </div>
              )}

              {working && (
                <div className="flex items-center gap-1.5 pl-0.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                      style={{ opacity: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 7 - i * 0.9)) }}
                    />
                  ))}
                  <span className="ml-1 text-[11px] text-neutral-500">working</span>
                </div>
              )}

              {done && (
                <div className="flex items-start gap-1.5 rounded-lg bg-white px-2.5 py-2 text-[11.5px] leading-snug text-neutral-700 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                    <Check className="h-2 w-2 text-white" strokeWidth={3} />
                  </span>
                  <span>Filled 5 cells and inserted the chart.</span>
                </div>
              )}
            </div>

            <div
              ref={(el) => { marks.current.input = el; }}
              className="mt-3 flex h-9 items-center gap-2 rounded-lg border border-black/[0.09] bg-white px-2.5"
            >
              <span className="flex-1 truncate text-[11.5px] text-neutral-800">
                {sent ? <span className="text-neutral-400">Ask Argos…</span> : typed}
                <span style={{ opacity: caretOn ? 1 : 0 }} className="ml-px inline-block w-px">|</span>
              </span>
              <span
                ref={(el) => { marks.current.send = el; }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-[10px] text-white"
                style={{ transform: `scale(${t >= T.sent && t < T.sent + 0.16 ? 0.9 : 1})` }}
              >
                ↑
              </span>
            </div>
          </div>
        </div>

        {/* the agent's cursor — what makes it read as done BY something */}
        {cursor && (
          <svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            className="pointer-events-none absolute left-0 top-0 z-20"
            style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
            aria-hidden
          >
            <path
              d="M2 1.6 L15.6 12.4 L9.4 12.9 L12.7 19.6 L10.1 20.9 L6.8 14.2 L2 18.3 Z"
              fill="#111111"
              stroke="#ffffff"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {showCopy && (
        <>
          {/* One line saying what just happened, so the picture is never left to
              speak for itself — a person who glances once should still get it. */}
          <p className="mt-5 text-[15px] leading-snug text-foreground">
            You ask in plain words. Argos does it on the page you're already on.
          </p>

          <ul className="mt-4 space-y-2.5">
            {CAPABILITIES.map(({ line, pro }) => (
              <li key={line} className="flex items-start gap-2.5">
                <span className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-neutral-900">
                  <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-[13.5px] leading-relaxed text-foreground/80">
                  {line}
                  {pro && (
                    <span className="ml-2 inline-block translate-y-[-1px] rounded-full border border-neutral-900/15 bg-neutral-900/[0.06] px-1.5 py-px align-middle text-[9.5px] font-semibold uppercase tracking-[0.09em] text-neutral-600">
                      Pro
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
