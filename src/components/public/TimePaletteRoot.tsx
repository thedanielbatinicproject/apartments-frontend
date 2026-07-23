"use client";

import { useTimeOfDay } from "@/components/public/home/useTimeOfDay";
import { StoneDefs } from "@/components/public/home/StoneDefs";

// ============================================================
// Omotač koji podstranicama daje ISTU dnevnu paletu (--hs-*) kao
// naslovnica — cijeli javni dio sitea diše istim svjetlom kroz dan.
// Do prvog izračuna palete (poznata tek na klijentu) sadržaj je
// nevidljiv i meko se pojavi — bez bljeska krivih boja.
// ============================================================

export function TimePaletteRoot({ children }: { children: React.ReactNode }) {
  const tod = useTimeOfDay();
  const ready = tod !== null;

  return (
    <div
      style={{
        ...(tod ? (tod.cssVars as React.CSSProperties) : undefined),
        opacity: ready ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}
      className="flex min-h-dvh flex-col"
    >
      <StoneDefs />
      {children}
    </div>
  );
}
