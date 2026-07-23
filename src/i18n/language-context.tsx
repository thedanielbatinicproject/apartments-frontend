"use client";

// ============================================================
// Language Context — jezik za SVE javne rute (sve osim /intranet).
//
// Odabir se čuva u trajnom cookieju: jedan uređaj = jedan odabir.
// `needsSelection` je true dok cookie ne postoji — na to se veže
// fullscreen LanguageGate na prvom posjetu.
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import {
  type Lang,
  DEFAULT_LANG,
  LANG_COOKIE,
  LANG_COOKIE_DAYS,
  isSupportedLang,
} from "./config";
import type { Dictionary } from "./dictionaries/en";
import { en } from "./dictionaries/en";
import { hr } from "./dictionaries/hr";
import { de } from "./dictionaries/de";
import { it } from "./dictionaries/it";
import { fr } from "./dictionaries/fr";
import { ua } from "./dictionaries/ua";

// Svi rječnici su uvezeni statički — ukupno su maleni (tekst),
// a statički import znači da promjena jezika radi trenutno i
// offline, bez network roundtripa po rječnik.
const DICTIONARIES: Record<Lang, Dictionary> = { en, hr, de, it, fr, ua };

interface LanguageContextValue {
  lang: Lang;
  dict: Dictionary;
  setLang: (lang: Lang) => void;
  /** true dok korisnik još nikad nije odabrao jezik (nema cookieja) */
  needsSelection: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [needsSelection, setNeedsSelection] = useState(false);

  // Cookie se čita tek nakon mounta — pri SSR-u ga nema, pa bi
  // čitanje u initializeru izazvalo hydration mismatch.
  useEffect(() => {
    const stored = Cookies.get(LANG_COOKIE);
    if (isSupportedLang(stored)) {
      setLangState(stored);
    } else {
      setNeedsSelection(true);
    }
  }, []);

  const setLang = useCallback((next: Lang) => {
    Cookies.set(LANG_COOKIE, next, {
      expires: LANG_COOKIE_DAYS,
      sameSite: "lax",
    });
    setLangState(next);
    setNeedsSelection(false);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dict: DICTIONARIES[lang],
      setLang,
      needsSelection,
    }),
    [lang, setLang, needsSelection]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage mora biti pozvan unutar <LanguageProvider>.");
  }
  return ctx;
}
