import { supabase } from '@/integrations/supabase/client';

/** Shared helpers for the Lyto desktop-agent (CLI) install + pairing flow. */

export const CLI_API_URL = import.meta.env.VITE_API_URL || 'https://api.trylyto.com';

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
    return `$env:LYTO_TOKEN="${t}"; irm ${CLI_API_URL}/cli/win | iex`;
  }
  return `curl -fsSL ${CLI_API_URL}/cli | LYTO_TOKEN=${t} bash`;
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

/** POST /api/cli/pair → single-use pairing code (Pro-gated). */
export async function mintPairingCode(): Promise<string> {
  let res: Response;
  try {
    res = await authedFetch('/api/cli/pair', { method: 'POST' });
  } catch {
    throw new PairingError('Sign in on this site first to get a pairing code.', 'unauthed');
  }
  if (res.status === 402) {
    throw new PairingError('An active Lyto Pro subscription is required to connect the desktop agent.', 'needs_pro');
  }
  if (!res.ok) {
    throw new PairingError('Could not generate a pairing code. Please try again.', 'failed');
  }
  const { token } = await res.json();
  return token as string;
}
