import { useCallback, useEffect, useState } from 'react';
import { Check, Loader2, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchTelegramLink, fetchTelegramStatus, readCachedTelegramStatus, writeCachedTelegramStatus, type TelegramStatus } from '@/lib/cli';

/**
 * Connect Telegram from the web.
 *
 * The reason this exists: "Set it up without the extension" is the door for
 * everyone whose browser has no side panel, Opera, Zen, Firefox, Safari, and
 * until now the only place to link a Telegram account was inside the extension
 * they cannot install. The endpoints (`/api/integrations/telegram/link` and
 * `/status`) were always there; nothing on the web called them.
 *
 * Four states, because three of them are dead ends if you get them wrong:
 * signed out (nothing to link to), no Pro (the messenger is a Pro entitlement,
 * say so before the click, not after), ready, and connected.
 */
export function TelegramConnect({ className = '' }: { className?: string }) {
  const { user, loading } = useAuth();
  const [tg, setTg] = useState<TelegramStatus | null>(null);
  const [opening, setOpening] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (userId?: string | null) => {
    // Telegram alone. This used to also fetch the CLI status purely to read its
    // `entitled` flag and lock the section behind Pro, a request whose only
    // purpose was to decide whether to refuse.
    const s = await fetchTelegramStatus();
    setTg(s);
    if (s) writeCachedTelegramStatus(userId, s.connected);
  }, []);

  useEffect(() => {
    if (!user) return;
    // Paint from the last known answer first. With nothing here the card opened
    // on "not connected", a Connect button offered to someone already connected
    //, and corrected itself a moment later, which reads as the page forgetting
    // who you are. Only `connected` is restored; the username comes with the
    // real response.
    const cached = readCachedTelegramStatus(user.id);
    if (cached !== null) setTg((prev) => prev ?? { connected: cached, configured: true });
    void refresh(user.id);
  }, [user, refresh]);

  /* While the link is open in Telegram, watch for the other side to answer. */
  useEffect(() => {
    if (!waiting || tg?.connected) return;
    const id = window.setInterval(() => void refresh(user?.id), 3000);
    const stop = window.setTimeout(() => setWaiting(false), 120_000);
    return () => { window.clearInterval(id); window.clearTimeout(stop); };
  }, [waiting, tg?.connected, refresh, user?.id]);

  const connect = useCallback(async () => {
    setOpening(true); setError(null);
    try {
      const url = await fetchTelegramLink();
      setWaiting(true);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      const code = e instanceof Error ? e.message : '';
      setError(
        code === 'TELEGRAM_NOT_CONFIGURED'
          ? 'The Telegram bot is not configured on the server yet.'
          : code === 'unauthed'
            ? 'Your session expired, sign in again.'
            : `Could not get the link (${code || 'network'}). Try again in a moment.`,
      );
    } finally {
      setOpening(false);
    }
  }, []);

  // The page is white; a white card on it is not a card. This is the first thing
  // someone without Chrome is asked to act on, so it gets an edge and a shadow.
  const card =
    'lg-glass rounded-2xl p-6 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.35)] sm:p-7';

  if (loading) return null;

  /* ── connected ─────────────────────────────────────────────────────────── */
  if (tg?.connected) {
    return (
      <div className={`${card} ${className}`}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600">
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </span>
          <div>
            <p className="text-[15px] font-semibold text-foreground">Telegram is connected</p>
            <p className="text-[13px] text-muted-foreground">
              {tg.username ? `@${tg.username}, ` : ''}text the bot and it gets to work.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${card} ${className}`}>
      <div className="flex items-center gap-2.5">
        <Send className="h-4 w-4 text-muted-foreground" />
        {/* No Pro tag: Telegram is on the free plan. It was the least visible half of
            the product to exactly the people who had not decided to pay yet, and a
            badge saying otherwise is a lock they can see and not open. */}
        <p className="text-[15px] font-semibold text-foreground">Argos in Telegram</p>
      </div>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        No browser needed: text it like a person, and it runs the task in the cloud and answers
        you in the chat. This is the way in if your browser can't run the panel.
      </p>

      {!user ? (
        <Link
          to="/auth?from=telegram"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Sign in to connect →
        </Link>
      ) : (
        <>
          <button
            type="button"
            onClick={() => void connect()}
            disabled={opening}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Connect Telegram
          </button>
          {waiting && (
            <p className="mt-3 flex items-center justify-center gap-2 text-[12.5px] text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Waiting for you to press Start in Telegram…
            </p>
          )}
          {error && <p className="mt-3 text-center text-[12.5px] text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
}
