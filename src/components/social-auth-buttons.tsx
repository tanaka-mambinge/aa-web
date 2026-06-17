"use client";

import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";

import Button from "@/components/ui/button";
import { openSocialAuth } from "@/lib/social-auth";

interface SocialAuthButtonsProps {
  mode: "login" | "register";
  nextPath?: string;
}

const LABELS = {
  login: "Continue with",
  register: "Sign up with",
} as const;

export default function SocialAuthButtons({ mode, nextPath }: SocialAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">{LABELS[mode]}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" variant="secondary" className="w-full" onClick={() => openSocialAuth("google", "login", nextPath)}>
          <IconBrandGoogle className="h-4 w-4" />
          Google
        </Button>
        <Button type="button" variant="secondary" className="w-full" onClick={() => openSocialAuth("github", "login", nextPath)}>
          <IconBrandGithub className="h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}
