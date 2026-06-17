"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { IconBell, IconLink, IconLock, IconUser, IconX } from "@tabler/icons-react";

import ConnectionsSection from "@/components/settings/connections-section";
import NotificationsSection from "@/components/settings/notifications-section";
import PasswordSection from "@/components/settings/password-section";
import ProfileSection from "@/components/settings/profile-section";
import { useHashDialog } from "@/hooks/use-hash-modal";
import { cn } from "@/lib/cn";
import type { User } from "@/lib/types";
import { useUiStore } from "@/stores/ui-store";

interface SettingsDialogProps {
  user: User;
}

const TABS = [
  { value: "profile", label: "Profile", icon: IconUser },
  { value: "password", label: "Password", icon: IconLock },
  { value: "connections", label: "Connections", icon: IconLink },
  { value: "notifications", label: "Notifications", icon: IconBell },
] as const;

function tabClassName(active: boolean) {
  return cn(
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
    active ? "bg-surface-raised text-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink",
  );
}

export default function SettingsDialog({ user }: SettingsDialogProps) {
  const open = useUiStore((state) => state.settingsOpen);
  const tab = useUiStore((state) => state.settingsTab);
  const setOpen = useUiStore((state) => state.setSettingsOpen);
  const setTab = useUiStore((state) => state.setSettingsTab);
  const { requestClose } = useHashDialog(
    "settings",
    open,
    () => setOpen(false),
    () => setOpen(true),
  );

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && requestClose()}>
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

            <Dialog.Close asChild>
              <button
                aria-label="Close settings"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                <IconX className="h-5 w-5" stroke={1.75} />
              </button>
            </Dialog.Close>
          </div>

          <Tabs.Root value={tab} onValueChange={(value) => setTab(value as typeof tab)} className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-border px-5 py-4 sm:hidden">
              <Tabs.List className="grid w-full grid-cols-4 gap-1 rounded-md border border-border bg-surface p-1">
                {TABS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tabs.Trigger key={item.value} value={item.value} className="outline-none">
                      <span className={cn(tabClassName(tab === item.value), "justify-center px-2 text-xs")}>
                        <Icon className="h-4 w-4 shrink-0" stroke={1.75} />
                        {item.label}
                      </span>
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>
            </div>

            <div className="flex min-h-0 flex-1 sm:overflow-hidden">
              <Tabs.List className="hidden w-64 shrink-0 flex-col gap-1.5 border-r border-border bg-surface px-4 py-6 sm:flex">
                {TABS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Tabs.Trigger key={item.value} value={item.value} className="w-full text-left outline-none">
                      <span className={tabClassName(tab === item.value)}>
                        <Icon className="h-4 w-4 shrink-0" stroke={1.75} />
                        {item.label}
                      </span>
                    </Tabs.Trigger>
                  );
                })}
              </Tabs.List>

              <div className="min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-9 sm:py-9">
                <Tabs.Content value="profile" className="outline-none">
                  <ProfileSection user={user} />
                </Tabs.Content>
                <Tabs.Content value="password" className="outline-none">
                  <PasswordSection user={user} />
                </Tabs.Content>
                <Tabs.Content value="connections" className="outline-none">
                  <ConnectionsSection user={user} />
                </Tabs.Content>
                <Tabs.Content value="notifications" className="outline-none">
                  <NotificationsSection />
                </Tabs.Content>
              </div>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
