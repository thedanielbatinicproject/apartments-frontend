"use client";

import { useEffect, useState } from "react";
import { Check, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/language-context";
import {
  SUPPORTED_LANGS,
  LANG_META,
  type Lang,
  isSupportedLang,
} from "@/i18n/config";
import { api } from "@/lib/api/client";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { Portal } from "@/components/ui/portal";

// ============================================================
// Fullscreen odabir jezika — prvi posjet uređaja.
//
// UI je NAMJERNO NA ENGLESKOM: korisnik još nije odabrao jezik,
// pa je engleski jedini razuman zajednički nazivnik. Nazivi
// jezika su na vlastitom jeziku (Deutsch, Українська...) jer
// svatko prepoznaje svoj.
//
// Backend preko IP-a predloži jezik (GET /api/geo/detect-language)
// — prijedlog se predoznači, ali NIŠTA se ne bira automatski:
// jedan dodir potvrđuje ili mijenja. Ako geo poziv padne, samo
// nema predoznake; popup radi dalje.
// ============================================================

interface GeoResponse {
  detectedCountry: string;
  suggestedLanguage: string;
}

export function LanguageGate() {
  const { needsSelection, setLang } = useLanguage();
  const [suggested, setSuggested] = useState<Lang | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useScrollLock(needsSelection);

  useEffect(() => {
    if (!needsSelection) return;

    let cancelled = false;
    setIsDetecting(true);

    api
      .get<GeoResponse>("/api/geo/detect-language", { skipAuth: true })
      .then((geo) => {
        if (cancelled) return;
        if (isSupportedLang(geo.suggestedLanguage)) {
          setSuggested(geo.suggestedLanguage);
        }
      })
      .catch(() => {
        // Geo je samo pogodnost — bez prijedloga, bez greške
      })
      .finally(() => {
        if (!cancelled) setIsDetecting(false);
      });

    return () => {
      cancelled = true;
    };
  }, [needsSelection]);

  if (!needsSelection) return null;

  return (
    <Portal>
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose your language"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/85 backdrop-blur-xl"
    >
      {/* Mediteranski akcenti — isti stil kao javni dio */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-5 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/15">
            <Globe className="h-7 w-7 text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-stone-100">
            Choose your language
          </h1>
          <p className="mt-1 text-sm text-stone-400">
            {isDetecting ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Detecting your language…
              </span>
            ) : (
              "You can change this later at any time."
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SUPPORTED_LANGS.map((code) => {
            const meta = LANG_META[code];
            const isSuggested = suggested === code;

            return (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  "relative flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-2xl border px-3 transition-all active:scale-[0.97]",
                  isSuggested
                    ? "border-teal-400 bg-teal-500/15 text-stone-100"
                    : "border-stone-700/60 bg-stone-900/60 text-stone-200"
                )}
              >
                {isSuggested && (
                  <span className="absolute -top-2.5 inline-flex items-center gap-1 rounded-full bg-teal-500 px-2 py-0.5 text-[0.625rem] font-bold text-stone-950">
                    <Check className="h-2.5 w-2.5" />
                    Suggested
                  </span>
                )}
                <span className="text-2xl leading-none">{meta.flag}</span>
                <span className="text-sm font-semibold">{meta.native}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
    </Portal>
  );
}

/**
 * Mali globus u headeru — ponovno otvara odabir jezika.
 * Prikazuje trenutnu zastavu radi orijentacije.
 */
export function LanguageSwitcherButton() {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useScrollLock(isOpen);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Change language"
        className="tap-target flex items-center justify-center gap-1 rounded-full text-stone-300 transition-colors active:bg-stone-800/60"
      >
        <span className="text-base leading-none">{LANG_META[lang].flag}</span>
      </button>

      {/* Portal je OBAVEZAN: gumb živi u headeru s backdrop-blur,
          koji postaje containing block za fixed — bez portala se
          "fullscreen" popup crta unutar 56 px visokog headera. */}
      {isOpen && (
        <Portal>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose your language"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/85 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative mx-5 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-2.5">
              {SUPPORTED_LANGS.map((code) => {
                const meta = LANG_META[code];
                const isActive = lang === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setLang(code);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-2xl border px-3 transition-all active:scale-[0.97]",
                      isActive
                        ? "border-teal-400 bg-teal-500/15 text-stone-100"
                        : "border-stone-700/60 bg-stone-900/60 text-stone-200"
                    )}
                  >
                    <span className="text-2xl leading-none">{meta.flag}</span>
                    <span className="text-sm font-semibold">{meta.native}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        </Portal>
      )}
    </>
  );
}
