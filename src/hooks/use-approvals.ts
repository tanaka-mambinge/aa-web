"use client";

import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { ApprovalListResponse } from "@/lib/types";

export function useApprovals() {
  return useSWR<ApprovalListResponse>("/approvals", fetcher);
}
