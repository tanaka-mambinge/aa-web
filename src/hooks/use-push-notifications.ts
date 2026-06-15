"use client";

import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

import { apiRequest } from "@/lib/http";

type PushPref = "enabled" | "dismissed" | "unset";
type PushStatus =
  | "loading"
  | "idle"
  | "subscribing"
  | "enabled"
  | "denied"
  | "unsupported"
  | "missing-key"
  | "error";

interface PushConfig {
  enabled: boolean;
  public_key: string | null;
}

interface PushState {
  supported: boolean;
  configured: boolean;
  publicKey: string | null;
  subscribed: boolean;
  permission: NotificationPermission | "unsupported" | null;
  status: PushStatus;
  message: string;
}

const STORAGE_KEY = "aap.notifications.pref";
const SWR_KEY = "push-notification-state";

function supportsPush() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function readPref(): PushPref {
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "enabled" || value === "dismissed") {
    return value;
  }
  return "unset";
}

function writePref(pref: PushPref) {
  window.localStorage.setItem(STORAGE_KEY, pref);
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

async function loadPushState(): Promise<PushState> {
  if (!supportsPush()) {
    return {
      supported: false,
      configured: false,
      publicKey: null,
      subscribed: false,
      permission: "unsupported",
      status: "unsupported",
      message: "This browser does not support push notifications.",
    };
  }

  const permission = Notification.permission;

  try {
    const config = await apiRequest<PushConfig>("/push-config", { method: "GET" });

    if (!config.enabled || !config.public_key) {
      return {
        supported: true,
        configured: false,
        publicKey: null,
        subscribed: false,
        permission,
        status: "missing-key",
        message: "Push notifications are not configured yet.",
      };
    }

    if (permission === "denied") {
      return {
        supported: true,
        configured: true,
        publicKey: config.public_key,
        subscribed: false,
        permission,
        status: "denied",
        message: "Notifications are blocked for this site.",
      };
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    const subscribed = Boolean(subscription);

    return {
      supported: true,
      configured: true,
      publicKey: config.public_key,
      subscribed,
      permission,
      status: subscribed ? "enabled" : "idle",
      message: subscribed
        ? "This browser will get approval alerts."
        : "Notify this browser when new approval requests arrive.",
    };
  } catch {
    return {
      supported: true,
      configured: false,
      publicKey: null,
      subscribed: false,
      permission,
      status: "error",
      message: "Failed to load push configuration.",
    };
  }
}

async function syncSubscription(publicKey: string, permission: NotificationPermission): Promise<PushState> {
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  await apiRequest("/push-subscriptions", {
    method: "POST",
    body: JSON.stringify(subscription.toJSON()),
  });

  return {
    supported: true,
    configured: true,
    publicKey,
    subscribed: true,
    permission,
    status: "enabled",
    message: "This browser will get approval alerts.",
  };
}

export function usePushNotifications() {
  const [pref, setPrefState] = useState<PushPref>(() => (typeof window === "undefined" ? "unset" : readPref()));
  const [pending, setPending] = useState<string | null>(null);

  const { data, mutate } = useSWR(typeof window === "undefined" ? null : SWR_KEY, loadPushState, {
    revalidateOnFocus: false,
  });

  const setPref = useCallback((nextPref: PushPref) => {
    setPrefState(nextPref);
    writePref(nextPref);
  }, []);

  useEffect(() => {
    if (!data) return;
    if (data.subscribed) {
      if (readPref() !== "dismissed") {
        setPref("enabled");
      }
    } else if (readPref() === "enabled") {
      setPref("unset");
    }
  }, [data?.subscribed, setPref]);

  const enable = useCallback(async () => {
    if (!data) return;

    if (!data.supported) {
      await mutate({ ...data, status: "unsupported", message: "This browser does not support push notifications." }, { revalidate: false });
      return;
    }

    if (!data.configured || !data.publicKey) {
      await mutate({ ...data, status: "missing-key", message: "Push notifications are not configured yet." }, { revalidate: false });
      return;
    }

    setPending("Requesting notification permission…");

    try {
      const permissionValue =
        Notification.permission === "granted" ? "granted" : await Notification.requestPermission();

      if (permissionValue !== "granted") {
        setPending(null);
        await mutate(
          {
            ...data,
            permission: permissionValue,
            status: permissionValue === "denied" ? "denied" : "idle",
            message: "Notification permission was not granted.",
          },
          { revalidate: false },
        );
        return;
      }

      setPending("Enabling notifications…");
      const next = await syncSubscription(data.publicKey, permissionValue);
      setPref("enabled");
      setPending(null);
      await mutate(next, { revalidate: false });
    } catch (error) {
      setPending(null);
      await mutate(
        { ...data, status: "error", message: error instanceof Error ? error.message : "Failed to enable notifications." },
        { revalidate: false },
      );
    }
  }, [data, mutate, setPref]);

  const refresh = useCallback(async () => {
    if (!data) return;

    if (!data.supported) {
      await mutate({ ...data, status: "unsupported", message: "This browser does not support push notifications." }, { revalidate: false });
      return;
    }

    if (!data.configured || !data.publicKey) {
      await mutate({ ...data, status: "missing-key", message: "Push notifications are not configured yet." }, { revalidate: false });
      return;
    }

    if (Notification.permission === "denied") {
      await mutate({ ...data, permission: "denied", status: "denied", message: "Notifications are blocked for this site." }, { revalidate: false });
      return;
    }

    setPending("Refreshing notification subscription…");

    try {
      const next = await syncSubscription(data.publicKey, Notification.permission);
      setPref("enabled");
      setPending(null);
      await mutate(next, { revalidate: false });
    } catch (error) {
      setPending(null);
      await mutate(
        { ...data, status: "error", message: error instanceof Error ? error.message : "Failed to refresh subscription." },
        { revalidate: false },
      );
    }
  }, [data, mutate, setPref]);

  const disable = useCallback(async () => {
    if (data?.supported) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        await subscription?.unsubscribe();
      } catch {
        // Ignore local unsubscribe errors and still clear the state below.
      }
    }

    setPref("dismissed");

    if (data) {
      await mutate(
        { ...data, subscribed: false, status: "idle", message: "Notifications are turned off in this browser." },
        { revalidate: false },
      );
    }
  }, [data, mutate, setPref]);

  const dismiss = useCallback(() => {
    setPref("dismissed");
  }, [setPref]);

  const status: PushStatus = pending ? "subscribing" : data?.status ?? "loading";
  const message = pending ?? data?.message ?? "Loading notification settings…";

  return {
    status,
    supported: data?.supported ?? false,
    configured: data?.configured ?? false,
    subscribed: data?.subscribed ?? false,
    pref,
    permission: data?.permission ?? null,
    message,
    enable,
    disable,
    dismiss,
    refresh,
  };
}
