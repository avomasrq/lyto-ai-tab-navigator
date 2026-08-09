import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Makes `/cli#install` land on the install section.
 *
 * The browser resolves a hash before React has rendered anything, so on a cold load
 * there is no element to scroll to and the page just sits at the top — which is what
 * every link we hand out, and every shared URL, was doing. Sections carry scroll-mt-*,
 * so scrollIntoView already clears the floating navbar.
 */
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // A plain route change should start at the top rather than inherit the
      // scroll position of the page we came from.
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    // Sections below the fold mount with the rest of the page, but images and lazy
    // chunks land later and move things; a couple of retries beats a single guess.
    let tries = 0;
    const settle = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: tries === 0 ? 'auto' : 'smooth', block: 'start' });
        if (tries > 2) return;
      }
      tries += 1;
      if (tries <= 4) timer = window.setTimeout(settle, 220);
    };
    let timer = window.setTimeout(settle, 60);

    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
