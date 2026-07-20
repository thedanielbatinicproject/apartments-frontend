"use client";

import { useEffect } from "react";

// ============================================================
// Zaključavanje scrolla pozadine — s BROJAČEM.
//
// ZAŠTO BROJAČ: prije je svaka komponenta sama radila
//   const original = document.body.style.overflow;
//   document.body.style.overflow = "hidden";
//   return () => { document.body.style.overflow = original; }
//
// To puca kad se dva sloja preklope. Konkretan slučaj:
//   1. Detalj prijave se otvori  → sprema original "", stavlja hidden
//   2. Dijalog potvrde se otvori → sprema original "hidden" (!), stavlja hidden
//   3. Korisnik potvrdi brisanje → detalj se odmah unmounta, vraća ""
//   4. Dijalog se zatvara s odgodom → vraća SVOJ original "hidden"
//   → stranica ostaje trajno zaključana
//
// S brojačem se zaključavanje otpušta tek kad ga nitko više ne
// drži, a izvorna vrijednost se pamti samo jednom.
// ============================================================

let lockCount = 0;
let originalOverflow: string | null = null;

function acquire() {
  if (typeof document === "undefined") return;

  if (lockCount === 0) {
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  lockCount++;
}

function release() {
  if (typeof document === "undefined") return;

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.body.style.overflow = originalOverflow ?? "";
    originalOverflow = null;
  }
}

/**
 * Zaključava scroll dok je `active` true.
 * Sigurno je imati više aktivnih odjednom (dijalog nad dijalogom).
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    acquire();
    return release;
  }, [active]);
}
