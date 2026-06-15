import * as React from "react";

import { cn } from "@/lib/cn";

interface BadgeProps extends React.ComponentProps<"span"> {
  tone?: "default" | "pending" | "approved" | "rejected" | "cancelled" | "timed_out" | "critical" | "high" | "low";
}

const toneStyles = {
  default: "bg-surface-raised text-ink-muted",
  pending: "bg-warning-muted text-warning",
  approved: "bg-success-muted text-success",
  rejected: "bg-danger-muted text-danger",
  cancelled: "bg-surface-raised text-ink-faint",
  timed_out: "bg-attention-muted text-attention",
  critical: "bg-danger-muted text-danger",
  high: "bg-warning-muted text-warning",
  low: "bg-success-muted text-success",
};

export default function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
