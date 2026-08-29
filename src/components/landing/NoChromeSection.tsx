import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Terminal } from 'lucide-react';
import { useInstallEnv } from '@/components/InstallCta';
import { canInstallExtension, isChrome, type Browser } from '@/lib/store';
import { reveal } from '@/lib/reveal';
import { RibbonField } from '@/components/ui/ribbon-field';
import { MythLine } from '@/components/landing/Myth';

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
 *
 * Sized up to match: this used to run at max-w-3xl with a 15px body and 13px
 * card labels — smaller than every other section on the page, which is exactly
 * backwards for the one block whose entire job is to be seen by the people it's
 * for. It's the same width and heading scale as JobsSection now, and the two
 * doors (Telegram, CLI) read as cards, not a footnote list.
 *
 * Each door is now its own link. They read as clickable — bordered, padded,
 * rounded — but weren't; every path funneled through the one button at the
 * bottom, which loses the actual split between them (Telegram needs nothing
 * installed at all; the CLI needs a Pro subscription and one line in a
 * terminal, once). The
 * button stays as the low-effort default for someone who hasn't decided.
 */

const NAME: Partial<Record<Browser, string>> = {
  opera: 'Opera', firefox: 'Firefox', safari: 'Safari', brave: 'Brave', edge: 'Edge',
};

export default function NoChromeSection() {
  const env = useInstallEnv();
  const stuck = !env.installed && (!canInstallExtension(env.device) || !isChrome(env.browser));
  const named = NAME[env.browser];

  return (
    <section className="py-28 sm:py-36">
      <div className="mx-auto max-w-4xl px-5">
        <MythLine className="mb-6">Ἄλλη θύρα · the other door</MythLine>

        <motion.div
          {...reveal()}
          className={`relative overflow-hidden rounded-[36px] border border-white/70 shadow-2xl shadow-primary/10 ${
            stuck ? 'shadow-[0_28px_80px_-30px_rgba(0,0,0,0.55)]' : ''
          }`}
        >
          {/* The same shimmering plate the CLI page uses for its install panel: an
              animated stripe field behind a frosted veil. This section is the one
              door for everyone whose browser cannot run the panel — two people were
              lost here in silence — so it gets the loudest surface on the page
              rather than a plain bordered rectangle. */}
          <RibbonField />
          {/* 0.78, down from 0.87. The ribbons are the only thing moving behind
              the two cards below, and at 0.87 the veil had already erased them
              before the cards got a chance to refract anything — the panes were
              sitting on a flat white field pretending to be glass. The heading
              and the paragraph still read at this weight; they are near-black
              at 17px and up. */}
          <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(3px)' }} />

          <div className="relative z-10 px-8 pt-11 sm:px-14 sm:pt-16">
            <h2 className="font-serif text-[2rem] leading-[1.15] tracking-tight sm:text-[2.7rem]">
              {stuck && named ? `On ${named}? Then take the other door.` : 'Don’t use Chrome?'}
            </h2>
          </div>

          <div className="relative z-10 px-8 pb-11 pt-5 sm:px-14 sm:pb-16">
          <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-[18px]">
            The panel needs Chrome’s side panel API, which Opera, Firefox and Safari don’t have.
            Everything else doesn’t need a browser at all.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <Link
              to="/cli#telegram"
              className="lg-glass-card lg-glass-hover group/card rounded-3xl p-7 hover:border-primary/25"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover/card:translate-x-0.5 group-hover/card:text-primary" />
              </div>
              <div className="mt-5 text-[18px] font-semibold">Telegram</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                The same agent in a chat: it runs tasks in the cloud, on a schedule, and answers
                you there.
              </p>
            </Link>
            <Link
              to="/cli#install"
              className="lg-glass-card lg-glass-hover group/card rounded-3xl p-7 hover:border-primary/25"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Terminal className="h-5 w-5 text-primary" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover/card:translate-x-0.5 group-hover/card:text-primary" />
              </div>
              <div className="mt-5 text-[18px] font-semibold">The CLI</div>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                One command to install, a window after that. Your shell, your files, your
                logged-in browser.
              </p>
            </Link>
          </div>

          <Link
            to="/cli#telegram"
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-[1px]"
          >
            Set it up without the extension
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
