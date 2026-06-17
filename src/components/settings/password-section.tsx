"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { apiRequest } from "@/lib/http";
import type { User } from "@/lib/types";

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const setPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((value) => value.new_password === value.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
type SetPasswordValues = z.infer<typeof setPasswordSchema>;

interface PasswordSectionProps {
  user: User;
}

export default function PasswordSection({ user }: PasswordSectionProps) {
  return user.has_password ? <ChangePasswordForm /> : <SetPasswordForm />;
}

function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(values: ChangePasswordValues) {
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
        {formError ? <div className="rounded-md border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">{formError}</div> : null}
        {success ? <div className="rounded-md border border-success/20 bg-success-muted px-4 py-3 text-sm text-success">{success}</div> : null}

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

        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating…" : "Update password"}</Button>
      </Card>
    </section>
  );
}

function SetPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordValues>({ resolver: zodResolver(setPasswordSchema) });

  async function onSubmit(values: SetPasswordValues) {
    try {
      setFormError(null);
      setSuccess(null);

      await apiRequest<void>("/auth/set-password", {
        method: "POST",
        body: JSON.stringify({ new_password: values.new_password }),
      });

      reset();
      setSuccess("Password set successfully.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to set password");
    }
  }

  return (
    <section className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">Password</h2>
        <p className="max-w-xl text-sm leading-7 text-ink-muted">Add a password so you can sign in with email too.</p>
      </div>

      <Card as="form" className="space-y-6 p-6 sm:p-7" onSubmit={handleSubmit(onSubmit)}>
        {formError ? <div className="rounded-md border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">{formError}</div> : null}
        {success ? <div className="rounded-md border border-success/20 bg-success-muted px-4 py-3 text-sm text-success">{success}</div> : null}

        <div className="grid gap-5">
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

        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Set password"}</Button>
      </Card>
    </section>
  );
}
