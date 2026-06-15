"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useMemo, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { z } from "zod";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { useHashDialog } from "@/hooks/use-hash-modal";
import { apiRequest } from "@/lib/http";
import type { CliToken, CliTokenCreateResponse } from "@/lib/types";
import { useUiStore } from "@/stores/ui-store";

const schema = z.object({
  name: z.string().min(1, "Project name is required"),
  expiresInDays: z.string(),
});

const EXPIRY_OPTIONS = [
  { value: "", label: "Never" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
];

interface CreateTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => Promise<CliToken[] | undefined>;
}

export default function CreateTokenDialog({ open, onOpenChange, onCreated }: CreateTokenDialogProps) {
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("30");
  const [error, setError] = useState<string | null>(null);
  const setCreatedToken = useUiStore((state) => state.setCreatedToken);
  const { requestClose } = useHashDialog("create-token", open, () => onOpenChange(false));

  const parsedDays = useMemo(() => {
    if (!expiresInDays.trim()) return null;
    return Number(expiresInDays);
  }, [expiresInDays]);

  async function submit() {
    const result = schema.safeParse({ name, expiresInDays });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    try {
      setError(null);
      const token = await apiRequest<CliTokenCreateResponse>("/cli-tokens", {
        method: "POST",
        body: JSON.stringify({
          name,
          expires_in_days: parsedDays,
        }),
      });
      setCreatedToken(token);
      await onCreated();
      setName("");
      setExpiresInDays("30");
      onOpenChange(false);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Failed to create token");
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && requestClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col bg-canvas text-ink sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[90dvh] sm:w-[min(92vw,32rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border sm:border-border sm:bg-surface sm:shadow-raised">
          <div className="flex items-start justify-between gap-5 border-b border-border px-5 py-6 sm:px-6 sm:py-7">
            <div className="space-y-2">
              <Dialog.Title className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">Create project token</Dialog.Title>
              <Dialog.Description className="text-sm leading-6 text-ink-muted">
                The raw token is shown once. Set it as <code className="font-mono text-ink">AA_TOKEN</code> in
                that project&apos;s environment.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                <IconX className="h-5 w-5" stroke={1.75} />
              </button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-6 sm:py-8">
            <div className="space-y-5">
              <Input label="Project name" value={name} onChange={(event) => setName(event.target.value)} error={error ?? undefined} placeholder="billing-service" />
              <div className="space-y-2">
                <span className="text-sm font-medium text-ink-muted">Expires in</span>
                <Select aria-label="Expires in" className="w-full" value={expiresInDays} onValueChange={setExpiresInDays} options={EXPIRY_OPTIONS} />
              </div>
            </div>
          </div>
          <div className="mt-auto flex gap-3 border-t border-border px-5 py-5 sm:px-6">
            <Button onClick={() => void submit()}>Create project token</Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
