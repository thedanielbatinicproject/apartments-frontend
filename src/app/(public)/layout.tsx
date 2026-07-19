import React from "react";
import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-900 text-stone-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Jednostavno zaglavlje */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-800 bg-stone-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-stone-100">
              Apartments <span className="text-teal-400">Šibenik</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-teal-400">Početna</Link>
            <Link href="/apartmani" className="transition-colors hover:text-teal-400">Apartmani</Link>
            <Link href="/o-sibeniku" className="transition-colors hover:text-teal-400">O Šibeniku</Link>
            <Link href="/kontakt" className="transition-colors hover:text-teal-400">Kontakt</Link>
          </nav>
          <Link
            href="/kontakt"
            className="rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-stone-950 hover:bg-teal-400 transition-all duration-300"
          >
            Rezerviraj
          </Link>
        </div>
      </header>

      {/* Glavni sadržaj */}
      <main className="flex-1">{children}</main>

      {/* Podnožje */}
      <footer className="border-t border-stone-800 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Apartments Šibenik. Sva prava pridržana.</p>
        </div>
      </footer>
    </div>
  );
}
