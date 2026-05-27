import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a JS timestamp / Firestore-ish millis into a readable date. */
export function formatDate(value: number | Date | undefined, locale = "en") {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Stable id generator for client-side keys / draft ids. */
export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
