import { redirect } from "next/navigation";

import SettingsDialog from "@/components/settings-dialog";
import { getServerUser } from "@/lib/server-auth";

const TABS = new Set(["profile", "password", "connections", "notifications"]);

export default async function SettingsModalPage({
  params,
}: {
  params: Promise<{ tab: string }>;
}) {
  const user = await getServerUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { tab } = await params;
  if (!TABS.has(tab)) {
    redirect("/dashboard/settings/profile");
  }

  return <SettingsDialog user={user} tab={tab as "profile" | "password" | "connections" | "notifications"} closeHref="/dashboard" />;
}
