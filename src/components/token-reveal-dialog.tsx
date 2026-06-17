"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IconCopy, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import { useUiStore } from "@/stores/ui-store";

interface TokenRevealDialogProps {
  closeHref: string;
}

export default function TokenRevealDialog({ closeHref }: TokenRevealDialogProps) {
  const router = useRouter();
  const createdToken = useUiStore((state) => state.createdToken);
  const setCreatedToken = useUiStore((state) => state.setCreatedToken);

  return (
    <Dialog.Root open onOpenChange={(next) => !next && router.push(closeHref)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 text-ink shadow-raised">
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
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCreatedToken(null);
                    router.push(closeHref);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Dialog.Title className="text-2xl font-semibold text-ink">No token to reveal</Dialog.Title>
                <Dialog.Description className="text-sm leading-7 text-ink-muted">
                  Create a token first.
                </Dialog.Description>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  router.push(closeHref);
                }}
              >
                <IconX className="h-4 w-4" />
                Back
              </Button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
