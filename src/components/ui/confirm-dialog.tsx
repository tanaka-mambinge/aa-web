"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  /** If set, the confirm button stays disabled until the user types this value exactly. */
  confirmationText?: string;
  onConfirm: () => Promise<void> | void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  confirmationText,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState("");

  const requiresTypedConfirmation = Boolean(confirmationText);
  const confirmDisabled = pending || (requiresTypedConfirmation && typedConfirmation !== confirmationText);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setTypedConfirmation("");
        }
        if (!pending) {
          onOpenChange(next);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-6 text-ink shadow-raised">
          <div className="space-y-2">
            <Dialog.Title className="text-lg font-semibold tracking-tight text-ink">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="text-sm leading-6 text-ink-muted">{description}</Dialog.Description>
            ) : null}
          </div>
          {requiresTypedConfirmation ? (
            <div className="mt-4">
              <Input
                label={`Type "${confirmationText}" to confirm`}
                value={typedConfirmation}
                onChange={(event) => setTypedConfirmation(event.target.value)}
                autoComplete="off"
                autoFocus
              />
            </div>
          ) : null}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" disabled={pending} onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button variant={variant === "danger" ? "soft-danger" : "primary"} disabled={confirmDisabled} onClick={() => void handleConfirm()}>
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
