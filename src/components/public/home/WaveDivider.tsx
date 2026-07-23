"use client";

// ============================================================
// Valoviti rub između sekcija — scena "teče" iz jedne u drugu
// umjesto tvrdog reza. Boja dolazi iz CSS varijable (paleta doba
// dana), pa se rub uvijek stapa sa sekcijom kojoj pripada.
// ============================================================

interface WaveDividerProps {
  /** CSS boja (u pravilu var(--hs-...)) sekcije ISPOD ruba */
  fill: string;
  /** Okomito zrcaljenje — za zatvaranje sekcije prema sljedećoj */
  flip?: boolean;
  className?: string;
}

export function WaveDivider({ fill, flip = false, className = "" }: WaveDividerProps) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-[clamp(2.5rem,7vw,5rem)] w-full ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        d="M0 90 L0 45 Q120 18 260 38 Q420 60 580 40 Q740 20 900 42 Q1060 64 1200 40 Q1320 22 1440 48 L1440 90 Z"
        style={{ fill }}
      />
    </svg>
  );
}
