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
import SocialAuthButtons from "@/components/social-auth-buttons";
import { apiRequest } from "@/lib/http";
import { getSafeNextPath } from "@/lib/next-path";
import type { AuthResponse } from "@/lib/types";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  nextPath?: string;
}

export default function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      setIsPending(true);
      setError(null);
      await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          device_type: "web",
        }),
      });

      router.push(getSafeNextPath(nextPath));
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Login failed");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AuthFormCard error={error} onSubmit={handleSubmit(onSubmit)}>
      <SocialAuthButtons mode="login" nextPath={nextPath} />
      <div className="space-y-3">
        <Input
          label="Email"
          type="email"
          placeholder="name@company.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-ink-muted">
        <Link href="/forgot-password" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Forgot password?
        </Link>
      </p>
      <p className="text-center text-sm text-ink-muted">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Register
        </Link>
      </p>
    </AuthFormCard>
  );
}
