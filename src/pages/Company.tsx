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
    imgPosition: 'object-top',
    bio: 'Driving the vision and strategy behind Lyto AI. Passionate about making AI accessible and genuinely useful in everyday browser workflows.',
  },
  {
    name: 'Gleb Babichev',
    role: 'Co-founder & CTO',
    img: '/gleb.JPG',
    imgPosition: 'object-[center_5%]',
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
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Flow field canvas background */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <NeuralBackground
            color="#f97316"
            trailOpacity={0.12}
            particleCount={500}
            speed={0.7}
            className="bg-white"
          />
        </div>
        {/* Fade to white at the bottom so it blends into the next section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, white 90%)' }}
        />

        <FadeIn className="relative container mx-auto max-w-4xl text-center">
          <AnnouncementBanner
            badge="Lyto Inc."
            description="AI that lives inside your browser"
            className="mb-8"
          />
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-6">
            making the browser{' '}
            <span className="italic text-gradient">work for you</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building AI that lives inside your browser — not alongside it. Lyto handles the clicking, scrolling, researching, and form-filling so you can focus on thinking.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <LiquidButton asChild size="lg" variant="default">
              <Link to="/">
                Try Lyto free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </LiquidButton>
            <LiquidButton asChild size="lg" variant="default">
              <a href="mailto:info@trylyto.com">
                Get in touch
              </a>
            </LiquidButton>
          </div>
        </FadeIn>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-4">Our mission</p>
              <h2 className="text-3xl sm:text-4xl font-serif leading-tight mb-6">
                Eliminate browser busywork — entirely.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The average knowledge worker spends over two hours a day on repetitive browser tasks: copying data between tabs, filling out forms, hunting for information across a dozen open pages.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Lyto was built to reclaim that time. We believe AI should disappear into the tools you already use — and the browser is where most of your work already lives.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border/60 overflow-hidden shadow-lg">
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
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-medium mb-3">What we believe</p>
            <h2 className="text-3xl sm:text-4xl font-serif leading-tight max-w-xs">
              principles we build by
            </h2>
          </FadeIn>
          <FadeInStagger className="grid sm:grid-cols-2 gap-px bg-border/40 rounded-2xl overflow-hidden" staggerDelay={0.06}>
            {VALUES.map((v) => (
              <FadeInItem key={v.title}>
                <div className="bg-background p-8 sm:p-10 h-full flex flex-col gap-5">
                  <span className="font-serif text-5xl text-primary/20 leading-none select-none">
                    {v.number}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight mb-2">{v.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/50 font-medium mb-3">The team</p>
            <h2 className="text-3xl sm:text-4xl font-serif leading-tight max-w-sm">
              built by people who{' '}
              <span className="italic text-gradient">use it every day</span>
            </h2>
          </FadeIn>

          <FadeInStagger className="flex flex-col gap-0 divide-y divide-border/40" staggerDelay={0.12}>
            {TEAM.map((member, i) => (
              <FadeInItem key={member.name}>
                <div className={`flex flex-col sm:flex-row items-start gap-8 py-10 ${i % 2 === 1 ? 'sm:flex-row-reverse' : ''}`}>
                  {/* Photo */}
                  <div className="shrink-0">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-muted">
                      <img
                        src={member.img}
                        alt={member.name}
                        className={`w-full h-full object-cover ${member.imgPosition}`}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-xl font-semibold tracking-tight">{member.name}</h3>
                      <span className="text-xs font-medium text-primary bg-primary/8 px-2.5 py-1 rounded-full border border-primary/15">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mt-3">
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
      <section className="py-20 px-6">
        <FadeIn className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-serif leading-tight mb-4">
            ready to get your time back?
          </h2>
          <p className="text-muted-foreground mb-8">
            Install Lyto for free and see what your browser can do when it has an AI co-pilot.
          </p>
          <LiquidButton asChild size="xl" variant="default">
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
      <footer className="py-8 px-6">
        <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
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
        <p className="text-center text-xs text-muted-foreground/50 mt-4">© {new Date().getFullYear()} Lyto Inc.</p>
      </footer>
    </div>
  );
};

export default Company;
