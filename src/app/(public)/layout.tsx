import React from "react";
import { Fraunces } from "next/font/google";
import { LanguageProvider } from "@/i18n/language-context";
import { LanguageGate } from "@/components/guest/LanguageGate";

// ============================================================
// Korijenski javni layout — jezična infrastruktura + display font.
//
// Sve javne rute su višejezične: LanguageProvider drži odabir
// (trajni cookie), a LanguageGate na PRVOM posjetu uređaja
// otvara fullscreen odabir jezika s geo prijedlogom.
//
// Fraunces (--font-display) je OVDJE da ga dijele naslovnica i
// sve podstranice — jedan download, jedan identitet.
//
// Header/footer NISU ovdje: naslovnica ("/") je scenično iskustvo
// bez klasičnog headera, pa klasični chrome živi u podgrupi
// (chrome)/ koja obuhvaća samo podstranice.
// ============================================================

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className={fraunces.variable}>
        <LanguageGate />
        {children}
      </div>
    </LanguageProvider>
  );
}
