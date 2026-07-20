// ============================================================
// Pomoćnici za solarni dashboard: labele, jedinice, opisi za
// info-tooltipe i formatiranje brojeva/datuma.
//
// Backend ima GET /api/solar/variables baš za dinamičke labele i
// jedinice (dvojezično) — koristimo ga kao izvor istine kad
// odgovori. FALLBACK niže postoji za slučaj da ta ruta padne ili
// (još) ne vrati sve ključeve — isti obrambeni obrazac kao
// checkin-utils.stayStatusMeta (nepoznato → neutralno, ne ruši UI).
// ============================================================

import type { SolarAggregateResponse, SolarVariableResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/invoice-utils";

/** Numerička polja SolarReadingResponse — sve osim timestamp/extra. */
export type SolarNumericField =
  | "batteryVoltage"
  | "batteryCurrent"
  | "batteryPower"
  | "batterySoc"
  | "batteryTemperature"
  | "pvVoltage"
  | "pvCurrent"
  | "pvPower"
  | "loadVoltage"
  | "loadCurrent"
  | "loadPower"
  | "yieldToday"
  | "consumptionToday"
  | "controllerStatus";

export interface SolarFieldMeta {
  key: string;
  label: string;
  unit: string;
  group: string;
  /** Tekst info-tooltipa uz karticu */
  description: string;
}

const FALLBACK_META: Record<string, Omit<SolarFieldMeta, "key">> = {
  batteryVoltage: {
    label: "Napon baterije",
    unit: "V",
    group: "battery",
    description:
      "Ova kartica prikazuje zadnji poznati napon na bateriji, u voltima.",
  },
  batteryCurrent: {
    label: "Struja baterije",
    unit: "A",
    group: "battery",
    description:
      "Ova kartica prikazuje zadnju poznatu jakost struje na bateriji, u amperima. Pozitivna vrijednost obično znači punjenje, negativna pražnjenje.",
  },
  batteryPower: {
    label: "Snaga baterije",
    unit: "W",
    group: "battery",
    description:
      "Ova kartica prikazuje trenutnu snagu na bateriji u vatima — umnožak napona i struje.",
  },
  batterySoc: {
    label: "Napunjenost baterije",
    unit: "%",
    group: "battery",
    description:
      "Ova kartica prikazuje procijenjenu napunjenost baterije (State of Charge) u postotcima, prema izračunu solarnog kontrolera.",
  },
  batteryTemperature: {
    label: "Temperatura baterije",
    unit: "°C",
    group: "battery",
    description:
      "Ova kartica prikazuje zadnju izmjerenu temperaturu baterije u Celzijevim stupnjevima.",
  },
  pvVoltage: {
    label: "Napon solarnih panela",
    unit: "V",
    group: "pv",
    description:
      "Ova kartica prikazuje napon koji solarni paneli (PV) trenutno proizvode, u voltima.",
  },
  pvCurrent: {
    label: "Struja solarnih panela",
    unit: "A",
    group: "pv",
    description:
      "Ova kartica prikazuje jakost struje koju solarni paneli trenutno proizvode, u amperima.",
  },
  pvPower: {
    label: "Snaga solarnih panela",
    unit: "W",
    group: "pv",
    description:
      "Ova kartica prikazuje trenutnu snagu proizvodnje solarnih panela u vatima.",
  },
  loadVoltage: {
    label: "Napon potrošnje",
    unit: "V",
    group: "load",
    description:
      "Ova kartica prikazuje napon na izlazu za potrošače spojene na sustav, u voltima.",
  },
  loadCurrent: {
    label: "Struja potrošnje",
    unit: "A",
    group: "load",
    description:
      "Ova kartica prikazuje jakost struje koju troše uređaji spojeni na sustav, u amperima.",
  },
  loadPower: {
    label: "Snaga potrošnje",
    unit: "W",
    group: "load",
    description:
      "Ova kartica prikazuje trenutnu snagu koju troše uređaji spojeni na sustav, u vatima.",
  },
  yieldToday: {
    label: "Proizvodnja danas",
    unit: "kWh",
    group: "daily",
    description:
      "Ova kartica prikazuje ukupnu energiju koju su solarni paneli proizveli od ponoći do sad, u kilovatsatima.",
  },
  consumptionToday: {
    label: "Potrošnja danas",
    unit: "kWh",
    group: "daily",
    description:
      "Ova kartica prikazuje ukupnu energiju koju su potrošači potrošili od ponoći do sad, u kilovatsatima.",
  },
  controllerStatus: {
    label: "Status kontrolera",
    unit: "",
    group: "system",
    description:
      "Ova kartica prikazuje sirovi statusni kôd solarnog kontrolera kojeg šalje uređaj — točno značenje broja ovisi o modelu kontrolera.",
  },
};

/** Redoslijed i grupiranje kartica u glavnom gridu. */
export const FIELD_GROUPS: {
  group: string;
  title: string;
  keys: SolarNumericField[];
}[] = [
  {
    group: "battery",
    title: "Baterija",
    keys: [
      "batteryVoltage",
      "batteryCurrent",
      "batteryPower",
      "batterySoc",
      "batteryTemperature",
    ],
  },
  {
    group: "pv",
    title: "Solarni paneli (PV)",
    keys: ["pvVoltage", "pvCurrent", "pvPower"],
  },
  {
    group: "load",
    title: "Potrošnja (Load)",
    keys: ["loadVoltage", "loadCurrent", "loadPower"],
  },
  {
    group: "daily",
    title: "Danas",
    keys: ["yieldToday", "consumptionToday"],
  },
];

/**
 * Spaja backend metapodatke (labelHr/unit/group) s lokalnim
 * fallbackom. Backend pobjeđuje kad postoji zapis za taj ključ —
 * lokalni opis (description) se uvijek koristi jer ga backend ne
 * šalje.
 */
export function resolveFieldMeta(
  key: string,
  variables: SolarVariableResponse[] | null | undefined
): SolarFieldMeta {
  const fromBackend = variables?.find((v) => v.key === key);
  const fallback = FALLBACK_META[key];

  return {
    key,
    label: fromBackend?.labelHr || fallback?.label || key,
    unit: fromBackend?.unit ?? fallback?.unit ?? "",
    group: fromBackend?.group || fallback?.group || "other",
    description:
      fallback?.description ??
      "Podatak dolazi izravno sa solarnog/baterijskog uređaja na terenu.",
  };
}

// ---------- Formatiranje brojeva ----------

const UNIT_DECIMALS: Record<string, number> = {
  V: 2,
  A: 2,
  W: 1,
  "°C": 1,
  "%": 0,
  kWh: 2,
};

/** Formatira broj prema jedinici (npr. 12.837 V → "12.84"). */
export function formatSolarValue(
  value: number | null | undefined,
  unit: string
): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const decimals = UNIT_DECIMALS[unit] ?? 2;
  return new Intl.NumberFormat("hr-HR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Formatirana vrijednost + jedinica u jednom (izostavlja jedinicu ako nema vrijednosti). */
export function formatSolarValueWithUnit(
  value: number | null | undefined,
  unit: string
): string {
  const formatted = formatSolarValue(value, unit);
  return formatted === "—" ? "—" : `${formatted} ${unit}`;
}

/** "min–maks jedinica", ili "—" ako nedostaje bilo koja granica. */
export function formatSolarRange(
  min: number | null | undefined,
  max: number | null | undefined,
  unit: string
): string {
  if (min == null || max == null) return "—";
  return `${formatSolarValue(min, unit)}–${formatSolarValue(max, unit)} ${unit}`;
}

/** Instant ("2026-07-20T10:25:00Z") → "20.07.2026. 10:25" */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  try {
    return new Intl.DateTimeFormat("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString("hr-HR");
  }
}

/** Kraći prikaz vremena — samo sat:minuta (za osi grafova). */
export function formatTimeShort(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * "Prije X" — koliko je davno zadnje očitanje stiglo. Daje osjećaj
 * "realtime" prikaza bez potrebe za websocketom.
 */
export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 10) return "upravo sad";
  if (seconds < 60) return `prije ${seconds} s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `prije ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `prije ${hours} h`;
  const days = Math.round(hours / 24);
  return `prije ${days} d`;
}

// ---------- Raspon grafa ----------

export const CHART_RANGES: { value: "24h" | "7d" | "30d"; label: string }[] = [
  { value: "24h", label: "24 sata" },
  { value: "7d", label: "7 dana" },
  { value: "30d", label: "30 dana" },
];

// ---------- Agregati (tjedno/mjesečno) ----------

/** Naslov perioda — mjesečni prikazuje naziv mjeseca, tjedni raspon datuma. */
export function periodLabel(agg: SolarAggregateResponse): string {
  if (agg.periodType === "MONTHLY") {
    const date = new Date(`${agg.periodStart}T00:00:00`);
    if (Number.isNaN(date.getTime())) return formatDate(agg.periodStart);
    const label = new Intl.DateTimeFormat("hr-HR", {
      month: "long",
      year: "numeric",
    }).format(date);
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return `${formatDate(agg.periodStart)} – ${formatDate(agg.periodEnd)}`;
}
