import { headers } from "next/headers";

function normalizePath(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value, "http://localhost").pathname + new URL(value, "http://localhost").search;
  } catch {
    return value.startsWith("/") ? value : `/${value}`;
  }
}

export async function getRequestPath(fallback: string) {
  const requestHeaders = await headers();
  const candidates = [
    requestHeaders.get("x-matched-path"),
    requestHeaders.get("x-url"),
    requestHeaders.get("next-url"),
    requestHeaders.get("x-invoke-path"),
    requestHeaders.get("referer"),
  ];

  for (const candidate of candidates) {
    const normalized = normalizePath(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return fallback;
}
