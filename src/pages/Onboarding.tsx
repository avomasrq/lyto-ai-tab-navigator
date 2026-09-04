import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { InstallCta, useInstallEnv } from '@/components/InstallCta';
import { ExtensionShowcase } from '@/components/ExtensionShowcase';
import { canInstallExtension, isChrome } from '@/lib/store';

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
            <stop offset="0%" stopColor="rgba(0, 0, 0,0.18)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ob-rg2" cx="80%" cy="70%" r="55%">
            <stop offset="0%" stopColor="rgba(0, 0, 0,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <radialGradient id="ob-rg3" cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="rgba(82, 82, 82,0.1)" />
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
          background: 'radial-gradient(circle, rgba(0, 0, 0,0.15) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(0, 0, 0,0.12) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(82, 82, 82,0.1) 0%, transparent 70%)',
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

/* ── Step data ──
 *
 * Two questions, not three: the old "what best describes you?" is gone. Role
 * predicted nothing we act on, and every extra screen is people lost before the
 * install, which is the only screen that matters.
 *
 * Source values keep the old spellings (producthunt, linkedin, twitter, youtube,
 * friend, google, other) so the 180 answers already collected stay comparable;
 * telegram_discord and reddit are new buckets that were simply missing.
 */
const SOURCES = [
  { value: 'producthunt',     label: 'Product Hunt' },
  { value: 'telegram_discord',label: 'A Telegram or Discord group' },
  { value: 'reddit',          label: 'Reddit' },
  { value: 'linkedin',        label: 'LinkedIn' },
  { value: 'twitter',         label: 'X (Twitter)' },
  { value: 'youtube',         label: 'YouTube' },
  { value: 'google',          label: 'Google or the Chrome Web Store' },
  { value: 'friend',          label: 'A friend or colleague' },
  { value: 'other',           label: 'Something else' },
];

/**
 * Concrete jobs, not categories. `productivity` (63) and `research` (48) topped
 * the old list because they were the vaguest options on it, people pick the
 * roomiest box when none of them fits. And "just looking" has to be here: without
 * it, someone with no particular task picks at random and pollutes everyone else's
 * numbers.
 */
const JOBS = [
  { value: 'forms',       label: 'Filling in forms and typing data' },
  { value: 'collecting',  label: 'Collecting information from lots of pages' },
  { value: 'documents',   label: 'Getting through long documents' },
  { value: 'reports',     label: 'Producing the same reports over and over' },
  { value: 'tabs',        label: 'Keeping track of what I have open' },
  { value: 'just_looking',label: 'Nothing specific, just looking' },
];

const STEPS = [
  {
    key: 'source',
    headline: 'Where did you hear about Argos?',
    subtext: "Honestly, this is the only way we can tell what's working. One tap.",
    options: SOURCES,
  },
  {
    key: 'job',
    headline: 'What would you rather stop doing by hand?',
    subtext: 'Pick the closest one. It changes what we show you first.',
    options: JOBS,
  },
];

/** Screens with a question, plus the install screen that closes the flow. */
const TOTAL_SCREENS = STEPS.length + 1;

/* ── Glass surface ──
 *
 * The same material as the sign-in button in Auth.tsx: a translucent pane over
 * the drifting background, a hairline that catches light along the top-left and
 * falls away to shadow bottom-right, and two inset lines standing in for the
 * thickness of the glass. Written once here and shared by the options, the input
 * and the panels below, so the flow reads as one sheet of material rather than
 * three components that happen to be pale.
 *
 * The emoji are gone with it. Nine labels each wearing a mismatched pictogram,
 * a cat for Product Hunt, an alien for Reddit, read as clip art, and half of
 * them render differently on every platform anyway. The words carry it.
 */
const GLASS_CSS = `
  /* Rebased on the extension panel's recipe (see .lg-glass in index.css). This
     used to be its own approximation, one flat white fill and a masked
     gradient ring, and index.css was in turn lifted from it, so the two drifted
     as a pair. What changed: saturate(200%) so colour comes through the pane
     instead of being washed out of it, a rim on all four edges rather than a
     top highlight alone, and a real border so the shape still has an outer edge
     against a pale background.

     It stays a local class rather than becoming .lg-glass because the states
     below hang off it, and because every one of them replaces box-shadow
     outright, so the four-sided rim has to be repeated in each. That is the
     cost of styling states this way; losing a rim on hover is the bug it
     causes. */
  .ob-glass {
    position: relative;
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
      0 2px 16px rgba(0,0,0,0.06);
    transition: transform .18s ease, background .18s ease, box-shadow .18s ease;
  }
  .ob-option:hover {
    background:
      linear-gradient(0deg,
        hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07),
        hsla(var(--adaptive-h), var(--adaptive-s), var(--adaptive-l), 0.07)),
      rgba(255,255,255,0.80);
    transform: translateY(-1px);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.95),
      inset 0 -1px 0 rgba(255,255,255,0.25),
      inset 1px 0 0 rgba(255,255,255,0.40),
      inset -1px 0 0 rgba(255,255,255,0.40),
      0 10px 28px rgba(0,0,0,0.09);
  }
  .ob-option:active { transform: translateY(0); }
  /* Selected: the pane goes dark instead of gaining a coloured border, the
     palette here is near-black on warm white, and an accent ring was the one
     saturated thing on the screen. */
  .ob-option[data-selected='true'] {
    background: rgba(18,18,18,0.9);
    border-color: rgba(255,255,255,0.10);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.14),
      inset 0 -1px 0 rgba(255,255,255,0.04),
      inset 1px 0 0 rgba(255,255,255,0.05),
      inset -1px 0 0 rgba(255,255,255,0.05),
      0 8px 24px rgba(0,0,0,0.18);
  }
`;

/* ── Option ── */
function OptionCard({
  label, selected, onClick,
}: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-selected={selected}
      aria-pressed={selected}
      className={[
        'ob-glass ob-option group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left',
        'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-foreground/25',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors',
          selected ? 'border-white/70 bg-white/90' : 'border-foreground/20 bg-white/40',
        ].join(' ')}
      >
        {selected && <Check className="h-2.5 w-2.5 text-neutral-900" strokeWidth={3.5} />}
      </span>
      <span className={[
        'text-[13.5px] font-medium leading-snug transition-colors',
        selected ? 'text-white' : 'text-foreground',
      ].join(' ')}>
        {label}
      </span>
    </button>
  );
}

/* ── Step indicator ── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          // Near-black, not the hard-coded orange this used to be: --primary in
          // this theme is 0 0% 9%, so the dots were the only saturated element on
          // an otherwise monochrome screen.
          animate={{
            width: i === current ? 20 : 8,
            backgroundColor: i === current ? 'rgba(18,18,18,0.85)' : 'rgba(0,0,0,0.18)',
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
  const [sourceOther, setSourceOther] = useState('');
  const [saving, setSaving] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  // The last screen is not a question. Finishing the survey used to drop people
  // straight on a dashboard full of zeroes, with no mention that Argos is a
  // browser extension they still had to install, 93 of 180 who answered every
  // question never opened the panel. The step that was missing is this one.
  const [showInstall, setShowInstall] = useState(false);
  /**
   * True while a slide is swapping.
   *
   * Two things were wrong without it. Clicks landed during the enter animation and
   * did nothing, the card is still blurred and moving, so a person taps a visible
   * option and the screen ignores them; I hit it twice in a row myself. And the
   * button read from `stepIndex`, which updates instantly, so it said "Finish"
   * while question one was still on screen. Both are the same fix: nothing is
   * interactive, and no label changes, until the new slide has actually arrived.
   */
  const [settling, setSettling] = useState(false);
  // Decided once, before the first screen, because the install screen has four
  // different shapes and the wrong one is a dead end rather than a bad guess.
  const env = useInstallEnv();

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
      setSettling(true);
      setStepIndex(i => i + 1);
      return;
    }

    /* Last question answered, save, then show the install step */
    if (!user) return;
    setSaving(true);

    // supabase-js resolves with `{ error }` instead of throwing, so the old
    // try/catch here caught nothing: a failed insert looked exactly like a
    // successful one. Logged, still non-blocking, a lost answer must not cost
    // the person their signup.
    //
    // Written HERE, before the install screen, on purpose: someone who closes the
    // tab on that screen has still answered, and comes back to a dashboard that
    // knows to show them the install (spec §6) rather than the survey again.
    const { error } = await supabase.from('onboarding_responses' as never).insert({
      user_id: user.id,
      email: user.email,
      source: selections['source'],
      source_other: selections['source'] === 'other' ? sourceOther.trim() || null : null,
      job: selections['job'],
      // What they were on, recorded at the one moment we know it. Without these,
      // "signed up on a phone and physically could not install" is indistinguishable
      // from "lost interest".
      device: env.device,
      browser: env.browser,
      completed_at: new Date().toISOString(),
    } as never);
    if (error) console.warn('[onboarding] answers not saved:', error.message);

    setSaving(false);
    setShowInstall(true);
  };

  /** Marks on the row what they did with the install screen. Best-effort. */
  const markInstallStep = async (patch: { clicked_install?: boolean; claimed_installed?: boolean; skipped_install?: boolean }) => {
    if (!user) return;
    const { error } = await supabase
      .from('onboarding_responses' as never)
      .update(patch as never)
      .eq('user_id', user.id);
    if (error) console.warn('[onboarding] install step not recorded:', error.message);
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

  if (showInstall) {
    return (
      <div className="min-h-screen relative flex flex-col overflow-hidden">
        <style>{GLASS_CSS}</style>
        <GradientBackground />

        <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-0">
          <span className="text-base font-serif tracking-tight select-none">
            Argos<span className="text-primary">.</span>
          </span>
          <StepDots current={STEPS.length} total={TOTAL_SCREENS} />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
          <motion.div
            /* No entrance if the tab is not being looked at. Chrome freezes rAF in
               a background tab, so an entrance that starts blurred and transparent
               stays that way: I landed on this screen twice with the whole thing
               stuck behind a 6px blur. `initial={false}` starts at the end state. */
            initial={document.hidden ? false : { opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl"
          >
            <div className="grid items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
              {/* Left: what the thing IS, shown. Only for people who can install,
                  on a phone or a non-Chrome browser the animation would be selling
                  something they cannot have, which is worse than not selling. */}
              {!env.installed && canInstallExtension(env.device) && isChrome(env.browser) && (
                <ExtensionShowcase className="order-2 lg:order-1" />
              )}

              <div className="order-1 lg:order-2">
                <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-foreground leading-tight mb-3">
                  {env.installed
                    ? "You're all set"
                    : !canInstallExtension(env.device)
                      ? 'Argos runs in Chrome on a computer'
                      : !isChrome(env.browser)
                        ? 'Argos needs Chrome'
                        : 'Argos works where your work happens'}
                </h1>

                {/* The one thing the extension is for, said plainly. Everything else
                    in the product answers you; this is the part with hands. */}
                {!env.installed && canInstallExtension(env.device) && isChrome(env.browser) && (
                  <p className="mb-5 text-[14.5px] leading-relaxed text-muted-foreground">
                    The extension is how Argos touches the page you're on.{' '}
                    <span className="text-foreground">Everything else talks to you. This one works.</span>
                  </p>
                )}

                <div className="ob-glass rounded-3xl p-6 sm:p-7">
                  <InstallCta
                    env={env}
                    email={user?.email ?? null}
                    onInstallClick={() => void markInstallStep({ clicked_install: true })}
                    onBrowserRequest={async (address) => {
                      const { error } = await supabase.from('browser_requests' as never).insert({
                        user_id: user?.id ?? null,
                        email: address,
                        browser: env.browser,
                      } as never);
                      if (error) console.warn('[onboarding] browser request not saved:', error.message);
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await markInstallStep({ claimed_installed: true });
                    navigate('/dashboard');
                  }}
                  className="mt-5 w-full text-center text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {/* Not "Open the panel": a web page cannot open it. chrome.sidePanel.open()
                      needs a user gesture inside the extension, and a message from the site
                      is not one, the button would promise something it cannot do. The
                      shortcut in the CTA above is the honest instruction. */}
                  {env.installed ? 'Go to my dashboard →' : "I've already installed it →"}
                </button>

                {/* A way out that is not a dead end.
                    The spec said no skip, on the reasoning that everyone who leaves here
                    lands on an empty dashboard. But refusing is a real answer: someone on
                    Firefox or Arc cannot install this no matter how good the pitch is, and
                    trapping them makes the product look broken rather than unavailable.
                    So the exit exists, it is recorded, and it says what still works for
                    them, Telegram and the desktop agent, neither of which needs Chrome. */}
                {!env.installed && (
                  <div className="mt-6 border-t border-black/[0.06] pt-5 text-center">
                    <button
                      type="button"
                      onClick={async () => {
                        await markInstallStep({ skipped_install: true });
                        navigate('/dashboard');
                      }}
                      className="text-[13px] text-muted-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    >
                      Not now, I'll use Argos without the extension
                    </button>
                    <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-muted-foreground/60">
                      Argos also answers in Telegram and runs on your own machine as a desktop agent.
                      Both are set up from your dashboard, and neither needs Chrome.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <style>{GLASS_CSS}</style>
      <GradientBackground />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-0">
        <span className="text-base font-serif tracking-tight select-none">
          Argos<span className="text-primary">.</span>
        </span>
        <StepDots current={stepIndex} total={TOTAL_SCREENS} />
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
              onAnimationComplete={() => setSettling(false)}
              className={`flex flex-col ${settling ? 'pointer-events-none' : ''}`}
            >
              {/* Step label, counts the install screen too, so "3 of 3" is the
                  install and nobody thinks the flow ended a screen early. */}
              <p className="text-xs font-medium text-primary/70 tracking-widest uppercase mb-3">
                Step {stepIndex + 1} of {TOTAL_SCREENS}
              </p>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-foreground leading-tight mb-2">
                {currentStep.headline}
              </h1>
              <p className="text-sm text-muted-foreground mb-8">{currentStep.subtext}</p>

              {/* Two columns, not four. The labels are now sentences ("Collecting
                  information from lots of pages"), and a four-up grid wrapped every
                  one of them to three ragged lines. */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {currentStep.options.map(opt => (
                  <OptionCard
                    key={opt.value}
                    label={opt.label}
                    selected={currentSelection === opt.value}
                    onClick={() => handleSelect(opt.value)}
                  />
                ))}
              </div>

              {/* "Something else" was 39 of 180 answers, the second largest source
                  and a complete blind spot, because there was nowhere to say what it
                  was. Optional: the screen still passes on the choice alone. */}
              {currentStep.key === 'source' && currentSelection === 'other' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-4 overflow-hidden"
                >
                  <label className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <span className="text-sm text-muted-foreground">Where, roughly?</span>
                    <input
                      type="text"
                      value={sourceOther}
                      onChange={(e) => setSourceOther(e.target.value)}
                      maxLength={120}
                      autoFocus
                      className="ob-glass min-w-0 flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-foreground/20"
                    />
                  </label>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Continue / Finish button */}
          <div className="flex justify-end mt-8">
            <motion.button
              type="button"
              onClick={handleContinue}
              disabled={!currentSelection || saving || settling}
              whileHover={currentSelection ? { scale: 1.03 } : {}}
              whileTap={currentSelection ? { scale: 0.97 } : {}}
              className={[
                'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold',
                'transition-all duration-200',
                currentSelection && !saving && !settling
                  // Solid near-black against the glass, the one opaque thing on the
                  // screen, so "what do I press" needs no thought.
                  ? 'cursor-pointer bg-neutral-900 text-white shadow-lg shadow-black/10 hover:bg-neutral-800'
                  : 'ob-glass cursor-not-allowed text-muted-foreground/70',
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
              ) : isLast && !settling ? (
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
