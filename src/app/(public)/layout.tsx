import React from "react";
import Link from "next/link";
import { PublicMobileMenu } from "@/components/public/PublicMobileMenu";

// ============================================================
// Javni layout — mobile-first.
//
// Ključne promjene:
//  - Dodan mobilni izbornik (prije nije postojao nikakav način
//    navigacije ispod md breakpointa)
//  - Header koristi pt-safe da ne završi ispod notcha
//  - "Rezerviraj" gumb se na najmanjim ekranima skriva (CTA je
//    unutar mobilnog izbornika) da header ne bude pretrpan
//  - min-h-dvh umjesto min-h-screen (iOS URL traka)
// ============================================================

const NAV_LINKS = [
  { href: "/", label: "Početna" },
  { href: "/apartmani", label: "Apartmani" },
  { href: "/o-sibeniku", label: "O Šibeniku" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-stone-900 text-stone-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Zaglavlje */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-md pt-safe px-safe">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="truncate text-base font-bold tracking-tight text-stone-100 sm:text-xl">
              Apartments <span className="text-teal-400">Šibenik</span>
            </span>
          </Link>

          {/* Desktop navigacija */}
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-teal-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            {/* CTA — skriven na najužim ekranima, dostupan u mobilnom izborniku */}
            <Link
              href="/kontakt"
              className="hidden min-h-[2.25rem] items-center rounded-full bg-teal-500 px-4 text-xs font-semibold text-stone-950 transition-all duration-300 hover:bg-teal-400 active:scale-95 xs:flex sm:inline-flex"
            >
              Rezerviraj
            </Link>

            {/* Mobilni izbornik */}
            <PublicMobileMenu />
          </div>
        </div>
      </header>

      {/* Glavni sadržaj */}
      <main className="flex-1">{children}</main>

      {/* Podnožje */}
      <footer className="border-t border-stone-800 bg-stone-950 pb-safe px-safe">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-stone-500 sm:px-6 lg:px-8">
          <nav className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 transition-colors hover:text-teal-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-balance">
            © {new Date().getFullYear()} Apartments Šibenik. Sva prava
            pridržana.
          </p>
        </div>
      </footer>
    </div>
  );
}
