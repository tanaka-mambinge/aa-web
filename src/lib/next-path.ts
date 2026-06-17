export function getSafeNextPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const parsed = new URL(value, "http://local.test");
    if (parsed.origin !== "http://local.test") {
      return fallback;
    }

    const nextPath = `${parsed.pathname}${parsed.search}`;
    return nextPath || fallback;
  } catch {
    return fallback;
  }
}
