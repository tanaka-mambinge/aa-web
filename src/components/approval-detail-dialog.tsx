"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { useApprovals } from "@/hooks/use-approvals";
import { apiRequest } from "@/lib/http";
import { formatRelativeTime } from "@/lib/format";
import type { Approval } from "@/lib/types";

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
  approvalId: string;
  closeHref: string;
}

export default function ApprovalDetailDialog({ approvalId, closeHref }: ApprovalDetailDialogProps) {
  const router = useRouter();
  const { data, isLoading, mutate } = useApprovals();
  const approval = data?.approvals.find((item) => item.id === approvalId) ?? null;
  const detailEntries = approval
    ? [
        ["Action", approval.action],
        ["Created", formatRelativeTime(approval.created_at)],
        ...(approval.updated_at !== approval.created_at ? [["Updated", formatRelativeTime(approval.updated_at)]] : []),
        ...Object.entries(approval.extra).map(([key, value]) => [formatLabel(key), formatExtraValue(value)]),
      ]
    : [];

  async function resolve(status: "approve" | "reject" | "cancel") {
    if (!approval) return;
    const nextStatus = status === "approve" ? "approved" : status === "reject" ? "rejected" : "cancelled";

    await mutate(
      async (current) => {
        const updated = await apiRequest<Approval>(`/approvals/${approval.id}/${status}`, { method: "POST" });
        if (!current) return current;
        return { approvals: current.approvals.map((item) => (item.id === updated.id ? updated : item)) };
      },
      {
        optimisticData: (current) => ({
          approvals: (current?.approvals ?? []).map((item) =>
            item.id === approval.id ? { ...item, status: nextStatus } : item,
          ),
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      },
    );

    router.push(closeHref);
  }

  return (
    <Dialog.Root open onOpenChange={(next) => !next && router.push(closeHref)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col bg-canvas text-ink sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[min(94dvh,900px)] sm:w-[min(94vw,48rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:border-border sm:bg-surface sm:shadow-raised">
          {isLoading ? (
            <div className="flex h-full items-center justify-center px-6 py-8 text-sm text-ink-muted">Loading approval…</div>
          ) : approval ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-6 sm:px-6 sm:py-7">
                <div className="min-w-0 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Dialog.Title className="text-2xl font-semibold tracking-tight text-ink">{approval.title}</Dialog.Title>
                    <div className="flex items-center gap-2">
                      <Badge tone={approval.status === "pending" ? "pending" : approval.status} className="capitalize">
                        {formatLabel(approval.status)}
                      </Badge>
                      <Badge tone={approval.risk} className="capitalize">{approval.risk}</Badge>
                    </div>
                  </div>
                  <Dialog.Description className="max-w-[58ch] text-sm leading-6 text-ink-muted">
                    {approval.summary}
                  </Dialog.Description>
                </div>
                <Button variant="ghost" size="icon" aria-label="Close approval review" onClick={() => router.push(closeHref)}>
                  <IconX className="h-5 w-5" stroke={1.75} />
                </Button>
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

              {approval.status === "pending" ? (
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
          ) : (
            <div className="flex h-full flex-col items-start justify-between gap-6 px-6 py-8">
              <div className="space-y-2">
                <Dialog.Title className="text-2xl font-semibold tracking-tight text-ink">Approval not found</Dialog.Title>
                <Dialog.Description className="text-sm leading-6 text-ink-muted">
                  This approval is no longer available.
                </Dialog.Description>
              </div>
              <Button onClick={() => router.push(closeHref)}>Back to approvals</Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
