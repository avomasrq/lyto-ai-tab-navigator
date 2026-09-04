import { supabase } from '@/integrations/supabase/client';

/** Shared helpers for the Argos desktop-agent (CLI) install + pairing flow. */

export const CLI_API_URL = import.meta.env.VITE_API_URL || 'https://api.tryargos.cc';

export type OS = 'mac' | 'windows' | 'linux';

export const OS_LABEL: Record<OS, string> = { mac: 'macOS', windows: 'Windows', linux: 'Linux' };

export interface CliStatus {
  entitled: boolean;
  connected: boolean;
  paired: boolean;
}

export function detectOS(): OS {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'windows';
  if (ua.includes('mac')) return 'mac';
  return 'linux';
}

/** The one-line installer the user pastes into their terminal. */
export function installCommand(os: OS, token: string): string {
  const t = token || '<pairing-code>';
  if (os === 'windows') {
    return `$env:ARGOS_TOKEN="${t}"; irm ${CLI_API_URL}/cli/win | iex`;
  }
  return `curl -fsSL ${CLI_API_URL}/cli | ARGOS_TOKEN=${t} bash`;
}

async function authedFetch(path: string, init?: RequestInit) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Not signed in');
  return fetch(`${CLI_API_URL}${path}`, {
    ...init,
    headers: { ...(init?.headers || {}), Authorization: `Bearer ${token}` },
  });
}

export async function fetchCliStatus(): Promise<CliStatus | null> {
  try {
    const res = await authedFetch('/api/cli/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export class PairingError extends Error {
  constructor(message: string, public code: 'needs_pro' | 'unauthed' | 'failed') {
    super(message);
  }
}

/**
 * POST /api/cli/unpair → drops the live socket and bumps cliTokenVersion, which is what
 * actually invalidates the old code. The token is derived from (userId, version), so
 * minting again without this returns the identical string, "generate a new code" is
 * only truthful when it rotates the version first.
 */
export async function unpairCli(): Promise<void> {
  const res = await authedFetch('/api/cli/unpair', { method: 'POST' });
  if (!res.ok) throw new PairingError('Could not release the current pairing. Please try again.', 'failed');
}

/** POST /api/cli/pair → the account's pairing code (Pro-gated). */
export async function mintPairingCode(): Promise<string> {
  let res: Response;
  try {
    res = await authedFetch('/api/cli/pair', { method: 'POST' });
  } catch {
    throw new PairingError('Sign in on this site first to get a pairing code.', 'unauthed');
  }
  if (res.status === 402) {
    throw new PairingError('An active Argos Pro subscription is required to connect the desktop agent.', 'needs_pro');
  }
  if (!res.ok) {
    throw new PairingError('Could not generate a pairing code. Please try again.', 'failed');
  }
  const { token } = await res.json();
  return token as string;
}

/* ── Telegram, from the web ────────────────────────────────────────────────
 *
 * Connecting Telegram used to be possible only from inside the extension, which
 * is exactly backwards for the people who need it most: the ones on Opera, Zen
 * or Firefox, who arrive at "set it up without the extension" and are then told
 * to open a panel they cannot install. The endpoints have always been there,
 * the web just never called them.
 */

export interface TelegramStatus {
  connected: boolean;
  configured: boolean;
  username?: string | null;
}

/**
 * Last known Telegram status, per account, in localStorage.
 *
 * Both places that ask for it render the wrong thing while the request is in
 * flight: the home-page nudge waits and appears late enough to be scrolled past,
 * and the card on /cli starts on "not connected" and flips a moment later, which
 * looks like it forgot. Neither can be fixed by asking faster, the answer is a
 * network round trip away, so the previous answer is kept and used for the
 * first paint, then corrected in place if it turns out to be stale.
 *
 * Keyed by user id: the wrong account's cached "connected" would hide the button
 * from someone who needs it. Best effort throughout, private windows and
 * blocked storage throw, and the only cost of a miss is the delay we had before.
 */
const TG_CACHE_KEY = (userId: string) => `argos:tg:${userId}`;

export function readCachedTelegramStatus(userId: string | null | undefined): boolean | null {
  if (!userId) return null;
  try {
    const v = localStorage.getItem(TG_CACHE_KEY(userId));
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

export function writeCachedTelegramStatus(userId: string | null | undefined, connected: boolean): void {
  if (!userId) return;
  try {
    localStorage.setItem(TG_CACHE_KEY(userId), connected ? '1' : '0');
  } catch {
    /* storage unavailable, the next paint just waits for the network again */
  }
}

export async function fetchTelegramStatus(): Promise<TelegramStatus | null> {
  try {
    // No `api` prefix here: IntegrationsController is @Controller('integrations'),
    // while the CLI one is @Controller('api/cli'). Getting this wrong 404s, and a
    // 404 arrives looking exactly like "something went wrong", verified against
    // the live API: /integrations/telegram/status → 401, /api/integrations/… → 404.
    const res = await authedFetch('/integrations/telegram/status');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * The bot deep link (t.me/…?start=<token>) that ties the chat to this account.
 *
 * Throws rather than returning null, because the three ways this fails need three
 * different sentences: not signed in, the bot is not configured on the server, or
 * the call itself failed. Collapsing them into "could not get the link" is how a
 * 404 from a wrong path spent an evening looking like a server problem.
 */
export async function fetchTelegramLink(): Promise<string> {
  const res = await authedFetch('/integrations/telegram/link');
  if (res.status === 401) throw new Error('unauthed');
  if (!res.ok) throw new Error(`http_${res.status}`);
  const data = await res.json();
  if (data?.error) throw new Error(String(data.error));
  if (typeof data?.url !== 'string') throw new Error('no_url');
  return data.url;
}
