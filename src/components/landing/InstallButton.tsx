import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CHROME_STORE_URL, canInstallExtension, installMailto, isChrome,
} from '@/lib/store';
import { useInstallEnv } from '@/components/InstallCta';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

/**
 * The one button on the page, in the only four shapes that can succeed.
 *
 * "Add to Chrome" is a dead end for two of them and nobody finds that out until
 * they have clicked: mobile Chrome installs no extensions at all, and on Opera,
 * Firefox or Zen the extension installs and then has nowhere to appear, because
 * the panel is Chrome's side panel API. Two real users were lost exactly there,
 * which is why the environment decides the label rather than the copy deck.
 *
 * Same detection as the onboarding install step, one implementation, so the
 * promise on the landing page and the promise after signup cannot drift apart.
 *
 * Styled as ui/glass-button's wrap/face/shadow structure rather than that
 * component directly: GlassButton renders a real <button>, and every one of
 * these four is navigation (a route or an external link), not a click
 * handler — a <button> there would be the wrong element for a screen reader
 * and for open-in-new-tab. The three classes (glass-button, glass-button-text,
 * glass-button-shadow, defined in index.css) are the same visual surface,
 * just applied to an <a>/<Link>.
 */
export function InstallButton({
  className,
  size = 'lg',
  showSignIn = true,
}: {
  className?: string;
  size?: 'lg' | 'md';
  showSignIn?: boolean;
}) {
  const env = useInstallEnv();
  const { user, loading: authLoading } = useAuth();

  const face = cn(
    'glass-button group relative isolate inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white',
    size === 'lg' ? 'text-[15px]' : 'text-sm',
  );
  const text = cn(
    'glass-button-text relative flex items-center gap-2.5 select-none tracking-tight',
    size === 'lg' ? 'px-8 py-4' : 'px-6 py-3',
  );

  const arrow = <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />;

  let inner: JSX.Element;
  if (env.installed) {
    inner = (
      <Link to="/dashboard" className={face}>
        <span className={text}>Open your dashboard {arrow}</span>
      </Link>
    );
  } else if (!canInstallExtension(env.device)) {
    // A phone cannot install it, so the button does the one useful thing: puts
    // the link where the person will be when they can.
    inner = (
      <a href={installMailto()} className={face}>
        <span className={text}><Mail className="h-4 w-4" /> Send me the link</span>
      </a>
    );
  } else if (!isChrome(env.browser)) {
    inner = (
      // Straight to the CLI page, not to a signup form: someone whose browser
      // cannot run the panel needs to see that the same agent runs without one
      // before being asked for anything.
      <Link to="/cli#telegram" className={face}>
        <span className={text}>Set up Argos without the extension {arrow}</span>
      </Link>
    );
  } else {
    inner = (
      <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className={face}>
        <span className={text}>Add to Chrome · It's Free {arrow}</span>
      </a>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="glass-button-wrap relative inline-flex rounded-full">
        {inner}
        <div className="glass-button-shadow rounded-full" aria-hidden />
      </div>
      {/* Hidden once there is a session: "Already have it? Sign in" offers a
          signed-in person the one thing they have already done, directly under
          the button they came for. Withheld while auth is still resolving too,
          a link that appears and then vanishes is worse than one that arrives a
          moment late. */}
      {showSignIn && !authLoading && !user && (
        <Link
          to="/auth"
          /* py-2.5 rather than none: as a bare inline link this was a 20px-tall
             tap target on a phone, half the 44px guideline, sitting directly
             under the primary button, easy to miss and easy to mis-hit. */
          className="-my-1 px-2 py-2.5 text-[13px] text-muted-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Already have it? Sign in
        </Link>
      )}
    </div>
  );
}
