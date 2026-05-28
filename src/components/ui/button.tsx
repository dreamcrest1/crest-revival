import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold tracking-wide uppercase ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] font-display",
  {
    variants: {
      variant: {
        // Royal Decree — crimson + gold trim
        default:
          "bg-destructive text-vellum border border-primary/70 shadow-[inset_0_1px_0_hsl(43_79%_60%/0.35),inset_0_-2px_0_hsl(0_0%_0%/0.5),0_3px_10px_hsl(0_0%_0%/0.5)] hover:shadow-[0_0_22px_hsl(43_79%_46%/0.55),inset_0_1px_0_hsl(43_79%_60%/0.35)] hover:text-primary",
        destructive:
          "bg-destructive text-vellum border border-primary/60 hover:shadow-[0_0_20px_hsl(0_100%_27%/0.55)]",
        // Parchment Scroll
        outline:
          "bg-[hsl(36_47%_61%)] text-[hsl(var(--ink))] border-l-4 border-l-[hsl(0_100%_27%)] border-y border-r border-[hsl(28_50%_25%/0.6)] hover:bg-[hsl(36_47%_54%)] shadow-[inset_0_0_18px_hsl(28_50%_25%/0.35)]",
        // Carved Stone
        secondary:
          "bg-transparent text-primary border border-primary/40 shadow-[inset_0_0_0_1px_hsl(0_0%_0%/0.5),inset_0_1px_0_hsl(43_79%_60%/0.15)] hover:bg-gradient-to-b hover:from-[hsl(28_22%_14%)] hover:to-[hsl(28_22%_8%)]",
        ghost:
          "text-primary hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30",
        link: "text-primary underline-offset-4 hover:underline normal-case tracking-normal",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
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
