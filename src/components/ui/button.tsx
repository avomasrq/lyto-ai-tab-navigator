import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-muted-foreground/40 rounded-xl",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl",
        ghost: "hover:bg-secondary hover:text-foreground rounded-xl",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "relative bg-gradient-to-r from-primary via-orange-400 to-primary bg-[length:200%_100%] text-primary-foreground font-bold shadow-[0_0_30px_hsl(25_95%_53%/0.4)] hover:shadow-[0_0_50px_hsl(25_95%_53%/0.6)] hover:bg-[position:100%_0] hover:scale-[1.02] active:scale-[0.98] rounded-2xl border border-primary/20",
        heroOutline: "relative border-2 border-muted-foreground/30 bg-transparent text-foreground backdrop-blur-sm hover:border-primary/60 hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_30px_hsl(25_95%_53%/0.2)] rounded-2xl",
        glass: "glass-card text-foreground hover:bg-muted/40 rounded-xl",
        nav: "text-muted-foreground hover:text-foreground bg-transparent rounded-lg",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-base tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
