import React from "react";
import { LanguageProvider } from "@/i18n/language-context";
import { LanguageGate } from "@/components/guest/LanguageGate";

// ============================================================
// Layout za /checkin/** — gost dolazi preko QR koda, često kao
// PRVI posjet uređaja, pa i ovdje mora raditi odabir jezika.
// Bez javnog headera/footera: tok je fokusiran, bez distrakcija.
// ============================================================

export default function CheckinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <LanguageGate />
      {children}
    </LanguageProvider>
  );
}
