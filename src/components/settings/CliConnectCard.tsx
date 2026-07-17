import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, Check, Copy, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  type OS, type CliStatus, OS_LABEL,
  detectOS, installCommand, fetchCliStatus, mintPairingCode, PairingError,
} from '@/lib/cli';
import { cn } from '@/lib/utils';

/**
 * Desktop Agent (CLI) connect card for the website Settings page — the quick
 * connect. The full guide lives at /cli. Shows live status, reveals a one-time
 * pairing code, and prints the OS-specific install one-liner.
 */
export default function CliConnectCard() {
  const [status, setStatus] = useState<CliStatus | null>(null);
  const [os, setOs] = useState<OS>(detectOS());
  const [pairing, setPairing] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshStatus = useCallback(async () => {
    const s = await fetchCliStatus();
    if (s) setStatus(s);
  }, []);

  useEffect(() => {
    void refreshStatus();
    pollRef.current = setInterval(() => void refreshStatus(), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [refreshStatus]);

  const mintCode = useCallback(async () => {
    setMinting(true);
    setError(null);
    try {
      setPairing(await mintPairingCode());
    } catch (e) {
      setError(e instanceof PairingError ? e.message : 'Something went wrong.');
    } finally {
      setMinting(false);
    }
  }, []);

  const command = installCommand(os, pairing ?? '');

  const copyCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  }, [command]);

  const entitled = status?.entitled;
  const online = status?.connected;

  return (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">Desktop Agent</p>
      <div
        className="rounded-3xl border border-white/70 overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 2px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)' }}
      >
        {/* Header row */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-neutral-500 shrink-0" />
              <p className="text-sm font-semibold text-neutral-800">Lyto CLI</p>
            </div>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Run Lyto on your own machine. <Link to="/cli" className="text-primary hover:underline">Full guide →</Link>
            </p>
          </div>
          {status && (
            <span className={cn(
              'shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide',
              online ? 'bg-green-50 text-green-600 border-green-200' : 'bg-neutral-100 text-neutral-400 border-neutral-200',
            )}>
              <span className={cn('h-1.5 w-1.5 rounded-full', online ? 'bg-green-500' : 'bg-neutral-300')} />
              {online ? 'ONLINE' : 'OFFLINE'}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {status && !entitled ? (
            <div className="text-center py-2">
              <p className="text-sm font-medium text-neutral-700">Available on Lyto Pro</p>
              <p className="text-xs text-neutral-400 mt-1 mb-4 leading-relaxed">
                The desktop agent runs locally with your own key. Upgrade to connect it.
              </p>
              <a href="/#pricing" className="inline-block w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors">
                Upgrade to Pro →
              </a>
            </div>
          ) : (
            <>
              {/* OS tabs */}
              <div className="flex items-center gap-1 mb-3 p-1 rounded-xl bg-neutral-100/70 w-fit">
                {(['mac', 'windows', 'linux'] as OS[]).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOs(o)}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors',
                      os === o ? 'bg-white text-neutral-800 shadow-sm' : 'text-neutral-400 hover:text-neutral-600',
                    )}
                  >
                    {OS_LABEL[o]}
                  </button>
                ))}
              </div>

              {!pairing ? (
                <button
                  onClick={mintCode}
                  disabled={minting || !status}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {minting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {minting ? 'Generating…' : 'Get install command'}
                </button>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs text-neutral-400">
                    Paste this into your terminal. The pairing code is single-use and gates your download.
                  </p>
                  <div className="relative">
                    <pre className="text-[11.5px] leading-relaxed text-neutral-100 bg-neutral-900 rounded-xl px-3.5 py-3 pr-11 overflow-x-auto font-mono whitespace-pre-wrap break-all">
                      {command}
                    </pre>
                    <button
                      onClick={copyCommand}
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                      aria-label="Copy command"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {online
                      ? '✓ A machine is already connected. Running this pairs another one.'
                      : status?.paired
                        ? 'Your machine is paired but offline — start the agent to bring it online.'
                        : 'Once it finishes, the status above turns Online.'}
                  </p>
                </div>
              )}

              {error && <p className="mt-2.5 text-xs text-red-500">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
