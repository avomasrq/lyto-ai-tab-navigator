import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import {
  CHROME_STORE_URL, PANEL_SHORTCUT, canInstallExtension, detectBrowser, detectDevice,
  installMailto, isChrome, pingExtension, type Browser, type Device,
} from '@/lib/store';
import { cn } from '@/lib/utils';

export interface InstallEnv {
  device: Device;
  browser: Browser;
  installed: boolean;
}

/**
 * Environment behind the install step, resolved after mount.
 *
 * Starts as "desktop Chrome, not installed" — the state whose CTA is a plain
 * install button, so the first paint is never a dead end even for the fraction
 * of a second before the ping answers.
 */
export function useInstallEnv(): InstallEnv {
  const [env, setEnv] = useState<InstallEnv>({ device: 'desktop', browser: 'chrome', installed: false });

  useEffect(() => {
    let alive = true;
    void pingExtension().then((installed) => {
      if (alive) setEnv({ device: detectDevice(), browser: detectBrowser(), installed });
    });
    return () => { alive = false; };
  }, []);

  return env;
}

const BROWSER_LABEL: Partial<Record<Browser, string>> = {
  opera: 'Opera', firefox: 'Firefox', edge: 'Edge', brave: 'Brave', safari: 'Safari',
};

const primary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90';
const secondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-border/70 bg-white px-4 py-2.5 text-[13px] font-medium text-foreground transition-colors hover:bg-muted';

/**
 * The install step, in the four states the environment can actually be in. One
 * component because the onboarding finale and the dashboard of a never-used
 * account must say the same thing — the spec's section 6 is section 4a again.
 *
 * The states exist because three of them used to be a single "Add to Chrome"
 * button that could not work:
 *  · mobile — Chrome on phones supports no extensions at all;
 *  · non-Chrome — the panel is Chrome's side panel API, so it installs and then
 *    has nowhere to appear;
 *  · already installed — offering to install it again reads as broken.
 */
export function InstallCta({
  env,
  className,
  email,
  onInstallClick,
  onBrowserRequest,
}: {
  env: InstallEnv;
  className?: string;
  /** Prefills the mail draft so "email me" needs no typing. */
  email?: string | null;
  onInstallClick?: () => void;
  /** 4г: collect the address of someone whose browser can't run it yet. */
  onBrowserRequest?: (email: string) => Promise<void> | void;
}) {
  const [copied, setCopied] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(email ?? '');
  const [notifySent, setNotifySent] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CHROME_STORE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mail draft still works */
    }
  }, []);

  // ── 4б: already installed ─────────────────────────────────────────────────
  if (env.installed) {
    return (
      <div className={className}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Argos is installed. Open the panel on any page and ask it something.
        </p>
        <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">{PANEL_SHORTCUT}</span> works anywhere.
          Pin the icon so it's always one click away.
        </p>
      </div>
    );
  }

  // ── 4в: phone or tablet ───────────────────────────────────────────────────
  if (!canInstallExtension(env.device)) {
    return (
      <div className={className}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Mobile Chrome can't install extensions. That's a Google limitation, not us being lazy.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Send yourself the link and install it when you're at your desk.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a href={installMailto(email)} className={cn(primary, 'flex-1')}>
            <Mail className="h-4 w-4" />
            Email me the link
          </a>
          <button type="button" onClick={copyLink} className={cn(secondary, 'flex-1')}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          Your account is ready either way. Nothing is lost.
        </p>
      </div>
    );
  }

  // ── 4г: a desktop browser that has no side panel ──────────────────────────
  if (!isChrome(env.browser)) {
    const label = BROWSER_LABEL[env.browser] ?? 'your browser';
    return (
      <div className={className}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The panel uses Chrome's side panel API, which {label} doesn't have. So the extension
          installs and then has nowhere to appear. Rather than let you find that out the hard way,
          we're saying it here.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          If you use Chrome for anything else, it works there.
        </p>
        <a
          href={CHROME_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onInstallClick}
          className={cn(primary, 'mt-5 w-full')}
        >
          Add to Chrome anyway
        </a>

        {onBrowserRequest && (
          <div className="mt-5">
            {notifySent ? (
              <p className="text-[13px] text-muted-foreground">
                Noted — we'll write to you when it runs in {label}.
              </p>
            ) : (
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!notifyEmail.trim()) return;
                  await onBrowserRequest(notifyEmail.trim());
                  setNotifySent(true);
                }}
              >
                <input
                  type="email"
                  required
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-xl border border-border/70 bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-primary/50"
                />
                <button type="submit" className={secondary}>
                  Tell me when it works →
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── 4а: Chrome on a desktop, not installed ────────────────────────────────
  return (
    <div className={className}>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The site was only for making an account. The panel next to your pages is the actual product.
      </p>
      <a
        href={CHROME_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onInstallClick}
        className={cn(primary, 'mt-5 w-full')}
      >
        Add to Chrome
      </a>
      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
        After installing: pin the icon, then open the panel on any page.{' '}
        <span className="font-medium text-foreground">{PANEL_SHORTCUT}</span> opens it anywhere.
      </p>
    </div>
  );
}
