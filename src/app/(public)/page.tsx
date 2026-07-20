import React from "react";
import Link from "next/link";

// ============================================================
// Početna stranica — mobile-first.
//
// Ključne promjene:
//  - Fluid tipografija: naslov skalira od 2rem (SE) do 4rem (desktop)
//  - Vertikalni razmaci počinju mali (py-12) pa rastu
//  - Kartice: 1 stupac → 2 (xs) → 3 (md); prije su bile 1 pa odmah 3
//  - CTA gumbi su full-width na uskim ekranima (lakše ih je pogoditi)
//  - min-h-[80vh] → min-h-[70dvh] (vh na iOS-u računa i URL traku,
//    pa je hero ispadao viši od ekrana)
// ============================================================

const APARTMENTS = [
  {
    name: "Apartman Oliva",
    size: "Za 2+2 osobe",
    desc: "Suvremeni dizajn s terasom i pogledom na maslinik.",
  },
  {
    name: "Apartman Levant",
    size: "Za 4 osobe",
    desc: "Prostran i osvijetljen apartman s pogledom na more.",
  },
  {
    name: "Apartman Maestral",
    size: "Za 2 osobe",
    desc: "Romantični studio u potkrovlju za savršen par.",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-stone-950 via-slate-900 to-stone-900">
      {/* Pozadinski gradijent */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900/50 to-stone-950/90" />

      {/* ---------- HERO ---------- */}
      <section className="mx-auto flex min-h-[70dvh] max-w-3xl flex-col items-center justify-center px-5 py-14 text-center sm:px-6 sm:py-20">
        <span className="inline-block rounded-full border border-teal-800/40 bg-teal-950/50 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-teal-400 text-balance sm:text-xs sm:tracking-widest">
          Mediteranski Luksuz u Srcu Dalmacije
        </span>

        <h1 className="mt-5 text-[clamp(2rem,9vw,4rem)] font-bold leading-[1.1] tracking-tight text-stone-100 text-balance">
          Apartments{" "}
          <span className="bg-gradient-to-r from-teal-400 to-amber-200 bg-clip-text text-transparent">
            Šibenik
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-stone-400 text-pretty sm:text-lg">
          Dobrodošli u našu novu web aplikaciju! Trenutno radimo na
          inicijalizaciji projekta i postavljanju strukture. Ovdje će uskoro
          poletjeti naša interaktivna ptica i zasjati luksuzni mediteranski
          ugođaj.
        </p>

        {/* CTA — full-width stupac na mobitelu, red na širim ekranima */}
        <div className="mt-8 flex w-full max-w-xs flex-col gap-3 xs:max-w-none xs:flex-row xs:justify-center">
          <Link
            href="/apartmani"
            className="flex min-h-[3rem] items-center justify-center rounded-full bg-teal-500 px-6 font-semibold text-stone-950 shadow-lg shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-400 hover:shadow-teal-400/30 active:scale-[0.98]"
          >
            Pregledaj Apartmane
          </Link>
          <Link
            href="/intranet/dashboard"
            className="flex min-h-[3rem] items-center justify-center rounded-full border border-stone-800 bg-stone-900 px-6 font-semibold text-stone-300 transition-all duration-300 hover:bg-stone-800 hover:text-stone-100 active:scale-[0.98]"
          >
            Intranet
          </Link>
        </div>
      </section>

      {/* ---------- KARTICE APARTMANA ---------- */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:px-6 sm:pb-24">
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
          {APARTMENTS.map((apt) => (
            <article
              key={apt.name}
              className="group rounded-2xl border border-stone-800/60 bg-stone-900/50 p-5 text-left backdrop-blur-sm transition-all duration-300 hover:border-teal-500/40 hover:bg-stone-900/80 active:scale-[0.99] sm:p-6"
            >
              <div className="mb-4 h-1.5 w-12 rounded-full bg-teal-500 transition-all duration-300 group-hover:w-20" />
              <h3 className="text-lg font-bold text-stone-100 text-balance sm:text-xl">
                {apt.name}
              </h3>
              <span className="mt-1 block text-xs font-semibold text-teal-400/80">
                {apt.size}
              </span>
              <p className="mt-2 text-sm text-stone-400 text-pretty">
                {apt.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
