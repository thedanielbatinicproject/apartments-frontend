// ============================================================
// Pomoćnici za prijave gostiju: hrvatski nazivi statusa,
// kopiranje u međuspremnik, emoji zastave.
// ============================================================

import type {
  GuestStayStatus,
  SubmissionMethod,
} from "@/lib/api/types";

// ---------- Statusi (hrvatski, za roditelje) ----------

export const STAY_STATUS_META: Record<
  GuestStayStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Čeka akciju gosta",
    className: "bg-muted text-muted-foreground",
  },
  PROCESSING: {
    label: "Obrada",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  },
  VERIFIED: {
    label: "Potvrđeno",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  FAILED: {
    label: "Neuspjelo",
    className: "bg-destructive/10 text-destructive",
  },
  MANUAL_REVIEW: {
    label: "Za provjeru",
    className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  },
  EXPIRED: {
    label: "Isteklo",
    className: "bg-muted text-muted-foreground",
  },
};

/**
 * Siguran dohvat meta podataka statusa.
 *
 * Backend može vratiti status koji frontend (još) ne poznaje —
 * novu vrijednost enuma, null kod nedovršenog zapisa, ili drukčije
 * napisan string. Izravan pristup STAY_STATUS_META[status] tada
 * ruši render; ovdje se svaki nepoznati status degradira u
 * neutralnu sivu oznaku s izvornim tekstom.
 */
export function stayStatusMeta(status: string | null | undefined): {
  label: string;
  className: string;
} {
  if (status && status in STAY_STATUS_META) {
    return STAY_STATUS_META[status as GuestStayStatus];
  }
  return {
    label: status || "Nepoznato",
    className: "bg-muted text-muted-foreground",
  };
}

export const SUBMISSION_METHOD_LABEL: Record<SubmissionMethod, string> = {
  OCR_SELF: "Sken dokumenta",
  MANUAL_FORM: "Ručni unos",
  ADMIN_PAPER_SCAN: "Papirnati obrazac",
};

export function submissionMethodLabel(
  method: string | null | undefined
): string {
  if (!method) return "—";
  return SUBMISSION_METHOD_LABEL[method as SubmissionMethod] ?? method;
}

export const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  ID_CARD: "Osobna iskaznica",
  PASSPORT: "Putovnica",
  DRIVING_LICENCE: "Vozačka dozvola",
};

export function documentTypeLabel(type: string | null | undefined): string {
  if (!type) return "—";
  return DOCUMENT_TYPE_LABEL[type] ?? type;
}

export const SEX_LABEL: Record<string, string> = {
  M: "Muško",
  F: "Žensko",
  MALE: "Muško",
  FEMALE: "Žensko",
};

// ---------- Kopiranje ----------

/**
 * Kopira tekst u međuspremnik.
 *
 * navigator.clipboard radi samo na HTTPS/localhost — kad se na
 * mobitel dolazi preko IP adrese lokalne mreže (http://192.168...),
 * API ne postoji. Fallback preko skrivene textarea pokriva i to,
 * jer je kopiranje ovdje glavna svrha stranice (unos u eVisitor).
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // padni na fallback
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

// ---------- Zastave ----------

/**
 * Emoji zastava iz nacionalnosti.
 *
 * MRZ s dokumenata daje ISO-3166 alpha-3 (HRV, DEU...), a ručni
 * unos može biti bilo što ("Croatia", "Njemačka"). Pokrivamo
 * ISO-3 kodove i najčešće nazive; nepoznato vraća null pa UI
 * jednostavno ne prikaže zastavu — nije kritično.
 */
const ISO3_TO_ISO2: Record<string, string> = {
  HRV: "HR", DEU: "DE", AUT: "AT", ITA: "IT", SVN: "SI", HUN: "HU",
  CZE: "CZ", SVK: "SK", POL: "PL", NLD: "NL", BEL: "BE", FRA: "FR",
  ESP: "ES", PRT: "PT", GBR: "GB", IRL: "IE", CHE: "CH", SWE: "SE",
  NOR: "NO", DNK: "DK", FIN: "FI", USA: "US", CAN: "CA", AUS: "AU",
  BIH: "BA", SRB: "RS", MNE: "ME", MKD: "MK", ALB: "AL", GRC: "GR",
  ROU: "RO", BGR: "BG", UKR: "UA", TUR: "TR", RUS: "RU", CHN: "CN",
  JPN: "JP", KOR: "KR", ISR: "IL", NZL: "NZ", LUX: "LU", EST: "EE",
  LVA: "LV", LTU: "LT", ISL: "IS",
};

const NAME_TO_ISO2: Record<string, string> = {
  croatia: "HR", hrvatska: "HR", germany: "DE", njemačka: "DE",
  deutschland: "DE", austria: "AT", austrija: "AT", österreich: "AT",
  italy: "IT", italija: "IT", italia: "IT", slovenia: "SI",
  slovenija: "SI", hungary: "HU", mađarska: "HU", poland: "PL",
  poljska: "PL", france: "FR", francuska: "FR", spain: "ES",
  španjolska: "ES", netherlands: "NL", nizozemska: "NL",
  "united kingdom": "GB", uk: "GB", "velika britanija": "GB",
  switzerland: "CH", švicarska: "CH", sweden: "SE", švedska: "SE",
  norway: "NO", norveška: "NO", denmark: "DK", danska: "DK",
  usa: "US", "united states": "US", sad: "US", czechia: "CZ",
  "czech republic": "CZ", češka: "CZ", slovakia: "SK", slovačka: "SK",
  bosnia: "BA", bosna: "BA", "bosna i hercegovina": "BA",
  serbia: "RS", srbija: "RS",
};

export function flagEmoji(nationality: string | null | undefined): string | null {
  if (!nationality) return null;

  const raw = nationality.trim();
  if (!raw) return null;

  let iso2: string | undefined;

  if (/^[A-Za-z]{3}$/.test(raw)) iso2 = ISO3_TO_ISO2[raw.toUpperCase()];
  else if (/^[A-Za-z]{2}$/.test(raw)) iso2 = raw.toUpperCase();
  else iso2 = NAME_TO_ISO2[raw.toLowerCase()];

  if (!iso2 || !/^[A-Z]{2}$/.test(iso2)) return null;

  // Regional indicator symbols: 'A' → U+1F1E6
  const base = 0x1f1e6;
  return String.fromCodePoint(
    base + (iso2.charCodeAt(0) - 65),
    base + (iso2.charCodeAt(1) - 65)
  );
}
