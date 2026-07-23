"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, MapPinOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { LanguageProvider, useLanguage } from "@/i18n/language-context";
import { LanguageGate } from "@/components/guest/LanguageGate";

// ============================================================
// Globalna 404 stranica (src/app/not-found.tsx — Next.js je
// prikazuje za svaku putanju koja ne odgovara nijednoj ruti).
//
// Renderira se SAMO unutar root layouta (AuthProvider je ondje,
// pa useAuth() radi bez vlastitog providera), ALI ne unutar
// (public)/checkin/itd. layouta — LanguageProvider zato mora biti
// vlastiti, ovdje, isti obrazac kao checkin/check-invoice.
//
// Admin gumb/link: prikazuje se drukčije ovisno je li netko već
// prijavljen u intranet (učitano iz istog AuthProvider-a kao i
// ostatak aplikacije) — ne pogađa se iz URL-a, stvarno provjerava
// auth stanje.
// ============================================================

function NotFoundContent() {
  const pathname = usePathname() || "/";
  const { user, isLoading } = useAuth();
  const { dict } = useLanguage();
  const t = dict.notFound;

  const description = t.description.replace("{path}", pathname);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-stone-950 px-6 text-center text-stone-100">
      {/* Mediteranski akcenti — isti stil kao ostale javne/gost stranice */}
      <div className="pointer-events-none fixed -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-32 -left-24 h-80 w-80 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative flex w-full max-w-sm flex-col items-center gap-5 pt-safe pb-safe">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-800">
          <MapPinOff className="h-8 w-8 text-stone-400" />
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-teal-400">
            404
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-100">{t.title}</h1>
        </div>

        <p className="text-sm text-stone-400 text-pretty">{description}</p>

        {/* "Bogatiji debug" — stvarno zatražena putanja, dobro vidljiva */}
        <code className="max-w-full break-all rounded-lg border border-stone-700 bg-stone-900 px-3 py-1.5 text-xs text-stone-500">
          {pathname}
        </code>

        <div className="mt-2 flex w-full flex-col gap-2.5">
          <Link
            href="/"
            className="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 text-base font-bold text-stone-950 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]"
          >
            <Home className="h-5 w-5" />
            {t.homeButton}
          </Link>

          {!isLoading && user && (
            <Link
              href="/intranet/dashboard"
              className="inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-red-500/90 px-5 text-base font-bold text-white shadow-lg shadow-red-500/20 transition-all active:scale-[0.98]"
            >
              <LayoutDashboard className="h-5 w-5" />
              {t.adminButton}
            </Link>
          )}
        </div>

        {!isLoading && !user && (
          <p className="mt-2 text-xs text-stone-600">
            {t.adminHint}{" "}
            <Link
              href="/intranet/login"
              className="underline underline-offset-2 transition-colors hover:text-stone-400"
            >
              {t.adminLinkText}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <LanguageProvider>
      {/* Prvi posjet bez odabranog jezika → gate prekriva sadržaj dok
          korisnik ne odabere; ista logika kao checkin/check-invoice. */}
      <LanguageGate />
      <NotFoundContent />
    </LanguageProvider>
  );
}
