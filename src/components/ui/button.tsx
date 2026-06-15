import * as React from "react";

import { cn } from "@/lib/cn";

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "soft" | "soft-danger";
  size?: "default" | "icon";
}

const variantStyles = {
  primary: "bg-accent text-accent-ink border border-accent hover:bg-accent-strong hover:border-accent-strong",
  secondary:
    "bg-surface text-ink border border-border-strong hover:border-ink-faint",
  ghost: "bg-transparent text-ink-muted border border-transparent hover:bg-surface-raised hover:text-ink",
  danger: "bg-transparent text-danger border border-danger/40 hover:bg-danger-muted",
  soft: "bg-surface-raised text-ink-muted border border-transparent hover:text-ink",
  "soft-danger": "bg-danger-muted text-danger border border-transparent hover:bg-danger/15",
};

const sizeStyles = {
  default: "h-10 gap-2 px-4 text-sm",
  icon: "h-10 w-10 p-0",
};

export default function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-40",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}
