// ============================================================
// Zajednički pomoćnici za račune — nazivi, statusi, izračuni.
//
// Držimo ih na jednom mjestu jer se koriste u tri ekrana
// (lista, forma, detalj) i moraju biti dosljedni.
// ============================================================

import type {
  InvoiceDocumentType,
  InvoiceStatus,
  InvoiceItemRequest,
} from "@/lib/api/types";

// ---------- Tipovi dokumenata ----------

export const DOCUMENT_TYPES: {
  value: InvoiceDocumentType;
  label: string;
  short: string;
  /** Naslov za novi dokument — pazi na rod ("Nova ponuda") */
  newLabel: string;
  description: string;
}[] = [
  {
    value: "INVOICE",
    label: "Račun",
    short: "Račun",
    newLabel: "Novi račun",
    description: "Za naplatu boravka koji je gost već iskoristio.",
  },
  {
    value: "PROFORMA",
    label: "Predračun",
    short: "Predr.",
    newLabel: "Novi predračun",
    description: "Poziv na plaćanje prije dolaska gosta.",
  },
  {
    value: "QUOTE",
    label: "Ponuda",
    short: "Ponuda",
    newLabel: "Nova ponuda",
    description: "Neobvezujuća ponuda cijene za gosta.",
  },
];

/** Naslov za kreiranje novog dokumenta odabrane vrste. */
export function newDocumentLabel(type: InvoiceDocumentType): string {
  return DOCUMENT_TYPES.find((t) => t.value === type)?.newLabel ?? "Novi dokument";
}

/** Zadana jedinična cijena po noćenju. */
export const DEFAULT_UNIT_PRICE = 65;

export function documentTypeLabel(type: InvoiceDocumentType): string {
  return DOCUMENT_TYPES.find((t) => t.value === type)?.label ?? type;
}

// ---------- Statusi ----------

export const STATUS_META: Record<
  InvoiceStatus,
  { label: string; className: string; description: string }
> = {
  DRAFT: {
    label: "Nedovršen",
    className:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    description:
      "Dokument nema dodijeljen broj. Otvorite ga i spremite da bude gotov.",
  },
  ISSUED: {
    label: "Izdan",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    description:
      "Dokument je gotov i ima svoj broj. Možete ga urediti, obrisati ili poslati gostu.",
  },
  CANCELLED: {
    label: "Storniran",
    className: "bg-muted text-muted-foreground border-border",
    description:
      "Dokument je poništen. Ostaje u evidenciji radi traga, ali više ne vrijedi.",
  },
};

// ---------- Formatiranje ----------

/** Iznos u hrvatskom formatu s valutom (1.234,56 EUR). */
export function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined
): string {
  const value = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  const code = currency || "EUR";

  try {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    // Nepoznata oznaka valute — ispiši ručno umjesto da puknemo
    return `${value.toFixed(2)} ${code}`;
  }
}

/** "YYYY-MM-DD" → "31.12.2026." */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}.`;
}

/** Današnji datum kao "YYYY-MM-DD" (lokalno, ne UTC). */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Broj noćenja između dva datuma (za automatsku količinu). */
export function nightsBetween(
  checkin: string | null | undefined,
  checkout: string | null | undefined
): number | null {
  if (!checkin || !checkout) return null;

  const ms =
    new Date(`${checkout}T00:00:00`).getTime() -
    new Date(`${checkin}T00:00:00`).getTime();

  if (!Number.isFinite(ms)) return null;
  const nights = Math.round(ms / 86_400_000);
  return nights > 0 ? nights : null;
}

// ---------- Izračuni ----------

export interface InvoiceTotals {
  netAmount: number;
  discountAmount: number;
  totalDue: number;
}

/**
 * Pregled iznosa u formi, prije slanja na backend.
 *
 * VAŽNO: ovo je samo prikaz. Autoritativne iznose računa backend
 * i vraća ih u InvoiceResponse — nikad ne spremamo ove vrijednosti.
 */
export function computeTotals(
  items: InvoiceItemRequest[],
  discountAmount: number | null | undefined
): InvoiceTotals {
  const netAmount = items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) return sum;
    return sum + quantity * unitPrice;
  }, 0);

  const discount =
    typeof discountAmount === "number" && Number.isFinite(discountAmount)
      ? discountAmount
      : 0;

  return {
    netAmount,
    discountAmount: discount,
    totalDue: Math.max(0, netAmount - discount),
  };
}

/** Iznos jedne stavke. */
export function lineTotal(item: InvoiceItemRequest): number {
  const quantity = Number(item.quantity);
  const unitPrice = Number(item.unitPrice);
  if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) return 0;
  return quantity * unitPrice;
}

/** Pretvara string iz inputa u broj ili null (prazno polje). */
export function parseNumber(value: string): number | null {
  const trimmed = value.trim().replace(",", ".");
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Godine za filtar — od tekuće unatrag. */
export function recentYears(count = 5): number[] {
  const current = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => current - i);
}
