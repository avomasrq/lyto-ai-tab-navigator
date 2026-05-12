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

const IntegrationsSection = () => {
  return (
    <section id="integrations" className="scroll-mt-24">
      {/* Sticky header stays visible while the scroll-locked orbit plays */}
      <div className="sticky top-16 z-10 text-center pt-10 pb-4 px-4 pointer-events-none">
        <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-primary font-medium">
          Integrations
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mt-3 leading-tight">
          Works with your
          <br />
          <span className="italic text-gradient">favourite tools</span>
        </h2>
        <p className="text-muted-foreground mt-4 text-sm sm:text-base max-w-sm mx-auto">
          Scroll to connect all 7 integrations.
        </p>
      </div>

      {/* Scroll-locked orbit animation */}
      <MultiOrbitSemiCircle integrations={INTEGRATIONS} sectionHeight="320vh" />
    </section>
  );
};

export default IntegrationsSection;
