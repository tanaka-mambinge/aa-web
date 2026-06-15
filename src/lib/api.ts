export const API_URL = "";

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export function getBackendUrl() {
  if (!BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is required");
  }

  return BACKEND_URL;
}

export const API_PREFIX = "/api/v1";
