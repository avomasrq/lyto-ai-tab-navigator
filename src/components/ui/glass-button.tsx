import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Structural port of a "glass button" pattern: a wrap (hover/press scale),
 * a real <button> carrying the glass front face, and a sibling shadow div
 * for the soft glow behind it. The pasted source referenced four CSS
 * classes — glass-button-wrap/-button/-text/-shadow — with no definitions
 * anywhere; the actual surface lives in src/index.css next to .lg-glass,
 * built black to match the rest of the site's dark-glass surfaces rather
 * than guessing at whatever the original demo's globals.css had.
 *
 * cn imported from @/lib/utils rather than the hand-rolled join() the
 * source defined inline — every other file in this folder uses the one
 * cn, and two different implementations of the same helper one directory
 * apart is the kind of drift that bites later.
 */

const glassButtonVariants = cva(
  "relative isolate cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "glass-button-wrap cursor-pointer rounded-full",
          className
        )}
      >
        <button
          className={cn("glass-button", glassButtonVariants({ size }))}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              glassButtonTextVariants({ size }),
              contentClassName
            )}
          >
            {children}
          </span>
        </button>
        <div className="glass-button-shadow rounded-full" aria-hidden />
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
