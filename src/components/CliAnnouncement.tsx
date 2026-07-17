import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ArrowRight, X } from 'lucide-react';

/**
 * Homepage "CLI IS OUT" banger — a tilted white card that peeks in from the
 * bottom-right corner and straightens/slides out on hover. Dismissible.
 */
const DISMISS_KEY = 'lyto-cli-launch-dismissed';

export default function CliAnnouncement() {
  const [show, setShow] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    const t = setTimeout(() => setShow(true), 1600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISS_KEY, '1');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 120, y: 40, rotate: 12 }}
          animate={{ opacity: 1, x: hover ? 0 : 34, y: hover ? 0 : 14, rotate: hover ? 0 : 8 }}
          exit={{ opacity: 0, x: 160, rotate: 14 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 1 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="fixed bottom-5 right-4 sm:right-6 z-[60] hidden sm:block"
          style={{ transformOrigin: 'bottom right' }}
        >
          <Link
            to="/cli"
            className="group relative block w-[280px] rounded-2xl p-[1.5px] shadow-2xl shadow-primary/25"
            style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.85), rgba(249,115,22,0.25))' }}
          >
            <button
              onClick={dismiss}
              aria-label="Dismiss"
              className="absolute -top-2 -left-2 z-10 h-6 w-6 rounded-full bg-white text-neutral-400 hover:text-neutral-700 flex items-center justify-center shadow-md border border-neutral-200"
            >
              <X className="h-3 w-3" />
            </button>

            <div className="relative rounded-2xl bg-white px-5 py-4 overflow-hidden">
              {/* soft warm wash */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/80 via-transparent to-transparent" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">New · Desktop Agent</span>
                </div>
                <p className="font-serif text-2xl leading-none text-neutral-900 tracking-tight">
                  CLI is <span className="italic text-primary">out</span>
                </p>
                <p className="mt-2 text-[12px] leading-snug text-neutral-500">
                  Lyto on your own machine — shell + a real browser, run from Telegram.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-neutral-900 group-hover:gap-2 transition-all">
                  Meet the CLI <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
