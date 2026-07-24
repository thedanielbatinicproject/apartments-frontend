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

/**
 * Numerička polja SolarReadingResponse s "običnim" prikazom kartice
 * (broj + jedinica). Bitmaske (greške/upozorenja/arrow flag) NISU
 * ovdje — one imaju posebne komponente (SolarFaultCard/SolarArrowFlagCard)
 * jer se dekodiraju, ne prikazuju kao sirovi broj.
 */
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
  | "controllerStatus"
  | "pvChargerRadiatorTemp"
  | "pvRelayState"
  | "pvChargerAccumulatedDay"
  | "pvChargerAccumulatedHour"
  | "pvChargerAccumulatedMinute"
  | "pvChargerBatteryVoltage"
  | "pvChargerWorkState"
  | "inverterBusVoltage"
  | "inverterOutputVoltage"
  | "inverterCurrent"
  | "inverterPower"
  | "inverterSystemLoad"
  | "inverterAcRadiatorTemp"
  | "inverterTransformerTemp"
  | "inverterDcRadiatorTemp"
  | "inverterLoadPercent"
  | "chargerTotalProducedEnergy"
  | "dischargerTotalMwh"
  | "dischargerTotalKwh";

/** Polja s posebnim (bitmaska) prikazom — greške/upozorenja. */
export type SolarFaultField =
  | "inverterErrorCode1"
  | "inverterErrorCode2"
  | "inverterWarningCode1"
  | "inverterWarningCode2"
  | "chargerErrorCode"
  | "chargerWarningCode";

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

  // ---------- PV punjač (dodatna polja) ----------
  pvChargerRadiatorTemp: {
    label: "Temperatura radijatora PV punjača",
    unit: "°C",
    group: "pv",
    description: "Temperatura rashladnog radijatora fotonaponskog punjača.",
  },
  pvRelayState: {
    label: "PV relej",
    unit: "",
    group: "pv",
    description:
      "Stanje upravljačkog releja fotonaponskog sustava, kako ga javlja uređaj (čista telemetrija).",
  },
  pvChargerAccumulatedDay: {
    label: "Akumulirano vrijeme rada (dani)",
    unit: "dana",
    group: "pv",
    description: "Ukupno akumulirano vrijeme rada PV punjača, dio u danima.",
  },
  pvChargerAccumulatedHour: {
    label: "Akumulirano vrijeme rada (sati)",
    unit: "h",
    group: "pv",
    description: "Ukupno akumulirano vrijeme rada PV punjača, dio u satima.",
  },
  pvChargerAccumulatedMinute: {
    label: "Akumulirano vrijeme rada (minute)",
    unit: "min",
    group: "pv",
    description: "Ukupno akumulirano vrijeme rada PV punjača, dio u minutama.",
  },
  pvChargerBatteryVoltage: {
    label: "Napon baterije (PV punjač)",
    unit: "V",
    group: "pv",
    description:
      "Napon baterije izmjeren na samom PV punjaču — može se neznatno razlikovati od napona mjerenog na inverteru zbog pada napona na kabelima.",
  },
  pvChargerWorkState: {
    label: "Radno stanje PV punjača",
    unit: "",
    group: "pv",
    description:
      "Sirovi kôd trenutnog načina rada PV punjača — točno značenje ovisi o modelu uređaja.",
  },

  // ---------- Inverter ----------
  inverterBusVoltage: {
    label: "Napon sabirnice invertera",
    unit: "V",
    group: "inverter",
    description: "Napon unutarnje DC sabirnice invertera.",
  },
  inverterOutputVoltage: {
    label: "Izlazni napon invertera",
    unit: "V",
    group: "inverter",
    description: "Izmjenični (AC) izlazni napon invertera.",
  },
  inverterCurrent: {
    label: "Struja invertera",
    unit: "A",
    group: "inverter",
    description: "Ukupna struja koju inverter trenutno isporučuje.",
  },
  inverterPower: {
    label: "Snaga invertera",
    unit: "W",
    group: "inverter",
    description: "Ukupna snaga koju inverter trenutno isporučuje.",
  },
  inverterSystemLoad: {
    label: "Ukupno opterećenje sustava",
    unit: "W",
    group: "inverter",
    description: "Ukupna potrošnja snage svih trošila spojenih na inverter.",
  },
  inverterAcRadiatorTemp: {
    label: "Temperatura AC radijatora",
    unit: "°C",
    group: "inverter",
    description: "Temperatura izmjeničnog (AC) rashladnog radijatora invertera.",
  },
  inverterTransformerTemp: {
    label: "Temperatura transformatora",
    unit: "°C",
    group: "inverter",
    description: "Temperatura transformatora unutar invertera.",
  },
  inverterDcRadiatorTemp: {
    label: "Temperatura DC radijatora",
    unit: "°C",
    group: "inverter",
    description: "Temperatura istosmjernog (DC) rashladnog radijatora invertera.",
  },
  inverterLoadPercent: {
    label: "Postotak opterećenja",
    unit: "%",
    group: "inverter",
    description:
      "Postotak trenutne potrošnje u odnosu na ukupni nazivni kapacitet invertera.",
  },

  // ---------- Kumulativna energija ----------
  chargerTotalProducedEnergy: {
    label: "Ukupno proizvedeno (punjač)",
    unit: "kWh",
    group: "cumulative",
    description:
      "Sveukupna količina energije koju je PV punjač proizveo otkad je uređaj u pogonu (kumulativno, ne resetira se dnevno).",
  },
  dischargerTotalMwh: {
    label: "Ukupno ispražnjeno (MWh)",
    unit: "MWh",
    group: "cumulative",
    description:
      "Sveukupna količina energije ispražnjena iz sustava, dio u megavatsatima (zbraja se s kWh vrijednosti niže za puni ukupni iznos).",
  },
  dischargerTotalKwh: {
    label: "Ukupno ispražnjeno (kWh)",
    unit: "kWh",
    group: "cumulative",
    description:
      "Sveukupna količina energije ispražnjena iz sustava, dio u kilovatsatima.",
  },
};

/** Labele/opisi za polja s posebnim (bitmaska) prikazom. */
export const FAULT_FIELD_META: Record<
  SolarFaultField,
  { label: string; description: string; kind: "error" | "warning" }
> = {
  inverterErrorCode1: {
    label: "Kod inverter greške (1)",
    description: "Bitmaska grešaka invertera — moguće je više aktivnih istovremeno.",
    kind: "error",
  },
  inverterErrorCode2: {
    label: "Kod inverter greške (2)",
    description: "Bitmaska grešaka invertera, drugi registar.",
    kind: "error",
  },
  inverterWarningCode1: {
    label: "Kod inverter upozorenja (1)",
    description: "Bitmaska upozorenja invertera — moguće je više aktivnih istovremeno.",
    kind: "warning",
  },
  inverterWarningCode2: {
    label: "Kod inverter upozorenja (2)",
    description: "Bitmaska upozorenja invertera, drugi registar (trenutno bez definiranih kodova).",
    kind: "warning",
  },
  chargerErrorCode: {
    label: "MPPT punjač — kod greške",
    description: "Bitmaska grešaka MPPT/PV punjača — moguće je više aktivnih istovremeno.",
    kind: "error",
  },
  chargerWarningCode: {
    label: "MPPT punjač — kod upozorenja",
    description: "Bitmaska upozorenja MPPT/PV punjača.",
    kind: "warning",
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
    keys: [
      "pvVoltage",
      "pvCurrent",
      "pvPower",
      "pvChargerBatteryVoltage",
      "pvChargerRadiatorTemp",
      "pvRelayState",
      "pvChargerWorkState",
      "pvChargerAccumulatedDay",
      "pvChargerAccumulatedHour",
      "pvChargerAccumulatedMinute",
    ],
  },
  {
    group: "load",
    title: "Potrošnja (Load)",
    keys: ["loadVoltage", "loadCurrent", "loadPower"],
  },
  {
    group: "inverter",
    title: "Inverter",
    keys: [
      "inverterOutputVoltage",
      "inverterBusVoltage",
      "inverterCurrent",
      "inverterPower",
      "inverterSystemLoad",
      "inverterLoadPercent",
      "inverterAcRadiatorTemp",
      "inverterDcRadiatorTemp",
      "inverterTransformerTemp",
    ],
  },
  {
    group: "daily",
    title: "Danas",
    keys: ["yieldToday", "consumptionToday"],
  },
  {
    group: "cumulative",
    title: "Kumulativno (od početka rada)",
    keys: ["chargerTotalProducedEnergy", "dischargerTotalMwh", "dischargerTotalKwh"],
  },
];

/** Redoslijed polja s bitmaska prikazom (greške/upozorenja). */
export const FAULT_FIELDS: SolarFaultField[] = [
  "inverterErrorCode1",
  "inverterErrorCode2",
  "inverterWarningCode1",
  "inverterWarningCode2",
  "chargerErrorCode",
  "chargerWarningCode",
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
    // "||" a ne "??": backend zna vratiti unit: "" za bezjedinične
    // vrijednosti (npr. akumulirano vrijeme), a tada želimo naš
    // ljepši fallback ("dana"/"h"/"min"), ne prazan string.
    unit: fromBackend?.unit || fallback?.unit || "",
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
