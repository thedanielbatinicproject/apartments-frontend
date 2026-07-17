import React from "react";

export default function HomePage() {
  return (
    <div className="relative min-h-[80vh] flex flex-col justify-center items-center px-4 py-20 text-center overflow-hidden bg-gradient-to-b from-stone-950 via-slate-900 to-stone-900">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-900/50 to-stone-950/90 -z-10" />
      
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-teal-400 uppercase bg-teal-950/50 rounded-full border border-teal-800/40">
          Mediteranski Luksuz u Srcu Dalmacije
        </span>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-100">
          Apartments <span className="bg-gradient-to-r from-teal-400 to-amber-200 bg-clip-text text-transparent">Šibenik</span>
        </h1>
        
        <p className="text-lg text-stone-400 max-w-xl mx-auto leading-relaxed">
          Dobrodošli u našu novu web aplikaciju! Trenutno radimo na inicijalizaciji projekta i postavljanju strukture. Ovdje će uskoro poletjeti naša interaktivna ptica i zasjati luksuzni mediteranski ugođaj.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            href="/apartmani"
            className="px-6 py-3 rounded-full bg-teal-500 text-stone-950 font-semibold shadow-lg shadow-teal-500/20 hover:bg-teal-400 hover:shadow-teal-400/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Pregledaj Apartmane
          </a>
          <a
            href="/admin/dashboard"
            className="px-6 py-3 rounded-full bg-stone-900 text-stone-300 font-semibold border border-stone-800 hover:bg-stone-800 hover:text-stone-100 transition-all duration-300"
          >
            Admin Panel
          </a>
        </div>
      </div>

      {/* Apartment placeholders preview */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
        {[
          { name: "Apartman Oliva", size: "Za 2+2 osobe", desc: "Suvremeni dizajn s terasom i pogledom na maslinik." },
          { name: "Apartman Levant", size: "Za 4 osobe", desc: "Prostran i osvijetljen apartman s pogledom na more." },
          { name: "Apartman Maestral", size: "Za 2 osobe", desc: "Romantični studio u potkrovlju za savršen par." }
        ].map((apt, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-stone-800/60 bg-stone-900/50 backdrop-blur-sm hover:border-teal-500/40 hover:bg-stone-900/80 transition-all duration-300 text-left group"
          >
            <div className="h-2 w-12 bg-teal-500 rounded-full mb-4 group-hover:w-20 transition-all duration-300" />
            <h3 className="text-xl font-bold text-stone-100">{apt.name}</h3>
            <span className="text-xs text-teal-400/80 block mt-1 font-semibold">{apt.size}</span>
            <p className="text-sm text-stone-400 mt-2">{apt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
