import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "xs" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default:
        "bg-[#0F172A] text-white hover:bg-slate-800 active:bg-slate-950 shadow-xs",
      outline:
        "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100",
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200/80 active:bg-slate-200",
      ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
    }[variant];

    const sizeClasses = {
      default: "h-9 px-3.5 py-2 text-xs font-medium rounded-lg",
      sm: "h-8 px-3 py-1.5 text-xs font-medium rounded-md",
      xs: "h-6 px-2.5 py-0.5 text-[11px] font-medium rounded-md",
      icon: "h-8 w-8 rounded-lg flex items-center justify-center",
    }[size];

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
          variantClasses,
          sizeClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

