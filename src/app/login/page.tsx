import { redirect } from "next/navigation";

import AuthPageShell from "@/components/auth/auth-page-shell";
import LoginForm from "@/components/login-form";
import { getServerUser } from "@/lib/server-auth";

export default async function LoginPage() {
  const user = await getServerUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell
      title="Sign in to review approvals"
      description="Your browser session handles human review. CLI and app clients keep using bearer tokens separately."
    >
      <LoginForm />
    </AuthPageShell>
  );
}
