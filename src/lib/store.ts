/**
 * The Chrome Web Store listing — the one place the product is actually installed
 * from. The URL was copy-pasted across six files in two shapes (with and without
 * the `lyto-ai-research-assistan` slug), which is how the rebrand left a stale
 * name in half of them. New call sites use this; the old ones still work because
 * Chrome resolves a listing by id and ignores the slug.
 */
export const EXTENSION_ID = 'nalekilafbipfallhlkbpidgfceoabcb';

export const CHROME_STORE_URL = `https://chromewebstore.google.com/detail/${EXTENSION_ID}`;

/**
 * Opening the side panel. `MacCtrl` in the extension manifest is the CONTROL key,
 * not Command — so this really is Ctrl on every platform, and telling Mac users
 * "⌘+Shift+L" would have them pressing a shortcut that does nothing.
 */
export const PANEL_SHORTCUT = 'Ctrl+Shift+L';

export type Device = 'desktop' | 'mobile' | 'tablet';

export type Browser = 'chrome' | 'edge' | 'opera' | 'brave' | 'firefox' | 'safari' | 'other';

/**
 * Form factor, for one decision: can this person install the extension at all?
 *
 * Chrome on Android and on iOS supports no extensions whatsoever — not a smaller
 * install flow, none. So "Add to Chrome" on a phone is a button that cannot
 * succeed: it opens a Store page with nothing to press. That is a silent dead end
 * for what is typically half the traffic on a landing page.
 *
 * `userAgentData.mobile` is the reliable signal where it exists; the UA regex is
 * the fallback. iPad is special-cased because iPadOS 13+ reports itself as
 * "Macintosh" and would otherwise pass as a desktop that can install.
 */
export function detectDevice(): Device {
  if (typeof navigator === 'undefined') return 'desktop';

  const ua = navigator.userAgent;
  const touch = navigator.maxTouchPoints ?? 0;

  // iPadOS 13+ masquerades as macOS; a real Mac reports no touch points.
  if (/Macintosh/.test(ua) && touch > 1) return 'tablet';
  if (/iPad/.test(ua)) return 'tablet';
  if (/Android/.test(ua) && !/Mobile/.test(ua)) return 'tablet';

  const uaData = (navigator as any).userAgentData;
  if (typeof uaData?.mobile === 'boolean') return uaData.mobile ? 'mobile' : 'desktop';

  return /Android|iPhone|iPod|Windows Phone/i.test(ua) ? 'mobile' : 'desktop';
}

/** Neither phones nor tablets can install a Chrome extension. */
export const canInstallExtension = (device: Device): boolean => device === 'desktop';

/**
 * Which browser, in the only terms that matter here: the panel is built on
 * Chrome's side panel API, so on Opera, Firefox, Zen and the rest the extension
 * installs and then has nowhere to appear. Two live users hit exactly that.
 *
 * Order matters — every Chromium browser also says "Chrome" in its UA, so the
 * impostors are ruled out first.
 */
export function detectBrowser(): Browser {
  if (typeof navigator === 'undefined') return 'chrome';
  const ua = navigator.userAgent;

  if (/OPR\/|Opera/.test(ua)) return 'opera';
  if (/Edg\//.test(ua)) return 'edge';
  // Brave hides itself in the UA; it exposes navigator.brave instead.
  if ((navigator as any).brave?.isBrave) return 'brave';
  if (/Firefox\/|FxiOS/.test(ua)) return 'firefox';
  if (/Chrome\/|CriOS/.test(ua)) return 'chrome';
  if (/Safari\//.test(ua)) return 'safari';
  return 'other';
}

/** Chrome proper — the only browser where the side panel exists. */
export const isChrome = (b: Browser): boolean => b === 'chrome';

/**
 * Is the extension already installed? Asks it directly: the manifest lists this
 * site under `externally_connectable`, so a installed copy answers `{ ok: true }`.
 *
 * Resolves false on anything else — no chrome.runtime, not installed, an older
 * build without the handler, or no reply within the timeout. That is the safe
 * direction: the worst case is offering to install something already installed,
 * never hiding the install from someone who needs it.
 */
export function pingExtension(timeoutMs = 500): Promise<boolean> {
  return new Promise((resolve) => {
    const runtime = (window as any).chrome?.runtime;
    if (!runtime?.sendMessage) return resolve(false);

    let settled = false;
    const done = (v: boolean) => { if (!settled) { settled = true; resolve(v); } };
    setTimeout(() => done(false), timeoutMs);

    try {
      runtime.sendMessage(EXTENSION_ID, { type: 'ping' }, (res: any) => {
        // Reading lastError is what suppresses Chrome's "Unchecked runtime.lastError"
        // console noise when nothing is listening.
        const failed = !!runtime.lastError;
        done(!failed && res?.ok === true);
      });
    } catch {
      done(false);
    }
  });
}

/**
 * A pre-filled mail draft the person sends to themselves, so the install waits on
 * their desk instead of being lost. `mailto:` deliberately, not a send-it-for-me
 * endpoint: the site has no mail provider wired up at all, and a button that
 * silently fails to deliver would be worse than the dead end it replaces.
 */
export const installMailto = (to?: string | null): string =>
  `mailto:${to ?? ''}?subject=` +
  encodeURIComponent('Install Argos on my computer') +
  '&body=' +
  encodeURIComponent(
    `Argos is a Chrome extension — it runs in Chrome on a computer.\n\nOpen this on your desktop and click "Add to Chrome":\n${CHROME_STORE_URL}\n`,
  );
