"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconCopy } from "@tabler/icons-react";

import Button from "@/components/ui/button";
import { useHashDialog } from "@/hooks/use-hash-modal";
import { useUiStore } from "@/stores/ui-store";

export default function TokenRevealDialog() {
  const createdToken = useUiStore((state) => state.createdToken);
  const setCreatedToken = useUiStore((state) => state.setCreatedToken);
  const { requestClose } = useHashDialog("token-created", Boolean(createdToken), () => setCreatedToken(null));

  return (
    <Dialog.Root open={Boolean(createdToken)} onOpenChange={(open) => !open && requestClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-canvas/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 text-ink">
          {createdToken ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Dialog.Title className="text-2xl font-semibold text-ink">Token created</Dialog.Title>
                <Dialog.Description className="text-sm leading-7 text-ink-muted">
                  Copy this token now. It will not be shown again.
                </Dialog.Description>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-raised py-2 pl-4 pr-2">
                <p className="flex-1 truncate font-mono text-sm text-ink">{createdToken.token}</p>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(createdToken.token)}
                  aria-label="Copy token"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-canvas transition-colors hover:bg-ink/90"
                >
                  <IconCopy className="h-4 w-4" stroke={1.75} />
                </button>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setCreatedToken(null)}>Close</Button>
              </div>
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
