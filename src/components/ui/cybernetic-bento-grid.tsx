import React, { useEffect, useRef } from 'react';
import {
    Globe,
    Mail,
    Search,
    Activity,
    Chrome,
    ShieldCheck,
    ArrowRight,
} from 'lucide-react';


interface BentoItemProps {
    className?: string;
    children: React.ReactNode;
}

const BentoItem: React.FC<BentoItemProps> = ({ className = '', children }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const item = itemRef.current;
        if (!item) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        };

        item.addEventListener('mousemove', handleMouseMove);
        return () => item.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div ref={itemRef} className={`bento-item ${className}`}>
            {children}
        </div>
    );
};

export const CyberneticBentoGrid: React.FC = () => {
    return (
        <div className="bento-container">
            <div className="w-full max-w-6xl">
                <div className="bento-grid">

                    {/* ─── Card 1 — Browser Control (hero, 2×2) ─── */}
                    <BentoItem className="col-span-1 sm:col-span-2 row-span-2 flex flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-600 mb-3">
                                <Globe className="size-3" />
                                Browser control
                            </div>
                            <h3 className="text-xl font-serif mb-2">
                                Full control over your browser
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                                Open tabs, scroll, click, fill forms — Lyto interacts with every element on any page.
                            </p>
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
                                            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded-t-md ${
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
                                    <span className="text-[10px] text-muted-foreground/40">mail.google.com/inbox</span>
                                </div>
                            </div>

                            <div className="flex h-36">
                                <div className="flex-1 p-4 space-y-2.5">
                                    <div className="h-2 w-2/3 bg-muted/70 rounded-full" />
                                    <div className="h-2 w-1/2 bg-muted/50 rounded-full" />
                                    <div className="h-2 w-3/5 bg-muted/50 rounded-full" />
                                    <div className="mt-3 flex gap-2">
                                        <div className="h-7 w-24 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
                                            <span className="text-[9px] text-primary font-medium">Compose</span>
                                        </div>
                                        <div className="h-7 w-16 rounded-lg bg-muted/60 border border-border" />
                                    </div>
                                </div>
                                <div className="w-44 border-l border-border bg-muted/10 p-3 flex flex-col gap-2">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">Lyto running</span>
                                    </div>
                                    {[
                                        { text: 'Opened Gmail tab', done: true },
                                        { text: 'Clicked Compose', done: true },
                                        { text: 'Typing message...', done: false },
                                    ].map((step) => (
                                        <div key={step.text} className="flex items-start gap-1.5 text-[10px]">
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
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-600 mb-3">
                            <Mail className="size-3" />
                            Integrations
                        </div>
                        <h3 className="text-xl font-serif mb-2">Connects your tools</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Gmail, Calendar, Docs, and Sheets — connected from day one.
                        </p>
                        <div className="mt-5 flex items-center gap-2">
                            {/* 2×2 app icon grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { src: '/gmaillogo.webp',      label: 'Gmail'    },
                                    { src: '/googlecalendar.png',  label: 'Calendar' },
                                    { src: '/googledocs.png',      label: 'Docs'     },
                                    { src: '/googlesheets.png',    label: 'Sheets'   },
                                ].map(({ src, label }) => (
                                    <div key={label} className="flex flex-col items-center gap-1">
                                        <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-border/30 bg-white flex items-center justify-center p-1">
                                            <img src={src} alt={label} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-[9px] text-muted-foreground">{label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col items-center gap-1 px-1">
                                <div className="h-10 border-l border-dashed border-border" />
                                <ArrowRight className="size-3 text-primary/40" />
                            </div>

                            <div className="flex flex-col items-center gap-1.5 ml-1">
                                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-border/30">
                                    <img src="/Lytoailogo.png" alt="Lyto AI" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[9px] text-muted-foreground">Lyto AI</span>
                            </div>
                        </div>
                    </BentoItem>

                    {/* ─── Card 3 — Privacy ─── */}
                    <BentoItem>
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-600 mb-3">
                            <ShieldCheck className="size-3" />
                            Privacy first
                        </div>
                        <h3 className="text-xl font-serif mb-2">Your data stays local</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            No servers, no tracking. Everything runs inside your Chrome browser.
                        </p>
                        <div className="mt-5 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                            ✓ Zero data sent to external servers
                        </div>
                    </BentoItem>

                    {/* ─── Card 4 — Deep Research (tall) ─── */}
                    <BentoItem className="row-span-2">
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-600 mb-3">
                            <Search className="size-3" />
                            Deep research
                        </div>
                        <h3 className="text-xl font-serif mb-2">Research anything</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Scans your open tabs, finds sources, and builds structured reports.
                        </p>

                        <div className="mt-5 space-y-2">
                            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                                <Search className="size-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">Compare SaaS pricing across tabs</span>
                            </div>
                            {[
                                { color: '#f97316', domain: 'techcrunch.com', note: 'pricing analysis' },
                                { color: '#3b82f6', domain: 'producthunt.com', note: 'tool comparison' },
                                { color: '#10b981', domain: 'g2.com', note: 'user reviews' },
                            ].map((s) => (
                                <div key={s.domain} className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                    <span className="text-xs text-foreground/80 flex-1">{s.domain}</span>
                                    <span className="text-[10px] text-muted-foreground">{s.note}</span>
                                </div>
                            ))}
                            <p className="text-[10px] text-muted-foreground px-1 pt-0.5">3 sources found · generating report...</p>
                        </div>
                    </BentoItem>

                    {/* ─── Card 5 — Automation (dark accent, wide) ─── */}
                    <BentoItem className="col-span-1 sm:col-span-2 bento-item--dark">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary mb-3">
                                    <Activity className="size-3" />
                                    Automation
                                </div>
                                <h3 className="text-xl font-serif text-white mb-1">Real-time task tracking</h3>
                                <p className="text-sm text-white/40 leading-relaxed">
                                    Every action Lyto takes, logged and visualized live.
                                </p>
                            </div>
                            <div className="flex gap-8 flex-shrink-0">
                                <div className="text-right">
                                    <p className="text-3xl font-serif text-white">2,847</p>
                                    <p className="text-[11px] text-white/35 mt-0.5">tasks this week</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-serif text-primary">+34%</p>
                                    <p className="text-[11px] text-white/35 mt-0.5">vs last week</p>
                                </div>
                            </div>
                        </div>
                    </BentoItem>

                    {/* ─── Card 6 — Chrome Extension ─── */}
                    <BentoItem>
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-orange-600 mb-3">
                            <Chrome className="size-3" />
                            Chrome Web Store
                        </div>
                        <h3 className="text-xl font-serif mb-2">One-click install</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Add to Chrome and start automating in seconds.
                        </p>
                        <div className="mt-5 rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
                            ✓ Free to install · No account required
                        </div>
                    </BentoItem>

                </div>
            </div>
        </div>
    );
};
