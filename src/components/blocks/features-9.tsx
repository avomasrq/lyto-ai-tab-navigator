import { Activity, Globe, Mail, Search, ArrowRight } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

export function Features9() {
    return (
        <div className="grid gap-4 md:grid-cols-3">

            {/* ── Card 1 — Browser Control (wide) ── */}
            <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-card p-8">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative mb-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary mb-3">
                        <Globe className="size-3" />
                        Browser control
                    </span>
                    <h3 className="text-xl font-serif mb-2">Full control over your browser</h3>
                    <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                        Open tabs, scroll, click, fill forms — Lyto interacts with every DOM element on any page.
                    </p>
                </div>

                {/* Browser mockup */}
                <div className="relative rounded-xl border border-border bg-background overflow-hidden shadow-sm">
                    {/* Chrome bar */}
                    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-muted/40">
                        <div className="flex gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                        </div>
                        <div className="flex gap-0.5 ml-2">
                            {[['Gmail', '#ea4335'], ['Docs', '#4285f4'], ['GitHub', '#24292f']].map(([tab, color], i) => (
                                <div key={tab} className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded-t-md ${i === 0 ? 'bg-background border-x border-t border-border -mb-px relative z-10' : 'text-muted-foreground/60'}`}>
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                                    {tab}
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 mx-2 h-5 rounded-md bg-muted/40 border border-border/40 flex items-center px-2">
                            <span className="text-[10px] text-muted-foreground/40">mail.google.com/inbox</span>
                        </div>
                    </div>

                    {/* Page + Lyto panel */}
                    <div className="flex h-36">
                        {/* Page skeleton */}
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

                        {/* Lyto sidebar panel */}
                        <div className="w-48 border-l border-border bg-muted/10 p-3 flex flex-col gap-2">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">Lyto running</span>
                            </div>
                            {[
                                { text: 'Opened Gmail tab', done: true },
                                { text: 'Clicked Compose', done: true },
                                { text: 'Typing message body...', done: false },
                            ].map(item => (
                                <div key={item.text} className="flex items-start gap-1.5 text-[10px]">
                                    <span className={`w-1 h-1 rounded-full mt-1 flex-shrink-0 ${item.done ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                                    <span className={item.done ? 'text-muted-foreground/50' : 'text-foreground'}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Card 2 — Google Workspace ── */}
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 flex flex-col">
                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary mb-3">
                        <Mail className="size-3" />
                        Google Workspace
                    </span>
                    <h3 className="text-xl font-serif mb-2">Connects your tools</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Gmail, Docs, and Sheets — connected from day one.
                    </p>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col gap-2">
                            {[['G', '#ea4335', 'Gmail'], ['D', '#4285f4', 'Docs'], ['S', '#0f9d58', 'Sheets']].map(([letter, bg, label]) => (
                                <div key={label} className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ background: bg }}>
                                        {letter}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <div className="h-16 border-l border-dashed border-primary/25" />
                            <ArrowRight className="size-3 text-primary/30 rotate-90" />
                        </div>

                        <div className="flex flex-col items-center gap-1.5">
                            <div className="w-11 h-11 rounded-xl border-2 border-primary/30 bg-primary/8 flex items-center justify-center text-base font-bold text-primary">
                                L
                            </div>
                            <span className="text-[10px] text-muted-foreground">Lyto AI</span>
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground leading-relaxed">
                        ✓ Reply drafted in Gmail · Summary added to Docs
                    </div>
                </div>
            </div>

            {/* ── Card 3 — Research ── */}
            <div className="rounded-2xl border border-border bg-card p-8 flex flex-col">
                <div className="mb-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary mb-3">
                        <Search className="size-3" />
                        Deep research
                    </span>
                    <h3 className="text-xl font-serif mb-2">Research anything, instantly</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Lyto scans your open tabs, finds sources, and builds reports with graphs.
                    </p>
                </div>

                <div className="mt-auto space-y-2">
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                        <Search className="size-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">Compare SaaS pricing across tabs</span>
                    </div>
                    {[
                        { color: '#f97316', domain: 'techcrunch.com', note: 'pricing analysis' },
                        { color: '#3b82f6', domain: 'producthunt.com', note: 'tool comparison' },
                        { color: '#10b981', domain: 'g2.com',          note: 'user reviews' },
                    ].map(s => (
                        <div key={s.domain} className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                            <span className="text-xs text-foreground/80 flex-1">{s.domain}</span>
                            <span className="text-[10px] text-muted-foreground">{s.note}</span>
                        </div>
                    ))}
                    <p className="text-[10px] text-muted-foreground px-1 pt-0.5">3 sources found · generating report...</p>
                </div>
            </div>

            {/* ── Card 4 — Automation Chart (dark, wide) ── */}
            <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-foreground p-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex items-start justify-between mb-6 gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-primary mb-3">
                            <Activity className="size-3" />
                            Automation activity
                        </span>
                        <h3 className="text-xl font-serif text-background mb-1">Real-time task tracking</h3>
                        <p className="text-sm text-background/40 leading-relaxed">
                            Every action Lyto takes, logged and visualized live.
                        </p>
                    </div>
                    <div className="flex gap-8 flex-shrink-0">
                        <div className="text-right">
                            <p className="text-3xl font-serif text-background">2,847</p>
                            <p className="text-[11px] text-background/35 mt-0.5">Tasks this week</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-serif text-primary">+34%</p>
                            <p className="text-[11px] text-background/35 mt-0.5">vs last week</p>
                        </div>
                    </div>
                </div>

                <AutomationChart />
            </div>

        </div>
    )
}

/* ── Chart ── */
const chartConfig = {
    tasks:    { label: 'Tasks automated', color: 'hsl(var(--primary))' },
    research: { label: 'Research runs',   color: 'rgba(255,255,255,0.3)' },
} satisfies ChartConfig

const chartData = [
    { day: 'Mon', tasks: 120, research: 50 },
    { day: 'Tue', tasks: 280, research: 140 },
    { day: 'Wed', tasks: 220, research: 180 },
    { day: 'Thu', tasks: 450, research: 300 },
    { day: 'Fri', tasks: 380, research: 220 },
    { day: 'Sat', tasks: 600, research: 400 },
    { day: 'Sun', tasks: 750, research: 550 },
]

const AutomationChart = () => (
    <ChartContainer className="h-48 aspect-auto w-full" config={chartConfig}>
        <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
            <defs>
                <linearGradient id="fillTasks2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="fillResearch2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0.18)" stopOpacity={1} />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)"    stopOpacity={1} />
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.25)' }}
                dy={6}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area strokeWidth={1.5} dataKey="research" type="monotone" fill="url(#fillResearch2)" stroke="rgba(255,255,255,0.15)" stackId="a" />
            <Area strokeWidth={2}   dataKey="tasks"    type="monotone" fill="url(#fillTasks2)"    stroke="hsl(var(--primary))"   stackId="a" />
        </AreaChart>
    </ChartContainer>
)
