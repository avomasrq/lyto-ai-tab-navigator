import { Activity, FolderOpen, MessageSquare, Search, Clock, RefreshCw, LogOut, ArrowLeft } from 'lucide-react';

const stats = [
  { title: 'Projects', value: '12', sub: 'Extension projects', icon: FolderOpen },
  { title: 'Sessions', value: '84', sub: 'Landing & extension', icon: MessageSquare },
  { title: 'Research', value: '3/5', sub: 'Available', icon: Search },
  { title: 'API Requests', value: '1,240', sub: '38 this week', icon: Activity },
  { title: 'Last Activity', value: '2m ago', sub: '14 today', icon: Clock },
];

const projects = [
  { name: 'Sales outreach flow', updated: '1h ago' },
  { name: 'Form auto-fill script', updated: '3h ago' },
  { name: 'Gmail summarizer', updated: 'Yesterday' },
  { name: 'Docs research agent', updated: '2d ago' },
];

const sessions = [
  { name: 'Compare cloud pricing', time: '12m ago' },
  { name: 'Research AI tools 2025', time: '1h ago' },
  { name: 'Competitor analysis', time: 'Yesterday' },
  { name: 'SEO keyword research', time: '2d ago' },
];

const prompts = [
  { text: 'Open all Gmail unread tabs', time: '2m ago' },
  { text: 'Fill contact form on site', time: '18m ago' },
  { text: 'Summarize this Google Doc', time: '1h ago' },
  { text: 'Search and compare prices', time: '2h ago' },
  { text: 'Automate outreach sequence', time: '5h ago' },
];

const chartBars = [28, 45, 32, 60, 48, 72, 38, 55, 80, 65, 44, 90, 58, 74];

const DashboardPreview = () => {
  return (
    <div className="min-h-full bg-background text-foreground text-[10px] font-sans select-none pointer-events-none">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95">
        <div className="px-4 flex h-9 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xs tracking-tight">Lyto AI<span className="text-primary">.</span></span>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-muted-foreground">Dashboard</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-2.5 w-2.5" />
            <span>alex@example.com</span>
            <LogOut className="h-2.5 w-2.5" />
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Page header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="uppercase tracking-widest text-primary font-medium mb-0.5" style={{ fontSize: 8 }}>Overview</p>
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-sm">
                Welcome back, <span className="text-primary">alex</span>
              </h1>
              <span className="font-serif italic text-base text-muted-foreground">Pro</span>
            </div>
          </div>
          <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: 8 }}>
            <ArrowLeft className="h-2 w-2" /> Back to home
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {stats.map(({ title, value, sub, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-muted-foreground" style={{ fontSize: 8 }}>{title}</span>
                <Icon className="h-2.5 w-2.5 text-muted-foreground/50" />
              </div>
              <p className="font-semibold text-sm text-foreground leading-none mb-1">{value}</p>
              <p className="text-muted-foreground leading-none" style={{ fontSize: 8 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Left col — 2 spans */}
          <div className="col-span-2 space-y-3">
            {/* Projects + Research side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* Projects */}
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground" style={{ fontSize: 9 }}>Projects</span>
                  <FolderOpen className="h-2.5 w-2.5 text-muted-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  {projects.map((p) => (
                    <div key={p.name} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                      <span className="text-foreground truncate max-w-[100px]" style={{ fontSize: 8 }}>{p.name}</span>
                      <span className="text-muted-foreground flex-shrink-0 ml-1" style={{ fontSize: 7 }}>{p.updated}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research sessions */}
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground" style={{ fontSize: 9 }}>Research</span>
                  <Search className="h-2.5 w-2.5 text-muted-foreground/50" />
                </div>
                <div className="space-y-1.5">
                  {sessions.map((s) => (
                    <div key={s.name} className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
                      <span className="text-foreground truncate max-w-[100px]" style={{ fontSize: 8 }}>{s.name}</span>
                      <span className="text-muted-foreground flex-shrink-0 ml-1" style={{ fontSize: 7 }}>{s.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* API Usage row */}
            <div>
              <p className="font-medium text-muted-foreground mb-1.5" style={{ fontSize: 9 }}>API Usage</p>
              <div className="grid grid-cols-[1fr_1.5fr] gap-3">
                {/* Usage card */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="text-center pb-2 border-b border-border mb-2">
                    <p className="text-muted-foreground mb-1" style={{ fontSize: 8 }}>Requests This Month</p>
                    <p className="text-lg font-bold text-foreground leading-none mb-0.5">1,240</p>
                    <p className="text-primary font-medium" style={{ fontSize: 8 }}>Unlimited</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-1" style={{ fontSize: 8 }}>Research Sessions</p>
                    <p className="text-base font-bold text-foreground leading-none mb-0.5">3 / 5</p>
                    <p className="text-muted-foreground" style={{ fontSize: 7 }}>Resets Aug 1</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="font-medium text-foreground mb-2" style={{ fontSize: 9 }}>Daily Usage</p>
                  <div className="flex items-end gap-0.5 h-16">
                    {chartBars.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i === chartBars.length - 1
                            ? 'hsl(var(--primary))'
                            : 'hsl(var(--primary) / 0.25)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right col — prompt history */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground" style={{ fontSize: 9 }}>Prompt History</span>
              <MessageSquare className="h-2.5 w-2.5 text-muted-foreground/50" />
            </div>
            <div className="space-y-1.5">
              {prompts.map((p) => (
                <div key={p.text} className="rounded-md bg-background border border-border/40 p-2">
                  <p className="text-foreground leading-snug mb-0.5" style={{ fontSize: 8 }}>{p.text}</p>
                  <p className="text-muted-foreground" style={{ fontSize: 7 }}>{p.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPreview;
