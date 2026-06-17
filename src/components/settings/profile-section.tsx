"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconLogout2 } from "@tabler/icons-react";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { useEmailPrivacy } from "@/hooks/use-email-privacy";
import { apiRequest } from "@/lib/http";
import type { User } from "@/lib/types";

interface ProfileSectionProps {
  user: User;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const { displayEmail, emailObfuscated, setEmailObfuscated } = useEmailPrivacy(user.email);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    try {
      setIsLoggingOut(true);
      await apiRequest<{ ok: boolean }>("/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <section className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">Profile</h2>
        <p className="max-w-xl text-sm leading-7 text-ink-muted">Read-only account details for this session.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <dl className="divide-y divide-border">
          <div className="grid gap-1.5 py-5 first:pt-0 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Name</dt>
            <dd className="text-sm text-ink">{user.name}</dd>
          </div>
          <div className="grid gap-1.5 py-5 sm:grid-cols-[160px_1fr] sm:items-start sm:gap-6">
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted sm:pt-0.5">Email</dt>
            <dd className="space-y-2 text-sm text-ink">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>{displayEmail}</span>
                <button
                  type="button"
                  onClick={() => setEmailObfuscated(!emailObfuscated)}
                  className="inline-flex h-9 items-center justify-center self-start rounded-md border border-border-strong px-3 text-sm font-medium text-ink-muted transition-colors hover:border-ink-faint hover:text-ink sm:self-auto"
                >
                  {emailObfuscated ? "Show email" : "Hide email"}
                </button>
              </div>
              <p className="text-xs leading-5 text-ink-faint">
                Masked by default so it isn&apos;t exposed on shared screens or recordings.
              </p>
            </dd>
          </div>
          <div className="grid gap-1.5 py-5 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Workspace ID</dt>
            <dd className="break-all font-mono text-sm text-ink">{user.workspace_id}</dd>
          </div>
          <div className="grid gap-1.5 py-5 pb-0 sm:grid-cols-[160px_1fr] sm:items-center sm:gap-6">
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">Member since</dt>
            <dd className="text-sm text-ink">{formatDate(user.created_at)}</dd>
          </div>
        </dl>
      </Card>

      <div className="flex items-center justify-between border-t border-border pt-6">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-ink">Session</h3>
          <p className="text-sm text-ink-muted">Sign out of this device.</p>
        </div>
        <Button variant="secondary" disabled={isLoggingOut} onClick={() => void logout()}>
          <IconLogout2 className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </section>
  );
}
