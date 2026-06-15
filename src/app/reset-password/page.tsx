import Link from "next/link";
import { redirect } from "next/navigation";

import AuthPageShell from "@/components/auth/auth-page-shell";
import ResetPasswordForm from "@/components/reset-password-form";
import { getServerUser } from "@/lib/server-auth";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const user = await getServerUser();
  if (user) {
    redirect("/dashboard");
  }

  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams?.token ?? "";

  return (
    <AuthPageShell
      title="Set a new password"
      description="Use the link from your email to finish resetting your account."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-4 rounded-lg border border-border bg-surface p-7 text-center shadow-card">
          <p className="text-sm leading-7 text-ink-muted">That reset link is missing a token.</p>
          <Link href="/forgot-password" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
            Request a new reset link
          </Link>
        </div>
      )}
    </AuthPageShell>
  );
}
