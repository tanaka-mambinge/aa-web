"use client";

import * as React from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { cn } from "@/lib/cn";

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, id, type, ...props },
  ref,
) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const [revealed, setRevealed] = React.useState(false);
  const isPassword = type === "password";

  return (
    <label htmlFor={inputId} className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-ink-muted">{label}</span>
      ) : null}
      <span className="relative block">
        <input
          id={inputId}
          ref={ref}
          type={isPassword && revealed ? "text" : type}
          className={cn(
            "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-ink-faint focus:ring-2 focus:ring-accent/10",
            isPassword && "pr-11",
            error && "border-danger/40 focus:border-danger/60 focus:ring-danger/10",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-faint transition-colors hover:text-ink"
          >
            {revealed ? <IconEyeOff className="h-4 w-4" stroke={1.75} /> : <IconEye className="h-4 w-4" stroke={1.75} />}
          </button>
        ) : null}
      </span>
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
});

export default Input;
