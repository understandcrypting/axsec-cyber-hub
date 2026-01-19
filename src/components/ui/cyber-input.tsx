import * as React from "react";
import { cn } from "@/lib/utils";

export interface CyberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-md border border-border/50 bg-card/50 px-4 py-2 text-sm font-mono",
            "text-foreground placeholder:text-muted-foreground/50",
            "transition-all duration-300",
            "focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(180_100%_50%/0.2)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
CyberInput.displayName = "CyberInput";

export { CyberInput };
