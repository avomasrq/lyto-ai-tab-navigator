import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Zap, Shield, Users } from 'lucide-react';
import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';
import Navbar from '@/components/Navbar';

const TEAM = [
  {
    name: 'Arystan Tanekov',
    role: 'Co-founder & CEO',
    img: '/arystannew.png',
    bio: 'Driving the vision and strategy behind Lyto AI. Passionate about making AI accessible and genuinely useful in everyday browser workflows.',
  },
  {
    name: 'Gleb Babichev',
    role: 'Co-founder & CTO',
    img: '/gleb.JPG',
    bio: 'Building the technical foundation of Lyto. Focused on creating fast, reliable AI that works seamlessly with any webpage.',
  },
];

const VALUES = [
  {
    icon: Zap,
    title: 'Speed over bloat',
    description: 'Every feature ships because it saves real time. We cut anything that slows users down.',
  },
  {
    icon: Shield,
    title: 'Privacy first',
    description: 'Your data stays in your browser. We never collect, store, or train on your browsing activity.',
  },
  {
    icon: Globe,
    title: 'Built for the web',
    description: 'The browser is the most powerful app on your computer. We make it smarter, not more cluttered.',
  },
  {
    icon: Users,
    title: 'User obsessed',
    description: 'Every decision starts with the question: does this make the user\'s day meaningfully better?',
  },
];

const Company = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        {/* Subtle dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, transparent 40%, white 100%)' }}
        />

        <FadeIn className="relative container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground mb-8 uppercase tracking-widest">
            Lyto Inc.
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif leading-[1.05] tracking-tight mb-6">
            making the browser{' '}
            <span className="italic text-gradient">work for you</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building AI that lives inside your browser — not alongside it. Lyto handles the clicking, scrolling, researching, and form-filling so you can focus on thinking.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Lyto free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:info@trylyto.com"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Get in touch
            </a>
          </div>
        </FadeIn>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 border-t border-border/40">
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
                  src="/lytoaidashboard.png"
                  alt="Lyto AI in action"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-muted/20 border-y border-border/40">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-3">What we believe</p>
            <h2 className="text-3xl sm:text-4xl font-serif leading-tight">
              principles we build by
            </h2>
          </FadeIn>
          <FadeInStagger className="grid sm:grid-cols-2 gap-6" staggerDelay={0.08}>
            {VALUES.map((v) => (
              <FadeInItem key={v.title}>
                <div className="rounded-2xl border border-border/60 bg-white p-7 h-full">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                    <v.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-3">The team</p>
            <h2 className="text-3xl sm:text-4xl font-serif leading-tight">
              built by people who{' '}
              <span className="italic text-gradient">use it every day</span>
            </h2>
          </FadeIn>
          <FadeInStagger className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto" staggerDelay={0.1}>
            {TEAM.map((member) => (
              <FadeInItem key={member.name}>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/60 bg-white">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-border"
                  />
                  <h3 className="text-base font-semibold">{member.name}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5 mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-border/40">
        <FadeIn className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-serif leading-tight mb-4">
            ready to get your time back?
          </h2>
          <p className="text-muted-foreground mb-8">
            Install Lyto for free and see what your browser can do when it has an AI co-pilot.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Add to Chrome — It's Free
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Questions?{' '}
            <a href="mailto:info@trylyto.com" className="text-primary hover:underline underline-offset-4">
              info@trylyto.com
            </a>
          </p>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
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
          <span className="text-xs">© {new Date().getFullYear()} Lyto Inc.</span>
        </div>
      </footer>
    </div>
  );
};

export default Company;
