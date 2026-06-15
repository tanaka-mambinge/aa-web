"use client";

import { IconBell, IconX } from "@tabler/icons-react";

import { useUiStore } from "@/stores/ui-store";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export default function PushNotificationsBanner() {
  const setSettingsOpen = useUiStore((state) => state.setSettingsOpen);
  const setSettingsTab = useUiStore((state) => state.setSettingsTab);
  const { status, supported, configured, subscribed, pref, permission, message, dismiss } = usePushNotifications();

  if (status === "loading" || !supported || !configured || permission === "denied" || subscribed || pref !== "unset") {
    return null;
  }

  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-raised">
          <IconBell className="h-5 w-5 text-ink-muted" stroke={1.75} />
        </span>
        <div>
          <p className="text-sm font-medium text-ink">Desktop notifications</p>
          <p className="mt-1 text-sm leading-6 text-ink-muted">{message}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 sm:self-center">
        <Button
          variant="secondary"
          onClick={() => {
            setSettingsTab("notifications");
            setSettingsOpen(true);
          }}
        >
          Open settings
        </Button>
        <Button
          variant="ghost"
          onClick={() => dismiss()}
        >
          <IconX className="h-4 w-4" />
          Dismiss
        </Button>
      </div>
    </Card>
  );
}
