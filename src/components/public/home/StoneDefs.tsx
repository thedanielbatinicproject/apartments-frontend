"use client";

// ============================================================
// Organska tekstura kamena — SVG pattern s NEPRAVILNIM fugama
// (valovite linije, pomaknuti redovi, poneki "kamen" ispušten),
// namjerno NE mreža savršenih pravokutnika.
//
// Renderira se JEDNOM po dokumentu (skriveni <svg> s <defs>);
// svi ostali SVG-ovi u istom dokumentu referiraju fill/overlay
// preko url(#hs-stone). Boje fuga se miješaju iz --hs-city pa
// tekstura prati dnevnu paletu (danju svijetli vapnenac s mekim
// sjenama, noću jedva vidljiva).
// ============================================================

export function StoneDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        <pattern
          id="hs-stone"
          patternUnits="userSpaceOnUse"
          width="72"
          height="52"
          patternTransform="rotate(-1.5)"
        >
          {/* Vodoravne fuge — valovite, svaka drukčija */}
          <path
            d="M-4 11 Q8 9 20 11.5 T44 10.5 T68 12 T78 11"
            fill="none"
            style={{ stroke: "color-mix(in oklab, var(--hs-city) 55%, #17130e)" }}
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M-4 27 Q10 29 24 27 T50 28.5 T78 27"
            fill="none"
            style={{ stroke: "color-mix(in oklab, var(--hs-city) 55%, #17130e)" }}
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M-4 43 Q12 41 26 43.5 T54 42 T78 43.5"
            fill="none"
            style={{ stroke: "color-mix(in oklab, var(--hs-city) 55%, #17130e)" }}
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Okomite fuge — kratke, razmaknute, pomaknute po redu */}
          <path
            d="M17 1 Q18 5 17 10 M49 0 Q48 5 49 10.5 M33 12 Q34 19 33 26 M62 12.5 Q61 20 62 27 M9 28 Q10 35 9 42 M41 28.5 Q40 35 41 42 M25 44 Q26 47 25 51 M57 43.5 Q58 47 57 52"
            fill="none"
            style={{ stroke: "color-mix(in oklab, var(--hs-city) 55%, #17130e)" }}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.32"
          />
          {/* Poneka svijetla brida — kamen uhvati svjetlo */}
          <path
            d="M20 13 Q30 12 32 13 M50 29.5 Q58 29 61 30 M10 44.5 Q18 44 22 45"
            fill="none"
            style={{ stroke: "color-mix(in oklab, var(--hs-city) 60%, #ffffff)" }}
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.35"
          />
        </pattern>
      </defs>
    </svg>
  );
}
