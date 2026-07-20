"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Home,
  Loader2,
  AlertTriangle,
  Download,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FORM_APARTMENTS,
  FORM_LANGUAGES,
  formPdfPath,
  formPdfExists,
  apartmentName,
  languageName,
} from "@/lib/checkin-forms";

// ============================================================
// /intranet/forms — ispis praznih obrazaca za prijavu gostiju.
//
// Tok je namjerno u dva jasna koraka (apartman → jezik) s
// rečenicom koja sažima izbor prije ispisa, jer se obrazac za
// krivi apartman primijeti tek kad ga gost već ispuni — oznaka
// apartmana je otisnuta na papiru.
// ============================================================

export default function FormsPage() {
  const router = useRouter();

  const [apartmentId, setApartmentId] = useState<number | null>(null);
  const [lang, setLang] = useState<string | null>(null);
  const [exists, setExists] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Provjeri postoji li PDF čim su oba izbora poznata
  useEffect(() => {
    if (apartmentId == null || !lang) {
      setExists(null);
      return;
    }

    let cancelled = false;
    setIsChecking(true);

    void formPdfExists(apartmentId, lang).then((ok) => {
      if (!cancelled) {
        setExists(ok);
        setIsChecking(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [apartmentId, lang]);

  const isReady = apartmentId != null && lang != null;
  const canPrint = isReady && exists === true;

  const openPrint = () => {
    if (!canPrint) return;
    router.push(`/intranet/forms/print?apartment=${apartmentId}&lang=${lang}`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          Ispis obrazaca
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
          Prazan obrazac za prijavu gostiju. Ispisani obrazac gost ispuni
          rukom, a vi ga poslije skenirate.
        </p>
      </div>

      {/* --- 1. Apartman --- */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          <span className="mr-1.5 text-muted-foreground">1.</span>
          Za koji apartman?
        </h3>

        <div className="grid grid-cols-1 gap-2.5 xs:grid-cols-3">
          {FORM_APARTMENTS.map((apartment) => {
            const isActive = apartmentId === apartment.id;

            return (
              <button
                key={apartment.id}
                type="button"
                onClick={() => setApartmentId(apartment.id)}
                className={cn(
                  "flex min-h-[5rem] flex-col items-center justify-center gap-1.5 rounded-2xl border p-4 text-center transition-all active:scale-[0.98]",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                )}
              >
                <Home
                  className={cn(
                    "h-5 w-5",
                    isActive ? "opacity-90" : "text-muted-foreground"
                  )}
                />
                <span className="text-sm font-semibold text-balance">
                  {apartment.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- 2. Jezik --- */}
      <section className={cn("space-y-3", apartmentId == null && "opacity-50")}>
        <h3 className="text-sm font-semibold text-foreground">
          <span className="mr-1.5 text-muted-foreground">2.</span>
          Na kojem jeziku?
        </h3>

        <div className="grid grid-cols-2 gap-2.5 xs:grid-cols-3">
          {FORM_LANGUAGES.map((language) => {
            const isActive = lang === language.code;

            return (
              <button
                key={language.code}
                type="button"
                disabled={apartmentId == null}
                onClick={() => setLang(language.code)}
                className={cn(
                  "flex min-h-[3.5rem] items-center justify-center gap-2 rounded-2xl border px-3 text-center transition-all active:scale-[0.98] disabled:cursor-not-allowed",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground"
                )}
              >
                <span className="text-lg leading-none">{language.flag}</span>
                <span className="text-sm font-semibold">{language.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* --- 3. Sažetak i ispis --- */}
      {isReady && (
        <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-sm text-foreground text-pretty">
            Ispiši obrazac za{" "}
            <strong>{apartmentName(apartmentId)}</strong> na jeziku{" "}
            <strong>{languageName(lang)}</strong>.
          </p>

          {isChecking && (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Provjeravam obrazac...
            </p>
          )}

          {exists === false && !isChecking && (
            <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-50 px-3.5 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800 text-pretty dark:text-amber-300">
                Ovaj obrazac još nije izrađen. Nedostaje datoteka{" "}
                <code className="font-mono">
                  {formPdfPath(apartmentId, lang).replace("/forms/", "")}
                </code>{" "}
                u mapi <code className="font-mono">public/forms</code>.
              </p>
            </div>
          )}

          {exists === true && (
            <>
              <button
                type="button"
                onClick={openPrint}
                className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground transition-all active:scale-[0.99] sm:min-h-[3rem] sm:text-sm"
              >
                <Printer className="h-5 w-5" />
                Ispiši obrazac
              </button>

              <a
                href={formPdfPath(apartmentId, lang)}
                download
                className="inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors active:bg-muted"
              >
                <Download className="h-4 w-4" />
                Preuzmi PDF
              </a>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Ispisujte u stvarnoj veličini (100 %), bez prilagodbe stranici
              </p>
            </>
          )}
        </section>
      )}

      {!isReady && (
        <p className="text-center text-xs text-muted-foreground">
          Odaberite apartman i jezik da nastavite.
        </p>
      )}
    </div>
  );
}
