import { getBackendUrl } from "@/lib/api";

export type SocialProvider = "google" | "github";
export type SocialAuthMode = "login" | "link";

export function getSocialAuthUrl(provider: SocialProvider, mode: SocialAuthMode, nextPath?: string) {
  const url = new URL(
    `${getBackendUrl()}/api/v1/auth/social/${provider}/${mode === "login" ? "start" : "link"}`,
  );

  if (nextPath) {
    url.searchParams.set("next", nextPath);
  }

  return url.toString();
}

export function openSocialAuth(provider: SocialProvider, mode: SocialAuthMode, nextPath?: string) {
  window.location.assign(getSocialAuthUrl(provider, mode, nextPath));
}
