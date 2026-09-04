import { cn } from '@/lib/utils';

/**
 * The classical furniture of the site, in one place.
 *
 * Argos is the dog in the Odyssey, the one who waited twenty years and knew
 * Odysseus the moment he came home, when nobody else did. That is why the site
 * is dressed the way it is (stone tablets, meander friezes, statues on black),
 * and it is also the only myth reference that earns its keep here: the whole
 * differentiator of the product is that it remembers you between visits.
 *
 * So the story appears once, next to memory, and everywhere else the classics
 * are texture rather than a lecture.
 */

/** A line of small caps between two hairlines. */
export function MythLine({
  children,
  className,
  tone = 'dark',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  const rule = tone === 'dark' ? 'to-foreground/25' : 'to-white/30';
  const text = tone === 'dark' ? 'text-muted-foreground/80' : 'text-white/55';
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <span className={cn('h-px w-10 bg-gradient-to-r from-transparent sm:w-16', rule)} />
      <span className={cn('text-[10px] font-semibold uppercase tracking-[0.28em]', text)}>{children}</span>
      <span className={cn('h-px w-10 bg-gradient-to-l from-transparent sm:w-16', rule)} />
    </div>
  );
}
