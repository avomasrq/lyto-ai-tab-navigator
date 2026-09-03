import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { EtherealShadow } from '@/components/ui/etheral-shadow';
import { FadeIn } from '@/components/ui/fade-in';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import {
  type OS, type CliStatus, OS_LABEL, CLI_API_URL,
  detectOS, installCommand, fetchCliStatus, mintPairingCode, unpairCli, PairingError,
} from '@/lib/cli';
import { cn } from '@/lib/utils';
import { AnnouncementBanner } from '@/components/ui/upgrade-banner';
import { DrawnLabel } from '@/components/ui/drawn-label';
import { RibbonField } from '@/components/ui/ribbon-field';
import { TelegramConnect } from '@/components/cli/TelegramConnect';
import { Cmd, SectionHead, fadeUp } from '@/components/cli/ui';
import { toast } from 'sonner';

const Footer = lazy(() => import('@/components/Footer'));

/* ── tiny hand-made glyphs (no icon library) ── */

const Spinner = ({ className }: { className?: string }) => (
  <span className={cn('inline-block rounded-full border-2 border-current border-t-transparent animate-spin', className)} />
);

const LockGlyph = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
    <rect x="3" y="7" width="10" height="7" rx="2" fill="currentColor" opacity="0.85" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════════
   /cli — launch page for the Argos desktop agent. Light like the rest of the
   site; the terminals themselves stay dark (they're terminals).
   Star of the show: an auto-typing terminal replaying a real session.
   ════════════════════════════════════════════════════════════════════════ */

/* ─────────────────────────── Phone (Telegram, light) ─────────────────────────── */

type ChatMsg =
  | { who: 'you'; text: string }
  | { who: 'argos'; text: string }
  | { who: 'argos-file'; name: string; meta: string; kind: string }
  | { who: 'argos-approve'; text: string };

// One flat conversation, appended message by message; the window keeps the tail.
const CHAT_SCRIPT: ChatMsg[] = [
  { who: 'you', text: 'Sort my Downloads into project folders' },
  { who: 'argos', text: 'Done. 214 files into 8 folders: screenshots → /Design, invoices → /Finance.' },
  { who: 'you', text: 'Make a PDF report from q2-sales.csv' },
  { who: 'argos-file', name: 'report.pdf', meta: '14 pages · 1.2 MB', kind: 'PDF' },
  { who: 'argos', text: 'Charts included. Anything to change?' },
  { who: 'you', text: 'Delete the old builds folder' },
  { who: 'argos-approve', text: 'Run rm -rf ~/old-builds? This is destructive.' },
  { who: 'you', text: 'Yes' },
  { who: 'argos', text: '3.1 GB freed ✓' },
  { who: 'you', text: 'Find the cheapest flight ALA → DXB on Friday' },
  { who: 'argos', text: 'Air Astana 9:40 — $214. Opened checkout in your browser, logged in as you.' },
];

const VISIBLE_MSGS = 7;

function PhoneChat({ onFirstCycleDone, speed }: { onFirstCycleDone?: () => void; speed?: React.MutableRefObject<number> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: '-100px' });
  const [count, setCount] = useState(2); // start with a bit of history so it never looks empty
  const [typing, setTyping] = useState(false);
  const firstCycleDone = useRef(false);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    // impatient scrolls crank `speed` up — the chat replays faster instead of being skipped
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms / (speed?.current ?? 1)));

    (async () => {
      let i = 2;
      while (!cancelled) {
        if (i >= CHAT_SCRIPT.length) {
          if (!firstCycleDone.current) {
            firstCycleDone.current = true;
            onFirstCycleDone?.();
          }
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
            <img src="/argoss.png" alt="Argos" className="h-8 w-8 rounded-full object-cover bg-white shrink-0 ring-1 ring-neutral-200" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-neutral-900 leading-tight">Argos</p>
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
                    {m.who === 'argos' && (
                      <div className="rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-2 text-[13px] leading-snug text-neutral-800 shadow-sm border border-neutral-200/60">{m.text}</div>
                    )}
                    {m.who === 'argos-file' && (
                      <div className="rounded-[18px] rounded-bl-[6px] bg-white px-3.5 py-2.5 shadow-sm border border-neutral-200/60 flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center font-mono text-[9.5px] font-bold text-primary shrink-0">{m.kind}</div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-neutral-900 leading-tight truncate">{m.name}</p>
                          <p className="text-[10.5px] text-neutral-400 mt-0.5">{m.meta}</p>
                        </div>
                      </div>
                    )}
                    {m.who === 'argos-approve' && (
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

/* "Copied to clipboard" confirmation. Was an inscribed stone chip with a
   meander frieze and a funerary-urn glyph; it is the site's glass now, like
   every other surface. */
function showGreekCopiedToast() {
  toast.custom(() => (
    <div className="lg-glass relative overflow-hidden rounded-[14px] px-6 py-3.5">
      <p className="relative z-10 text-center text-[13px] font-geometric font-medium tracking-tight text-foreground">
        Command copied to your clipboard
      </p>
    </div>
  ), { duration: 3000 });
}

function Installer() {
  const [status, setStatus] = useState<CliStatus | null>(null);
  const [checked, setChecked] = useState(false); // first status fetch done → we know signed-in vs not
  const [os, setOs] = useState<OS>(detectOS());
  const [pairing, setPairing] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<{ msg: string; needsPro: boolean; unauthed: boolean } | null>(null);
  const [rotating, setRotating] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);

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
      showGreekCopiedToast();
      setTimeout(() => setCopied(false), 1800);
    } catch { /* blocked */ }
  }, [command]);

  /**
   * Deliberately no auto-mint and no auto-copy on load.
   *
   * Doing it automatically meant every single visit — including someone who had already
   * installed and connected — silently took over the clipboard, fired the "copied" toast,
   * and re-showed a code they no longer needed, with no way back to "Get my pairing code".
   * Someone who is already connected came here for the guide, not to re-pair.
   */

  const rotate = useCallback(async () => {
    setRotating(true); setError(null);
    try {
      // The token is derived from (userId, version): without releasing the old pairing
      // first, "new code" would hand back the exact same string.
      await unpairCli();
      setPairing(await mintPairingCode());
    } catch (e) {
      if (e instanceof PairingError) setError({ msg: e.message, needsPro: e.code === 'needs_pro', unauthed: e.code === 'unauthed' });
      else setError({ msg: 'Something went wrong.', needsPro: false, unauthed: false });
    } finally {
      setRotating(false);
    }
  }, []);

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[26px] bg-primary/10 blur-2xl pointer-events-none" />
      <div className="lg-glass-card relative overflow-hidden rounded-[22px]">
        {/* The extra top padding used to clear a meander frieze that is no
            longer there; the title row sits on the rim now. */}
        <div className="relative flex items-center gap-1.5 border-b border-foreground/[0.07] px-4 pb-3 pt-4">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          {/* The window title is decoration; below sm there is no room for it and it wrapped
              into the traffic lights and the badges. The flex-1 spacer keeps the layout. */}
          <span className="flex-1 hidden sm:flex items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-mono text-muted-foreground/50 select-none">
            <img src="/argoss.png" alt="" aria-hidden className="h-3.5 w-3.5 rounded-[3px] object-cover" />
            argos installer
          </span>
          <span className="flex-1 sm:hidden" />
          <span className="mr-2 shrink-0 whitespace-nowrap rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-primary select-none">PRO ONLY</span>
          {status && (
            <span className={cn(
              'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[9.5px] font-bold tracking-widest',
              online ? 'text-green-600' : 'text-muted-foreground/50',
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', online ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30')} />
              {online ? 'ONLINE' : 'OFFLINE'}
            </span>
          )}
        </div>

        {/* Gate: no account → sign in; Free → upgrade. The command stays visible but
            blurred behind a lock — you can see what you'd get, not copy it.
            
            The blur is on this content, not on the veil above it, and that is
            not a style preference. The veil blurs with `backdrop-filter`, and an
            ancestor that has one of its own establishes a backdrop root: the
            descendant then samples what is behind *the root* rather than the
            siblings painted inside it. The moment the terminal card became glass
            the veil started blurring the page behind the card and left the
            command sitting in plain focus underneath. Filtering the element
            itself does not care what its ancestors are made of. */}
        <div className="relative">
        <div
          className={cn(
            'p-5',
            (!checked || !status || !status.entitled) &&
              'pointer-events-none select-none min-h-[500px] flex flex-col justify-center blur-[7px]',
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

          {/* The whole line copies — hunting for an 8px icon is not a thing to ask of
              someone who came here to paste one command. */}
          <div className="relative">
            <button
              type="button"
              onClick={() => copy()}
              title={copied ? 'Copied' : 'Click to copy'}
              aria-label={copied ? 'Copied the install command' : 'Copy the install command'}
              className="block w-full cursor-pointer rounded-xl border border-border/70 bg-muted/50 px-4 py-3.5 pr-12 text-left transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <span className="block font-mono text-[12px] sm:text-[12.5px] leading-relaxed text-foreground/85 whitespace-pre-wrap break-all">
                <span className="text-green-600 select-none">$ </span>{command}
              </span>
            </button>
            <span
              aria-hidden
              className="pointer-events-none absolute top-2.5 right-2.5 h-8 w-8 rounded-lg bg-background border border-border/70 text-foreground/70 flex items-center justify-center"
            >
              {copied
                ? <span className="text-[13px] font-semibold text-green-600 select-none">✓</span>
                : <span className="text-[13px] font-mono select-none">⧉</span>}
            </span>
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
                    : 'Paste it into your terminal. The code gates your download and links this machine.'}
              </p>
            ) : status?.paired ? (
              /* Already set up. Showing a code here as if nothing had happened is what made
                 a return visit look broken — so this state leads with the connection and
                 keeps both codes behind a deliberate click. */
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {online
                    ? '✓ This account already has a machine connected and online.'
                    : 'Paired, but the agent is offline — start it with argos-cli.'}
                </p>
                <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <button
                    onClick={mint}
                    disabled={minting}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-foreground bg-muted hover:bg-muted/70 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {minting && <Spinner className="h-3.5 w-3.5" />}
                    Show my install command
                  </button>
                  <button
                    onClick={() => (confirmRotate ? void rotate() : setConfirmRotate(true))}
                    disabled={rotating}
                    className={cn(
                      'w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2',
                      confirmRotate
                        ? 'text-white bg-red-600 hover:bg-red-700'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {rotating && <Spinner className="h-3.5 w-3.5" />}
                    {confirmRotate ? 'Yes — disconnect and issue a new code' : 'Generate a new code'}
                  </button>
                </div>
                {confirmRotate && !rotating && (
                  <p className="mt-2 text-[11px] text-muted-foreground/70">
                    A new code invalidates the old one, so the machine paired now gets
                    disconnected and has to run the installer again.{' '}
                    <button onClick={() => setConfirmRotate(false)} className="underline hover:text-foreground">
                      Cancel
                    </button>
                  </p>
                )}
              </div>
            ) : (
              <button
                onClick={mint}
                disabled={minting}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {minting && <Spinner className="h-4 w-4" />}
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
              Argos Pro · macOS, Windows &amp; Linux · installs Node if missing
            </p>
          </div>
        </div>

        {/* Liquid-glass lock: the veil does the blur (backdrop-filter), the card
            floats on top — same glass language as the extension's Tasks paywall. */}
        {(!checked || !status || !status.entitled) && (
          <div className="cli-glass-veil absolute inset-0 z-10 flex items-center justify-center p-5">
            {!checked ? (
              <Spinner className="h-5 w-5 text-muted-foreground/60" />
            ) : !status ? (
              <div className="cli-glass-card cli-glass-halo relative overflow-hidden w-full max-w-[340px] rounded-[24px] p-6 text-center">
                <div className="cli-sheen absolute inset-0 overflow-hidden rounded-[24px]" />
                <div className="relative">
                  {/* the Argos mark behind the glass — with a small lock riding it */}
                  <div className="relative mx-auto h-14 w-14">
                    <span className="cli-orb-aura" />
                    <img
                      src="/argoss.png"
                      alt="Argos"
                      className="relative h-14 w-14 rounded-[14px] object-contain"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0,0.35))' }}
                    />
                    <span className="cli-glass-chip absolute -bottom-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full">
                      <LockGlyph className="h-3 w-3 text-foreground/70" />
                    </span>
                  </div>
                  <p className="mt-4 text-[15px] font-semibold text-foreground">Sign in to unlock your command</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    The installer is personal: it carries a pairing code tied to your Argos account.
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
                  <img src="/argoss.png" alt="Argos" className="h-7 w-7 rounded-[8px] object-contain" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.18))' }} />
                  <span className="text-[14px] font-semibold tracking-tight text-foreground">Argos Pro</span>
                  <span className="cli-glass-chip ml-auto flex h-7 w-7 items-center justify-center rounded-full">
                    <LockGlyph className="h-3 w-3 text-foreground/70" />
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[13px] line-through text-muted-foreground/50">$25</span>
                  <span className="text-[30px] leading-none font-bold tracking-tight text-foreground">$15</span>
                  <span className="text-[12px] text-muted-foreground">/mo</span>
                </div>
                <p className="mt-2 text-[13px] font-semibold leading-snug text-foreground">
                  Your computer, answering your texts — part of Argos Pro.
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


const PANEL_POINTS: { title: string; body: string }[] = [
  { title: 'On, off, and on again', body: 'One switch stops the agent, another starts it on login. The window does it whether the agent is up or not, so a stopped agent is never a reason to open a terminal.' },
  { title: 'Change the model in place', body: 'Eleven providers ready to pick, or any OpenAI-compatible endpoint of your own. The key is checked as you type, and the model list is the one your provider actually offers.' },
  { title: 'See the task it is doing', body: 'The step it is on, the tool it is using, and a Stop button that lands immediately. Under it, the tasks it ran before.' },
  { title: 'The folder it may work in', body: 'Shown, changeable, and one click from opening in Finder. Its file tools stay inside it.' },
];

/* ─────────────────────────── The panel, drawn ───────────────────────────

   A still of the real window rather than a screenshot of it. The panel is dark
   glass on a near-black ground and its surfaces are this site's own
   `.lg-glass-dark-card` recipe, lifted into the CLI when it was built — so
   redrawing it here in the same material is not an approximation, it is the
   same three layers. It also stays sharp at any width, and a screenshot would
   go stale the first time a row moves. */

const PanelSwitch = ({ on, sm }: { on: boolean; sm?: boolean }) => (
  <span
    aria-hidden
    className={cn(
      'relative inline-block shrink-0 rounded-full transition-colors',
      sm ? 'h-[16px] w-[28px]' : 'h-[22px] w-[38px]',
      on ? 'bg-emerald-400/70' : 'bg-white/15',
    )}
  >
    <span
      className={cn(
        'absolute rounded-full bg-white shadow-sm',
        sm ? 'top-[2px] h-[12px] w-[12px]' : 'top-[3px] h-[16px] w-[16px]',
        on ? (sm ? 'left-[14px]' : 'left-[19px]') : 'left-[2px]',
      )}
    />
  </span>
);

const PanelRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-[7px]">
    <span className="text-[11px] text-neutral-400">{label}</span>
    <span className="text-[11px] font-medium text-neutral-200">{children}</span>
  </div>
);

const PanelCard = ({
  title, action, children,
}: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <div className="lg-glass-dark-card rounded-[14px] px-4 py-3">
    <div className="flex items-baseline justify-between gap-3">
      <h4 className="text-[12.5px] font-semibold tracking-tight text-neutral-100">{title}</h4>
      {action && <span className="text-[10.5px] text-neutral-400">{action}</span>}
    </div>
    <div className="mt-1.5 divide-y divide-white/[0.06]">{children}</div>
  </div>
);

function PanelWindow() {
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute -inset-6 rounded-[40px] bg-black/40 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[18px] border border-white/[0.09] shadow-2xl shadow-black/60">
        {/* the window's own chrome: --app= leaves a title bar and nothing else */}
        <div className="flex items-center gap-1.5 bg-[hsl(0_0%_7%)] px-3.5 py-2.5">
          <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
          <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
          <span className="h-[9px] w-[9px] rounded-full bg-white/20" />
          <span className="mx-auto pr-8 text-[11px] text-neutral-400">Argos</span>
        </div>

        <div className="relative bg-[hsl(0_0%_4%)] px-4 pb-4 pt-3.5">
          {/* the drifting fields the panel draws behind its glass */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(38% 30% at 18% 12%, rgba(255,255,255,0.10), transparent 70%),' +
                'radial-gradient(32% 26% at 88% 38%, rgba(255,255,255,0.07), transparent 72%),' +
                'radial-gradient(40% 30% at 55% 96%, rgba(255,255,255,0.06), transparent 70%)',
            }}
          />

          <div className="relative space-y-2.5">
            {/* state + the one switch that matters */}
            <div className="lg-glass-dark-card flex items-center gap-3 rounded-[14px] px-4 py-3.5">
              <span className="relative mt-[5px] flex h-2 w-2 shrink-0 self-start">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold tracking-tight text-neutral-50">Active on this computer</p>
                <p className="mt-0.5 text-[11px] leading-snug text-neutral-400">
                  Your Telegram messages are answered here, with your files and your logged-in browser.
                </p>
              </div>
              <span className="ml-auto"><PanelSwitch on /></span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              <PanelCard title="This computer" action={<>Restart · <span className="text-red-300/80">Turn off</span></>}>
                <PanelRow label="Starts on login"><PanelSwitch on sm /></PanelRow>
                <PanelRow label="Chrome you can watch"><PanelSwitch on sm /></PanelRow>
                <PanelRow label="Telegram">Linked</PanelRow>
                <PanelRow label="Running for">6d 4h</PanelRow>
              </PanelCard>

              <PanelCard title="Model" action="Change">
                <PanelRow label="Provider">Gemini</PanelRow>
                <PanelRow label="Model"><span className="font-mono text-[10.5px]">gemini-2.5-pro</span></PanelRow>
                <PanelRow label="Key"><span className="font-mono text-[10.5px]">••••••4f7a</span></PanelRow>
                <PanelRow label="Checked">just now ✓</PanelRow>
              </PanelCard>
            </div>

            {/* the task in flight */}
            <div className="lg-glass-dark-card rounded-[14px] px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="text-[12.5px] font-semibold tracking-tight text-neutral-100">Right now</h4>
                <span className="text-[10.5px] text-red-300/80">Stop this task</span>
              </div>
              <p className="mt-1.5 text-[12px] text-neutral-200">Sort my Downloads into project folders</p>
              <div className="mt-1 flex items-center gap-3 text-[10.5px] text-neutral-400">
                <span>step 4 of 9</span>
                <span className="font-mono">shell · mv</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Capabilities ─────────────────────────── */

const PRIMITIVES: { glyph: string; title: string; body: string; image?: string }[] = [
  { glyph: '>_', title: 'The shell: your whole machine', body: 'Files, apps, ffmpeg, pandoc, git, installs, scripts. It drives your computer through the real terminal, exactly like a coding agent. No pixel-clicking, no fragile macros.', image: '/clipics1.jpg' },
  { glyph: '◉', title: 'A real browser, logged in as you', body: 'Your actual Chrome profile: sessions, cookies, autofill. It books, buys and fills forms under your accounts, on your machine.', image: '/clipages2.jpg' },
];

const GUIDE_TG: { say: string; happens: string }[] = [
  { say: '“Sort my Downloads into folders”', happens: 'Plans the steps, runs them in the shell, reports back.' },
  { say: '“Make a PDF from this spreadsheet”', happens: 'Builds it on your machine and sends the file into the chat.' },
  { say: 'Send it a file + “save this properly”', happens: 'Files land in the workspace, sorted where they belong.' },
  { say: '“Book / order / fill in …”', happens: 'Uses the real browser with your logged-in accounts.' },
  { say: 'Anything destructive', happens: 'It stops and asks Yes/No before running. Your call, always.' },
];

const TRAITS: { glyph: string; title: string; body: string }[] = [
  { glyph: '✓', title: 'Asks before it breaks things', body: 'rm -rf, sudo, git push. Anything destructive stops and waits for your explicit Yes, and only your paired account can command it.' },
  { glyph: '⌁', title: 'Your key, your model', body: 'Gemini, Claude, OpenAI, OpenRouter or local Ollama. You pay the provider directly. Zero markup.' },
  { glyph: '∞', title: 'Always on', body: 'Starts on login, restarts on crash. launchd · Windows Startup · systemd. Off and on again is a switch in the panel, not a command.' },
];

/* ─────────────────────────── Page ─────────────────────────── */

/**
 * Hero entrance that cannot leave the hero blank. framer-motion runs on rAF,
 * which Chrome freezes in a background tab — so a hero built out of opacity-0
 * entrances renders as an empty painting until the tab is focused.
 */
const rise = (delay: number, y = 18) =>
  typeof document !== 'undefined' && document.hidden
    ? {}
    : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay } };

const Cli = () => {
  useEffect(() => {
    document.title = 'Argos CLI — your computer, on your side';
    return () => { document.title = 'Argos'; };
  }, []);

  /**
   * Honour #telegram in the URL.
   *
   * The router does not scroll to a hash by itself, so a link built to land
   * someone on the Telegram card dropped them at the top of a page about a
   * terminal agent instead — the one thing they were not looking for. Deferred a
   * frame because the section is below lazy content that has not laid out yet
   * when this runs, and scrolling to a node whose position is about to change
   * puts you somewhere else entirely.
   */
  useEffect(() => {
    if (window.location.hash !== '#telegram') return;
    const id = window.setTimeout(() => {
      document.getElementById('telegram')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Something for the glass to stand on.
          Every panel below this point used to be carved limestone, which is an
          opaque surface and needs nothing behind it. Glass is not: over the flat
          `bg-background` these sections used to carry, blur(20px) returns the
          same flat white and the panes read as plain bordered boxes — the
          material becomes a repaint cost with no visible effect. These pools are
          the minimum that gives them something to refract. Fixed, so the cards
          travel across them rather than carrying them along. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(50% 40% at 15% 20%, rgba(9,9,11,0.055), transparent 70%),' +
            'radial-gradient(45% 38% at 85% 45%, rgba(9,9,11,0.045), transparent 72%),' +
            'radial-gradient(55% 45% at 45% 88%, rgba(9,9,11,0.05), transparent 70%)',
        }}
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
          <EtherealShadow color="rgba(0, 0, 0, 1)" noise={{ opacity: 0.5, scale: 1.2 }} sizing="fill" />
        </div>
        {/* Backdrop — David's "The Death of Socrates" (1787, public domain).
            Desaturated to hold the monochrome theme. The hero is a two-column
            grid with copy on the left, so the frame is anchored right (keeping
            Socrates' raised hand in view) and veiled with a left-weighted
            gradient plus a soft radial wash — that keeps the text side clean
            while the painting still reads on the right. */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <img
            src="/socrates.jpeg"
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover grayscale opacity-[0.55] dark:opacity-[0.3] contrast-[1.15]"
            style={{ objectPosition: '55% 42%' }}
          />
          {/* The veil has to follow the copy, and the copy moves: below lg the
              hero is one centred column sitting straight over the canvas, at lg+
              it's a left column with the terminal on the right. One fixed
              gradient can't cover both, so there's a centred wash for the
              stacked layout and a left-weighted one for the split layout. */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                'radial-gradient(85% 65% at 50% 42%, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.66) 55%, hsl(var(--background) / 0.25) 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                'linear-gradient(to right, hsl(var(--background) / 0.92) 0%, hsl(var(--background) / 0.55) 30%, hsl(var(--background) / 0.12) 62%, transparent 88%)',
            }}
          />
          {/* Top fade — the navbar is transparent over the hero, so its links
              need something to sit on. */}
          <div
            className="absolute inset-x-0 top-0 h-24"
            style={{
              background: 'linear-gradient(to bottom, hsl(var(--background) / 0.85), transparent)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32"
            style={{
              background: 'linear-gradient(to bottom, transparent, hsl(var(--background)))',
            }}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-16 w-full">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <AnnouncementBanner
                buttonText="Argos CLI"
                description="your computer, on your side"
                className="mb-8"
              />

              <motion.h1
                {...rise(0.08)}
                className="font-geometric text-[2.1rem] sm:text-5xl lg:text-[3.6rem] leading-[1.12] tracking-tight text-balance text-foreground"
              >
                Your computer,
                <br />
                <span className="italic text-foreground sm:not-italic sm:text-gradient">on your side</span>
              </motion.h1>

              {/* Someone landing here from "Don't use Chrome?" arrives mid-thought —
                  the hero below reads as if they picked a desktop agent on purpose,
                  when they actually picked "no extension". Say that first. */}
              <motion.p
                {...rise(0.13)}
                className="mt-4 text-muted-foreground/80 text-[13.5px] leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                No Chrome? This needs no browser extension at all.
              </motion.p>

              {/* The plain-language promise first. A person needs no vocabulary for
                  "text it and it does the thing"; "a real shell" only means something
                  to someone who already knows they want one, so it comes second and
                  quieter. */}
              <motion.p
                {...rise(0.18)}
                className="mt-4 text-foreground/80 text-[17px] sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                Text it in Telegram like a person. It does the work on your own machine
                and sends the result back.
              </motion.p>

              <motion.p
                {...rise(0.24)}
                className="mt-3 text-muted-foreground text-[14.5px] leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                A local agent with your real shell and your logged-in browser.
              </motion.p>

              <motion.div
                {...rise(0.32)}
                className="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <a
                  href="#install"
                  className="group w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 text-center"
                >
                  Install in one line
                  <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
                </a>
                <span className="font-mono text-[11.5px] text-muted-foreground/60">$ one command, then a window · needs Argos Pro</span>
              </motion.div>
            </div>

            {/* The demo IS the explanation, so it stands in the hero rather than
                waiting a screen down. It also used to hold the page hostage: the
                section pinned the viewport until the chat finished playing. That
                lock is gone — trapping someone on the first screen is a worse first
                impression than a demo they scrolled past. */}
            <motion.div
              {...rise(0.2, 24)}
              className="relative mx-auto w-full max-w-[340px] lg:max-w-none"
            >
              {/* The painting runs right under the phone now that the layout is two
                  columns, and a Telegram thread on top of a David is unreadable. A
                  soft wash lifts it off without hiding the canvas around it. */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[112%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: 'radial-gradient(closest-side, hsl(var(--background) / 0.92), hsl(var(--background) / 0.55) 55%, transparent 78%)', filter: 'blur(6px)' }}
              />
              <PhoneChat />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Telegram, connectable from here ──────────────────────────────
          People land on this page from "Set it up without the extension", which
          means their browser cannot run the panel — and until now the panel was
          the only place Telegram could be linked. It is the first thing after
          the promise, before any talk of terminals. */}
      <section id="telegram" className="relative px-4 pb-6 pt-2 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <TelegramConnect />
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionHead
            eyebrow="Two primitives"
            title={<>Not a set of features. <span className="text-gradient">A whole machine.</span></>}
            sub="Everything it can do reduces to two things: a real shell, and a real browser."
          />
          {/* the two primitives — ribbon-field headers, white bodies */}
          <FadeIn className="grid sm:grid-cols-2 gap-6">
            {PRIMITIVES.map((b) => (
              <div
                key={b.title}
                className="lg-glass-card lg-glass-hover group relative overflow-hidden rounded-3xl"
              >
                {b.image && (
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" style={{ filter: 'grayscale(100%)' }} />
                  <RibbonField className="opacity-70 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute bottom-5 left-8 font-mono text-[32px] leading-none text-white select-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                    {b.glyph}
                  </span>
                </div>
              )}
                <div className="relative p-8 pt-6 flex flex-col h-full">
                  <div className="relative">
                    <h3 className="text-[20px] font-geometric tracking-tight text-foreground">{b.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{b.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </FadeIn>

          {/* safety traits */}
          <FadeIn delay={0.1}>
            <p className="mt-14 mb-6 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/50">
              …and what makes it safe to hand them over
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              {TRAITS.map((b) => (
                <div
                  key={b.title}
                  className="lg-glass-card lg-glass-hover rounded-[22px] px-6 py-7"
                >
                  <span className="lg-glass flex h-10 w-10 items-center justify-center rounded-full font-mono text-[17px] text-foreground/70 select-none">{b.glyph}</span>
                  <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-foreground">{b.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── The panel ────────────────────────────────────────────────────
          The one thing this page used to get wrong. A person who does not want
          a terminal read "six commands" and left; the agent has had a window
          for a while now, and the page kept selling the commands. It goes
          before the install, because it is what makes the install a small ask:
          the terminal is one line, once, and then this. Dark, because the
          window is: showing it on a white card would be a picture of something
          else. */}
      <section
        id="panel"
        data-surface="dark"
        className="relative overflow-hidden bg-neutral-950 pb-56 pt-52 text-white scroll-mt-20 sm:pb-[22rem] sm:pt-[19rem]"
      >
        {/* The panel's own ground, not an impression of it: the four drifting
            fields and the marble figure, lifted out of `panel/page.ts` (see
            .panel-glow in index.css). The figure only stands where there is a
            gutter to stand in, which is the rule the panel itself follows. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="panel-glow panel-glow-a" />
          <div className="panel-glow panel-glow-b" />
          <div className="panel-glow panel-glow-c" />
          <div className="panel-glow panel-glow-d" />
          <div className="panel-figure">
            <img src="/panel-figure.jpg" alt="" aria-hidden />
          </div>
        </div>

        {/* White page, then black, in one pixel: the razor edge MemoryBand had on
            the homepage. Both ends fade here, because unlike that band this one
            is light above AND below, and the ramp is longer and five-stop
            rather than that band's three: a straight two-stop fade spends most
            of its height already black and reads as a hard edge with a smudge
            over it. */}
        <div aria-hidden className="panel-fade panel-fade-top" />
        <div aria-hidden className="panel-fade panel-fade-bottom" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fadeUp} className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              The panel
            </p>
            <h2 className="font-geometric text-3xl leading-[1.12] tracking-tight text-neutral-50 sm:text-4xl md:text-5xl">
              You type one line.
              <br />
              <span className="text-neutral-400">After that it is a window.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-400">
              Setup leaves an Argos icon in your Applications folder, and on Windows in the Start
              menu. Open it and the agent is a switch, a model you can change, and the task it is
              running right now.
            </p>
          </motion.div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <motion.div {...fadeUp}>
              <PanelWindow />
            </motion.div>

            <motion.div {...fadeUp} className="space-y-7">
              {PANEL_POINTS.map((b) => (
                <div key={b.title} className="border-l border-white/10 pl-5">
                  <h3 className="text-[15px] font-semibold tracking-tight text-neutral-100">{b.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-neutral-400">{b.body}</p>
                </div>
              ))}
              <p className="pl-5 text-[12.5px] leading-relaxed text-neutral-500">
                It runs on your own machine and nowhere else: the window talks to the agent over
                localhost, with a one-time key the agent puts in the address.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Install ── */}
      <section id="install" className="relative py-20 sm:py-28 px-4 sm:px-6 scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          {/* ribbon panel — the animated stripe field glows through a frosted white veil */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 shadow-2xl shadow-primary/10">
            <RibbonField />
            <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.87)', backdropFilter: 'blur(3px)' }} />

            <div className="relative z-10 px-5 sm:px-10 lg:px-14 py-14 sm:py-16">
          <SectionHead
            eyebrow="Install"
            title={<>One line. <span className="text-gradient">That's the setup.</span></>}
            sub="The desktop agent is part of Argos Pro, so an active subscription is required to install and connect it."
          />
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 items-center">
            <motion.div {...fadeUp}>
              <Installer />
            </motion.div>
            <motion.ol {...fadeUp} className="space-y-7">
              {[
                ['Get your pairing code', 'One tap on this page (needs Argos Pro). Single-use: it verifies your subscription and pairs the machine.'],
                ['Paste the line into your terminal', 'It installs Node if needed, pulls the CLI, and walks you through a 60-second wizard: your model key, your browser. This is the only time you need a terminal.'],
                ['Open Argos from your Applications folder', 'The setup leaves the icon there, or in the Start menu on Windows. It opens the panel: state, switches, model, the task in flight.'],
                ['Message it from Telegram', 'The panel flips to Active on this computer. From now on your computer answers your texts.'],
              ].map(([t, s], i) => (
                <li key={t} className="flex gap-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-mono text-[12.5px] font-semibold text-primary select-none">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-[16px] font-semibold text-foreground">{t}</p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{s}</p>
                  </div>
                </li>
              ))}
            </motion.ol>
          </div>

          {/* what you're trusting, exactly — the whole ask, spelled out */}
          <motion.div
            {...fadeUp}
            className="lg-glass mt-10 rounded-2xl p-6"
          >
            <p className="text-[13px] font-semibold text-foreground">What you're trusting, exactly</p>
            <div className="mt-3 grid sm:grid-cols-3 gap-4">
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="text-foreground/80 font-medium">The script is public.</span>{' '}
                <a href={`${CLI_API_URL}/cli`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read it</a>: it installs Node if missing, installs <code className="font-mono text-[11.5px]">argos-cli</code>, and registers a login service. Nothing else.
              </p>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                {/* Was "Your data stays local" — which reads as a claim about all of
                    Argos, and the extension does sync page context to the server. The
                    sentence underneath was always the accurate one, so the heading now
                    says exactly what it can back up and nothing wider. */}
                <span className="text-foreground/80 font-medium">Your key and your files stay on your machine.</span>{' '}
                Your model key, files and browser profile never leave it. The pairing code only gates the download and links the agent to your account.
              </p>
              <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="text-foreground/80 font-medium">Nothing runs silently.</span>{' '}
                Destructive commands stop and wait for your explicit Yes. Turn the agent off from the panel whenever you like, or remove it all with <code className="font-mono text-[11.5px]">argos-cli uninstall</code>.
              </p>
            </div>
          </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What you actually say to it ── */}
      <section className="relative py-20 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <SectionHead
            eyebrow="In practice"
            title={<>What you actually <span className="italic text-foreground sm:text-gradient">say to it</span></>}
            sub="There is nothing to memorise. You write the way you would to a person who has your computer in front of them."
          />
          {/* the real examples, in the words people use */}
          <motion.div {...fadeUp} className="lg-glass-card relative overflow-hidden rounded-[22px]">
            <div className="relative flex items-center justify-between border-b border-foreground/[0.07] px-5 py-3.5">
              <p className="text-sm font-semibold text-foreground">In Telegram: no commands, just talk</p>
              <span className="text-[10px] text-muted-foreground/60">plain language</span>
            </div>
            <div className="relative divide-y divide-foreground/[0.06]">
              {GUIDE_TG.map((t) => (
                <div key={t.say} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6">
                  <p className="text-[13.5px] font-medium text-foreground sm:w-[320px] shrink-0">{t.say}</p>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{t.happens}</p>
                </div>
              ))}
            </div>
            <div className="relative border-t border-foreground/[0.07] bg-white/25 px-5 py-3.5">
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Not just Telegram. Ask Argos in the <span className="text-foreground/75">browser extension</span> to run something in the background, and with your desktop agent online it routes the task to <span className="text-foreground/75">your own machine</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── The reference lives somewhere else now ── */}
      <section id="guide" className="relative py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <motion.a
            {...fadeUp}
            href="/cli/docs"
            className="lg-glass-card lg-glass-hover group relative block overflow-hidden rounded-[22px] px-6 py-6 sm:px-8 sm:py-7"
          >
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[15px] font-semibold text-foreground">
                  The commands are still there
                </p>
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-muted-foreground">
                  Repair, full removal, where the files live. Day to day the panel covers it, and
                  the installer runs the one command that matters. This is for the days it does not.
                </p>
              </div>
              {/* A pill, not a line of coloured text. The whole card is the
                  link, but nothing on it said so: --primary in this theme is
                  0 0% 9%, so "text-primary" is the same near-black as the
                  heading above it and read as a third line of copy. The lift on
                  hover was the only affordance, and an affordance you have to
                  hover to discover is not one. */}
              <span className="lg-glass inline-flex shrink-0 items-center gap-2 self-start rounded-full px-4 py-2.5 text-[13.5px] font-semibold text-foreground transition-colors group-hover:bg-foreground group-hover:text-background sm:self-auto">
                Full command reference
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div
              className="relative rounded-3xl overflow-hidden p-px"
              style={{ background: 'linear-gradient(135deg, rgba(0, 0, 0,0.35) 0%, rgba(0, 0, 0,0.08) 60%, transparent 100%)' }}
            >
              {/* The shimmering plate from "Don't use Chrome?" on the homepage,
                  reproduced as the same three layers in the same order rather
                  than approximated.

                  The order is the effect. A first pass here put the ribbon
                  behind an .lg-glass pane and skipped the veil, on the theory
                  that a 68% pane does what a 0.78 veil does. It does not: the
                  veil carries its own blur(3px), and that second blur is what
                  turns the ribbon's hard diagonal bands into the slow soft
                  masses the homepage actually shows. Without it you get stripes.

                  The one thing that does carry over from that pass: the canvas
                  must be a sibling painted *before* whatever filters it, never
                  a child. A backdrop-filter only sees what is beneath its own
                  element. */}
              <RibbonField />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
              />
              <div className="relative rounded-[23px] p-10 text-center overflow-hidden sm:p-14">
                <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                <div className="relative z-10">
                  <h2 className="font-geometric text-3xl sm:text-5xl leading-[1.1] tracking-tight text-foreground">
                    Give Argos <span className="text-gradient">its own computer</span>
                  </h2>
                  <p className="mt-5 text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Yours. The one it already knows, with your files, your logins, your setup.
                  </p>
                  <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#install" className="w-full sm:w-auto">
                      <LiquidButton size="xl" className="rounded-full px-8 text-base font-semibold text-primary w-full">
                        Install the CLI →
                      </LiquidButton>
                    </a>
                    <a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
                      See Pro pricing
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Cli;
