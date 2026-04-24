import React, { useEffect, useRef, useState } from 'react';
import {
    Globe,
    Search,
    Activity,
    Chrome,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    Sparkles,
} from 'lucide-react';

interface BentoItemProps {
    className?: string;
    children: React.ReactNode;
}

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

const BentoItem: React.FC<BentoItemProps> = ({ className = '', children }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const item = itemRef.current;
        if (!item || isMobile) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            item.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            item.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        };
        item.addEventListener('mousemove', handleMouseMove);
        return () => item.removeEventListener('mousemove', handleMouseMove);
    }, [isMobile]);

    return (
        <div ref={itemRef} className={`bento-item ${className}`}>
            {children}
        </div>
    );
};

// ── Integration logos config ──────────────────────────────────────────────
const ALL_INTEGRATIONS = [
    { src: '/gmaillogo.webp',     label: 'Gmail',    color: '#ea4335' },
    { src: '/googlecalendar.png', label: 'Calendar', color: '#1a73e8' },
    { src: '/googledocs.png',     label: 'Docs',     color: '#4285f4' },
    { src: '/googlesheets.png',   label: 'Sheets',   color: '#0f9d58' },
    { src: '/slack.png',          label: 'Slack',    color: '#611f69' },
    { src: '/github.png',         label: 'GitHub',   color: '#24292f' },
    { src: '/whatsapp.png',       label: 'WhatsApp', color: '#25d366' },
];

export const CyberneticBentoGrid: React.FC = () => {
    return (
        <div className="bento-container">
            <div className="w-full max-w-6xl">
                <div className="bento-grid">

                    {/* ─── Card 1 — Browser Control (hero, 2×2) ─── */}
                    <BentoItem className="col-span-1 sm:col-span-2 row-span-2 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 mb-3">
                                <Globe className="size-3.5" />
                                Browser control
                            </div>
                            <h3 className="text-xl sm:text-2xl font-serif mb-2">
                                Full control over your browser
                            </h3>
                            <p className="text-sm sm:text-base text-muted-foreground max-w-sm leading-relaxed">
                                Open tabs, scroll, click, fill forms — Lyto interacts with every element on any page, just like a human would.
                            </p>

                            {/* Feature pills */}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {['Open tabs', 'Click elements', 'Fill forms', 'Scroll pages', 'Extract data'].map((f) => (
                                    <span key={f} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary/80 font-medium">
                                        <CheckCircle2 className="size-3 opacity-70" />
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Browser mockup */}
                        <div className="mt-5 rounded-xl border border-border bg-background overflow-hidden shadow-sm">
                            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/40">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                                </div>
                                <div className="flex gap-0.5 ml-2">
                                    {[
                                        { tab: 'Gmail', color: '#ea4335' },
                                        { tab: 'Docs', color: '#4285f4' },
                                        { tab: 'GitHub', color: '#24292f' },
                                    ].map((t, i) => (
                                        <div
                                            key={t.tab}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-t-md ${
                                                i === 0
                                                    ? 'bg-background border-x border-t border-border -mb-px relative z-10'
                                                    : 'text-muted-foreground/60'
                                            }`}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                                            {t.tab}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 mx-2 h-5 rounded-md bg-muted/40 border border-border/40 flex items-center px-2">
                                    <span className="text-xs text-muted-foreground/40">mail.google.com/inbox</span>
                                </div>
                            </div>

                            <div className="flex h-36">
                                <div className="flex-1 p-4 space-y-2.5">
                                    <div className="h-2 w-2/3 bg-muted/70 rounded-full" />
                                    <div className="h-2 w-1/2 bg-muted/50 rounded-full" />
                                    <div className="h-2 w-3/5 bg-muted/50 rounded-full" />
                                    <div className="mt-3 flex gap-2">
                                        <div className="h-7 w-24 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                                            <span className="text-xs text-primary font-medium">Compose</span>
                                        </div>
                                        <div className="h-7 w-16 rounded-lg bg-muted/60 border border-border" />
                                    </div>
                                </div>
                                <div className="w-44 border-l border-border bg-muted/10 p-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Lyto running</span>
                                    </div>
                                    {[
                                        { text: 'Opened Gmail tab', done: true },
                                        { text: 'Clicked Compose', done: true },
                                        { text: 'Typing message...', done: false },
                                    ].map((step) => (
                                        <div key={step.text} className="flex items-start gap-1.5 text-xs">
                                            <span className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${step.done ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                                            <span className={step.done ? 'text-muted-foreground/50' : 'text-foreground'}>{step.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </BentoItem>

                    {/* ─── Card 2 — Integrations ─── */}
                    <BentoItem>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 mb-3">
                            <Zap className="size-3.5" />
                            Integrations
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif mb-1.5">Connects your tools</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            Gmail, Docs, Sheets, Slack, GitHub, WhatsApp — all your favourite apps, ready to automate.
                        </p>

                        {/* Logo grid → Lyto */}
                        <div className="flex items-center gap-3">
                            <div className="grid grid-cols-4 gap-2 flex-1">
                                {ALL_INTEGRATIONS.map(({ src, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-1">
                                        <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-border/30 bg-white flex items-center justify-center p-1">
                                            <img src={src} alt={label} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[9px] text-muted-foreground leading-tight text-center">{label}</span>
                                    </div>
                                ))}
                                {/* "More" pill */}
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-8 h-8 rounded-xl border border-dashed border-border bg-muted/30 flex items-center justify-center">
                                        <span className="text-[10px] text-muted-foreground font-medium">+</span>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground">More</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className="flex flex-col items-center gap-1">
                                    <ArrowRight className="size-3.5 text-primary/50" />
                                </div>
                                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-border/30">
                                    <img src="/Lytoailogo.png" alt="Lyto AI" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[9px] text-muted-foreground">Lyto AI</span>
                            </div>
                        </div>
                    </BentoItem>

                    {/* ─── Card 3 — Privacy ─── */}
                    <BentoItem>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 mb-3">
                            <ShieldCheck className="size-3.5" />
                            Privacy first
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif mb-1.5">Your data stays yours</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Everything runs inside Chrome. No third-party servers ever see your browsing data or messages.
                        </p>
                        <div className="mt-4 space-y-2">
                            {[
                                'Zero data sent to external servers',
                                'No activity tracking or logging',
                                'Your API key, your control',
                            ].map((point) => (
                                <div key={point} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="size-3 text-green-500 flex-shrink-0" />
                                    {point}
                                </div>
                            ))}
                        </div>
                    </BentoItem>

                    {/* ─── Card 4 — Deep Research (tall) ─── */}
                    <BentoItem className="row-span-2">
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 mb-3">
                            <Search className="size-3.5" />
                            Deep research
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif mb-1.5">Research anything in seconds</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Lyto scans your open tabs, searches the web, finds sources, and builds structured reports — all without you lifting a finger.
                        </p>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
                                <Sparkles className="size-3.5 text-primary flex-shrink-0" />
                                <span className="text-sm text-foreground/80">Compare SaaS pricing across tabs</span>
                            </div>
                            {[
                                { color: '#f97316', domain: 'techcrunch.com', note: 'pricing analysis' },
                                { color: '#3b82f6', domain: 'producthunt.com', note: 'tool comparison' },
                                { color: '#10b981', domain: 'g2.com', note: 'user reviews' },
                                { color: '#8b5cf6', domain: 'reddit.com', note: 'community takes' },
                            ].map((s) => (
                                <div key={s.domain} className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                    <span className="text-sm text-foreground/80 flex-1 min-w-0 truncate">{s.domain}</span>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">{s.note}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between px-1 pt-1">
                                <p className="text-xs text-muted-foreground">4 sources · generating report</p>
                                <span className="flex gap-0.5">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-1 h-1 rounded-full bg-primary animate-pulse"
                                            style={{ animationDelay: `${i * 0.2}s` }}
                                        />
                                    ))}
                                </span>
                            </div>
                        </div>

                        {/* Pro badge */}
                        <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5 flex items-center gap-2">
                            <Sparkles className="size-3.5 text-orange-500 flex-shrink-0" />
                            <span className="text-xs text-orange-700 font-medium">7 deep research sessions/month on Pro</span>
                        </div>
                    </BentoItem>

                    {/* ─── Card 5 — Automation (wide, dark accent) ─── */}
                    <BentoItem className="col-span-1 sm:col-span-2 bento-item--dark">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary mb-3">
                                    <Activity className="size-3.5" />
                                    Automation
                                </div>
                                <h3 className="text-xl sm:text-2xl font-serif mb-1">Real-time task tracking</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Every action Lyto takes is logged and visualised live — so you always know exactly what's happening.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {['Tab management', 'Form filling', 'Email drafting', 'Data extraction'].map((t) => (
                                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-primary/80">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-6 sm:gap-8 flex-shrink-0">
                                <div>
                                    <p className="text-3xl font-serif">2,847</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">tasks this week</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-serif text-primary">+34%</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">vs last week</p>
                                </div>
                            </div>
                        </div>
                    </BentoItem>

                    {/* ─── Card 6 — Chrome Extension ─── */}
                    <BentoItem>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 mb-3">
                            <Chrome className="size-3.5" />
                            Chrome Web Store
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif mb-1.5">One-click install</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Add to Chrome in seconds. No setup, no configuration — just install and start automating.
                        </p>
                        <div className="mt-4 space-y-2">
                            {[
                                'Free to install',
                                'Google account required',
                                'Works on any website',
                            ].map((point) => (
                                <div key={point} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckCircle2 className="size-3 text-primary flex-shrink-0" />
                                    {point}
                                </div>
                            ))}
                        </div>
                        <a
                            href="https://chromewebstore.google.com/detail/lyto-ai-research-assistan/nalekilafbipfallhlkbpidgfceoabcb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Add to Chrome
                            <ArrowRight className="size-3" />
                        </a>
                    </BentoItem>

                </div>
            </div>
        </div>
    );
};
