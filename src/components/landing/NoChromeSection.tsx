import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Terminal } from 'lucide-react';
import { useInstallEnv } from '@/components/InstallCta';
import { canInstallExtension, isChrome, type Browser } from '@/lib/store';
import { reveal } from '@/lib/reveal';
import { RibbonField } from '@/components/ui/ribbon-field';

/**
 * The second way in, not a second product line.
 *
 * Two of eleven people died here in silence: one in Opera, one in Zen. They
 * installed something that could never appear, concluded the product was broken,
 * and left. The panel really does need Chrome's side panel API — but the cloud
 * agent, the schedules and the CLI never needed a browser at all, so the honest
 * answer is a door rather than an apology.
 *
 * Shown to everyone, addressed by name to the people who need it: if the browser
 * cannot run the panel, the block says so out loud instead of making them work
 * out that it is about them.
 */

const NAME: Partial<Record<Browser, string>> = {
  opera: 'Opera', firefox: 'Firefox', safari: 'Safari', brave: 'Brave', edge: 'Edge',
};

export default function NoChromeSection() {
  const env = useInstallEnv();
  const stuck = !env.installed && (!canInstallExtension(env.device) || !isChrome(env.browser));
  const named = NAME[env.browser];

  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <motion.div
          {...reveal()}
          className={`relative overflow-hidden rounded-[32px] border border-white/70 shadow-2xl shadow-primary/10 ${
            stuck ? 'shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]' : ''
          }`}
        >
          {/* The same shimmering plate the CLI page uses for its install panel: an
              animated stripe field behind a frosted veil. This section is the one
              door for everyone whose browser cannot run the panel — two people were
              lost here in silence — so it gets the loudest surface on the page
              rather than a plain bordered rectangle. */}
          <RibbonField />
          <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.87)', backdropFilter: 'blur(3px)' }} />

          <div className="relative z-10 px-8 pt-9 sm:px-10 sm:pt-11">
            <h2 className="font-serif text-[1.7rem] leading-tight tracking-tight sm:text-[2.1rem]">
              {stuck && named ? `On ${named}? Then take the other door.` : 'Don’t use Chrome?'}
            </h2>
          </div>

          <div className="relative z-10 px-8 pb-9 pt-4 sm:px-10 sm:pb-11">
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            The panel needs Chrome’s side panel API, which Opera, Firefox and Safari don’t have.
            Everything else doesn’t need a browser at all.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur-md">
              <Send className="h-4 w-4 text-muted-foreground" />
              <div className="mt-3 text-[13.5px] font-medium">Telegram</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                The same agent in a chat: it runs tasks in the cloud, on a schedule, and answers
                you there.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 backdrop-blur-md">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <div className="mt-3 text-[13.5px] font-medium">The CLI</div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                One command on your own computer: your shell, your files, your logged-in browser.
              </p>
            </div>
          </div>

          <Link
            to="/cli#telegram"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-[1px]"
          >
            Set it up without the extension
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
