import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ArrowRight, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

/* ── Gradient background ── */
function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="bg1" cx="15%" cy="15%" r="60%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.14)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="bg2" cx="85%" cy="75%" r="55%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.10)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="hsl(0 0% 100%)" />
        <rect width="100%" height="100%" fill="url(#bg1)" />
        <rect width="100%" height="100%" fill="url(#bg2)" />
      </svg>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600, top: '-15%', left: '-10%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500, height: 500, bottom: '-10%', right: '-8%',
          background: 'radial-gradient(circle, rgba(234,88,12,0.10) 0%, transparent 70%)',
          filter: 'blur(55px)',
        }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(30,30,30,1) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
}

function BlurFade({ children, delay = 0, className }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const BETA_FEATURES = [
  {
    number: '01',
    label: 'Newest features first',
    description: 'Beta members get every new feature before anyone else — no waiting for public releases',
  },
  {
    number: '02',
    label: 'Best offers & pricing',
    description: 'Exclusive deals and early-bird pricing only available to people on this list',
  },
  {
    number: '03',
    label: 'Lyto on iPhone & Android',
    description: 'Be first in line when the mobile app launches — full AI power in your pocket',
  },
  {
    number: '04',
    label: 'Lyto desktop client for Mac',
    description: 'Early access to the native Mac app with deeper system integration',
  },
  {
    number: '05',
    label: 'New integrations — first',
    description: 'WhatsApp, Telegram, GitHub, Slack, Figma and more — beta users get them first',
  },
  {
    number: '06',
    label: 'Shape the roadmap',
    description: 'Direct line to the team — your feedback decides what gets built next',
  },
];

const Beta = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  const fetchCount = async () => {
    const { data } = await supabase.rpc('get_waitlist_count');
    if (data !== null) setWaitlistCount(Number(data));
  };

  useEffect(() => { fetchCount(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase
      .from('waitlist')
      .insert({ email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === '23505') {
        setErrorMsg("You're already on the list — we'll reach out soon.");
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
      setStatus('error');
      return;
    }

    setStatus('success');
    fetchCount();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <GradientBackground />
      <Navbar />

      <div className="relative z-10 pt-28 pb-20 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">

          {/* Hero */}
          <div className="text-center mb-16">
            <BlurFade delay={0.05}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#fed7aa] bg-[#fff7ed] px-3 py-1 text-xs font-semibold text-[#9a3412] mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c] animate-pulse inline-block" />
                Version 3.0 — coming soon
              </div>
            </BlurFade>

            <BlurFade delay={0.12}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-[1.1] tracking-tight mb-5">
                The next version of<br />
                <span className="italic text-gradient">Lyto 3.0 is almost here</span>
              </h1>
            </BlurFade>

            <BlurFade delay={0.2}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                New features, new platforms, best offers — beta members get it all first. From the v2.0 browser extension to Lyto on iPhone, Android, and a native Mac client.
              </p>
            </BlurFade>
          </div>

          {/* Two-column: features + form */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left — what's new */}
            <BlurFade delay={0.28}>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-medium mb-6">
                  What beta members get
                </p>
                <div className="space-y-4">
                  {BETA_FEATURES.map((f, i) => (
                    <motion.div
                      key={f.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.32 + i * 0.07 }}
                      className="flex items-start gap-4"
                    >
                      <span className="font-serif text-2xl text-primary/20 leading-none shrink-0 w-8 select-none pt-0.5">
                        {f.number}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{f.label}</p>
                        <p className="text-sm text-muted-foreground">{f.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </BlurFade>

            {/* Right — waitlist form */}
            <BlurFade delay={0.34}>
              <div
                className="rounded-2xl p-7 sm:p-9"
                style={{
                  background: 'rgba(255,255,255,0.60)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.65)',
                  boxShadow: '0 8px 48px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
                }}
              >
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-6"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">You're on the beta list!</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        You'll be first in line for new features, new platforms, and exclusive offers.
                      </p>
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to home
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }}>
                      <div className="mb-6">
                        <h2 className="text-xl font-serif tracking-tight text-foreground mb-1">
                          Get early access
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Be the first to use every new feature, platform, and offer — before the public ever sees it.
                        </p>
                      </div>

                      {/* Social proof */}
                      <AnimatePresence>
                        {waitlistCount !== null && waitlistCount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-primary/5 border border-primary/10"
                          >
                            <div className="flex -space-x-1.5">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-muted overflow-hidden">
                                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="" className="w-full h-full" />
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">{waitlistCount}</span> people already waiting
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); setStatus('idle'); }}
                          disabled={status === 'loading'}
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 disabled:opacity-60"
                          style={{
                            background: 'rgba(255,255,255,0.75)',
                            border: '1px solid rgba(0,0,0,0.08)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.8) inset',
                          }}
                        />

                        {errorMsg && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-orange-600 px-1"
                          >
                            {errorMsg}
                          </motion.p>
                        )}

                        <button
                          type="submit"
                          disabled={status === 'loading' || !email.trim()}
                          className="beta-submit-btn w-full"
                        >
                          {status === 'loading' ? (
                            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                              Joining...
                            </motion.span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              Join the beta waitlist
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </button>
                      </form>

                      <div className="mt-5 flex items-center justify-between text-[11px] text-muted-foreground/50">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> Limited spots
                        </span>
                        <span>No spam, ever</span>
                        <span>Free to join</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </BlurFade>
          </div>

          {/* Back link */}
          <BlurFade delay={0.5}>
            <div className="text-center mt-14">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to home
              </Link>
            </div>
          </BlurFade>
        </div>
      </div>

      <style>{`
        .beta-submit-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          border: none;
          outline: none;
          background: linear-gradient(135deg, hsl(24 95% 53%), hsl(20 90% 48%));
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.2) inset,
            0 -1px 0 0 rgba(0,0,0,0.1) inset,
            0 4px 24px rgba(249,115,22,0.25),
            0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
        }
        .beta-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.25) inset,
            0 -1px 0 0 rgba(0,0,0,0.1) inset,
            0 8px 32px rgba(249,115,22,0.3),
            0 2px 6px rgba(0,0,0,0.1);
        }
        .beta-submit-btn:active:not(:disabled) { transform: translateY(0px); }
        .beta-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default Beta;
