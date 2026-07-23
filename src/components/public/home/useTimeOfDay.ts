"use client";

import { useEffect, useState } from "react";
import { computeTimeOfDay, type TimeOfDayState } from "./time-palette";

// ============================================================
// Trenutna dnevna paleta — računa se tek NAKON mounta (server ne
// zna posjetiteljevo lokalno vrijeme, pa bi SSR vrijednost radila
// hydration mismatch i bljesak krive palete). Do prvog izračuna
// vraća null; hero se u međuvremenu drži nevidljivim i otkriva se
// ulaznom animacijom, pa korisnik nikad ne vidi skok boja.
//
// Osvježava se svake minute (koraci interpolacije su neprimjetni)
// i odmah po povratku u tab (visibilitychange) — laptop koji se
// probudi navečer ne smije 60 s prikazivati popodnevnu paletu.
// ============================================================

const TICK_MS = 60_000;

export function useTimeOfDay(): TimeOfDayState | null {
  const [state, setState] = useState<TimeOfDayState | null>(null);

  useEffect(() => {
    const update = () => setState(computeTimeOfDay(new Date()));
    update();

    const interval = window.setInterval(update, TICK_MS);
    const onVisibility = () => {
      if (!document.hidden) update();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return state;
}
