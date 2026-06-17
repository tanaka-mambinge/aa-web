"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconBell, IconLink, IconLock, IconUser, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import ConnectionsSection from "@/components/settings/connections-section";
import NotificationsSection from "@/components/settings/notifications-section";
import PasswordSection from "@/components/settings/password-section";
import ProfileSection from "@/components/settings/profile-section";
import Button from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { User } from "@/lib/types";

interface SettingsDialogProps {
  user: User;
  tab: "profile" | "password" | "connections" | "notifications";
  closeHref: string;
}

const TABS = [
  { value: "profile", label: "Profile", icon: IconUser },
  { value: "password", label: "Password", icon: IconLock },
  { value: "connections", label: "Connections", icon: IconLink },
  { value: "notifications", label: "Notifications", icon: IconBell },
] as const;

function tabClassName(active: boolean) {
  return cn(
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
    active ? "bg-surface-raised text-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink",
  );
}

export default function SettingsDialog({ user, tab, closeHref }: SettingsDialogProps) {
  const router = useRouter();

  return (
    <Dialog.Root open onOpenChange={(next) => !next && router.push(closeHref)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col bg-canvas text-ink sm:left-1/2 sm:top-1/2 sm:h-[min(92dvh,820px)] sm:w-[min(94vw,68rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:border-border sm:bg-surface sm:shadow-raised">
          <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-6 sm:px-7 sm:py-7">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Profile and preferences
              </Dialog.Title>
              <Dialog.Description className="text-sm leading-6 text-ink-muted">
                Manage your profile, password, linked accounts, and notifications.
              </Dialog.Description>
            </div>

            <Button variant="ghost" size="icon" aria-label="Close settings" onClick={() => router.push(closeHref)}>
              <IconX className="h-5 w-5" stroke={1.75} />
            </Button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col sm:flex-row sm:overflow-hidden">
            <div className="border-b border-border px-5 py-4 sm:hidden">
              <nav className="grid w-full grid-cols-4 gap-1 rounded-md border border-border bg-surface p-1">
                {TABS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.value} href={`/dashboard/settings/${item.value}`} className="outline-none">
                      <span className={cn(tabClassName(tab === item.value), "justify-center px-2 text-xs")}>
                        <Icon className="h-4 w-4 shrink-0" stroke={1.75} />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <nav className="hidden w-64 shrink-0 flex-col gap-1.5 border-r border-border bg-surface px-4 py-6 sm:flex">
              {TABS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.value} href={`/dashboard/settings/${item.value}`} className="w-full text-left outline-none">
                    <span className={tabClassName(tab === item.value)}>
                      <Icon className="h-4 w-4 shrink-0" stroke={1.75} />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-9 sm:py-9">
              {tab === "profile" ? <ProfileSection user={user} /> : null}
              {tab === "password" ? <PasswordSection user={user} /> : null}
              {tab === "connections" ? <ConnectionsSection user={user} /> : null}
              {tab === "notifications" ? <NotificationsSection /> : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
