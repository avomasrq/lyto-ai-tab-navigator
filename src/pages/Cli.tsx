import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Copy, Check, Loader2, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import {
  type OS, type CliStatus, OS_LABEL, CLI_API_URL,
  detectOS, installCommand, fetchCliStatus, mintPairingCode, PairingError,
} from '@/lib/cli';
import { cn } from '@/lib/utils';

const Footer = lazy(() => import('@/components/Footer'));

/* ════════════════════════════════════════════════════════════════════════
   /cli — launch page for the Lyto desktop agent. Light like the rest of the
   site; the terminals themselves stay dark (they're terminals).
   Star of the show: an auto-typing terminal replaying a real session.
   ════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────── Typing terminal ─────────────────────────── */

type TLine =
  | { t: 'cmd'; text: string }                      // typed char-by-char after $
  | { t: 'ok' | 'act' | 'dim'; text: string }
  | { t: 'tg'; from: string; text: string }
  | { t: 'gap' }
  | { t: 'pause'; ms: number };

const SESSION: TLine[] = [
  { t: 'cmd', text: 'curl -fsSL https://api.trylyto.com/cli | LYTO_TOKEN=•••• bash' },
  { t: 'pause', ms: 500 },
  { t: 'ok', text: 'Pro verified — lyto-cli installed' },
  { t: 'ok', text: 'Background service registered · starts on login' },
  { t: 'pause', ms: 400 },
  { t: 'dim', text: '● agent online — waiting for your word' },
  { t: 'gap' },
  { t: 'pause', ms: 1200 },
  { t: 'tg', from: 'Telegram · you', text: 'turn ~/Downloads/q2-sales.csv into a PDF report' },
  { t: 'pause', ms: 700 },
  { t: 'act', text: 'shell   python3 build_report.py q2-sales.csv' },
  { t: 'pause', ms: 900 },
  { t: 'act', text: 'chart   revenue-by-region.png rendered' },
  { t: 'pause', ms: 700 },
  { t: 'act', text: 'file    report.pdf · 14 pages · 1.2 MB' },
  { t: 'pause', ms: 600 },
  { t: 'ok', text: 'sent back to Telegram · 41s' },
  { t: 'gap' },
  { t: 'pause', ms: 1400 },
  { t: 'tg', from: 'Telegram · you', text: 'now clean up old node_modules across ~/projects' },
  { t: 'pause', ms: 700 },
  { t: 'act', text: 'shell   find ~/projects -name node_modules -prune' },
  { t: 'pause', ms: 800 },
  { t: 'dim', text: '⚠ destructive — asking you first…' },
  { t: 'pause', ms: 900 },
  { t: 'tg', from: 'Telegram · you', text: 'Yes ✓' },
  { t: 'pause', ms: 700 },
  { t: 'ok', text: '9.4 GB freed across 23 projects' },
];

function useTerminalPlayer(active: boolean) {
  const [lines, setLines] = useState<{ line: TLine; partial?: string }[]>([]);
  const runId = useRef(0);

  useEffect(() => {
    if (!active) return;
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      await sleep(600);
      while (alive()) {
        setLines([]);
        for (const line of SESSION) {
          if (!alive()) return;
          if (line.t === 'pause') { await sleep(line.ms); continue; }
          if (line.t === 'cmd') {
            setLines((p) => [...p, { line, partial: '' }]);
            for (let i = 1; i <= line.text.length; i++) {
              if (!alive()) return;
              const partial = line.text.slice(0, i);
              setLines((p) => [...p.slice(0, -1), { line, partial }]);
              await sleep(line.text[i - 1] === ' ' ? 24 : 14 + Math.random() * 26);
            }
            await sleep(350);
          } else {
            setLines((p) => [...p, { line }]);
            await sleep(90);
          }
        }
        await sleep(3200);
      }
    })();

    return () => { runId.current++; };
  }, [active]);

  return lines;
}

const Cursor = () => (
  <span className="inline-block w-[7px] h-[15px] bg-primary align-middle ml-0.5 animate-pulse" style={{ animationDuration: '0.9s' }} />
);

function TypingTerminal() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-80px' });
  const lines = useTerminalPlayer(inView);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div ref={wrapRef} className="relative">
      <div className="absolute -inset-5 rounded-[30px] bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
        {/* chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/40">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-[11px] font-mono text-muted-foreground/50 select-none">you@macbook — lyto</span>
          <span className="w-12" />
        </div>
        {/* body */}
        <div ref={scrollRef} className="h-[340px] sm:h-[400px] overflow-y-auto px-5 py-4 font-mono text-[12px] sm:text-[12.5px] leading-[1.85] [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {lines.map(({ line, partial }, i) => {
            const isLast = i === lines.length - 1;
            switch (line.t) {
              case 'cmd':
                return (
                  <div key={i} className="text-foreground/90 break-all">
                    <span className="text-green-600 select-none">$ </span>
                    {partial ?? line.text}
                    {isLast && <Cursor />}
                  </div>
                );
              case 'ok':
                return <div key={i} className="text-green-600"><span className="select-none">✓ </span>{line.text}</div>;
              case 'act':
                return <div key={i} className="text-foreground/65"><span className="text-primary select-none">→ </span><span className="text-muted-foreground/60">{line.text.split('   ')[0]}</span>   {line.text.split('   ').slice(1).join('   ')}</div>;
              case 'dim':
                return <div key={i} className="text-muted-foreground/70">{line.text}</div>;
              case 'tg':
                return (
                  <div key={i} className="my-1.5 inline-block rounded-lg rounded-tl-sm bg-primary/[0.08] border border-primary/25 px-3 py-1.5 max-w-full">
                    <span className="block text-[9.5px] uppercase tracking-widest text-primary mb-0.5">{line.from}</span>
                    <span className="text-foreground/85">{line.text}</span>
                  </div>
                );
              case 'gap':
                return <div key={i} className="h-3" />;
              default:
                return null;
            }
          })}
          {lines.length === 0 && <div className="text-muted-foreground/50">booting<Cursor /></div>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Phone (Telegram, light) ─────────────────────────── */

type ChatMsg =
  | { who: 'you'; text: string }
  | { who: 'lyto'; text: string }
  | { who: 'lyto-file'; name: string; meta: string; kind: string }
  | { who: 'lyto-approve'; text: string };

// One flat conversation, appended message by message; the window keeps the tail.
const CHAT_SCRIPT: ChatMsg[] = [
  { who: 'you', text: 'Sort my Downloads into project folders' },
  { who: 'lyto', text: 'Done — 214 files into 8 folders. Screenshots → /Design, invoices → /Finance.' },
  { who: 'you', text: 'Make a PDF report from q2-sales.csv' },
  { who: 'lyto-file', name: 'report.pdf', meta: '14 pages · 1.2 MB', kind: 'PDF' },
  { who: 'lyto', text: 'Charts included. Anything to change?' },
  { who: 'you', text: 'Delete the old builds folder' },
  { who: 'lyto-approve', text: 'Run rm -rf ~/old-builds? This is destructive.' },
  { who: 'you', text: 'Yes' },
  { who: 'lyto', text: '3.1 GB freed ✓' },
  { who: 'you', text: 'Find the cheapest flight ALA → DXB on Friday' },
  { who: 'lyto', text: 'Air Astana 9:40 — $214. Opened checkout in your browser, logged in as you.' },
];

const VISIBLE_MSGS = 7;

function PhoneChat() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-100px' });
  const [count, setCount] = useState(2); // start with a bit of history so it never looks empty
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      let i = 2;
      while (!cancelled) {
        if (i >= CHAT_SCRIPT.length) {
          await sleep(3500);
          if (cancelled) return;
          i = 0;
          setCount(0);
          await sleep(400);
        }
        const next = CHAT_SCRIPT[i];
        if (next.who !== 'you') {
          setTyping(true);
          await sleep(1100);
          if (cancelled) return;
          setTyping(false);
        }
        i += 1;
        setCount(i);
        await sleep(next.who === 'you' ? 1100 : 1900);
      }
    })();

    return () => { cancelled = true; };
  }, [inView]);

  const msgs = CHAT_SCRIPT.slice(Math.max(0, count - VISIBLE_MSGS), count);

  return (
    <div ref={wrapRef} className="relative mx-auto w-[290px] sm:w-[305px]">
      <div className="absolute -inset-10 rounded-[70px] bg-primary/10 blur-3xl pointer-events-none" />
      {/* frame */}
      <div className="relative rounded-[48px] bg-neutral-900 p-[9px] shadow-2xl shadow-black/25 ring-1 ring-black/10">
        <div className="rounded-[38px] bg-[#f6f5f3] overflow-hidden">

          {/* status bar */}
          <div className="flex items-center justify-between px-7 pt-3 pb-1">
            <span className="text-[11px] font-semibold text-neutral-900">9:41</span>
            <span className="h-[18px] w-[74px] rounded-full bg-neutral-900" />
            <span className="flex items-center gap-1">
              <svg className="w-[15px] h-[11px] text-neutral-900" viewBox="0 0 16 12" fill="currentColor"><path d="M8 9.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM4.5 7.6a5 5 0 017 0l-1.06 1.06a3.5 3.5 0 00-4.88 0L4.5 7.6zM2 5.1a8.5 8.5 0 0112 0l-1.06 1.06a7 7 0 00-9.88 0L2 5.1z"/></svg>
              <svg className="w-[20px] h-[11px] text-neutral-900" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor"/><rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor"/><path d="M23.5 4v4a2 2 0 000-4z" fill="currentColor"/></svg>
            </span>
          </div>

          {/* chat header */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/80 backdrop-blur border-b border-neutral-200/70">
            <span className="text-primary text-[17px] leading-none select-none">‹</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-[13px] font-bold text-white shrink-0">L</div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-neutral-900 leading-tight">Lyto</p>
              <p className="text-[10.5px] text-green-600 leading-tight">online</p>
            </div>
          </div>

          {/* messages */}
          <div className="h-[452px] px-3 py-3 flex flex-col justify-end gap-[7px] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {msgs.map((m, idx) => {
                const key = `${count - msgs.length + idx}`;
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
                    transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    className={cn('max-w-[82%]', m.who === 'you' ? 'self-end' : 'self-start')}
                  >
                    {m.who === 'you' && (
                      <div className="rounded-[18px] rounded-br-[6px] bg-primary px-3.5 py-2 text-[13px] leading-snug text-white shadow-sm">{m.text}</div>
                    )}
                    {m.who === 'lyto' && (
                      <div className="rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-2 text-[13px] leading-snug text-neutral-800 shadow-sm border border-neutral-200/60">{m.text}</div>
                    )}
                    {m.who === 'lyto-file' && (
                      <div className="rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-2.5 shadow-sm border border-neutral-200/60 flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center font-mono text-[9.5px] font-bold text-primary shrink-0">{m.kind}</div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-neutral-900 leading-tight truncate">{m.name}</p>
                          <p className="text-[10.5px] text-neutral-400 mt-0.5">{m.meta}</p>
                        </div>
                      </div>
                    )}
                    {m.who === 'lyto-approve' && (
                      <div className="rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-2.5 shadow-sm border border-amber-300/70">
                        <p className="text-[12.5px] leading-snug text-neutral-800"><span className="text-amber-500 font-semibold">⚠ </span>{m.text}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[11.5px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3.5 py-1">Yes</span>
                          <span className="text-[11.5px] font-semibold text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg px-3.5 py-1">No</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {typing && (
                <motion.div
                  key={`typing-${count}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  className="self-start rounded-[18px] rounded-bl-[6px] bg-white border border-neutral-200/60 shadow-sm px-4 py-2.5 flex gap-1"
                >
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 rounded-full bg-neutral-300 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* input bar */}
          <div className="flex items-center gap-2 px-3 pb-4 pt-1">
            <div className="flex-1 h-9 rounded-full bg-white border border-neutral-200/80 px-4 flex items-center">
              <span className="text-[12.5px] text-neutral-300 select-none">Message</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white translate-x-[1px]" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a.993.993 0 00-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Install widget ─────────────────────────── */

function Installer() {
  const [status, setStatus] = useState<CliStatus | null>(null);
  const [checked, setChecked] = useState(false); // first status fetch done → we know signed-in vs not
  const [os, setOs] = useState<OS>(detectOS());
  const [pairing, setPairing] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<{ msg: string; needsPro: boolean; unauthed: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const s = await fetchCliStatus();
      if (!cancelled) { setStatus(s); setChecked(true); }
    };
    void tick();
    const id = setInterval(tick, 5000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const mint = useCallback(async () => {
    setMinting(true); setError(null);
    try {
      setPairing(await mintPairingCode());
    } catch (e) {
      if (e instanceof PairingError) setError({ msg: e.message, needsPro: e.code === 'needs_pro', unauthed: e.code === 'unauthed' });
      else setError({ msg: 'Something went wrong.', needsPro: false, unauthed: false });
    } finally {
      setMinting(false);
    }
  }, []);

  const command = installCommand(os, pairing ?? '');
  const online = status?.connected;

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* blocked */ }
  }, [command]);

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[26px] bg-primary/10 blur-2xl pointer-events-none" />
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/10">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/40">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="flex-1 text-center text-[11px] font-mono text-muted-foreground/50 select-none">installer</span>
          <span className="mr-2 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-primary select-none">PRO ONLY</span>
          {status && (
            <span className={cn(
              'inline-flex items-center gap-1.5 text-[9.5px] font-bold tracking-widest',
              online ? 'text-green-600' : 'text-muted-foreground/50',
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', online ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30')} />
              {online ? 'ONLINE' : 'OFFLINE'}
            </span>
          )}
        </div>

        {/* Gate: no account → sign in; Free → upgrade. The command stays visible but
            blurred behind a lock — you can see what you'd get, not copy it. */}
        <div className="relative">
        <div
          className={cn(
            'p-5',
            (!checked || !status || !status.entitled) &&
              'pointer-events-none select-none min-h-[500px] flex flex-col justify-center',
          )}
          aria-hidden={!checked || !status || !status.entitled || undefined}
        >
          <div className="flex items-center gap-1 mb-4 p-1 rounded-xl bg-muted/60 w-fit">
            {(['mac', 'windows', 'linux'] as OS[]).map((o) => (
              <button
                key={o}
                onClick={() => setOs(o)}
                className={cn(
                  'text-xs font-medium px-4 py-1.5 rounded-lg transition-colors',
                  os === o ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {OS_LABEL[o]}
              </button>
            ))}
          </div>

          <div className="relative">
            <pre className="text-[12px] sm:text-[12.5px] leading-relaxed text-foreground/85 bg-muted/50 border border-border/70 rounded-xl px-4 py-3.5 pr-12 overflow-x-auto font-mono whitespace-pre-wrap break-all">
              <span className="text-green-600 select-none">$ </span>{command}
            </pre>
            <button
              onClick={copy}
              className="absolute top-2.5 right-2.5 h-8 w-8 rounded-lg bg-background border border-border/70 hover:bg-muted text-foreground/70 flex items-center justify-center transition-colors"
              aria-label="Copy command"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* piping a remote script into your shell deserves a look first */}
          <div className="mt-2 px-1">
            <a
              href={`${CLI_API_URL}${os === 'windows' ? '/cli/win' : '/cli'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11.5px] font-medium text-primary hover:underline"
            >
              Read the script before you run it →
            </a>
          </div>

          <div className="mt-4">
            {pairing ? (
              <p className="text-xs text-center text-muted-foreground">
                {online
                  ? '✓ A machine is already connected — running this pairs another.'
                  : status?.paired
                    ? 'Paired but offline — start the agent to bring it online.'
                    : 'Paste it into your terminal. The code is single-use and gates your download.'}
              </p>
            ) : (
              <button
                onClick={mint}
                disabled={minting}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {minting && <Loader2 className="h-4 w-4 animate-spin" />}
                {minting ? 'Generating your code…' : 'Get my pairing code →'}
              </button>
            )}
            {error && (
              <div className="mt-3 text-center">
                <p className="text-xs text-red-500">{error.msg}</p>
                {error.needsPro && <a href="/#pricing" className="inline-block mt-1.5 text-xs font-semibold text-primary hover:underline">Upgrade to Pro →</a>}
                {error.unauthed && <a href="/auth" className="inline-block mt-1.5 text-xs font-semibold text-primary hover:underline">Sign in →</a>}
              </div>
            )}
            <p className="mt-3 text-[11px] text-center text-muted-foreground/60">
              Lyto Pro · macOS, Windows &amp; Linux · installs Node if missing
            </p>
          </div>
        </div>

        {/* Liquid-glass lock: the veil does the blur (backdrop-filter), the card
            floats on top — same glass language as the extension's Tasks paywall. */}
        {(!checked || !status || !status.entitled) && (
          <div className="cli-glass-veil absolute inset-0 z-10 flex items-center justify-center p-5">
            {!checked ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
            ) : !status ? (
              <div className="cli-glass-card cli-glass-halo relative overflow-hidden w-full max-w-[340px] rounded-[24px] p-6 text-center">
                <div className="cli-sheen absolute inset-0 overflow-hidden rounded-[24px]" />
                <div className="relative">
                  {/* the Lyto mark behind the glass — with a small lock riding it */}
                  <div className="relative mx-auto h-14 w-14">
                    <span className="cli-orb-aura" />
                    <img
                      src="/Lytoailogo.png"
                      alt="Lyto"
                      className="relative h-14 w-14 rounded-[14px] object-contain"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(194,65,12,0.35))' }}
                    />
                    <span className="cli-glass-chip absolute -bottom-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full">
                      <Lock className="h-3 w-3 text-foreground/70" />
                    </span>
                  </div>
                  <p className="mt-4 text-[15px] font-semibold text-foreground">Sign in to unlock your command</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    The installer is personal — it carries a pairing code tied to your Lyto account.
                  </p>
                  <a
                    href="/auth"
                    className="relative mt-4 block w-full overflow-hidden rounded-full py-2.5 text-[13px] font-semibold text-white shadow-[0_5px_18px_rgba(0,0,0,0.22)] transition-all hover:shadow-[0_7px_24px_rgba(0,0,0,0.28)]"
                    style={{ background: 'linear-gradient(180deg, #5B5B63, #3F3F46)' }}
                  >
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/30 to-transparent" />
                    <span className="relative">Sign in →</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="cli-glass-card cli-glass-halo relative overflow-hidden w-full max-w-[350px] rounded-[24px] p-5">
                <div className="cli-sheen absolute inset-0 overflow-hidden rounded-[24px]" />
                <div className="relative">
                <div className="flex items-center gap-2.5">
                  <img src="/Lytoailogo.png" alt="Lyto" className="h-7 w-7 rounded-[8px] object-contain" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }} />
                  <span className="text-[14px] font-semibold tracking-tight text-foreground">Lyto Pro</span>
                  <span className="cli-glass-chip ml-auto flex h-7 w-7 items-center justify-center rounded-full">
                    <Lock className="h-3 w-3 text-foreground/70" />
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[13px] line-through text-muted-foreground/50">$25</span>
                  <span className="text-[30px] leading-none font-bold tracking-tight text-foreground">$15</span>
                  <span className="text-[12px] text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground">
                  Your computer, answering your texts — part of Lyto Pro.
                </p>

                <div className="my-3.5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                <ul className="space-y-2.5">
                  {[
                    ['On your own machine', 'The desktop agent runs locally with your own key — your files, your browser, your control.'],
                    ['In your messengers', 'Text it from Telegram or WhatsApp — your computer answers from anywhere.'],
                    ["Works while you're away", 'Always on: starts on login, keeps going with the lid closed.'],
                  ].map(([t, s]) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-[1px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/15">
                        <svg className="h-2.5 w-2.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold leading-snug text-foreground">{t}</p>
                        <p className="text-[11px] leading-snug text-muted-foreground mt-0.5">{s}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <a
                  href="/#pricing"
                  className="relative mt-4 block w-full overflow-hidden rounded-full py-3 text-center text-[13px] font-semibold text-white shadow-[0_5px_18px_rgba(0,0,0,0.22)] transition-all hover:shadow-[0_7px_24px_rgba(0,0,0,0.28)]"
                  style={{ background: 'linear-gradient(180deg, #5B5B63, #3F3F46)' }}
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/30 to-transparent" />
                  <span className="relative">Start 3-day free trial →</span>
                </a>
                <p className="mt-2 text-center text-[10px] text-muted-foreground/70">3 days free, then $15/mo. Cancel anytime.</p>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Capabilities ─────────────────────────── */

const PRIMITIVES: { glyph: string; title: string; body: string }[] = [
  { glyph: '>_', title: 'The shell — your whole machine', body: 'Files, apps, ffmpeg, pandoc, git, installs, scripts. It drives your computer through the real terminal, exactly like a coding agent — no pixel-clicking, no fragile macros.' },
  { glyph: '◉', title: 'A real browser, logged in as you', body: 'Your actual Chrome profile — sessions, cookies, autofill. It books, buys and fills forms under your accounts, on your machine.' },
];

const TRAITS: { glyph: string; title: string; body: string }[] = [
  { glyph: '✓', title: 'Asks before it breaks things', body: 'rm -rf, sudo, git push — anything destructive stops and waits for your explicit Yes. Only your paired account can command it.' },
  { glyph: '⌁', title: 'Your key, your model', body: 'Gemini, Claude, OpenAI, OpenRouter or local Ollama. You pay the provider directly — zero markup.' },
  { glyph: '∞', title: 'Always on', body: 'Starts on login, restarts on crash. launchd · Windows Startup · systemd. Close the lid on the terminal, not on Lyto.' },
];

/* ─────────────────────────── Full guide data (mirrors COMMANDS.md) ─────────────────────────── */

const GUIDE_CORE: { cmd: string; desc: string }[] = [
  { cmd: 'lyto-cli', desc: 'Run the agent right here, in this terminal. Stop with Ctrl+C.' },
  { cmd: 'lyto-cli setup', desc: 'The setup wizard — also reconfigure: provider, key, pairing, browser. Enter keeps the current value.' },
  { cmd: 'lyto-cli setup --token <code>', desc: 'Same wizard with your pairing code (the one from this page) pre-filled. The installer runs this for you — you almost never type it yourself.' },
  { cmd: 'lyto-cli uninstall', desc: 'Remove everything — service, config & keys, Chrome profile, the package. Keeps your workspace files.' },
  { cmd: 'lyto-cli uninstall --purge', desc: 'Same, but also deletes the workspace files.' },
  { cmd: 'lyto-cli --version · --help', desc: 'Version / quick reference.' },
];

const GUIDE_SERVICE: { cmd: string; desc: string }[] = [
  { cmd: 'lyto-cli service install', desc: 'Run as a background service — starts on login, restarts on crash, no terminal window.' },
  { cmd: 'lyto-cli service start · stop', desc: 'Start / stop. Stopped stays installed — it comes back on next login or start.' },
  { cmd: 'lyto-cli service restart', desc: 'Apply a settings change.' },
  { cmd: 'lyto-cli service status', desc: 'Is it running? Plus the path to the logs.' },
  { cmd: 'lyto-cli service logs', desc: 'Tail what it has been doing.' },
  { cmd: 'lyto-cli service uninstall', desc: 'Remove just the autostart — config and package stay.' },
];

const GUIDE_RECIPES: { want: string; run: string }[] = [
  { want: 'Try it once, watch the output', run: 'lyto-cli' },
  { want: 'Have it always running', run: 'lyto-cli service install' },
  { want: 'Change model / key / settings', run: 'lyto-cli setup, then lyto-cli service restart' },
  { want: 'Something looks stuck', run: 'lyto-cli service status, then lyto-cli service logs' },
  { want: 'Remove it completely', run: 'lyto-cli uninstall' },
];

const GUIDE_PATHS: { path: string; what: string }[] = [
  { path: '~/.lyto/.env', what: 'Config + your model key' },
  { path: '~/.lyto/logs/', what: 'Agent logs (out + err)' },
  { path: '~/.lyto/browser/', what: "Lyto's Chrome profile, with your logins" },
  { path: '~/LytoWorkspace', what: 'Its workspace — where files land' },
];

const GUIDE_TG: { say: string; happens: string }[] = [
  { say: '“Sort my Downloads into folders”', happens: 'Plans the steps, runs them in the shell, reports back.' },
  { say: '“Make a PDF from this spreadsheet”', happens: 'Builds it on your machine and sends the file into the chat.' },
  { say: 'Send it a file + “save this properly”', happens: 'Files land in the workspace, sorted where they belong.' },
  { say: '“Book / order / fill in …”', happens: 'Uses the real browser with your logged-in accounts.' },
  { say: 'Anything destructive', happens: 'It stops and asks Yes/No before running. Your call, always.' },
];

/* ─────────────────────────── ASCII art background ─────────────────────────── */

function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_30XIKFZ370uhAIEjYnAUVACE5e3/8bb18be3-c64f-4b68-9f09-73e66c6d2602.mp4"
      poster="https://assets.21st.dev/ascii-recipes/thumbnails/user_30XIKFZ370uhAIEjYnAUVACE5e3/e0e7cd29-ec3d-4f34-a90f-0cc3f15dc33e.webp"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}

/* ─────────────────────────── Page ─────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.21, 0.6, 0.35, 1] },
} as const;

const SectionHead = ({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) => (
  <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-4">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-[1.12] tracking-tight text-foreground">{title}</h2>
    {sub && <p className="mt-4 text-muted-foreground text-base leading-relaxed">{sub}</p>}
  </motion.div>
);

const Cli = () => {
  useEffect(() => {
    document.title = 'Lyto CLI — your computer, on your side';
    return () => { document.title = 'Lyto AI'; };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <EtherealShadow color="rgba(249, 115, 22, 1)" noise={{ opacity: 0.5, scale: 1.2 }} sizing="fill" />
        </div>
        {/* ASCII art — sits between the ethereal bg and content, right-side anchored */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <AsciiArt className="absolute right-0 top-0 h-full w-full opacity-[0.18] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.15]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-16 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center w-full">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-primary mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              LYTO CLI — OUT NOW
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[9.5px] font-bold tracking-widest text-white">PRO</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08 }}
              className="font-serif text-[2.6rem] sm:text-6xl lg:text-[4rem] leading-[1.08] tracking-tight text-foreground"
            >
              Your computer,
              <br />
              <span className="text-gradient italic">on your side</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.18 }}
              className="mt-7 text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              A local agent with your shell and your logged-in browser.
              Text it from Telegram — it does the rest while you're anywhere else.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }}
              className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#install"
                className="group w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 text-center"
              >
                Install in one line
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
              </a>
              <span className="font-mono text-[11.5px] text-muted-foreground/60">$ one command · needs Lyto Pro</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 1.4, delay: 0.35 }}
          >
            <TypingTerminal />
          </motion.div>
        </div>
      </section>

      {/* ── Phone duet ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeUp} className="order-2 lg:order-1">
            <PhoneChat />
          </motion.div>
          <motion.div {...fadeUp} className="order-1 lg:order-2 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary mb-4">From your pocket</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.12] tracking-tight text-foreground">
              Text your computer
              <br />
              <span className="text-gradient italic">like a person</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md mx-auto lg:mx-0">
              No dashboards, no syntax. Open Telegram, say what you want in plain
              language, get the finished thing back — a file, a booking, a clean folder.
              Your machine at home does the work; your phone gets the receipt.
            </p>
            <ul className="mt-8 space-y-3.5 text-left max-w-md mx-auto lg:mx-0">
              {[
                ['Plain words in, finished work out', 'no commands to memorize — it plans its own steps'],
                ['Sends real files back', 'PDFs, videos, spreadsheets — straight into the chat'],
                ['Asks before anything risky', 'destructive commands wait for your Yes'],
                ['Works from the extension too', 'ask Lyto in your browser and it routes the task to your machine'],
              ].map(([t, s]) => (
                <li key={t} className="flex items-start gap-3.5">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-[15px] text-foreground font-medium">{t}</p>
                    <p className="text-[13px] text-muted-foreground mt-0.5">{s}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Two primitives"
            title={<>Not a set of features. <span className="italic text-muted-foreground/70">A whole machine.</span></>}
            sub="Everything it can do reduces to two things — and together they cover almost everything."
          />
          {/* the two primitives — exactly two */}
          <motion.div {...fadeUp} className="grid sm:grid-cols-2 gap-4">
            {PRIMITIVES.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-8 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/25"
              >
                <span className="font-mono text-[26px] text-primary select-none">{b.glyph}</span>
                <h3 className="mt-4 text-[19px] font-semibold tracking-tight text-foreground">{b.title}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </motion.div>

          {/* what makes handing them over sane */}
          <motion.p {...fadeUp} className="mt-12 mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/60">
            …and what makes it safe to hand them over
          </motion.p>
          <motion.div {...fadeUp} className="grid sm:grid-cols-3 gap-4">
            {TRAITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/25"
              >
                <span className="font-mono text-[20px] text-primary select-none">{b.glyph}</span>
                <h3 className="mt-3.5 text-[16px] font-semibold tracking-tight text-foreground">{b.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Install ── */}
      <section id="install" className="relative py-20 sm:py-28 px-4 sm:px-6 scroll-mt-20">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            eyebrow="Install"
            title={<>One line. <span className="text-gradient italic">That's the setup.</span></>}
            sub="The desktop agent is part of Lyto Pro — an active subscription is required to install and connect it."
          />
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
            <motion.div {...fadeUp}>
              <Installer />
            </motion.div>
            <motion.ol {...fadeUp} className="space-y-7">
              {[
                ['Get your pairing code', 'One tap on this page (needs Lyto Pro). Single-use — it verifies your subscription and pairs the machine.'],
                ['Paste the line into your terminal', 'It installs Node if needed, pulls the CLI, and walks you through a 60-second wizard: your model key, your browser.'],
                ['Message it from Telegram', 'The status flips to Online. From now on your computer answers your texts.'],
              ].map(([t, s], i) => (
                <li key={t} className="flex gap-5">
                  <span className="font-mono text-[13px] text-primary pt-0.5 select-none">0{i + 1}</span>
                  <div>
                    <p className="text-[16px] font-semibold text-foreground">{t}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{s}</p>
                  </div>
                </li>
              ))}
            </motion.ol>
          </div>

          {/* what you're trusting, exactly — the whole ask, spelled out */}
          <motion.div {...fadeUp} className="mt-10 rounded-2xl border border-border bg-card p-6">
            <p className="text-[13px] font-semibold text-foreground">What you're trusting, exactly</p>
            <div className="mt-3 grid sm:grid-cols-3 gap-4">
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="text-foreground/80 font-medium">The script is public.</span>{' '}
                <a href={`${CLI_API_URL}/cli`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read it</a> — it installs Node if missing, installs <code className="font-mono text-[11.5px]">lyto-cli</code>, and registers a login service. Nothing else.
              </p>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="text-foreground/80 font-medium">Your data stays local.</span>{' '}
                Your model key, files and browser profile never leave your machine. The pairing code only gates the download and links the agent to your account.
              </p>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="text-foreground/80 font-medium">Nothing runs silently.</span>{' '}
                Destructive commands stop and wait for your explicit Yes. Remove it all anytime with <code className="font-mono text-[11.5px]">lyto-cli uninstall</code>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Full guide ── */}
      <section id="guide" className="relative py-20 sm:py-28 px-4 sm:px-6 bg-muted/30 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="The full guide"
            title={<>Everything you'll <span className="text-gradient italic">ever type</span></>}
            sub="A handful of commands in the terminal — type each one exactly as shown, then press Enter. Everything else happens in Telegram, in plain language."
          />

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Recipes — the commands people actually use, front and center */}
            <motion.div {...fadeUp} className="lg:col-span-2 rounded-2xl border border-primary/30 bg-card overflow-hidden shadow-lg shadow-primary/5">
              <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between bg-primary/[0.04]">
                <p className="text-[15px] font-semibold text-foreground">I want to…</p>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">start here</span>
              </div>
              <div className="divide-y divide-border/50">
                {GUIDE_RECIPES.map((r) => (
                  <div key={r.want} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                    <p className="text-[14px] text-foreground/90 font-medium sm:w-[280px] shrink-0">{r.want}</p>
                    <code className="font-mono text-[13px] text-primary break-all">{r.run}</code>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Core commands */}
            <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Core commands</p>
                <span className="font-mono text-[10px] text-muted-foreground/60">lyto-cli</span>
              </div>
              <div className="divide-y divide-border/50">
                {GUIDE_CORE.map((c) => (
                  <div key={c.cmd} className="px-5 py-3">
                    <code className="font-mono text-[12.5px] text-primary break-all">{c.cmd}</code>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Service */}
            <motion.div {...fadeUp} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Background service</p>
                <span className="text-[10px] text-muted-foreground/60">the always-on mode</span>
              </div>
              <div className="divide-y divide-border/50">
                {GUIDE_SERVICE.map((c) => (
                  <div key={c.cmd} className="px-5 py-3">
                    <code className="font-mono text-[12.5px] text-primary break-all">{c.cmd}</code>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Paths */}
            <motion.div {...fadeUp} className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/60">
                <p className="text-sm font-semibold text-foreground">Where things live</p>
              </div>
              <div className="divide-y divide-border/50">
                {GUIDE_PATHS.map((p) => (
                  <div key={p.path} className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <code className="font-mono text-[12px] text-primary sm:w-[240px] shrink-0 break-all">{p.path}</code>
                    <p className="text-[13px] text-muted-foreground">{p.what}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3.5 border-t border-border/60 bg-muted/30">
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Providers out of the box: <span className="text-foreground/75">Gemini (default), Claude, OpenAI, OpenRouter, local Ollama / vLLM</span> — set with <code className="font-mono text-primary">lyto-cli setup</code>.
                </p>
              </div>
            </motion.div>

            {/* Telegram — full width */}
            <motion.div {...fadeUp} className="lg:col-span-2 rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">In Telegram — no commands, just talk</p>
                <span className="text-[10px] text-muted-foreground/60">plain language</span>
              </div>
              <div className="divide-y divide-border/50">
                {GUIDE_TG.map((t) => (
                  <div key={t.say} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
                    <p className="text-[13.5px] font-medium text-foreground sm:w-[320px] shrink-0">{t.say}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{t.happens}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3.5 border-t border-border/60 bg-muted/30">
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Not just Telegram — ask Lyto in the <span className="text-foreground/75">browser extension</span> to run something in the background, and with your desktop agent online it routes the task to <span className="text-foreground/75">your own machine</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-transparent p-10 sm:p-14 text-center overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="font-serif text-3xl sm:text-5xl leading-[1.1] tracking-tight text-foreground">
                Give Lyto <span className="text-gradient italic">its own computer</span>
              </h2>
              <p className="mt-5 text-muted-foreground max-w-md mx-auto leading-relaxed">
                Yours. The one it already knows — with your files, your logins, your setup.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#install"
                  className="rounded-full bg-primary px-9 py-3.5 text-[15px] font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Install the CLI →
                </a>
                <a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                  See Pro pricing
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Cli;
