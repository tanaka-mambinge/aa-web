import { apiRequest } from "@/lib/http";

export function fetcher<T>(path: string) {
  return apiRequest<T>(path, { method: "GET" });
}
