import React from "react";

export default function ApartmaniPage() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-16 text-center bg-stone-900 text-stone-100">
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-100 mb-4">
        Naši <span className="text-teal-400">Apartmani</span>
      </h1>
      <p className="text-stone-400 max-w-md">
        Ovdje će biti izlistana naša 3 apartmana s galerijom slika, cijenama i detaljima koje pruža backend.
      </p>
    </div>
  );
}
