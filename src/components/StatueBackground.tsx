import { EtherealShadow } from '@/components/ui/etheral-shadow';

/**
 * The dark statue backdrop from the sign-in screen, shared so onboarding sits on
 * the same ground it does. Two reasons beyond continuity: the flow is literally
 * the next screen after signing in, and the glass panes on top of it need
 * something to be glass over, on the white gradient they were previously drawn
 * on, a translucent pane is indistinguishable from a grey box.
 */
export function StatueBackground() {
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
      <div className="absolute inset-0 opacity-60 mix-blend-screen">
        <EtherealShadow color="rgba(255, 255, 255, 1)" noise={{ opacity: 0.5, scale: 1.2 }} sizing="fill" />
      </div>
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
