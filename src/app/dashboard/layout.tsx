import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardNav from "@/components/dashboard-nav";
import LoadingScreen from "@/components/loading-screen";
import PushNotificationsBanner from "@/components/push-notifications-banner";
import { getServerUser } from "@/lib/server-auth";

export default function DashboardLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  // The auth check reads cookies/headers and does an uncached fetch, so it must
  // live in its own Suspense boundary — otherwise the loading fallback never
  // shows and navigation just blocks while the token is verified.
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthenticatedShell modal={modal}>{children}</AuthenticatedShell>
    </Suspense>
  );
}

async function AuthenticatedShell({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const initialCollapsed = (await cookies()).get("aa.sidebar.collapsed")?.value === "1";

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink lg:flex-row">
      <DashboardNav user={user} initialCollapsed={initialCollapsed} />
      <main className="min-w-0 flex-1 overflow-x-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <PushNotificationsBanner />
          {children}
        </div>
      </main>
      {modal}
    </div>
  );
}
