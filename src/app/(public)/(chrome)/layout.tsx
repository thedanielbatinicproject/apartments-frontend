import React from "react";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { TimePaletteRoot } from "@/components/public/TimePaletteRoot";

// ============================================================
// "Chrome" grupa — podstranice s klasičnim headerom/footerom
// (apartmani, o-sibeniku, kontakt) u NOVOM svijetlom identitetu:
// TimePaletteRoot im daje istu dnevnu paletu kao naslovnici, pa
// header, sadržaj i footer dišu istim svjetlom kroz dan.
//
// Naslovnica ("/") NIJE ovdje — ona je scenični flow bez chromea.
// Route grupe ne mijenjaju URL-ove.
// ============================================================

export default function ChromeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimePaletteRoot>
      <div
        className="flex min-h-dvh flex-col"
        style={{
          background: "var(--hs-paper)",
          color: "var(--hs-text-strong)",
        }}
      >
        <PublicHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <PublicFooter />
      </div>
    </TimePaletteRoot>
  );
}
