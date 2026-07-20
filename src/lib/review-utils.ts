// ============================================================
// Pomoćnici za recenzije — izvor, jezik, formatiranje.
// ============================================================

import type { ReviewSource } from "@/lib/api/types";

export const REVIEW_SOURCES: { value: ReviewSource; label: string }[] = [
  { value: "AIRBNB", label: "Airbnb" },
  { value: "BOOKING", label: "Booking.com" },
  { value: "GOOGLE", label: "Google" },
  { value: "OTHER", label: "Ostalo" },
];

export const SOURCE_META: Record<
  ReviewSource,
  { label: string; className: string }
> = {
  AIRBNB: {
    label: "Airbnb",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  },
  BOOKING: {
    label: "Booking.com",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  GOOGLE: {
    label: "Google",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  OTHER: {
    label: "Ostalo",
    className: "bg-muted text-muted-foreground",
  },
};

/** Siguran dohvat — nepoznat izvor degradira u neutralnu oznaku umjesto da ruši render. */
export function sourceMeta(source: string | null | undefined): {
  label: string;
  className: string;
} {
  if (source && source in SOURCE_META) {
    return SOURCE_META[source as ReviewSource];
  }
  return { label: source || "Nepoznato", className: "bg-muted text-muted-foreground" };
}

const LANGUAGE_LABELS: Record<string, string> = {
  hr: "Hrvatski",
  en: "Engleski",
  de: "Njemački",
  it: "Talijanski",
  fr: "Francuski",
  ua: "Ukrajinski",
};

export function languageLabel(code: string | null | undefined): string {
  if (!code) return "—";
  return LANGUAGE_LABELS[code.toLowerCase()] ?? code.toUpperCase();
}

export const LANGUAGE_OPTIONS = Object.entries(LANGUAGE_LABELS).map(
  ([value, label]) => ({ value, label })
);
