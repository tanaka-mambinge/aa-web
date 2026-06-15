/**
 * Full-screen branded loader, shown as a Suspense fallback while the server
 * verifies the auth token (see app/dashboard/layout.tsx). Server component —
 * no client JS needed; the spinner is a pure CSS animation.
 */
export default function LoadingScreen({ message = "Verifying your session…" }: { message?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-canvas text-ink">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-accent" />
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-ink">
          A
        </span>
      </div>
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  );
}
