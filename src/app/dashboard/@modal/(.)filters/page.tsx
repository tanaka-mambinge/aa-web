"use client";

import { useMemo } from "react";

import ApprovalFilterSheet from "@/components/approval-filter-sheet";
import { useApprovals } from "@/hooks/use-approvals";
import { useCliTokens } from "@/hooks/use-cli-tokens";
import { useUiStore } from "@/stores/ui-store";

const FILTERS = ["all", "pending", "approved", "rejected", "cancelled", "timed_out"] as const;

export default function FiltersModalPage() {
  const { data: approvalData } = useApprovals();
  const { data: tokens } = useCliTokens();
  const filter = useUiStore((state) => state.approvalFilter);
  const setFilter = useUiStore((state) => state.setApprovalFilter);
  const cliFilter = useUiStore((state) => state.approvalCliFilter);
  const setCliFilter = useUiStore((state) => state.setApprovalCliFilter);

  const pendingCount = useMemo(() => {
    const approvals = approvalData?.approvals ?? [];
    return approvals.filter((approval) => approval.status === "pending").length;
  }, [approvalData?.approvals]);

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
    <ApprovalFilterSheet
      statusOptions={statusOptions}
      statusValue={filter}
      onStatusChange={(value) => setFilter(value as typeof filter)}
      cliOptions={cliOptions}
      cliValue={cliFilter}
      onCliChange={setCliFilter}
      closeHref="/dashboard"
    />
  );
}
