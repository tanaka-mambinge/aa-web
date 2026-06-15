import { redirect } from "next/navigation";

import AuthPageShell from "@/components/auth/auth-page-shell";
import ForgotPasswordForm from "@/components/forgot-password-form";
import { getServerUser } from "@/lib/server-auth";

export default async function ForgotPasswordPage() {
  const user = await getServerUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthPageShell title="Reset your password" description="Enter your email and we'll send a reset link.">
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
