"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import AuthFormCard from "@/components/auth/auth-form-card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { apiRequest } from "@/lib/http";

const schema = z.object({
  email: z.email("Enter a valid email"),
});

type ForgotPasswordFormValues = z.infer<typeof schema>;

export default function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      setIsPending(true);
      setError(null);
      await apiRequest<void>("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
      });

      setSuccess("If that email exists, we sent a reset link.");
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Request failed");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthFormCard error={error} success={success} onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        placeholder="name@company.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Sending…" : "Send reset link"}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Back to sign in
        </Link>
      </p>
    </AuthFormCard>
  );
}
