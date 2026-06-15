import type { ReactNode } from "react";

interface AuthPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10 lg:px-8">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-ink-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              AAP CONTROL
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="text-sm leading-6 text-ink-muted">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
