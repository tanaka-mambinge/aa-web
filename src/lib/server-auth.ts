import { cookies, headers } from "next/headers";

import { API_PREFIX } from "@/lib/api";
import type { User } from "@/lib/types";

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("aa_access_token")?.value;
  if (!token) {
    return null;
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  if (!host) {
    return null;
  }

  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  const response = await fetch(`${protocol}://${host}${API_PREFIX}/auth/me`, {
    headers: {
      Cookie: `aa_access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as User;
}
