// ---------------------------------------------------------------------------
// GLASS BUTTON  (React concepts: cva variants + forwardRef)
// ---------------------------------------------------------------------------
// The frosted-glass button used all over the auth screen. The visual styles
// live in src/styles/glass.css; this file is just structure + size variants.
//   • cva (class-variance-authority) maps a `size` prop to Tailwind classes.
//   • forwardRef passes a ref straight through to the real <button>.
// ---------------------------------------------------------------------------
import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva("relative isolate cursor-pointer rounded-full transition-all", {
  variants: {
    size: {
      default: "text-base font-medium",
      sm: "text-sm font-medium",
      lg: "text-lg font-medium",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: { size: "default" },
});
const glassButtonTextVariants = cva("glass-button-text relative block select-none tracking-tighter", {
  variants: {
    size: {
      default: "px-6 py-3.5",
      sm: "px-4 py-2",
      lg: "px-8 py-4",
      icon: "flex h-10 w-10 items-center justify-center",
    },
  },
  defaultVariants: { size: "default" },
});

export const GlassButton = React.forwardRef(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e) => {
      const button = e.currentTarget.querySelector("button");
      if (button && e.target !== button) button.click();
    };
    return (
      <div
        className={cn("glass-button-wrap cursor-pointer rounded-full relative", className)}
        onClick={handleWrapperClick}
      >
        <button
          className={cn("glass-button relative z-10", glassButtonVariants({ size }))}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
        </button>
        <div className="glass-button-shadow rounded-full pointer-events-none"></div>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export default GlassButton;
