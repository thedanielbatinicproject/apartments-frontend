import React from "react";

export default function KontaktPage() {
  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-16 text-center bg-stone-900 text-stone-100">
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-100 mb-4">
        <span className="text-teal-400">Kontakt</span> informacije
      </h1>
      <p className="text-stone-400 max-w-md">
        Informacije o lokaciji, kontakt podaci i poveznice na Booking.com i Airbnb.
      </p>
    </div>
  );
}
