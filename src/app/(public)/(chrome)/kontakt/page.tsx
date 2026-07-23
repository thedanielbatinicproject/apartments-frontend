import type { Metadata } from "next";
import { KontaktPageClient } from "@/components/public/KontaktPageClient";

// ============================================================
// Server wrapper samo radi metadata — vidi apartmani/page.tsx za
// isto obrazloženje (metadata ne radi u "use client" datotekama).
//
// Opis namjerno imenom spominje domaćine (Brigita, Ivica) — ljudi
// koji su već boravili traže baš "brigita apartmani šibenik" i sl.
// ============================================================

const TITLE = "Kontakt";
const DESCRIPTION =
  "Kontaktirajte Brigitu i Ivicu, vaše domaćine u Šibeniku — telefon, e-mail, WhatsApp i lokacija apartmana u kvartu Plišac, u starom gradu.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: `${TITLE} | Apartments Šibenik`,
    description: DESCRIPTION,
    siteName: "Apartments Šibenik",
    locale: "hr_HR",
    type: "website",
    url: "/kontakt",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Apartments Šibenik`,
    description: DESCRIPTION,
  },
};

export default function KontaktPage() {
  return <KontaktPageClient />;
}
