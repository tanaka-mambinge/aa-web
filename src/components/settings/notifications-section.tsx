"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/use-push-notifications";

function getTone(status: ReturnType<typeof usePushNotifications>["status"], subscribed: boolean) {
  if (status === "enabled" || subscribed) {
    return "approved";
  }
  if (status === "denied" || status === "unsupported" || status === "missing-key" || status === "error") {
    return "rejected";
  }
  return "cancelled";
}

export default function NotificationsSection() {
  const notifications = usePushNotifications();
  const {
    status,
    supported,
    configured,
    subscribed,
    pref,
    permission,
    message,
    enable,
    disable,
    refresh,
  } = notifications;

  const disabled = !supported || !configured || status === "subscribing";

  return (
    <section className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">Notifications</h2>
        <p className="max-w-xl text-sm leading-7 text-ink-muted">Control push alerts for this browser.</p>
      </div>

      <Card className="space-y-6 p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={getTone(status, subscribed)}>
            {subscribed || status === "enabled"
              ? "Enabled"
              : status === "denied"
                ? "Blocked"
                : status === "unsupported"
                  ? "Unsupported"
                  : status === "missing-key"
                    ? "Not configured"
                    : pref === "dismissed"
                      ? "Dismissed"
                      : "Off"}
          </Badge>
          <span className="text-sm text-ink-muted">
            Permission: {permission ?? "default"}
          </span>
        </div>

        <p className="max-w-xl text-sm leading-7 text-ink-muted">{message}</p>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void enable()} disabled={disabled || status === "enabled" || subscribed}>
            Enable
          </Button>
          <Button variant="secondary" onClick={() => void refresh()} disabled={disabled}>
            Refresh
          </Button>
          <Button variant="danger" onClick={() => void disable()} disabled={disabled && !subscribed}>
            Disable
          </Button>
        </div>
      </Card>
    </section>
  );
}
