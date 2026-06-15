"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { apiRequest } from "@/lib/http";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordSection() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  async function onSubmit(values: PasswordFormValues) {
    try {
      setFormError(null);
      setSuccess(null);

      await apiRequest<void>("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: values.current_password,
          new_password: values.new_password,
        }),
      });

      reset();
      setSuccess("Password updated successfully.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to update password");
    }
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">Password</h2>
        <p className="max-w-xl text-sm leading-7 text-ink-muted">Update your password without leaving the console.</p>
      </div>

      <Card as="form" className="space-y-6 p-6 sm:p-7" onSubmit={handleSubmit(onSubmit)}>
        {formError ? (
          <div className="rounded-md border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
            {formError}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-md border border-success/20 bg-success-muted px-4 py-3 text-sm text-success">
            {success}
          </div>
        ) : null}

        <div className="grid gap-5">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            error={errors.current_password?.message}
            {...register("current_password")}
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            error={errors.new_password?.message}
            {...register("new_password")}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            error={errors.confirm_password?.message}
            {...register("confirm_password")}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </Card>
    </section>
  );
}
