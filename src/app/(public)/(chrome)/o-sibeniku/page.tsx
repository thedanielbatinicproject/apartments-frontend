import type { Metadata } from "next";
import { OSibenikuPageClient } from "@/components/public/about/OSibenikuPageClient";

// ============================================================
// Server wrapper samo radi metadata — vidi apartmani/page.tsx za
// isto obrazloženje (metadata ne radi u "use client" datotekama).
// ============================================================

const TITLE = "O Šibeniku";
const DESCRIPTION =
  "Grad star tisuću godina, branjen sa četiri tvrđave, i nekad jedan od najelektrificiranijih gradova na svijetu. Povijest, tvrđave, Krka i Kornati — sve nadomak apartmana.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/o-sibeniku" },
  openGraph: {
    title: `${TITLE} | Apartments Šibenik`,
    description: DESCRIPTION,
    siteName: "Apartments Šibenik",
    locale: "hr_HR",
    type: "website",
    url: "/o-sibeniku",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | Apartments Šibenik`,
    description: DESCRIPTION,
  },
};

export default function OSibenikuPage() {
  return <OSibenikuPageClient />;
}
