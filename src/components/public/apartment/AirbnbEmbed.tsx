"use client";

import { useEffect } from "react";

// ============================================================
// Pravi Airbnb "Embeddable Listings" widget — ne link-out gumb.
// Airbnb sam skenira DOM za ".airbnb-embed-frame" divove i
// zamjenjuje ih iframeom čim se njihov airbnb_jssdk script izvrši.
//
// Script se dodaje FRESH pri svakom mountu (ne next/script s
// dedupliranjem) — u SPA navigaciji između apartmana svaki novi
// AirbnbEmbed mora ponovno potaknuti sken DOM-a za SVOJ data-id,
// što jedan globalno-učitani (i preskočeni idući put) script ne bi
// napravio pri navigaciji na drugi apartman.
//
// Dva <a> unutar diva su čist HTML fallback (prije nego se script
// izvrši, ili ako je blokiran) — obični, radni linkovi na oglas.
//
// BIJELA POZADINA: sam ".airbnb-embed-frame" div je Airbnbova meta —
// njihov SDK mu po izvršavanju script-a ubacuje iframe (tuđa domena,
// nemamo pristup CSS-u unutra, dizajn kartice je Airbnbov). Zato je
// OVDJE namjerno wrapan u vanjski div koji SDK nikad ne dira (cilja
// isključivo ".airbnb-embed-frame" klasu) — taj vanjski "okvir" nosi
// pozadinu/padding sitea, pa bijela Airbnb kartica sjedi uredno
// uokvirena umjesto da djeluje kao slučajna bijela mrlja.
// ============================================================

interface AirbnbEmbedProps {
  roomId: string;
  fallbackHref: string;
  viewOnAirbnbLabel: string;
  fallbackSummary: string;
}

export function AirbnbEmbed({
  roomId,
  fallbackHref,
  viewOnAirbnbLabel,
  fallbackSummary,
}: AirbnbEmbedProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.airbnb.com/embeddable/airbnb_jssdk";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [roomId]);

  return (
    <div
      className="rounded-2xl p-2.5"
      style={{
        background: "var(--hs-paper)",
        border: "1px solid color-mix(in oklab, var(--hs-text-soft) 15%, transparent)",
      }}
    >
      <div
        className="airbnb-embed-frame mx-auto overflow-hidden rounded-xl"
        data-id={roomId}
        data-view="home"
        data-hide-price="true"
        style={{ width: "100%", maxWidth: 450, height: 300 }}
      >
        <a href={fallbackHref}>{viewOnAirbnbLabel}</a>
        <a href={fallbackHref} rel="nofollow">
          {fallbackSummary}
        </a>
      </div>
    </div>
  );
}
