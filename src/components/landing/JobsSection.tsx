import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Clock, FileSpreadsheet, FolderOpen, Moon, Smartphone } from 'lucide-react';
import { InstallButton } from '@/components/landing/InstallButton';
import { reveal } from '@/lib/reveal';
import { MeanderBand } from '@/components/ui/greek-tablet';
import { MythLine } from '@/components/landing/Myth';

/**
 * The four jobs. These are the use cases — there is no separate use-case section,
 * because explaining the same thing twice is how the button ends up below the
 * fold.
 *
 * Every block opens with a situation rather than a feature name: people recognise
 * a position they have been in faster than a verb they have to translate. The
 * function follows as the explanation.
 *
 * Order is by repetition, not by cleverness. `research` had the worst retention
 * of any scenario in the funnel (15% came back) precisely because it is a
 * one-off: gather, write, close. Habits come from the things that happen again.
 *
 * Both Pro blocks are labelled. Showing the ceiling is fine; letting someone
 * discover the line after they have made plans is not.
 *
 * Every picture moves, and all of them move on the same discipline as the hero:
 * the resting state is the FINISHED state, and the animation is a short dip out
 * of it and back. Chrome freezes rAF in a background tab and leaves an element on
 * its first keyframe — measured, on this page — so anything that arrives into
 * visibility is invisible for as long as nobody is looking.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const LOOP = 5.6; // one pass, shared by every scene so the section breathes together

/** rest → away → rest. The first and last frame are the finished picture. */
const kf = <T,>(rest: T, away: T) => [rest, rest, away, rest, rest];

/**
 * One cycle for one element. `start` is when its moment happens, `dur` how long
 * it takes. `snap` jumps to the away state and travels back — for things that get
 * written or delivered; without it the move is a symmetric pulse.
 */
const cycle = (start: number, dur: number, snap = false) => ({
  duration: LOOP,
  repeat: Infinity,
  ease: EASE,
  times: snap
    ? [0, start / LOOP, (start + 0.06) / LOOP, (start + 0.06 + dur) / LOOP, 1]
    : [0, start / LOOP, (start + dur / 2) / LOOP, (start + dur) / LOOP, 1],
});

/**
 * A loop clock that survives a background tab.
 *
 * The scenes below used to be built from staggered entrances — every element
 * dropping in on its own delay — which reads as a list assembling itself rather
 * than as work being done, and looks especially cheap when four of them run at
 * once. They are now driven by one number: a scan position, a counter, a bar.
 *
 * setInterval rather than requestAnimationFrame on purpose. Chrome freezes rAF
 * in a hidden tab and leaves whatever frame it stopped on; intervals are merely
 * throttled to about a second, so the loop still finishes and lands on the
 * completed state instead of freezing halfway through it.
 */
function useLoopClock(period: number, step = 80) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(period);
  useEffect(() => {
    if (reduce) { setT(period); return; }
    const started = Date.now();
    const id = window.setInterval(() => setT(((Date.now() - started) / 1000) % period), step);
    return () => window.clearInterval(id);
  }, [period, step, reduce]);
  return t;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (p: number) => 1 - (1 - p) ** 3;

function ProTag() {
  return (
    <span className="ml-2.5 inline-block translate-y-[-2px] rounded-full border border-foreground/15 bg-foreground/[0.06] px-2 py-[3px] align-middle text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      Pro
    </span>
  );
}

/* ── the four pictures ──────────────────────────────────────────────── */

/** 01 — a form, filling itself in, field by field. */
function FormFilling() {
  const reduce = useReducedMotion();
  const ROWS = [
    { label: 'Full name', value: 'Ada Lovelace', at: 0.5 },
    { label: 'Email', value: 'ada@analytical.co', at: 1.1 },
    { label: 'Company', value: 'Analytical Engines', at: 1.7 },
    { label: 'Role', value: 'Head of Research', at: 2.3 },
  ];
  return (
    <div className="relative h-[236px] w-full">
      {/* the ones already behind you, tilted so the pile reads as a pile */}
      {[2, 1].map((depth) => (
        <div
          key={depth}
          className="absolute inset-x-6 top-6 h-[150px] rounded-2xl border border-black/[0.07] bg-white"
          style={{
            transform: `translateY(${depth * 9}px) rotate(${depth === 2 ? -2.2 : 1.6}deg)`,
            opacity: depth === 2 ? 0.45 : 0.7,
          }}
        />
      ))}
      <div className="absolute inset-x-2 top-2 rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.3)]">
        <div className="mb-4 h-2 w-24 rounded-full bg-black/10" />
        {ROWS.map((row) => (
          <div key={row.label} className="mb-2 flex items-center gap-3">
            <span className="w-14 shrink-0 text-[9px] uppercase tracking-wider text-neutral-400">{row.label}</span>
            <motion.span
              className="flex h-7 flex-1 items-center rounded-md border bg-black/[0.015] px-2.5"
              animate={reduce ? {} : { borderColor: kf('rgba(0,0,0,0.07)', 'rgba(18,18,18,0.45)') }}
              transition={cycle(row.at, 0.5)}
            >
              <motion.span
                className="whitespace-nowrap text-[11.5px] text-neutral-700"
                animate={reduce ? {} : { clipPath: kf('inset(0 0 0 0)', 'inset(0 100% 0 0)') }}
                transition={{ ...cycle(row.at, 0.45, true), ease: 'linear' }}
              >
                {row.value}
              </motion.span>
            </motion.span>
          </div>
        ))}
        <motion.div
          className="mt-3 inline-flex h-8 items-center rounded-lg bg-neutral-900 px-3.5 text-[11.5px] font-medium text-white"
          animate={reduce ? {} : { scale: kf(1, 0.94) }}
          transition={cycle(3.1, 0.45)}
        >
          Submit
        </motion.div>
      </div>
    </div>
  );
}

/** 02 — the table on screen, and the file that was never offered. */
function TableToFile() {
  const reduce = useReducedMotion();
  const ROWS = [
    ['Figma', '$1,440', 'Mar 4'],
    ['Vercel', '$960', 'Apr 19'],
    ['Linear', '$720', 'Jun 2'],
    ['Notion', '$540', 'Jul 11'],
  ];
  return (
    <div className="relative h-[252px] w-full">
      <div className="absolute inset-x-0 top-2 rounded-2xl border border-black/[0.07] bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]">
        <div className="mb-3 flex gap-2">
          {['Vendor', 'Spend', 'Renews'].map((h) => (
            <span key={h} className="flex-1 text-[9.5px] font-semibold uppercase tracking-wider text-neutral-400">{h}</span>
          ))}
        </div>
        {ROWS.map((row, i) => (
          <motion.div
            key={row[0]}
            className="flex gap-2 rounded-md border-t border-black/[0.05] px-1 py-2"
            /* each row lights up as it is read, in order */
            animate={reduce ? {} : { backgroundColor: kf('rgba(0,0,0,0)', 'rgba(18,18,18,0.055)') }}
            transition={cycle(0.5 + i * 0.35, 0.6)}
          >
            {row.map((cell) => (
              <span key={cell} className="flex-1 text-[11.5px] text-neutral-600">{cell}</span>
            ))}
          </motion.div>
        ))}
      </div>
      <motion.div
        className="absolute bottom-0 right-1 flex items-center gap-2.5 rounded-xl border border-black/[0.07] bg-white px-3.5 py-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
        animate={reduce ? {} : { y: kf(0, 26), opacity: kf(1, 0), scale: kf(1, 0.94) }}
        transition={cycle(2.3, 0.55, true)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10">
          <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
        </span>
        <span>
          <span className="block text-[12px] font-medium text-neutral-800">vendors.xlsx</span>
          <span className="block text-[10.5px] text-neutral-400">4 rows · ready</span>
        </span>
      </motion.div>
    </div>
  );
}

/**
 * 03 — the laptop is shut and the work is still moving.
 *
 * One motion, not five: a job running to completion. The count climbs, the bar
 * fills, and only when it reaches the end does the file exist. Nothing arrives
 * on a stagger, because nothing about this is a list appearing — it is one task
 * finishing while nobody watches.
 */
function NightShift() {
  const t = useLoopClock(6.4);
  const p = easeOut(clamp01((t - 0.5) / 3.0));     // the run itself
  const done = t >= 3.6;
  const found = Math.round(p * 38);

  return (
    <div className="relative h-[264px] w-full overflow-hidden rounded-2xl bg-neutral-900 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
      {/* moonlight, drifting — CSS, so it keeps its shape whatever the tab does */}
      <div
        aria-hidden
        className="absolute inset-0 animate-[jobs-drift_14s_ease-in-out_infinite] opacity-[0.4]"
        style={{ background: 'radial-gradient(70% 55% at 18% 0%, rgba(255,255,255,0.18), transparent 70%)' }}
      />

      <div className="relative flex h-full flex-col">
        <div className="mb-3 flex items-center gap-2 border-b border-white/[0.07] pb-2.5">
          <img src="/favicon-512.png" alt="" aria-hidden className="h-4 w-4 rounded-[5px]" />
          <span className="text-[11px] font-semibold tracking-wide text-white/80">Argos</span>
          <span className="ml-auto flex items-center gap-1.5 text-[10.5px] text-white/35">
            <Moon className="h-3 w-3" /> 22:41 · laptop closed
          </span>
        </div>

        <div className="ml-auto w-fit max-w-[80%] rounded-xl rounded-br-sm bg-white/[0.14] px-3 py-2 text-[11.5px] leading-snug text-white/90">
          pull every listing and build me a sheet
        </div>

        <div className="mt-auto">
          {/* the run */}
          <div className="mb-2 flex items-baseline gap-2">
            <span className="font-mono text-[26px] leading-none tabular-nums text-white/90">{found}</span>
            <span className="text-[11px] text-white/40">of 38 listings</span>
            <span className="ml-auto text-[10.5px] text-white/35">{done ? 'sent to Telegram' : 'collecting…'}</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.10]">
            <div
              className="h-full rounded-full bg-white/70 transition-[width] duration-100"
              style={{ width: `${p * 100}%` }}
            />
          </div>

          {/* the thing that only exists once the run is over */}
          <div
            className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/[0.10] px-3 py-2.5 backdrop-blur transition-all duration-500"
            style={{ opacity: done ? 1 : 0.12, transform: done ? 'none' : 'translateY(6px)' }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11.5px] font-medium text-white/90">listings.xlsx</span>
              <span className="block text-[10px] text-white/35">38 rows · sorted by price</span>
            </span>
            <Clock className="ml-auto h-3 w-3 shrink-0 text-white/25" />
            <span className="text-[10px] text-white/30">again at 08:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 04 — your own computer.
 *
 * A line sweeps down the folder and every row it passes is filed. One movement
 * across the whole picture, which is what "it went through your Downloads" looks
 * like — as opposed to four rows taking turns sliding in from the left.
 */
function OwnMachine() {
  const t = useLoopClock(6.4);
  const FILES = [
    { name: 'IMG_4471.HEIC', to: 'Photos' },
    { name: 'invoice-mar.pdf', to: 'Finance' },
    { name: 'contract v3.docx', to: 'Clients' },
    { name: 'screenshot 12.png', to: 'Design' },
  ];
  const SWEEP_FROM = 0.8, SWEEP_TO = 3.4;
  const sweep = clamp01((t - SWEEP_FROM) / (SWEEP_TO - SWEEP_FROM)); // 0…1 down the list
  const done = t >= SWEEP_TO + 0.2;
  const sorted = Math.round(easeOut(sweep) * 214);

  return (
    <div className="relative h-[264px] w-full overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-black/[0.02] px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 flex items-center gap-1.5 text-[10.5px] text-neutral-500">
          <FolderOpen className="h-3 w-3" /> Downloads
        </span>
        <span className="ml-auto text-[10px] text-neutral-400">your computer</span>
      </div>

      {/* where the instruction came from — the whole point of the block */}
      <div className="mx-3 mt-2.5 flex items-center gap-2 rounded-lg bg-black/[0.035] px-2.5 py-1.5">
        <Smartphone className="h-3 w-3 shrink-0 text-neutral-400" />
        <span className="truncate text-[10.5px] text-neutral-500">
          from your phone — <span className="text-neutral-700">“sort my Downloads”</span>
        </span>
      </div>

      <div className="relative px-3 pb-3 pt-2">
        {/* the line doing the work */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-3 h-9 rounded-lg"
          style={{
            top: `${8 + sweep * (FILES.length - 1) * 30}px`,
            background: 'linear-gradient(90deg, rgba(18,18,18,0.05), rgba(18,18,18,0.09), rgba(18,18,18,0.02))',
            opacity: sweep > 0 && !done ? 1 : 0,
            transition: 'top 90ms linear, opacity 260ms ease',
          }}
        />
        {FILES.map((f, i) => {
          // filed once the line has reached this row
          const filed = sweep >= (i + 0.6) / FILES.length;
          return (
            <div key={f.name} className="relative mb-1 flex items-center gap-2.5 rounded-lg px-2 py-[6px]">
              <span
                className="h-4 w-4 shrink-0 rounded-[3px] transition-colors duration-300"
                style={{ background: filed ? 'rgba(18,18,18,0.16)' : 'rgba(18,18,18,0.07)' }}
              />
              <span className="min-w-0 flex-1 truncate text-[11.5px] text-neutral-600">{f.name}</span>
              <span className="text-[10px] text-neutral-300">→</span>
              <span
                className="rounded-md px-2 py-[3px] text-[10.5px] font-medium transition-all duration-300"
                style={{
                  background: filed ? 'rgba(18,18,18,0.06)' : 'transparent',
                  color: filed ? 'rgb(64,64,64)' : 'rgb(212,212,212)',
                  boxShadow: filed ? 'none' : 'inset 0 0 0 1px rgba(0,0,0,0.06)',
                }}
              >
                {f.to}
              </span>
            </div>
          );
        })}

        <div className="mt-2 flex items-center gap-2 border-t border-black/[0.05] pt-2.5">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full transition-colors duration-300"
            style={{ background: done ? 'rgb(5,150,105)' : 'rgba(18,18,18,0.10)' }}
          >
            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
          </span>
          <span className="text-[11px] tabular-nums text-neutral-500">
            {sorted} files sorted · nothing opened in a browser
          </span>
        </div>
      </div>
    </div>
  );
}

const JOBS = [
  {
    n: '01',
    situation: 'Thirty fields between you and done',
    body: 'Applications, checkouts, sign-ups, expense forms — the same details you have typed a hundred times. Say it once and it types them for you, on the page you’re already on.',
    art: <FormFilling />,
  },
  {
    n: '02',
    situation: 'The data is on the screen and there’s no export button',
    body: 'Any table, any dashboard, any list. It reads what’s there and hands it back as a spreadsheet, a document or a chart.',
    art: <TableToFile />,
  },
  {
    n: '03',
    situation: 'It’s ten at night and the job isn’t done',
    body: 'Close the laptop. Long tasks carry on in the cloud and land in your Telegram when they’re finished. Put them on a schedule and they run without you at all.',
    art: <NightShift />,
    pro: true,
  },
  {
    n: '04',
    situation: 'The work isn’t in the browser',
    body: 'Your own computer: the files on your disk, the apps you have installed, your logged-in Chrome. Ask from the panel or from your phone — it does the work where the work is.',
    art: <OwnMachine />,
    pro: true,
  },
];

export default function JobsSection() {
  return (
    <section id="use-cases" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <MythLine className="mb-6">Οἱ ἆθλοι · the four labours</MythLine>

        <motion.h2
          {...reveal()}
          className="mx-auto max-w-2xl text-center font-geometric text-[1.9rem] leading-tight tracking-tight sm:text-[2.6rem]"
        >
          Four things it does{' '}
          {/* Solid below sm: background-clip:text does not paint an italic's
              overhang, and on a phone the phrase wraps mid-word and comes out sliced. */}
          <span className="italic text-foreground sm:text-gradient sm:pr-[0.08em]">instead of you</span>
        </motion.h2>

        <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-28">
          {JOBS.map((job, i) => (
            <motion.div
              key={job.n}
              {...reveal()}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              <div>
                <span className="font-mono text-[12px] tracking-[0.22em] text-muted-foreground/50">{job.n}</span>
                <h3 className="mt-3 max-w-md font-serif text-[1.6rem] leading-[1.2] tracking-tight sm:text-[2rem]">
                  {job.situation}
                  {job.pro && <ProTag />}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">{job.body}</p>
              </div>
              <div className="lg-glass rounded-3xl p-4 sm:p-5">{job.art}</div>
            </motion.div>
          ))}
        </div>

        {/* The decision does not happen in one place, so the button is where the
            person is when they make it — not back at the top of the page. */}
        <motion.div {...reveal()} className="mt-20 sm:mt-28">
          <InstallButton size="md" showSignIn={false} />
        </motion.div>

        <MeanderBand className="mx-auto mt-20 w-52 opacity-30" color="#8a6d3b" />
      </div>
    </section>
  );
}
