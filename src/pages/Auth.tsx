import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

/* ── Gradient background ── */
function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="rg1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="rg2" cx="80%" cy="70%" r="55%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="rg3" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="hsl(0 0% 100%)" />
        <rect width="100%" height="100%" fill="url(#rg1)" />
        <rect width="100%" height="100%" fill="url(#rg2)" />
        <rect width="100%" height="100%" fill="url(#rg3)" />
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

/* ── BlurFade ── */
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

/* ── GlassButton ── */
function GlassButton({
  onClick,
  children,
  className = '',
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <style>{`
        .glass-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
          border: none;
          outline: none;
          width: 100%;
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 0 rgba(0,0,0,0.06) inset,
            1px 0 0 0 rgba(255,255,255,0.7) inset,
            -1px 0 0 0 rgba(255,255,255,0.7) inset,
            0 4px 24px rgba(0,0,0,0.08),
            0 1px 3px rgba(0,0,0,0.06);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .glass-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.9) 0%,
            rgba(255,255,255,0.2) 40%,
            rgba(249,115,22,0.25) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glass-btn:hover {
          transform: translateY(-1px);
          background: rgba(255,255,255,0.7);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.95) inset,
            0 -1px 0 0 rgba(0,0,0,0.05) inset,
            1px 0 0 0 rgba(255,255,255,0.8) inset,
            -1px 0 0 0 rgba(255,255,255,0.8) inset,
            0 8px 32px rgba(249,115,22,0.12),
            0 2px 6px rgba(0,0,0,0.06);
        }
        .glass-btn:active {
          transform: translateY(0px);
        }
      `}</style>
      <button className={`glass-btn ${className}`} onClick={onClick}>
        {children}
      </button>
    </>
  );
}

/* ── Auth Page ── */
const Auth = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-muted-foreground text-sm"
        >
          Loading…
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <GradientBackground />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo + brand */}
        <BlurFade delay={0.1} className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg mb-4 border border-white/40">
            <img src="/Lytoailogo.png" alt="Lyto AI" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-serif tracking-tight text-foreground">
            Lyto<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered browser control</p>
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
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Welcome back</h2>
              <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your workspace</p>
            </div>

            {/* Google button */}
            <GlassButton onClick={signInWithGoogle}>
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </GlassButton>

            {/* Terms */}
            <p className="text-center text-[11px] text-muted-foreground/60 mt-5 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary/80 hover:text-primary underline-offset-2 hover:underline transition-colors">Terms</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary/80 hover:text-primary underline-offset-2 hover:underline transition-colors">Privacy Policy</a>
            </p>
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
              Data stays local
            </span>
            <span className="w-1 h-1 rounded-full bg-current" />
            <span>Free to use</span>
          </div>
        </BlurFade>
      </div>
    </div>
  );
};

export default Auth;
