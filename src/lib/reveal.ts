/**
 * Entrance animations that cannot leave the page invisible.
 *
 * Chrome freezes requestAnimationFrame in a background tab, and framer-motion
 * drives everything from it. An element that gets its visibility from an
 * entrance — opacity 0 → 1 — therefore stays at 0 for as long as the tab is not
 * looked at. That is not theoretical: a landing page opened with cmd+click, or
 * screenshotted by anything headless, renders as a blank column between the
 * headings. Measured on this page: visibilityState "hidden", paragraph and three
 * cards stuck at opacity 0 with a hole where the copy should be.
 *
 * So: when the document is hidden at mount, there is no entrance at all. The
 * page simply exists, which is what a person who has not seen it yet wants.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function reveal(delay = 0, y = 22) {
  if (typeof document !== 'undefined' && document.hidden) return {};
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.6, delay, ease: EASE },
  };
}
