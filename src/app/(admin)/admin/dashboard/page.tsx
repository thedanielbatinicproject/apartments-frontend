import React from "react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Dobrodošli natrag!</h2>
        <p className="text-sm text-zinc-400 mt-1">Brzi pregled stanja apartmana i sustava.</p>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Popunjenost (Ovaj Mjesec)", value: "85%", change: "+12% u odnosu na prošli mjesec" },
          { title: "Prihod (Srpanj)", value: "€4,820", change: "Očekivano još €1,200 do kraja mjeseca" },
          { title: "Solar (Trenutna Proizvodnja)", value: "3.4 kW", change: "Sustav radi stabilno (WebSocket aktivan)" },
          { title: "Recenzije", value: "4.9 / 5.0", change: "Ukupno 128 recenzija" }
        ].map((stat, idx) => (
          <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
            <p className="text-3xl font-bold text-zinc-100 mt-2">{stat.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Shortcut quick links / modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Recent activities / notifications */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-zinc-200">Brze Akcije</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/invoices"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-teal-500/40 transition-all text-center"
            >
              <span className="text-xs font-bold text-zinc-300">Novi Račun / Ponuda</span>
            </a>
            <a
              href="/admin/solar"
              className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/40 hover:border-teal-500/40 transition-all text-center"
            >
              <span className="text-xs font-bold text-zinc-300">Solar Očitanja</span>
            </a>
          </div>
        </div>

        {/* Right Side: Quick info */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">Informacije o sustavu</h3>
          <div className="space-y-3 text-sm text-zinc-400">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span>Verzija Frontenda:</span>
              <span className="text-zinc-200">1.0.0 (Next.js 15 App Router)</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span>Status API-ja:</span>
              <span className="text-teal-400 font-semibold">Povezan</span>
            </div>
            <div className="flex justify-between">
              <span>Baza podataka:</span>
              <span className="text-zinc-200">PostgreSQL + TimescaleDB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
