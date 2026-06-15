"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { CliToken } from "@/lib/types";

export function useCliTokens() {
  return useSWR<CliToken[]>("/cli-tokens", fetcher);
}
