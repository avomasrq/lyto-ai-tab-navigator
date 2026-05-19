import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

/* ── Gradient background (same style as Auth.tsx) ── */
function GradientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ob-rg1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stopColor="rgba(249,115,22,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ob-rg2" cx="80%" cy="70%" r="55%">
            <stop offset="0%" stopColor="rgba(234,88,12,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ob-rg3" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="rgba(251,146,60,0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="hsl(0 0% 100%)" />
        <rect width="100%" height="100%" fill="url(#ob-rg1)" />
        <rect width="100%" height="100%" fill="url(#ob-rg2)" />
        <rect width="100%" height="100%" fill="url(#ob-rg3)" />
      </svg>

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

/* ── Step data ── */
const ROLES = [
  { value: 'student',    label: 'Student',    emoji: '🎓' },
  { value: 'developer',  label: 'Developer',  emoji: '💻' },
  { value: 'marketer',   label: 'Marketer',   emoji: '📣' },
  { value: 'lawyer',     label: 'Lawyer',     emoji: '⚖️' },
  { value: 'researcher', label: 'Researcher', emoji: '🔬' },
  { value: 'founder',    label: 'Founder',    emoji: '🚀' },
  { value: 'designer',   label: 'Designer',   emoji: '🎨' },
  { value: 'other',      label: 'Other',      emoji: '✨' },
];

const SOURCES = [
  { value: 'twitter',    label: 'Twitter / X',        emoji: '𝕏' },
  { value: 'friend',     label: 'Friend or colleague', emoji: '🤝' },
  { value: 'google',     label: 'Google search',       emoji: '🔍' },
  { value: 'producthunt',label: 'ProductHunt',         emoji: '🐱' },
  { value: 'youtube',    label: 'YouTube',             emoji: '▶️' },
  { value: 'linkedin',   label: 'LinkedIn',            emoji: '💼' },
  { value: 'other',      label: 'Other',               emoji: '✨' },
];

const USE_CASES = [
  { value: 'research',      label: 'Research',          emoji: '🔎' },
  { value: 'forms',         label: 'Filling forms',     emoji: '📋' },
  { value: 'tabs',          label: 'Managing tabs',     emoji: '🗂️' },
  { value: 'productivity',  label: 'Work productivity', emoji: '⚡' },
  { value: 'studying',      label: 'Studying',          emoji: '📚' },
  { value: 'writing',       label: 'Writing',           emoji: '✍️' },
  { value: 'other',         label: 'Other',             emoji: '✨' },
];

const STEPS = [
  {
    key: 'role',
    headline: 'What best describes you?',
    subtext: 'Help us personalise your Lyto experience.',
    options: ROLES,
  },
  {
    key: 'source',
    headline: 'How did you find Lyto?',
    subtext: 'We\'d love to know how you heard about us.',
    options: SOURCES,
  },
  {
    key: 'use_case',
    headline: 'What will you mainly use Lyto for?',
    subtext: 'We\'ll tailor tips and features just for you.',
    options: USE_CASES,
  },
];

/* ── Option card ── */
interface OptionCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ emoji, label, selected, onClick }: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={[
        'relative flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-center',
        'transition-all duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        selected
          ? 'border-primary bg-primary/8 ring-1 ring-primary/30 shadow-sm'
          : 'border-border/60 bg-white hover:border-primary/40 hover:bg-primary/5',
      ].join(' ')}
      style={selected ? { backgroundColor: 'rgba(249,115,22,0.06)' } : {}}
    >
      {selected && (
        <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
        </span>
      )}
      <span className="text-2xl leading-none">{emoji}</span>
      <span className="text-[13px] font-medium leading-tight text-foreground">{label}</span>
    </motion.button>
  );
}

/* ── Step indicator ── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === current ? 20 : 8,
            backgroundColor: i === current ? 'rgb(249,115,22)' : 'rgba(249,115,22,0.25)',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

/* ── Slide variants ── */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    filter: 'blur(6px)',
  }),
};

/* ── Main component ── */
const Onboarding = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  /* Redirect unauthenticated users */
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  /* Check if onboarding already completed */
  useEffect(() => {
    if (!user) return;

    const check = async () => {
      const { data, error } = await supabase
        .from('onboarding_responses' as never)
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        navigate('/dashboard');
      } else {
        setCheckingOnboarding(false);
      }
    };

    check();
  }, [user, navigate]);

  const currentStep = STEPS[stepIndex];
  const currentSelection = selections[currentStep.key];
  const isLast = stepIndex === STEPS.length - 1;

  const handleSelect = (value: string) => {
    setSelections(prev => ({ ...prev, [currentStep.key]: value }));
  };

  const handleContinue = async () => {
    if (!currentSelection) return;

    if (!isLast) {
      setDirection(1);
      setStepIndex(i => i + 1);
      return;
    }

    /* Last step — save to Supabase */
    if (!user) return;
    setSaving(true);

    try {
      await supabase.from('onboarding_responses' as never).insert({
        user_id: user.id,
        email: user.email,
        role: selections['role'],
        source: selections['source'],
        use_case: selections['use_case'],
      } as never);
    } catch {
      /* Ignore errors — don't block the user */
    } finally {
      setSaving(false);
      navigate('/dashboard');
    }
  };

  /* Loading / auth check */
  if (loading || checkingOnboarding) {
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
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <GradientBackground />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-0">
        <span className="text-base font-serif tracking-tight select-none">
          Lyto AI<span className="text-primary">.</span>
        </span>
        <StepDots current={stepIndex} total={STEPS.length} />
      </div>

      {/* Content area */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={stepIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Step label */}
              <p className="text-xs font-medium text-primary/70 tracking-widest uppercase mb-3">
                Step {stepIndex + 1} of {STEPS.length}
              </p>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-foreground leading-tight mb-2">
                {currentStep.headline}
              </h1>
              <p className="text-sm text-muted-foreground mb-8">{currentStep.subtext}</p>

              {/* Options grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentStep.options.map(opt => (
                  <OptionCard
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={currentSelection === opt.value}
                    onClick={() => handleSelect(opt.value)}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Continue / Finish button */}
          <div className="flex justify-end mt-8">
            <motion.button
              type="button"
              onClick={handleContinue}
              disabled={!currentSelection || saving}
              whileHover={currentSelection ? { scale: 1.03 } : {}}
              whileTap={currentSelection ? { scale: 0.97 } : {}}
              className={[
                'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold',
                'transition-all duration-200',
                currentSelection && !saving
                  ? 'bg-primary text-white shadow-md hover:bg-primary/90 cursor-pointer'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60',
              ].join(' ')}
            >
              {saving ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                  />
                  Saving…
                </>
              ) : isLast ? (
                <>
                  Finish
                  <Check className="w-4 h-4" strokeWidth={2.5} />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
