import { cn } from '@/lib/utils';
import { SvgTextDraw } from '@/components/ui/text-svg-text-draw';

/* DrawnLabel, section eyebrow rendered in the hand-drawn stroke lettering.
   SvgTextDraw only has paths for a-z and space; any other character renders as
   nothing at all. That's a silent-data-loss footgun for a prop-driven label, so
   anything outside that set falls back to ordinary styled text instead of
   quietly dropping characters.

   The visible SVG is aria-hidden and paired with sr-only real text, so screen
   readers and SEO still get the label. */

const DRAWABLE = /^[a-z ]+$/i;

interface DrawnLabelProps {
  children: string;
  /** Classes for the drawn SVG (set height/colour here, e.g. "h-5 text-primary") */
  className?: string;
  /** Classes for the plain-text fallback when the label isn't drawable */
  fallbackClassName?: string;
  speed?: number;
}

export function DrawnLabel({
  children,
  className,
  fallbackClassName,
  speed = 1.6,
}: DrawnLabelProps) {
  const text = String(children);

  if (!DRAWABLE.test(text)) {
    return (
      <p className={cn('text-xs font-semibold uppercase tracking-[0.22em]', fallbackClassName)}>
        {text}
      </p>
    );
  }

  return (
    <>
      <p className="sr-only">{text}</p>
      <SvgTextDraw aria-hidden speed={speed} className={cn('h-5 w-auto', className)}>
        {text.toLowerCase()}
      </SvgTextDraw>
    </>
  );
}
