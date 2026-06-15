"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconKey,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu2,
  IconShieldCheck,
  IconX,
} from "@tabler/icons-react";

import Tooltip from "@/components/ui/tooltip";
import { useEmailPrivacy } from "@/hooks/use-email-privacy";
import { cn } from "@/lib/cn";
import type { User } from "@/lib/types";
import { useUiStore } from "@/stores/ui-store";

interface DashboardNavProps {
  user: User;
  initialCollapsed: boolean;
}

const LINKS = [
  { href: "/dashboard", label: "Approvals", icon: IconShieldCheck },
  { href: "/dashboard/tokens", label: "Project tokens", icon: IconKey },
];

const COLLAPSE_KEY = "aa.sidebar.collapsed";

export default function DashboardNav({ user, initialCollapsed }: DashboardNavProps) {
  const pathname = usePathname();
  const setSettingsOpen = useUiStore((state) => state.setSettingsOpen);
  const setSettingsTab = useUiStore((state) => state.setSettingsTab);
  const { displayEmail } = useEmailPrivacy(user.email);
  // Seeded from a cookie read on the server, so the very first render —
  // server HTML included — already matches the remembered preference.
  // No client-side sync step means no flash and nothing to animate on load.
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      document.cookie = `${COLLAPSE_KEY}=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
      return next;
    });
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleCollapsed();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


  const initial = user.email.charAt(0).toUpperCase();
  const isCollapsed = collapsed;

  const labelClasses = cn(
    "overflow-hidden whitespace-nowrap transition-[width,opacity,margin] duration-300 ease-in-out",
    isCollapsed ? "lg:ml-0 lg:w-0 lg:opacity-0" : "ml-3 w-auto opacity-100",
  );

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div className="inline-flex items-center gap-2 font-semibold tracking-tight text-ink">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-accent-ink">AA</span>
          AA
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
        >
          <IconMenu2 className="h-5 w-5" stroke={1.75} />
        </button>
      </header>

      {mobileOpen ? (
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] transition-opacity lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface px-4 py-6 transition-transform duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:py-6 lg:transition-[width] lg:duration-300 lg:ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-[76px] lg:px-3" : "lg:w-64",
        )}
      >
        <div
          className={cn(
            "flex items-center px-1",
            isCollapsed && "lg:flex-col lg:items-center lg:gap-3 lg:px-0",
          )}
        >
          <div className="flex min-w-0 items-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-ink">
              A
            </span>
              <span className={cn(labelClasses, "text-sm font-semibold tracking-tight text-ink")}>AA</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink lg:hidden"
          >
            <IconX className="h-[18px] w-[18px]" stroke={1.75} />
          </button>
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={`${collapsed ? "Expand" : "Collapse"} sidebar (⌘B)`}
            className={cn(
              "hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink lg:flex",
              isCollapsed ? "lg:ml-0" : "ml-auto",
            )}
          >
            {collapsed ? (
              <IconLayoutSidebarLeftExpand className="h-[18px] w-[18px]" stroke={1.75} />
            ) : (
              <IconLayoutSidebarLeftCollapse className="h-[18px] w-[18px]" stroke={1.75} />
            )}
          </button>
        </div>

        <nav className={cn("mt-8 flex flex-col gap-1", isCollapsed && "lg:items-center")}>
          {LINKS.map((link) => {
            const active = link.href === "/dashboard" ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            const linkEl = (
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isCollapsed ? "lg:h-10 lg:w-10 lg:justify-center lg:p-0" : undefined,
                  active ? "bg-surface-raised text-ink" : "text-ink-muted hover:bg-surface-raised hover:text-ink",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" stroke={1.75} />
                <span className={cn(labelClasses, isCollapsed && "lg:ml-0")}>{link.label}</span>
              </Link>
            );

            return isCollapsed ? (
              <Tooltip key={link.href} label={link.label} side="right">
                {linkEl}
              </Tooltip>
            ) : (
              <div key={link.href}>{linkEl}</div>
            );
          })}
        </nav>

        <div className={cn("mt-auto space-y-1 border-t border-border pt-4", isCollapsed && "lg:flex lg:flex-col lg:items-center")}>
          {(() => {
            const backBtn = (
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink",
                  isCollapsed ? "lg:h-10 lg:w-10 lg:justify-center lg:p-0" : undefined,
                )}
              >
                <IconArrowLeft className="h-[18px] w-[18px] shrink-0" stroke={1.75} />
                <span className={cn(labelClasses, isCollapsed && "lg:ml-0")}>Back to website</span>
              </Link>
            );
            return isCollapsed ? (
              <Tooltip label="Back to website" side="right">
                {backBtn}
              </Tooltip>
            ) : (
              backBtn
            );
          })()}

          {(() => {
            const profileBtn = (
              <button
                type="button"
                onClick={() => {
                  setSettingsTab("profile");
                  setSettingsOpen(true);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex w-full items-center rounded-md px-1 py-2 text-left transition-colors hover:bg-surface-raised",
                  isCollapsed ? "lg:h-10 lg:w-10 lg:justify-center lg:p-0" : undefined,
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-sm font-medium text-ink">
                  {initial}
                </span>
                <div className={cn(labelClasses, "min-w-0 flex-1", isCollapsed && "lg:ml-0 lg:flex-none")}>
                  <p className="truncate text-sm font-medium text-ink">{displayEmail}</p>
                  <p className="text-xs text-ink-faint">Operator</p>
                </div>
              </button>
            );

            return isCollapsed ? (
              <Tooltip label="Profile settings" side="right">
                {profileBtn}
              </Tooltip>
            ) : (
              profileBtn
            );
          })()}
        </div>
      </aside>
    </>
  );
}
