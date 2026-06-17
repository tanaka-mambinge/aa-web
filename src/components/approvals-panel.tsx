"use client";

import { useMemo } from "react";
import { IconAdjustmentsHorizontal, IconShieldCheck } from "@tabler/icons-react";
import Link from "next/link";

import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import Select from "@/components/ui/select";
import { useApprovals } from "@/hooks/use-approvals";
import { useCliTokens } from "@/hooks/use-cli-tokens";
import { cn } from "@/lib/cn";
import { formatRelativeTime } from "@/lib/format";
import type { Approval } from "@/lib/types";
import { useUiStore } from "@/stores/ui-store";

const FILTERS = ["all", "pending", "approved", "rejected", "cancelled", "timed_out"] as const;

const STATUS_STYLE: Record<Approval["status"], { dot: string; text: string; label: string }> = {
  pending: { dot: "bg-warning", text: "text-warning", label: "Pending" },
  approved: { dot: "bg-success", text: "text-success", label: "Approved" },
  rejected: { dot: "bg-danger", text: "text-danger", label: "Rejected" },
  cancelled: { dot: "bg-ink-faint", text: "text-ink-faint", label: "Cancelled" },
  timed_out: { dot: "bg-attention", text: "text-attention", label: "Timed out" },
};

export default function ApprovalsPanel() {
  const { data: approvalData, isLoading: approvalsLoading } = useApprovals();
  const { data: tokens } = useCliTokens();
  const filter = useUiStore((state) => state.approvalFilter);
  const setFilter = useUiStore((state) => state.setApprovalFilter);
  const cliFilter = useUiStore((state) => state.approvalCliFilter);
  const setCliFilter = useUiStore((state) => state.setApprovalCliFilter);

  const cliOptions = useMemo(() => {
    const options = [{ value: "all", label: "All projects" }];
    for (const token of tokens ?? []) {
      options.push({ value: token.id, label: token.name });
    }
    if ((tokens ?? []).length > 0) {
      options.push({ value: "none", label: "No project" });
    }
    return options;
  }, [tokens]);

  const filteredApprovals = useMemo(() => {
    const approvals = approvalData?.approvals ?? [];
    return approvals.filter((approval) => {
      if (filter !== "all" && approval.status !== filter) return false;
      if (cliFilter === "none" && approval.cli_token_id) return false;
      if (cliFilter !== "all" && cliFilter !== "none" && approval.cli_token_id !== cliFilter) return false;
      return true;
    });
  }, [approvalData?.approvals, filter, cliFilter]);

  const pendingCount = useMemo(() => {
    const approvals = approvalData?.approvals ?? [];
    return approvals.filter((approval) => approval.status === "pending").length;
  }, [approvalData?.approvals]);

  const activeFilterCount = (filter !== "pending" ? 1 : 0) + (cliFilter !== "all" ? 1 : 0);

  const statusOptions = useMemo(
    () =>
      FILTERS.map((item) => ({
        value: item,
        label:
          item
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") + (item === "pending" && pendingCount > 0 ? ` (${pendingCount})` : ""),
      })),
    [pendingCount],
  );

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Approval operations</h1>
        <p className="max-w-xl text-sm leading-7 text-ink-muted">
          Review requests and act on pending approvals from operators and integrations.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink">Requests</h2>
          <Link href="/dashboard/filters" className="inline-flex items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-raised sm:hidden">
            <IconAdjustmentsHorizontal className="h-4 w-4" stroke={1.75} />
            Filters
            {activeFilterCount > 0 ? (
              <span className="rounded-full bg-ink px-1.5 text-[10px] font-semibold text-canvas tabular-nums">
                {activeFilterCount}
              </span>
            ) : null}
          </Link>
          <div className="hidden items-center gap-3 sm:flex">
            {cliOptions.length > 1 ? (
              <Select
                aria-label="Filter by project"
                label="Project:"
                size="sm"
                value={cliFilter}
                onValueChange={setCliFilter}
                options={cliOptions}
              />
            ) : null}
            <Select
              aria-label="Filter by status"
              label="Status:"
              size="sm"
              value={filter}
              onValueChange={(value) => setFilter(value as typeof filter)}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="space-y-4">
          {approvalsLoading ? (
            <Card className="px-5 py-8 text-center text-sm text-ink-muted">Loading approvals…</Card>
          ) : filteredApprovals.length === 0 ? (
            <Card className="px-5 py-8 text-center text-sm text-ink-muted">
              No approvals match the current filter.
            </Card>
          ) : (
            filteredApprovals.map((approval) => (
              <Card
                key={approval.id}
                className={cn(
                  "p-6 transition-shadow hover:shadow-raised",
                  approval.status === "pending" && "border-border-strong",
                )}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", STATUS_STYLE[approval.status].text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_STYLE[approval.status].dot)} />
                        {STATUS_STYLE[approval.status].label}
                      </span>
                      <Badge tone={approval.risk} className="capitalize">{approval.risk}</Badge>
                      <span className="font-mono text-xs tabular-nums text-ink-faint">{formatRelativeTime(approval.created_at)}</span>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-medium text-ink">{approval.title}</h3>
                      <p className="text-sm leading-6 text-ink-muted">{approval.summary}</p>
                    </div>
                    <p className="font-mono text-xs text-ink-faint">{approval.action}</p>
                  </div>
                  <Link
                    href={`/dashboard/approvals/${approval.id}`}
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                      approval.status === "pending"
                        ? "border border-accent bg-accent text-accent-ink hover:bg-accent-strong hover:border-accent-strong"
                        : "border border-border-strong bg-surface text-ink hover:bg-surface-raised",
                    )}
                  >
                    <IconShieldCheck className="h-4 w-4" />
                    {approval.status === "pending" ? "Review" : "Inspect"}
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
