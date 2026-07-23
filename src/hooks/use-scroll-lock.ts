"use client";

import { useEffect } from "react";

// ============================================================
// Zaključavanje scrolla pozadine — s BROJAČEM, na <html> I <body>.
//
// DVIJE LEKCIJE UGRAĐENE OVDJE (obje su bile stvarni bugovi):
//
// 1. BROJAČ: kad se dva sloja preklope (dijalog iznad detalja),
//    naivno "spremi original / vrati original" ostavi stranicu
//    trajno zaključanom — drugi sloj kao "original" zapamti
//    hidden prvoga. Brojač otpušta tek kad nitko ne drži.
//
// 2. <html>, NE SAMO <body>: overflow s bodyja se propagira na
//    viewport SAMO dok je html overflow `visible`. Naš globals
//    stavlja `overflow-x: clip` na html (nužno za sticky), čime
//    je propagacija prekinuta — i `body { overflow: hidden }`
//    više NIŠTA ne zaključava. Zato se zaključava documentElement,
//    a body uz njega radi potpunosti.
// ============================================================

let lockCount = 0;
let originalHtmlOverflow: string | null = null;
let originalBodyOverflow: string | null = null;

function acquire() {
  if (typeof document === "undefined") return;

  if (lockCount === 0) {
    originalHtmlOverflow = document.documentElement.style.overflow;
    originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  lockCount++;
}

function release() {
  if (typeof document === "undefined") return;

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.documentElement.style.overflow = originalHtmlOverflow ?? "";
    document.body.style.overflow = originalBodyOverflow ?? "";
    originalHtmlOverflow = null;
    originalBodyOverflow = null;
  }
}

/**
 * Zaključava scroll dok je `active` true.
 * Sigurno za više aktivnih odjednom (dijalog nad dijalogom).
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    acquire();
    return release;
  }, [active]);
}
