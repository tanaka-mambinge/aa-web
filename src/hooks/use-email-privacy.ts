"use client";

import { useEffect } from "react";

import { hydrateEmailPrivacy, useUiStore } from "@/stores/ui-store";

export function obfuscateEmail(email: string) {
  const [name, domain = ""] = email.split("@");
  const visibleName = name.slice(0, Math.min(2, name.length));
  const visibleDomain = domain.slice(0, Math.min(2, domain.length));

  return `${visibleName}${"*".repeat(Math.max(name.length - visibleName.length, 3))}@${visibleDomain}${"*".repeat(Math.max(domain.length - visibleDomain.length, 3))}`;
}

export function useEmailPrivacy(email: string) {
  const emailObfuscated = useUiStore((state) => state.emailObfuscated);
  const setEmailObfuscated = useUiStore((state) => state.setEmailObfuscated);

  useEffect(() => {
    hydrateEmailPrivacy();
  }, []);

  return {
    emailObfuscated,
    displayEmail: emailObfuscated ? obfuscateEmail(email) : email,
    setEmailObfuscated,
  };
}
