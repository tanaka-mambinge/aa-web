"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { User } from "@/lib/types";

export function useCurrentUser() {
  return useSWR<User>("/auth/me", fetcher);
}
