import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cyberBadgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/10 text-primary",
        secondary:
          "border-secondary/50 bg-secondary text-secondary-foreground",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive",
        success:
          "border-success/30 bg-success/10 text-success",
        warning:
          "border-warning/30 bg-warning/10 text-warning",
        outline:
          "border-border text-foreground",
        glow:
          "border-primary/50 bg-primary/20 text-primary shadow-[0_0_10px_hsl(180_100%_50%/0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CyberBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cyberBadgeVariants> {}

function CyberBadge({ className, variant, ...props }: CyberBadgeProps) {
  return (
    <div className={cn(cyberBadgeVariants({ variant }), className)} {...props} />
  );
}

export { CyberBadge, cyberBadgeVariants };
