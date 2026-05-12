import { useRef, useEffect, useState, useCallback } from 'react';
import { MultiOrbitSemiCircle } from '@/components/ui/multi-orbit-semi-circle';

const INTEGRATIONS = [
  { src: '/gmaillogo.webp',     label: 'Gmail' },
  { src: '/googledocs.png',     label: 'Google Docs' },
  { src: '/googlesheets.png',   label: 'Sheets' },
  { src: '/googlecalendar.png', label: 'Calendar' },
  { src: '/slack.png',          label: 'Slack' },
  { src: '/github.png',         label: 'GitHub' },
  { src: '/whatsapp.png',       label: 'WhatsApp' },
];

const WHEEL_THRESHOLD = 80;  // deltaY needed to reveal / hide one icon
const UNLOCK_DELAY    = 500; // ms to linger after last icon appears

export default function IntegrationsSection() {
  const sectionRef      = useRef<HTMLDivElement>(null);
  const lockedRef       = useRef(false);
  const wheelDeltaRef   = useRef(0);
  const visibleCountRef = useRef(0);

  const [visibleCount, setVisibleCount] = useState(0);

  // ── scroll lock helpers (iOS-safe: fixed body) ─────────────────────────────
  const lock = useCallback(() => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    document.documentElement.style.overflowY = 'hidden';
  }, []);

  const unlock = useCallback(() => {
    if (!lockedRef.current) return;
    lockedRef.current = false;
    document.documentElement.style.overflowY = '';
  }, []);

  // ── advance / retreat ───────────────────────────────────────────────────────
  const advance = useCallback(() => {
    const next = Math.min(visibleCountRef.current + 1, INTEGRATIONS.length);
    visibleCountRef.current = next;
    setVisibleCount(next);
    wheelDeltaRef.current = 0;
    if (next >= INTEGRATIONS.length) {
      setTimeout(unlock, UNLOCK_DELAY);
    }
  }, [unlock]);

  const retreat = useCallback(() => {
    const prev = Math.max(visibleCountRef.current - 1, 0);
    visibleCountRef.current = prev;
    setVisibleCount(prev);
    wheelDeltaRef.current = 0;
  }, []);

  // ── IntersectionObserver: lock when section is centred in viewport ──────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleCountRef.current < INTEGRATIONS.length) {
          lock();
        } else if (!entry.isIntersecting) {
          unlock();
        }
      },
      { threshold: 0.6 },
    );

    io.observe(el);
    return () => { io.disconnect(); unlock(); };
  }, [lock, unlock]);

  // ── Wheel: swallow the event and advance/retreat ────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      wheelDeltaRef.current += e.deltaY;
      if      (wheelDeltaRef.current >  WHEEL_THRESHOLD) advance();
      else if (wheelDeltaRef.current < -WHEEL_THRESHOLD) retreat();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [advance, retreat]);

  // ── Touch: swipe up / down ──────────────────────────────────────────────────
  useEffect(() => {
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      const dy = startY - e.touches[0].clientY;
      if (Math.abs(dy) > 40) {
        startY = e.touches[0].clientY;
        dy > 0 ? advance() : retreat();
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
    };
  }, [advance, retreat]);

  const allVisible = visibleCount >= INTEGRATIONS.length;

  return (
    <section
      ref={sectionRef}
      id="integrations"
      className="h-screen flex flex-col items-center justify-center px-4 scroll-mt-24"
    >
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
          Integrations
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-3 leading-tight">
          Works with your
          <br />
          <span className="italic text-gradient">favourite tools</span>
        </h2>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base">
          {allVisible
            ? 'All integrations connected.'
            : `${visibleCount} of ${INTEGRATIONS.length} connected — keep scrolling`}
        </p>
      </div>

      {/* Orbit */}
      <MultiOrbitSemiCircle integrations={INTEGRATIONS} visibleCount={visibleCount} />

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mt-6">
        {INTEGRATIONS.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i < visibleCount ? '20px' : '6px',
              backgroundColor: i < visibleCount
                ? 'hsl(var(--primary))'
                : 'hsl(var(--muted))',
            }}
          />
        ))}
      </div>

      {/* Scroll hint arrow */}
      {!allVisible && (
        <p className="text-xs text-muted-foreground/50 mt-3 animate-pulse select-none">
          ↓ scroll to connect
        </p>
      )}
    </section>
  );
}
