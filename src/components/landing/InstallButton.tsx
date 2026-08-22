import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CHROME_STORE_URL, canInstallExtension, installMailto, isChrome,
} from '@/lib/store';
import { useInstallEnv } from '@/components/InstallCta';
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
 * Same detection as the onboarding install step — one implementation, so the
 * promise on the landing page and the promise after signup cannot drift apart.
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

  const base = cn(
    'group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary font-semibold text-white',
    'shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)] transition-all hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)] hover:-translate-y-[1px]',
    size === 'lg' ? 'px-8 py-4 text-[15px]' : 'px-6 py-3 text-sm',
  );

  const arrow = <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />;

  let button: JSX.Element;
  if (env.installed) {
    button = (
      <Link to="/dashboard" className={base}>
        Open your dashboard {arrow}
      </Link>
    );
  } else if (!canInstallExtension(env.device)) {
    // A phone cannot install it, so the button does the one useful thing: puts
    // the link where the person will be when they can.
    button = (
      <a href={installMailto()} className={base}>
        <Mail className="h-4 w-4" /> Send me the link
      </a>
    );
  } else if (!isChrome(env.browser)) {
    button = (
      // Straight to the CLI page, not to a signup form: someone whose browser
      // cannot run the panel needs to see that the same agent runs without one
      // before being asked for anything.
      <Link to="/cli#telegram" className={base}>
        Set up Argos without the extension {arrow}
      </Link>
    );
  } else {
    button = (
      <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer" className={base}>
        Add to Chrome · It's Free {arrow}
      </a>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {button}
      {showSignIn && (
        <Link
          to="/auth"
          className="text-[13px] text-muted-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Already have it? Sign in
        </Link>
      )}
    </div>
  );
}
