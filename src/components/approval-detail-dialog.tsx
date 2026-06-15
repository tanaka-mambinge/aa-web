"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";

import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { useHashDialog } from "@/hooks/use-hash-modal";
import { apiRequest } from "@/lib/http";
import { formatRelativeTime } from "@/lib/format";
import type { Approval, ApprovalListResponse } from "@/lib/types";
import { useUiStore } from "@/stores/ui-store";

function formatLabel(value: string) {
  return value.replace(/_/g, " ");
}

function formatExtraValue(value: unknown) {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

interface ApprovalDetailDialogProps {
  onMutate: (
    data: (current: ApprovalListResponse | undefined) => Promise<ApprovalListResponse | undefined>,
    opts: {
      optimisticData: (current: ApprovalListResponse | undefined) => ApprovalListResponse;
      rollbackOnError: boolean;
      populateCache: boolean;
      revalidate: boolean;
    },
  ) => Promise<ApprovalListResponse | undefined>;
}

export default function ApprovalDetailDialog({ onMutate }: ApprovalDetailDialogProps) {
  const selectedApproval = useUiStore((state) => state.selectedApproval);
  const setSelectedApproval = useUiStore((state) => state.setSelectedApproval);
  const { requestClose } = useHashDialog("approval", Boolean(selectedApproval), () => setSelectedApproval(null));
  const detailEntries = selectedApproval
    ? [
        ["Action", selectedApproval.action],
        ["Created", formatRelativeTime(selectedApproval.created_at)],
        ...(selectedApproval.updated_at !== selectedApproval.created_at
          ? [["Updated", formatRelativeTime(selectedApproval.updated_at)]]
          : []),
        ...Object.entries(selectedApproval.extra).map(([key, value]) => [formatLabel(key), formatExtraValue(value)]),
      ]
    : [];

  async function resolve(status: "approve" | "reject" | "cancel") {
    if (!selectedApproval) return;
    const nextStatus = status === "approve" ? "approved" : status === "reject" ? "rejected" : "cancelled";
    const approvalId = selectedApproval.id;
    setSelectedApproval(null);
    await onMutate(
      async (current) => {
        const updated = await apiRequest<Approval>(`/approvals/${approvalId}/${status}`, { method: "POST" });
        if (!current) return current;
        return { approvals: current.approvals.map((approval) => (approval.id === updated.id ? updated : approval)) };
      },
      {
        optimisticData: (current) => ({
          approvals: (current?.approvals ?? []).map((approval) =>
            approval.id === approvalId ? { ...approval, status: nextStatus } : approval,
          ),
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    );
  }

  return (
    <Dialog.Root open={Boolean(selectedApproval)} onOpenChange={(open) => !open && requestClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col bg-canvas text-ink sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[min(94dvh,900px)] sm:w-[min(94vw,48rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:border-border sm:bg-surface sm:shadow-raised">
          {selectedApproval ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-6 sm:px-6 sm:py-7">
                <div className="min-w-0 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Dialog.Title className="text-2xl font-semibold tracking-tight text-ink">
                      {selectedApproval.title}
                    </Dialog.Title>
                    <div className="flex items-center gap-2">
                      <Badge tone={selectedApproval.status === "pending" ? "pending" : selectedApproval.status} className="capitalize">{formatLabel(selectedApproval.status)}</Badge>
                      <Badge tone={selectedApproval.risk} className="capitalize">{selectedApproval.risk}</Badge>
                    </div>
                  </div>
                  <Dialog.Description className="max-w-[58ch] text-sm leading-6 text-ink-muted">
                    {selectedApproval.summary}
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close approval review"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                  >
                    <IconX className="h-5 w-5" stroke={1.75} />
                  </button>
                </Dialog.Close>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-6 sm:py-8">
                <dl className="divide-y divide-border">
                  {detailEntries.map(([key, value]) => (
                    <div key={key} className="grid gap-1.5 py-4 text-sm first:pt-0 last:pb-0 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <dt className="text-ink-muted">{key}</dt>
                      <dd className="min-w-0 break-words text-ink sm:text-right">
                        <span className={key === "Action" ? "font-mono" : undefined}>{value}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {selectedApproval.status === "pending" ? (
                <div className="mt-auto border-t border-border px-5 py-5 sm:px-6">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="ghost" onClick={() => void resolve("cancel")}>Cancel</Button>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                      <Button variant="danger" onClick={() => void resolve("reject")}>Reject</Button>
                      <Button onClick={() => void resolve("approve")}>Approve</Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
