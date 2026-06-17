"use client";

import { IconBrandGithub, IconBrandGoogle, IconLink } from "@tabler/icons-react";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { openSocialAuth } from "@/lib/social-auth";
import type { User } from "@/lib/types";

interface ConnectionsSectionProps {
  user: User;
}

const PROVIDERS = [
  { key: "google", label: "Google", icon: IconBrandGoogle },
  { key: "github", label: "GitHub", icon: IconBrandGithub },
] as const;

export default function ConnectionsSection({ user }: ConnectionsSectionProps) {
  return (
    <section className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">Connections</h2>
        <p className="max-w-xl text-sm leading-7 text-ink-muted">Link Google or GitHub so you can sign in without a password.</p>
      </div>

      <div className="grid gap-4">
        {PROVIDERS.map((provider) => {
          const linked = user.auth_methods.includes(provider.key);
          const Icon = provider.icon;
          return (
            <Card key={provider.key} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-ink-muted" />
                  <h3 className="text-sm font-semibold text-ink">{provider.label}</h3>
                </div>
                <p className="text-sm text-ink-muted">
                  {linked ? "Connected to this account." : "Not connected yet."}
                </p>
              </div>
              {linked ? (
                <Badge tone="approved" className="w-fit">Connected</Badge>
              ) : (
                <Button variant="secondary" onClick={() => openSocialAuth(provider.key, "link")}>
                  <IconLink className="h-4 w-4" />
                  Link {provider.label}
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
