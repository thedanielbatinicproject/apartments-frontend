import React from "react";
import { LanguageProvider } from "@/i18n/language-context";
import { LanguageGate } from "@/components/guest/LanguageGate";

// ============================================================
// Layout za /check-invoice — javna provjera računa preko QR koda/
// UID-a otisnutog na PDF-u. Dolazi ovamo tko god skenira QR (gost,
// porezna vlast...), često prvi posjet uređaja, pa treba isti
// odabir jezika kao /checkin. Bez javnog headera/footera — kratak,
// fokusiran alat, ne dio marketing stranice.
// ============================================================

export default function CheckInvoiceLayout({
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
