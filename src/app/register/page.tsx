import { redirect } from "next/navigation";

import RegisterForm from "@/components/register-form";
import { getSafeNextPath } from "@/lib/next-path";
import { getServerUser } from "@/lib/server-auth";

export default async function RegisterPage({
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
    <div className="min-h-screen bg-canvas text-ink">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10 lg:px-8">
        <div className="w-full max-w-[420px] space-y-10">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-ink-faint">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              AA
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-ink">
              Create an operator account
            </h1>
            <p className="text-sm leading-7 text-ink-muted">
              Register to review approvals in the browser and manage CLI tokens from
              the dashboard.
            </p>
          </div>

          <RegisterForm nextPath={nextPath} />
        </div>
      </div>
    </div>
  );
}
