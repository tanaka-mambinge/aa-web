"use client";

import { create } from "zustand";

import type { Approval, CliTokenCreateResponse } from "@/lib/types";

interface UiState {
  selectedApproval: Approval | null;
  createdToken: CliTokenCreateResponse | null;
  approvalFilter: "all" | "pending" | "approved" | "rejected" | "cancelled" | "timed_out";
  approvalCliFilter: string;
  settingsOpen: boolean;
  settingsTab: "profile" | "password" | "notifications" | "connections";
  emailObfuscated: boolean;
  setSelectedApproval: (approval: Approval | null) => void;
  setCreatedToken: (token: CliTokenCreateResponse | null) => void;
  setApprovalFilter: (filter: UiState["approvalFilter"]) => void;
  setApprovalCliFilter: (filter: string) => void;
  setSettingsOpen: (open: boolean) => void;
  setSettingsTab: (tab: UiState["settingsTab"]) => void;
  setEmailObfuscated: (obfuscated: boolean) => void;
}

const EMAIL_PRIVACY_KEY = "aa.email.obfuscated";

export const useUiStore = create<UiState>((set) => ({
  selectedApproval: null,
  createdToken: null,
  approvalFilter: "pending",
  approvalCliFilter: "all",
  settingsOpen: false,
  settingsTab: "profile",
  emailObfuscated: false,
  setSelectedApproval: (approval) => set({ selectedApproval: approval }),
  setCreatedToken: (token) => set({ createdToken: token }),
  setApprovalFilter: (approvalFilter) => set({ approvalFilter }),
  setApprovalCliFilter: (approvalCliFilter) => set({ approvalCliFilter }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setSettingsTab: (settingsTab) => set({ settingsTab }),
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
