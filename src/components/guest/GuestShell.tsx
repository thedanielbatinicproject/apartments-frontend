"use client";

import { ArrowLeft } from "lucide-react";

// ============================================================
// Zajednički okvir za sve javne "gost" tokove (checkin, provjera
// računa...) — mediteranski tamni stil, safe-area header s
// opcionalnim "natrag", centriran naslov + podnaslov.
//
// Izdvojeno iz /checkin/[apartmentId]/page.tsx da ga dijeli i
// /check-invoice bez duplog koda — obje su kratke, fokusirane
// stranice za mobitel, dostupne preko QR koda.
// ============================================================

interface GuestShellProps {
  title: string;
  subtitle?: string | null;
  onBack?: () => void;
  backLabel?: string;
  children: React.ReactNode;
}

export function GuestShell({
  title,
  subtitle,
  onBack,
  backLabel,
  children,
}: GuestShellProps) {
  return (
    <div className="min-h-dvh bg-stone-950 text-stone-100">
      {/* Mediteranski akcenti */}
      <div className="pointer-events-none fixed -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -left-24 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col px-gutter pt-safe pb-safe">
        <header className="flex min-h-[4rem] items-center gap-3 py-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-stone-300 transition-colors active:bg-stone-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-11 w-11 shrink-0" />
          )}

          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-bold text-stone-100">{title}</p>
            {subtitle && (
              <p className="truncate text-xs text-teal-400">{subtitle}</p>
            )}
          </div>

          <div className="h-11 w-11 shrink-0" />
        </header>

        <main className="flex-1 pb-8 pt-2">{children}</main>
      </div>
    </div>
  );
}
