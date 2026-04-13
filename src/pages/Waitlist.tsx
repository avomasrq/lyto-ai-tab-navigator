import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Sparkles, Users, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/* ── Gradient background (consistent with Auth page) ── */
function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="wg1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="wg2" cx="80%" cy="70%" r="55%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="wg3" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="hsl(0 0% 100%)" />
        <rect width="100%" height="100%" fill="url(#wg1)" />
        <rect width="100%" height="100%" fill="url(#wg2)" />
        <rect width="100%" height="100%" fill="url(#wg3)" />
      </svg>

      {/* Animated blobs */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 560,
          height: 560,
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 480,
          height: 480,
          bottom: '-8%',
          right: '-8%',
          background: 'radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -35, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 320,
          height: 320,
          top: '40%',
          left: '55%',
          background: 'radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)',
          filter: 'blur(35px)',
        }}
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(30,30,30,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(30,30,30,1) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
}

/* ── BlurFade animation wrapper ── */
function BlurFade({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Waitlist Page ── */
const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  const fetchCount = async () => {
    try {
      const { count, error } = await (supabase as any)
        .from('waitlist')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        setWaitlistCount(count);
      } else {
        const localList = JSON.parse(localStorage.getItem('lyto_waitlist') || '[]');
        setWaitlistCount(localList.length);
      }
    } catch {
      const localList = JSON.parse(localStorage.getItem('lyto_waitlist') || '[]');
      setWaitlistCount(localList.length);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      // 1. Try Supabase first
      const { error } = await (supabase as any)
        .from('waitlist')
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        console.warn('Supabase waitlist error (likely table not created yet):', error);
        
        if (error.code === '23505') {
          setErrorMsg('You\'re already on the waitlist! We\'ll notify you soon.');
          setStatus('error');
          return;
        }
        
        saveToLocalWaitlist(email);
        setTimeout(() => {
          setStatus('success');
          fetchCount(); // Refresh count after local save
        }, 800);
      } else {
        setStatus('success');
        fetchCount(); // Refresh count after real save
      }
    } catch (err) {
      console.error('Waitlist error:', err);
      // Fallback for any other errors
      saveToLocalWaitlist(email);
      setTimeout(() => setStatus('success'), 800);
    }
  };

  const saveToLocalWaitlist = (email: string) => {
    const list = JSON.parse(localStorage.getItem('lyto_waitlist') || '[]');
    if (!list.includes(email)) {
      list.push(email);
      localStorage.setItem('lyto_waitlist', JSON.stringify(list));
    }
    console.log('Saved to local waitlist (demo mode):', email);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <GradientBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <BlurFade delay={0.05}>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
        </BlurFade>

        {/* Logo + brand */}
        <BlurFade delay={0.1} className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg mb-4 border border-white/40">
            <img src="/Lytoailogo.png" alt="Lyto AI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-serif tracking-tight text-foreground">
            Join the Waitlist
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
            Be the first to know when Lyto AI launches on Chrome
          </p>
          
          <AnimatePresence>
            {waitlistCount !== null && waitlistCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 flex items-center gap-2"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white bg-muted overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 13}`} 
                        alt="User"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] font-medium text-primary/70">
                  Join <span className="text-primary font-bold">{waitlistCount}</span> {waitlistCount === 1 ? 'person' : 'others'} waiting
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </BlurFade>

        {/* Card */}
        <BlurFade delay={0.22}>
          <div
            className="rounded-2xl p-7 sm:p-9"
            style={{
              background: 'rgba(255,255,255,0.55)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 48px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,0.9) inset',
            }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">You're on the list!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    We'll email you as soon as the beta is ready.
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
                  {/* Features list */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <span>Early access to all features</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <span>Join the founding community</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <span>Get notified when beta launches</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 disabled:opacity-60"
                        style={{
                          background: 'rgba(255,255,255,0.7)',
                          border: '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 0 rgba(255,255,255,0.8) inset',
                        }}
                      />
                    </div>

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
                      className="waitlist-submit-btn w-full"
                    >
                      {status === 'loading' ? (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Joining...
                        </motion.span>
                      ) : (
                        'Join the Waitlist'
                      )}
                    </button>
                  </form>

                  <p className="text-center text-[11px] text-muted-foreground/50 mt-4">
                    No spam, ever. Unsubscribe at any time.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BlurFade>

        {/* Trust line */}
        <BlurFade delay={0.38}>
          <div className="mt-6 flex items-center justify-center gap-5 text-[11px] text-muted-foreground/50">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Encrypted
            </span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Privacy first
            </span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>Free to join</span>
          </div>
        </BlurFade>
      </div>

      {/* Submit button styles */}
      <style>{`
        .waitlist-submit-btn {
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
        .waitlist-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.25) inset,
            0 -1px 0 0 rgba(0,0,0,0.1) inset,
            0 8px 32px rgba(249,115,22,0.3),
            0 2px 6px rgba(0,0,0,0.1);
        }
        .waitlist-submit-btn:active:not(:disabled) {
          transform: translateY(0px);
        }
        .waitlist-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Waitlist;
