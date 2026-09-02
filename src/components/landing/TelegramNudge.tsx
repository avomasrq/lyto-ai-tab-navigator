import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchTelegramStatus, readCachedTelegramStatus, writeCachedTelegramStatus } from '@/lib/cli';

/**
 * The phone door on the home page.
 *
 * The paragraph above the install button already promises Argos keeps going
 * "from your phone", and until now nothing said how: the only mention of
 * Telegram lived in a section most people never scroll to. It went free on
 * 29 Aug and not one account has been connected since — which is not a pricing
 * problem when there was nothing to press.
 *
 * Two things it must not do. It must not compete with the install button, so it
 * is an outline rather than a filled control, one step down in size. And it must
 * not follow people around after they have acted on it: someone with the bot
 * already linked has nothing to do here, and a permanent nag on the front page
 * for a thing you already did reads as the site not knowing you.
 *
 * Signed-out visitors do see it — they are exactly who it is for, and asking the
 * API about a session that does not exist would only cost a 401.
 */
export function TelegramNudge() {
  const { user, loading } = useAuth();
  // Start from what was true last time. Only a cached "connected" holds the
  // block back; everything else — no cache, cached "not connected", no session —
  // shows it on the first paint, because that is the answer for almost everyone
  // and waiting for the network meant being scrolled past before arriving.
  const [connected, setConnected] = useState(() => readCachedTelegramStatus(user?.id) === true);

  useEffect(() => {
    if (loading || !user) return;
    let alive = true;
    void (async () => {
      const s = await fetchTelegramStatus();
      if (!alive || !s) return;
      setConnected(s.connected);
      writeCachedTelegramStatus(user.id, s.connected);
    })();
    return () => { alive = false; };
  }, [user, loading]);

  // Re-read once the session lands: on a cold load `user` is null for the first
  // render, so the cache could not be consulted yet.
  useEffect(() => {
    if (!user) return;
    const cached = readCachedTelegramStatus(user.id);
    if (cached !== null) setConnected(cached);
  }, [user]);

  if (connected) return null;

  /* `leading-none` on both lines is what makes the padding symmetric, and it is
     the whole fix. Two lines of different sizes (14px and 12.5px) carry
     different amounts of slack inside their line boxes, so with default leading
     equal padding values do not produce equal gaps. Measured in the browser
     rather than judged by eye — the first attempt compensated by shrinking the
     bottom padding and overshot in the other direction, which looked like the
     block had simply moved up. With leading removed, plain py-3 lands at 11px
     above the glyphs and 11.5px below. */
  return (
    <Link
      to="/cli#telegram"
      className="group inline-flex flex-col items-center gap-1.5 rounded-2xl border border-foreground/12 bg-foreground/[0.03] px-5 py-3 text-center shadow-[0_2px_12px_-8px_rgba(0,0,0,0.35)] transition-all hover:border-foreground/25 hover:bg-foreground/[0.06]"
    >
      <span className="inline-flex items-center gap-2 text-[14px] leading-none text-foreground/90">
        <Send className="h-3.5 w-3.5 text-[#2AABEE]" />
        <span>Close the laptop — it keeps working</span>
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
      <span className="text-[12.5px] leading-none text-muted-foreground">
        Text it on Telegram from your phone. No browser, no tab left open.
      </span>
    </Link>
  );
}
