import { redirect } from "next/navigation";

import AuthPageShell from "@/components/auth/auth-page-shell";
import LoginForm from "@/components/login-form";
import { getSafeNextPath } from "@/lib/next-path";
import { getServerUser } from "@/lib/server-auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const user = await getServerUser();
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeNextPath(resolvedSearchParams?.next);
  if (user) {
    redirect(nextPath);
  }

  return (
    <AuthPageShell
      title="Sign in to review approvals"
      description="Your browser session handles human review. CLI and app clients keep using bearer tokens separately."
    >
      <LoginForm nextPath={nextPath} />
    </AuthPageShell>
  );
}
