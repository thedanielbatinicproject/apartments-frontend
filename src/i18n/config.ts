// ============================================================
// i18n konfiguracija — jedno mjesto istine za jezike.
//
// ARHITEKTURA (zašto ovako):
//  - Jedan file po jeziku u dictionaries/ — prevoditelj dira
//    samo svoj file, git diff po jeziku je čist.
//  - Engleski (en.ts) je IZVOR TIPA: ostali jezici moraju
//    `satisfies Dictionary`, pa TypeScript pri buildu prijavi
//    svaki ključ koji nedostaje ili je višak. Nema tihih rupa
//    u prijevodu.
//  - Odabir se čuva u TRAJNOM cookieju (1 godina): jedan uređaj
//    = jedan odabir, vrijedi za sve javne rute. Cookie (a ne
//    localStorage) zato da ga i server može pročitati bude li
//    ikad trebalo SSR renderiranje po jeziku.
//
// Intranet NIJE obuhvaćen — on je namjerno samo na hrvatskom.
// ============================================================

export const SUPPORTED_LANGS = ["en", "hr", "de", "it", "fr", "ua"] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

/** Trajni cookie s odabirom jezika */
export const LANG_COOKIE = "apsi_lang";
export const LANG_COOKIE_DAYS = 365;

/** Nazivi jezika NA VLASTITOM jeziku — tako se biraju u popupu */
export const LANG_META: Record<Lang, { native: string; flag: string }> = {
  en: { native: "English", flag: "🇬🇧" },
  hr: { native: "Hrvatski", flag: "🇭🇷" },
  de: { native: "Deutsch", flag: "🇩🇪" },
  it: { native: "Italiano", flag: "🇮🇹" },
  fr: { native: "Français", flag: "🇫🇷" },
  ua: { native: "Українська", flag: "🇺🇦" },
};

export function isSupportedLang(value: unknown): value is Lang {
  return (
    typeof value === "string" && (SUPPORTED_LANGS as readonly string[]).includes(value)
  );
}
