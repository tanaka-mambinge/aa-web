"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
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
  closeHref: string;
  onCreated: () => Promise<CliToken[] | undefined>;
}

type FormValues = z.infer<typeof schema>;

export default function CreateTokenDialog({ closeHref, onCreated }: CreateTokenDialogProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const setCreatedToken = useUiStore((state) => state.setCreatedToken);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", expiresInDays: "30" },
  });

  async function onSubmit(values: FormValues) {
    try {
      setSubmitError(null);
      const token = await apiRequest<CliTokenCreateResponse>("/cli-tokens", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          expires_in_days: values.expiresInDays.trim() ? Number(values.expiresInDays) : null,
        }),
      });
      setCreatedToken(token);
      await onCreated();
      router.replace("/dashboard/tokens/new/reveal");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to create token");
    }
  }

  return (
    <Dialog.Root open onOpenChange={(next) => !next && router.push(closeHref)}>
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
            <Button variant="ghost" size="icon" aria-label="Close" onClick={() => router.push(closeHref)}>
              <IconX className="h-5 w-5" stroke={1.75} />
            </Button>
          </div>
          <form className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-6 sm:py-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {submitError ? (
                <div className="rounded-md border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
                  {submitError}
                </div>
              ) : null}
              <Input
                label="Project name"
                placeholder="billing-service"
                error={errors.name?.message}
                {...register("name")}
              />
              <div className="space-y-2">
                <span className="text-sm font-medium text-ink-muted">Expires in</span>
                <Controller
                  control={control}
                  name="expiresInDays"
                  render={({ field }) => (
                    <Select aria-label="Expires in" className="w-full" value={field.value} onValueChange={field.onChange} options={EXPIRY_OPTIONS} />
                  )}
                />
              </div>
            </div>
            <div className="mt-8 flex gap-3 border-t border-border pt-5">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating…" : "Create project token"}</Button>
              <Button variant="ghost" type="button" onClick={() => router.push(closeHref)}>Cancel</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
