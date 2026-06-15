import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

interface AuthFormCardProps extends ComponentProps<"form"> {
  error?: string | null;
  success?: string | null;
}

export default function AuthFormCard({ error, success, className, children, ...props }: AuthFormCardProps) {
  return (
    <form
      className={cn("space-y-5 rounded-lg border border-border bg-surface p-7 shadow-card", className)}
      {...props}
    >
      {error ? (
        <div className="rounded-md border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-md border border-success/20 bg-success-muted px-4 py-3 text-sm text-success">
          {success}
        </div>
      ) : null}
      {children}
    </form>
  );
}
