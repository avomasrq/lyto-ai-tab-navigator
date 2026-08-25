import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Cmd, SectionHead, fadeUp } from '@/components/cli/ui';

const Footer = lazy(() => import('@/components/Footer'));

/**
 * The command reference, on its own page.
 *
 * It used to sit at the bottom of /cli, and it was the single biggest thing
 * wrong with that page: two dozen commands, config paths and service controls
 * shown to a person who has not yet decided whether to install anything. The
 * verdict it produced is on record — "complicated to use and understand" is
 * why one person left. None of it is needed to start: the installer runs the
 * only command that matters.
 *
 * So the sales page keeps the promise and the install, and everything a person
 * needs AFTER saying yes lives here, one link away.
 */

/* ─────────────────────────── Full guide data (mirrors COMMANDS.md) ─────────────────────────── */

/* Every chip is one runnable command: they are click-to-copy, so a chip holding two
   commands joined by a separator would put something unpasteable on the clipboard. */

const GUIDE_CORE: { cmds: string[]; desc: string }[] = [
  { cmds: ['argos-cli'], desc: 'Run the agent right here, in this terminal. Stop with Ctrl+C.' },
  { cmds: ['argos-cli setup'], desc: 'The setup wizard — also reconfigure: provider, key, pairing, browser. Enter keeps the current value.' },
  { cmds: ['argos-cli setup --token <code>'], desc: 'Same wizard with your pairing code (the one from this page) pre-filled. The installer runs this for you — you almost never type it yourself.' },
  { cmds: ['argos-cli uninstall'], desc: 'Remove everything — service, config & keys, Chrome profile, the package. Keeps your workspace files.' },
  { cmds: ['argos-cli uninstall --purge'], desc: 'Same, but also deletes the workspace files.' },
  { cmds: ['argos-cli --version', 'argos-cli --help'], desc: 'Version / quick reference.' },
];

const GUIDE_SERVICE: { cmds: string[]; desc: string }[] = [
  { cmds: ['argos-cli service install'], desc: 'Run as a background service — starts on login, restarts on crash, no terminal window.' },
  { cmds: ['argos-cli service start', 'argos-cli service stop'], desc: 'Start / stop. Stopped stays installed — it comes back on next login or start.' },
  { cmds: ['argos-cli service restart'], desc: 'Apply a settings change.' },
  { cmds: ['argos-cli service status'], desc: 'Is it running? Plus the path to the logs.' },
  { cmds: ['argos-cli service logs'], desc: 'Tail what it has been doing.' },
  { cmds: ['argos-cli service uninstall'], desc: 'Remove just the autostart — config and package stay.' },
];

const GUIDE_RECIPES: { want: string; runs: string[] }[] = [
  { want: 'Try it once, watch the output', runs: ['argos-cli'] },
  { want: 'Have it always running', runs: ['argos-cli service install'] },
  { want: 'Change model / key / settings', runs: ['argos-cli setup', 'argos-cli service restart'] },
  { want: 'Something looks stuck', runs: ['argos-cli service status', 'argos-cli service logs'] },
  { want: 'Remove it completely', runs: ['argos-cli uninstall'] },
];

const GUIDE_PATHS: { path: string; what: string }[] = [
  { path: '~/.argos/.env', what: 'Config + your model key' },
  { path: '~/.argos/logs/', what: 'Agent logs (out + err)' },
  { path: '~/.argos/browser/', what: "Argos's Chrome profile, with your logins" },
  { path: '~/ArgosWorkspace', what: 'Its workspace — where files land' },
];

const CliDocs = () => {
  useEffect(() => {
    document.title = 'Argos CLI — command reference';
    return () => { document.title = 'Argos'; };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 sm:pt-32">
        <Link
          to="/cli"
          className="group inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span>
          Argos CLI
        </Link>
      </div>

      {/* ── Full guide ── */}
      <section id="guide" className="relative py-20 sm:py-28 px-4 sm:px-6 bg-background scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            eyebrow="The full guide"
            title={<>Everything you'll <span className="text-gradient">ever type</span></>}
            sub="A handful of commands in the terminal — type each one exactly as shown, then press Enter. Everything else happens in Telegram, in plain language."
          />

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Recipes — the commands people actually use, front and center */}
            <motion.div {...fadeUp} className="lg-glass-card relative overflow-hidden rounded-[22px] lg:col-span-2">
              <div className="relative px-5 py-4 border-b border-foreground/[0.07] flex items-center justify-between">
                <p className="text-[15px] font-semibold text-foreground">I want to…</p>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">start here</span>
              </div>
              <div className="relative divide-y divide-foreground/[0.06]">
                {GUIDE_RECIPES.map((r) => (
                  <div key={r.want} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <p className="text-[14px] text-foreground/90 font-medium sm:w-[280px] shrink-0">{r.want}</p>
                    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                      {r.runs.map((c, i) => (
                        <span key={c} className="inline-flex min-w-0 items-center gap-1.5">
                          {i > 0 && <span className="text-[11px] text-muted-foreground/70">then</span>}
                          <Cmd>{c}</Cmd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Core commands */}
            <motion.div {...fadeUp} className="lg-glass-card relative overflow-hidden rounded-[22px]">
              <div className="relative px-5 py-3.5 border-b border-foreground/[0.07] flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Core commands</p>
                <span className="font-mono text-[10px] text-muted-foreground/60">argos-cli</span>
              </div>
              <div className="relative divide-y divide-foreground/[0.06]">
                {GUIDE_CORE.map((c) => (
                  <div key={c.cmds[0]} className="px-5 py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.cmds.map((cmd) => <Cmd key={cmd}>{cmd}</Cmd>)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Service */}
            <motion.div {...fadeUp} className="lg-glass-card relative overflow-hidden rounded-[22px]">
              <div className="relative px-5 py-3.5 border-b border-foreground/[0.07] flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">Background service</p>
                <span className="text-[10px] text-muted-foreground/60">the always-on mode</span>
              </div>
              <div className="relative divide-y divide-foreground/[0.06]">
                {GUIDE_SERVICE.map((c) => (
                  <div key={c.cmds[0]} className="px-5 py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {c.cmds.map((cmd) => <Cmd key={cmd}>{cmd}</Cmd>)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Paths */}
            <motion.div {...fadeUp} className="lg-glass-card relative overflow-hidden rounded-[22px] lg:col-span-2">
              <div className="relative px-5 py-3.5 border-b border-foreground/[0.07]">
                <p className="text-sm font-semibold text-foreground">Where things live</p>
              </div>
              <div className="relative divide-y divide-foreground/[0.06]">
                {GUIDE_PATHS.map((p) => (
                  <div key={p.path} className="px-5 py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <code className="font-mono text-[12px] text-foreground/80 bg-muted rounded-md px-2 py-0.5 w-fit sm:w-[240px] shrink-0 break-all">{p.path}</code>
                    <p className="text-[13px] text-muted-foreground">{p.what}</p>
                  </div>
                ))}
              </div>
              <div className="relative px-5 py-3.5 border-t border-foreground/[0.07] bg-white/25">
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Providers out of the box: <span className="text-foreground/75">Gemini (default), Claude, OpenAI, OpenRouter, local Ollama / vLLM</span> — set with <code className="font-mono text-primary">argos-cli setup</code>.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>


      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default CliDocs;
