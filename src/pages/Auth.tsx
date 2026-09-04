import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { EtherealShadow } from '@/components/ui/etheral-shadow';

/* ── Greek statue backdrop, with the ethereal shadow drifting over it ── */
function StatueBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* The source is 736×414, so full-bleed object-cover upscales it 2–4× and it
          reads as blocky. Until a larger file exists, a small blur plus a scale that
          hides the blurred edge turns the upscaling into deliberate depth of field,
          the vignette and the drifting wisps above it do the rest. */}
      <img
        src="/auth-greek-statue.jpeg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover"
        style={{ objectPosition: '35% 50%', filter: 'blur(3px) contrast(1.06) saturate(0.9)' }}
      />
      {/* White wisps + grain, screen-blended so they read as drifting light
          over the photo instead of vanishing into its black background */}
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <EtherealShadow
          color="rgba(255, 255, 255, 1)"
          noise={{ opacity: 0.5, scale: 1.2 }}
          sizing="fill"
        />
      </div>
      {/* Vignette so the card and header text stay legible over the photo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 60% at 50% 40%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.8) 100%)',
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
        /* The sign-in button, on the extension panel's glass (see .lg-glass in
           index.css). It is a local block rather than the shared class because
           it also carries the button's shape and its hover/active states; only
           the material is shared, and it is copied, so it has to be kept in
           step by hand. What the rebase changed: saturate(200%), a real border
           in place of the masked ::before ring, and the same four-sided rim the
           rest of the site now uses.

           This is the first surface most people ever see us render, it is the
           only thing on the sign-in screen, so it is the worst one to leave a
           version behind on. */
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
          outline: none;
          width: 100%;
          background:
            linear-gradient(0deg,
              hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07),
              hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07)),
            rgba(255,255,255,0.68);
          backdrop-filter: blur(26px) saturate(200%);
          -webkit-backdrop-filter: blur(26px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.54);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.85),
            inset 0 -1px 0 rgba(255,255,255,0.22),
            inset 1px 0 0 rgba(255,255,255,0.30),
            inset -1px 0 0 rgba(255,255,255,0.30),
            0 2px 16px rgba(0,0,0,0.06),
            0 1px 3px rgba(0,0,0,0.06);
          transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
        }
        .glass-btn:hover {
          transform: translateY(-1px);
          background:
            linear-gradient(0deg,
              hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07),
              hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07)),
            rgba(255,255,255,0.80);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.95),
            inset 0 -1px 0 rgba(255,255,255,0.25),
            inset 1px 0 0 rgba(255,255,255,0.40),
            inset -1px 0 0 rgba(255,255,255,0.40),
            0 8px 32px rgba(0,0,0,0.12),
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
    if (!user || loading) return;
    // Has this person already answered the onboarding questions?
    //
    // `error` used to be dropped here, and a failed read looks exactly like "no
    // row": both give `data === null`. So any RLS or network hiccup sent someone
    // who had long since finished the survey back through it, every single sign
    // in. A read that FAILED tells us nothing about whether they onboarded, so
    // the safe move is the dashboard, which shows the install screen by itself
    // when the account has never been used.
    supabase
      .from('onboarding_responses' as never)
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.warn('[auth] onboarding check failed:', error.message);
          navigate('/dashboard');
          return;
        }
        navigate(data ? '/dashboard' : '/onboarding');
      });
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
      <StatueBackground />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo + brand */}
        <BlurFade delay={0.1} className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg mb-4 border border-white/40">
            <img src="/argoss.png" alt="Argos" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-geometric tracking-tight text-white">
            Argos<span className="text-primary">.</span>
          </h1>
          <p className="text-sm text-white/70 mt-1">The AI that acts as you</p>
        </BlurFade>

        {/* Card */}
        <BlurFade delay={0.22}>
          <div
            className="lg-glass rounded-2xl p-7 sm:p-9"
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
          <div className="mt-6 flex items-center justify-center gap-5 text-[11px] text-white/60">
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
