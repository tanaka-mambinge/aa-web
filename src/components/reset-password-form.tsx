"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AuthFormCard from "@/components/auth/auth-form-card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { apiRequest } from "@/lib/http";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type ResetPasswordFormValues = z.infer<typeof schema>;

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: ResetPasswordFormValues) {
    try {
      setIsPending(true);
      setError(null);
      await apiRequest<void>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          new_password: values.password,
        }),
      });

      setSuccess("Password updated. Redirecting you to sign in…");
      setTimeout(() => router.push("/login"), 1500);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Reset failed");
      setIsPending(false);
    }
  }

  return (
    <AuthFormCard error={error} success={success} onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-3">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat the new password"
          error={errors.confirm_password?.message}
          {...register("confirm_password")}
        />
      </div>
      <Button className="w-full" type="submit" disabled={isPending || !token}>
        {isPending ? "Updating…" : "Update password"}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/login" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Back to sign in
        </Link>
      </p>
    </AuthFormCard>
  );
}
