import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
import Navbar from '@/components/Navbar';
import NeuralBackground from '@/components/ui/flow-field-background';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { AnnouncementBanner } from '@/components/ui/upgrade-banner';

const TEAM = [
  {
    name: 'Arystan Tanekov',
    role: 'Co-founder & CEO',
    img: '/arystannew.png',
    imgPosition: 'object-center',
    bio: 'Driving the vision and strategy behind Lyto AI. Passionate about making AI accessible and genuinely useful in everyday browser workflows.',
  },
  {
    name: 'Gleb Babichev',
    role: 'Co-founder & CTO',
    img: '/gleb.JPG',
    imgPosition: 'object-[center_15%]',
    bio: 'Building the technical foundation of Lyto. Focused on creating fast, reliable AI that works seamlessly with any webpage.',
  },
];

const VALUES = [
  {
    number: '01',
    title: 'Speed over bloat',
    description: 'Every feature ships because it saves real time. We cut anything that slows users down.',
  },
  {
    number: '02',
    title: 'Privacy first',
    description: 'Your data stays in your browser. We never collect, store, or train on your browsing activity.',
  },
  {
    number: '03',
    title: 'Built for the web',
    description: 'The browser is the most powerful app on your computer. We make it smarter, not more cluttered.',
  },
  {
    number: '04',
    title: 'User obsessed',
    description: "Every decision starts with the question: does this make the user's day meaningfully better?",
  },
];

const Company = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 px-5 sm:px-6 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <NeuralBackground
            color="#f97316"
            trailOpacity={0.12}
            particleCount={300}
            speed={0.7}
            className="bg-white"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, white 90%)' }}
        />

        <FadeIn className="relative container mx-auto max-w-4xl text-center">
          <AnnouncementBanner
            buttonText="Lyto Inc."
            description="AI that lives inside your browser"
            className="mb-6 sm:mb-8"
          />

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-[1.08] tracking-tight mb-5 sm:mb-6">
            making the browser{' '}
            <span className="italic text-gradient">work for you</span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            We're building AI that lives inside your browser — not alongside it. Lyto handles the clicking, scrolling, researching, and form-filling so you can focus on thinking.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <LiquidButton asChild size="lg" variant="default" className="w-full sm:w-auto">
              <Link to="/">
                Try Lyto free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </LiquidButton>
            <LiquidButton asChild size="lg" variant="default" className="w-full sm:w-auto">
              <a href="mailto:info@trylyto.com">
                Get in touch
              </a>
            </LiquidButton>
          </div>
        </FadeIn>
      </section>

      {/* Mission */}
      <section className="py-14 sm:py-20 px-5 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-3 sm:mb-4">Our mission</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight mb-4 sm:mb-6">
                Eliminate browser busywork — entirely.
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                The average knowledge worker spends over two hours a day on repetitive browser tasks: copying data between tabs, filling out forms, hunting for information across a dozen open pages.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Lyto was built to reclaim that time. We believe AI should disappear into the tools you already use — and the browser is where most of your work already lives.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-xl sm:rounded-2xl border border-border/60 overflow-hidden shadow-md sm:shadow-lg">
                <img
                  src="/sheetsscreen.png"
                  alt="Lyto AI in action"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-24 px-5 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-10 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-medium mb-2 sm:mb-3">What we believe</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight max-w-xs">
              principles we build by
            </h2>
          </FadeIn>
          <FadeInStagger className="grid sm:grid-cols-2 gap-px bg-border/40 rounded-xl sm:rounded-2xl overflow-hidden" staggerDelay={0.06}>
            {VALUES.map((v) => (
              <FadeInItem key={v.title}>
                <div className="bg-background p-6 sm:p-8 md:p-10 h-full flex flex-col gap-4 sm:gap-5">
                  <span className="font-serif text-4xl sm:text-5xl text-primary/20 leading-none select-none">
                    {v.number}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight mb-1.5 sm:mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Team */}
      <section className="py-14 sm:py-24 px-5 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-10 sm:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-medium mb-2 sm:mb-3">The team</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight max-w-sm">
              built by people who{' '}
              <span className="italic text-gradient">use it every day</span>
            </h2>
          </FadeIn>

          <FadeInStagger className="flex flex-col gap-0 divide-y divide-border/40" staggerDelay={0.12}>
            {TEAM.map((member, i) => (
              <FadeInItem key={member.name}>
                <div className={`flex items-start gap-5 sm:gap-8 py-8 sm:py-10 ${i % 2 === 1 ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                  {/* Photo */}
                  <div className="shrink-0">
                    <div className="w-20 h-20 sm:w-36 sm:h-36 rounded-xl sm:rounded-2xl overflow-hidden bg-muted">
                      <img
                        src={member.img}
                        alt={member.name}
                        className={`w-full h-full object-cover ${member.imgPosition}`}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="text-base sm:text-xl font-semibold tracking-tight">{member.name}</h3>
                      <span className="text-[11px] sm:text-xs font-medium text-primary bg-primary/8 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-primary/15 whitespace-nowrap">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mt-2 sm:mt-3">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 px-5 sm:px-6">
        <FadeIn className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif leading-tight mb-3 sm:mb-4">
            ready to get your time back?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2 sm:px-0">
            Install Lyto for free and see what your browser can do when it has an AI co-pilot.
          </p>
          <LiquidButton asChild size="xl" variant="default" className="w-full sm:w-auto">
            <a
              href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Chrome — It's Free
              <ArrowRight className="w-4 h-4" />
            </a>
          </LiquidButton>
          <p className="mt-4 text-xs text-muted-foreground">
            Questions?{' '}
            <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">
              info@trylyto.com
            </a>
          </p>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 sm:px-6 border-t border-border/30">
        <div className="container mx-auto max-w-5xl">
          {/* Top row: logo + button */}
          <div className="flex items-center justify-between mb-5 sm:mb-0 sm:hidden">
            <div className="flex items-center gap-2">
              <img src="/Lytoailogo.png" alt="Lyto" className="h-5 w-auto" />
              <span className="font-serif text-sm">Lyto Inc.</span>
            </div>
            <LiquidButton asChild size="sm" variant="default">
              <a
                href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Chrome
                <ArrowRight className="w-3 h-3" />
              </a>
            </LiquidButton>
          </div>

          {/* Mobile nav links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground mb-5 sm:hidden">
            <Link to="/" className="hover:text-foreground transition-colors">Product</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a href="mailto:info@trylyto.com" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          {/* Desktop row */}
          <div className="hidden sm:flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src="/Lytoailogo.png" alt="Lyto" className="h-5 w-auto" />
              <span className="font-serif">Lyto Inc.</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/" className="hover:text-foreground transition-colors">Product</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <a href="mailto:info@trylyto.com" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <LiquidButton asChild size="sm" variant="default">
              <a
                href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
                target="_blank"
                rel="noopener noreferrer"
              >
                Add to Chrome
                <ArrowRight className="w-3 h-3" />
              </a>
            </LiquidButton>
          </div>

          <p className="text-center text-xs text-muted-foreground/40 mt-5">© {new Date().getFullYear()} Lyto Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Company;
