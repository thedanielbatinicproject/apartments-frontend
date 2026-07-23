// ============================================================
// Kontinuirana dnevna paleta — boje scene prate STVARNO vrijeme
// posjetitelja, bez diskretnih preklopa.
//
// Kako radi:
//  1. Za današnji datum se aproksimira izlazak/zalazak sunca
//     (sezonska sinusoida — zima ~9h, ljeto ~15h dnevnog svjetla),
//     pa su "sidra" faza (zora, jutro, podne, zlatni sat, sumrak,
//     noć...) vezana uz sunce, ne uz fiksne sate — u prosincu se
//     smrači u 17h, u srpnju u 21h, kao i u stvarnosti.
//  2. Trenutni trenutak se linearno interpolira između dva susjedna
//     sidra — NIKAD nema skoka palete, boje klize kontinuirano.
//  3. Interpolacija ide u OKLAB prostoru (kartezijevom), ne OKLCH:
//     lerp plavo↔narančasto tada prolazi kroz neutralno sivo umjesto
//     kroz zeleno (klasična zamka kod polar-hue lerpa u sumrak).
//     Browser podrška za oklab() == oklch(), koju projekt već koristi.
//
// Uz boje se iz istog sata izvodi i: pozicija/vidljivost sunca i
// mjeseca, faktor noći (zvijezde, prozori grada, lampa na rivi) te
// pozdrav ("Dobro jutro/dan/večer...").
// ============================================================

export type Greeting = "morning" | "day" | "evening" | "night";

export interface TimeOfDayState {
  /** CSS custom properties (--hs-*) za korijen hero sekcije */
  cssVars: Record<string, string>;
  /** Pozicije u % unutar scene; opacity 0 = ispod horizonta */
  sun: { x: number; y: number; opacity: number };
  moon: { x: number; y: number; opacity: number };
  /** 0 = puni dan, 1 = duboka noć (glatka rampa oko izlaska/zalaska) */
  night: number;
  greeting: Greeting;
}

/** [lightness 0-1, chroma, hue u stupnjevima] — ljudski čitljiv zapis */
type Lch = [number, number, number];

const COLOR_KEYS = [
  "skyTop",
  "skyMid",
  "skyLow",
  "sunCore",
  "sunGlow",
  "seaFar",
  "seaNear",
  "islands",
  "city",
  "cloud",
  "textStrong",
  "textSoft",
  "accent",
  // Podloge za sekcije ispod hero-a — i one žive kroz dan
  "paper",
  "card",
] as const;

type ColorKey = (typeof COLOR_KEYS)[number];
type Palette = Record<ColorKey, Lch>;

// ---------- Sidrene palete (ugađanje izgleda = uređivanje brojki) ----------

const NIGHT: Palette = {
  skyTop: [0.16, 0.045, 265],
  skyMid: [0.2, 0.05, 265],
  skyLow: [0.26, 0.055, 260],
  sunCore: [0.85, 0.14, 70],
  sunGlow: [0.8, 0.12, 65],
  seaFar: [0.23, 0.05, 255],
  seaNear: [0.18, 0.04, 258],
  islands: [0.19, 0.04, 268],
  city: [0.13, 0.012, 250],
  cloud: [0.32, 0.03, 270],
  textStrong: [0.94, 0.02, 90],
  textSoft: [0.76, 0.03, 90],
  accent: [0.84, 0.11, 80],
  paper: [0.19, 0.03, 266],
  card: [0.235, 0.035, 266],
};

const PRE_DAWN: Palette = {
  skyTop: [0.3, 0.06, 268],
  skyMid: [0.42, 0.07, 285],
  skyLow: [0.58, 0.09, 320],
  sunCore: [0.88, 0.15, 60],
  sunGlow: [0.84, 0.13, 55],
  seaFar: [0.32, 0.06, 256],
  seaNear: [0.26, 0.05, 258],
  islands: [0.3, 0.05, 272],
  city: [0.22, 0.01, 250],
  cloud: [0.52, 0.05, 305],
  textStrong: [0.93, 0.02, 88],
  textSoft: [0.75, 0.03, 88],
  accent: [0.82, 0.12, 60],
  paper: [0.3, 0.04, 290],
  card: [0.34, 0.045, 288],
};

const SUNRISE: Palette = {
  skyTop: [0.78, 0.06, 248],
  skyMid: [0.84, 0.09, 65],
  skyLow: [0.88, 0.12, 52],
  sunCore: [0.9, 0.15, 62],
  sunGlow: [0.87, 0.13, 56],
  seaFar: [0.58, 0.09, 243],
  seaNear: [0.44, 0.09, 250],
  islands: [0.66, 0.06, 262],
  city: [0.4, 0.01, 250],
  cloud: [0.93, 0.05, 60],
  textStrong: [0.3, 0.05, 258],
  textSoft: [0.48, 0.05, 250],
  accent: [0.72, 0.15, 42],
  paper: [0.9, 0.05, 75],
  card: [0.94, 0.04, 80],
};

const MORNING: Palette = {
  skyTop: [0.945, 0.035, 238],
  skyMid: [0.91, 0.05, 228],
  skyLow: [0.885, 0.065, 212],
  sunCore: [0.92, 0.13, 92],
  sunGlow: [0.89, 0.11, 86],
  seaFar: [0.645, 0.105, 231],
  seaNear: [0.49, 0.105, 241],
  islands: [0.74, 0.05, 242],
  city: [0.6, 0.008, 245],
  cloud: [0.975, 0.012, 90],
  textStrong: [0.28, 0.04, 250],
  textSoft: [0.45, 0.04, 246],
  accent: [0.7, 0.14, 45],
  paper: [0.965, 0.02, 95],
  card: [0.985, 0.012, 95],
};

/** Vrhunac — "Sunčani Mediteran", odabrana referentna paleta */
const NOON: Palette = {
  skyTop: [0.96, 0.03, 235],
  skyMid: [0.92, 0.05, 229],
  skyLow: [0.88, 0.06, 218],
  sunCore: [0.93, 0.12, 90],
  sunGlow: [0.9, 0.1, 85],
  seaFar: [0.66, 0.11, 230],
  seaNear: [0.5, 0.11, 240],
  islands: [0.75, 0.05, 240],
  city: [0.62, 0.006, 245],
  cloud: [0.98, 0.01, 90],
  textStrong: [0.28, 0.04, 250],
  textSoft: [0.45, 0.04, 245],
  accent: [0.7, 0.14, 45],
  paper: [0.97, 0.018, 95],
  card: [0.99, 0.01, 95],
};

const AFTERNOON: Palette = {
  skyTop: [0.945, 0.038, 233],
  skyMid: [0.91, 0.05, 222],
  skyLow: [0.88, 0.055, 200],
  sunCore: [0.92, 0.13, 86],
  sunGlow: [0.89, 0.115, 78],
  seaFar: [0.64, 0.105, 232],
  seaNear: [0.485, 0.1, 242],
  islands: [0.73, 0.05, 244],
  city: [0.6, 0.008, 245],
  cloud: [0.975, 0.015, 85],
  textStrong: [0.28, 0.04, 250],
  textSoft: [0.45, 0.04, 245],
  accent: [0.71, 0.145, 44],
  paper: [0.965, 0.022, 90],
  card: [0.985, 0.015, 92],
};

const GOLDEN: Palette = {
  skyTop: [0.72, 0.07, 252],
  skyMid: [0.8, 0.1, 60],
  skyLow: [0.85, 0.14, 55],
  sunCore: [0.88, 0.16, 64],
  sunGlow: [0.85, 0.145, 58],
  seaFar: [0.56, 0.095, 242],
  seaNear: [0.43, 0.09, 250],
  islands: [0.54, 0.07, 262],
  city: [0.33, 0.012, 250],
  cloud: [0.89, 0.07, 58],
  textStrong: [0.26, 0.05, 258],
  textSoft: [0.44, 0.05, 250],
  accent: [0.74, 0.16, 40],
  paper: [0.9, 0.06, 70],
  card: [0.93, 0.05, 75],
};

const DUSK: Palette = {
  skyTop: [0.33, 0.07, 266],
  skyMid: [0.48, 0.09, 292],
  skyLow: [0.6, 0.12, 20],
  sunCore: [0.85, 0.15, 55],
  sunGlow: [0.82, 0.13, 50],
  seaFar: [0.36, 0.07, 256],
  seaNear: [0.29, 0.06, 260],
  islands: [0.28, 0.05, 270],
  city: [0.19, 0.015, 260],
  cloud: [0.56, 0.07, 315],
  textStrong: [0.93, 0.02, 86],
  textSoft: [0.77, 0.03, 86],
  accent: [0.82, 0.12, 55],
  paper: [0.32, 0.05, 290],
  card: [0.36, 0.045, 288],
};

// ---------- Astronomija (aproksimacija, dovoljna za ugođaj) ----------

/** Izlazak/zalazak u minutama lokalnog dana, sezonski promjenjivo */
function sunTimes(date: Date): { sunrise: number; sunset: number } {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / 86_400_000
  );
  const daylight =
    (12.25 + 3.05 * Math.sin(((dayOfYear - 80) / 365) * 2 * Math.PI)) * 60;
  const noon = 12.5 * 60;
  return { sunrise: noon - daylight / 2, sunset: noon + daylight / 2 };
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** 0 na `from`, 1 na `to`, linearno između */
function ramp(x: number, from: number, to: number): number {
  return clamp01((x - from) / (to - from));
}

// ---------- Interpolacija u OKLAB ----------

type Lab = [number, number, number];

function toLab([l, c, h]: Lch): Lab {
  const rad = (h * Math.PI) / 180;
  return [l, c * Math.cos(rad), c * Math.sin(rad)];
}

function lerpLab(a: Lab, b: Lab, t: number): Lab {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function labToCss([l, a, b]: Lab): string {
  return `oklab(${l.toFixed(4)} ${a.toFixed(4)} ${b.toFixed(4)})`;
}

// ---------- Glavni izračun ----------

export function computeTimeOfDay(date: Date): TimeOfDayState {
  const minutes =
    date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
  const { sunrise, sunset } = sunTimes(date);

  // Sidra vezana uz sunce — redoslijed je rastući za svaki dan u godini
  const anchors: [number, Palette][] = [
    [sunrise - 75, PRE_DAWN],
    [sunrise + 10, SUNRISE],
    [sunrise + 150, MORNING],
    [12.5 * 60, NOON],
    [sunset - 170, AFTERNOON],
    [sunset - 45, GOLDEN],
    [sunset + 45, DUSK],
    [sunset + 110, NIGHT],
  ].map(([t, p]) => [(((t as number) % 1440) + 1440) % 1440, p as Palette]);
  anchors.sort((a, b) => a[0] - b[0]);

  // Nađi okružujući par sidara (kružno preko ponoći)
  let nextIndex = anchors.findIndex(([t]) => t > minutes);
  if (nextIndex === -1) nextIndex = 0;
  const prevIndex = (nextIndex - 1 + anchors.length) % anchors.length;
  const [prevT, prevPalette] = anchors[prevIndex];
  const [nextT, nextPalette] = anchors[nextIndex];

  const span = (nextT - prevT + 1440) % 1440 || 1440;
  const t = (((minutes - prevT + 1440) % 1440) / span) || 0;

  const cssVars: Record<string, string> = {};
  for (const key of COLOR_KEYS) {
    const mixed = lerpLab(toLab(prevPalette[key]), toLab(nextPalette[key]), t);
    cssVars[`--hs-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`] =
      labToCss(mixed);
  }

  // Faktor noći — glatke rampe oko zalaska/izlaska
  let night: number;
  if (minutes > sunset) night = ramp(minutes, sunset + 15, sunset + 85);
  else if (minutes < sunrise)
    night = 1 - ramp(minutes, sunrise - 85, sunrise - 15);
  else night = 0;
  cssVars["--hs-night"] = night.toFixed(3);

  // Sunce — luk preko neba tijekom dana
  const sunProgress = (minutes - sunrise) / (sunset - sunrise);
  const sunVisible = sunProgress > 0 && sunProgress < 1;
  const sun = {
    x: 12 + 76 * clamp01(sunProgress),
    y: 50 - 42 * Math.sin(Math.PI * clamp01(sunProgress)),
    opacity: sunVisible
      ? clamp01(Math.min(sunProgress, 1 - sunProgress) * 10)
      : 0,
  };

  // Mjesec — luk preko noći (od zalaska do izlaska)
  const nightSpan = 1440 - (sunset - sunrise);
  const moonProgress =
    minutes > sunset
      ? (minutes - sunset) / nightSpan
      : (minutes + 1440 - sunset) / nightSpan;
  const moon = {
    x: 82 - 64 * clamp01(moonProgress),
    y: 44 - 34 * Math.sin(Math.PI * clamp01(moonProgress)),
    opacity: night,
  };

  const hour = date.getHours();
  const greeting: Greeting =
    hour >= 5 && hour < 11
      ? "morning"
      : hour >= 11 && hour < 18
        ? "day"
        : hour >= 18 && hour < 23
          ? "evening"
          : "night";

  return { cssVars, sun, moon, night, greeting };
}
