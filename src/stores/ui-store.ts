"use client";

import { create } from "zustand";

import type { CliTokenCreateResponse } from "@/lib/types";

interface UiState {
  createdToken: CliTokenCreateResponse | null;
  approvalFilter: "all" | "pending" | "approved" | "rejected" | "cancelled" | "timed_out";
  approvalCliFilter: string;
  emailObfuscated: boolean;
  setCreatedToken: (token: CliTokenCreateResponse | null) => void;
  setApprovalFilter: (filter: UiState["approvalFilter"]) => void;
  setApprovalCliFilter: (filter: string) => void;
  setEmailObfuscated: (obfuscated: boolean) => void;
}

const EMAIL_PRIVACY_KEY = "aa.email.obfuscated";

export const useUiStore = create<UiState>((set) => ({
  createdToken: null,
  approvalFilter: "pending",
  approvalCliFilter: "all",
  emailObfuscated: false,
  setCreatedToken: (token) => set({ createdToken: token }),
  setApprovalFilter: (approvalFilter) => set({ approvalFilter }),
  setApprovalCliFilter: (approvalCliFilter) => set({ approvalCliFilter }),
  setEmailObfuscated: (emailObfuscated) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(EMAIL_PRIVACY_KEY, emailObfuscated ? "1" : "0");
    }
    set({ emailObfuscated });
  },
}));

export function hydrateEmailPrivacy() {
  if (typeof window === "undefined") {
    return;
  }

  useUiStore.setState({ emailObfuscated: window.localStorage.getItem(EMAIL_PRIVACY_KEY) === "1" });
}
