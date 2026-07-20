"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Printer, Download, Loader2 } from "lucide-react";
import {
  formPdfPath,
  apartmentName,
  languageName,
} from "@/lib/checkin-forms";
import { LoadingState } from "@/components/intranet/ui/DataStates";

// ============================================================
// /intranet/forms/print — otvara PDF i pokreće dijalog za ispis.
//
// PDF je u <iframe> istog porijekla, pa se print() može pozvati
// izravno na njegovom prozoru — tako dijalog dobije baš PDF, a
// ne stranicu oko njega.
//
// Automatski poziv NIJE zajamčen: neki preglednici ga blokiraju
// ako nije rezultat korisničkog klika, a mobilni Safari nema
// ugrađeni PDF viewer u iframeu. Zato ispod uvijek stoji i ručni
// gumb — automatika je pogodnost, ne jedini put.
// ============================================================

function PrintFormContent() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const apartmentId = Number(searchParams.get("apartment"));
  const lang = searchParams.get("lang") ?? "";

  const [isReady, setIsReady] = useState(false);
  const [autoPrintFailed, setAutoPrintFailed] = useState(false);
  const hasAutoPrinted = useRef(false);

  const isValid = Number.isFinite(apartmentId) && apartmentId > 0 && lang !== "";
  const pdfPath = isValid ? formPdfPath(apartmentId, lang) : null;

  const triggerPrint = () => {
    const frame = iframeRef.current;

    try {
      if (frame?.contentWindow) {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return true;
      }
    } catch {
      // Cross-origin ili preglednik bez PDF viewera u iframeu
    }

    setAutoPrintFailed(true);
    return false;
  };

  // Automatski dijalog čim se PDF učita
  useEffect(() => {
    if (!isReady || hasAutoPrinted.current) return;

    hasAutoPrinted.current = true;
    // Kratka odgoda — PDF viewer treba trenutak da se inicijalizira
    const timer = setTimeout(() => triggerPrint(), 700);
    return () => clearTimeout(timer);
  }, [isReady]);

  if (!isValid || !pdfPath) {
    return (
      <div className="space-y-4">
        <BackLink />
        <p className="text-sm text-muted-foreground">
          Nedostaje odabir apartmana ili jezika.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BackLink />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {apartmentName(apartmentId)}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Obrazac na jeziku: {languageName(lang)}
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={pdfPath}
            download
            className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold text-foreground transition-colors active:scale-95"
          >
            <Download className="h-4 w-4" />
            Preuzmi
          </a>

          <button
            type="button"
            onClick={triggerPrint}
            className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            Ispiši
          </button>
        </div>
      </div>

      {autoPrintFailed && (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground text-pretty">
          Dijalog za ispis nije se otvorio sam. Kliknite{" "}
          <strong>Ispiši</strong> gore, ili preuzmite PDF pa ga ispišite iz
          preglednika.
        </p>
      )}

      {/* Pregled PDF-a */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted/30">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Učitavanje obrasca...
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={pdfPath}
          title={`Obrazac za ${apartmentName(apartmentId)} (${languageName(lang)})`}
          onLoad={() => setIsReady(true)}
          className="h-[70dvh] w-full lg:h-[80dvh]"
        />
      </div>

      <p className="text-center text-xs text-muted-foreground text-pretty">
        U dijalogu za ispis odaberite stvarnu veličinu (100 %), bez prilagodbe
        stranici — inače se pozicijski kvadratići pomaknu i skeniranje neće
        prepoznati obrazac.
      </p>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/intranet/forms"
      className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Odabir obrasca
    </Link>
  );
}

export default function PrintFormPage() {
  return (
    <Suspense fallback={<LoadingState label="Priprema obrasca..." />}>
      <PrintFormContent />
    </Suspense>
  );
}
