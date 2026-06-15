const relativeFormatter = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
const absoluteFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Renders a timestamp as relative text ("3 hours ago", "in 2 days") for
 * anything within the last/next week, falling back to an absolute date
 * further out (operators care about "last week" vs "today", not exact weeks).
 */
export function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = date.getTime() - Date.now();
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < 45 * 1000) return "just now";
  if (absDiffMs < HOUR) return relativeFormatter.format(Math.round(diffMs / MINUTE), "minute");
  if (absDiffMs < DAY) return relativeFormatter.format(Math.round(diffMs / HOUR), "hour");
  if (absDiffMs < WEEK) return relativeFormatter.format(Math.round(diffMs / DAY), "day");

  return absoluteFormatter.format(date);
}
