import type { Metadata } from "next";
import { ApartmaniPageClient } from "@/components/public/apartment/ApartmaniPageClient";

// ============================================================
// Server wrapper samo radi metadata — ApartmaniPageClient je "use client"
// (dohvaća apartmane preko useAsync), a metadata export ne radi u
// client komponentama.
// ============================================================

const TITLE = "Apartmani";
const DESCRIPTION =
  "Tri obiteljska apartmana u starom gradu Šibeniku — Apartman s vrtom, Studio apartman i Soba apartman. Pogledajte fotografije, raspoloživost i recenzije gostiju.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/apartmani" },
  openGraph: {
    title: `${TITLE} | Apartments Šibenik`,
    description: DESCRIPTION,
    siteName: "Apartments Šibenik",
    locale: "hr_HR",
    type: "website",
    url: "/apartmani",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Apartments Šibenik`,
    description: DESCRIPTION,
  },
};

export default function ApartmaniPage() {
  return <ApartmaniPageClient />;
}
