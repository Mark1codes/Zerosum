import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "emerald" | "blue" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: "bg-slate-50 text-slate-600 border border-slate-200/80",
    emerald: "bg-emerald-50/90 text-emerald-700 border border-emerald-200/60",
    blue: "bg-blue-50 text-blue-700 border border-blue-200/70",
    outline: "bg-white text-slate-600 border border-slate-200",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-colors select-none",
        variantClasses,
        className
      )}
      {...props}
    />
  );
}

