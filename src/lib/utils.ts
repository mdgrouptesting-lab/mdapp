import type { Subscription, TimestampLike } from "./types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function toDate(t: TimestampLike): Date | null {
  if (!t) return null;
  if (t instanceof Date) return t;
  if (typeof t.toDate === "function") return t.toDate();
  if (typeof t.seconds === "number") return new Date(t.seconds * 1000);
  return null;
}

export function formatDate(t: TimestampLike, withTime = false) {
  const d = toDate(t);
  if (!d) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Is a subscription currently usable? Lifetime = active with no expiry. */
export function isSubscriptionActive(sub?: Subscription | null) {
  if (!sub || sub.status !== "active") return false;
  const exp = toDate(sub.expiresAt);
  return !exp || exp.getTime() > Date.now();
}

export function daysLeft(sub?: Subscription | null) {
  const exp = toDate(sub?.expiresAt);
  if (!exp) return null;
  return Math.max(0, Math.ceil((exp.getTime() - Date.now()) / 86400000));
}

export const isValidIndianPhone = (p: string) => /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(p.trim());
