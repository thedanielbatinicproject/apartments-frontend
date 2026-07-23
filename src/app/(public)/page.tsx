import type { Metadata } from "next";
import { HomeFlow } from "@/components/public/home/HomeFlow";
import { HOSTS, ADDRESS } from "@/lib/contact-info";

// ============================================================
// Naslovnica — scenično iskustvo bez klasičnog headera: jedan
// kontinuirani flow (hero → apartmani → o-Šibeniku → kontakt),
// vidi HomeFlow.tsx. Fraunces (--font-display) dolazi iz
// (public)/layout.tsx — dijeli ga cijeli javni dio.
//
// Title/description za "/" dolaze iz root layouta (metadata.title.default
// je već napisan kao idealan naslov početne stranice) — ovdje dodajemo
// samo canonical.
// ============================================================

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// JSON-LD (LodgingBusiness) — pomaže tražilicama razumjeti tko smo,
// gdje smo i tko su domaćini (bitno za upite tipa "brigita apartmani
// šibenik"). Sadržaj je u cijelosti statičan/naš, ali <-escape
// pratimo svejedno po službenoj Next preporuci.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Apartments Šibenik",
  description:
    "Tri obiteljska apartmana u srcu starog kamenog grada Šibenika, u kvartu Plišac.",
  url: "https://apartments-sibenik.com",
  image: "https://apartments-sibenik.com/images/hero.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS.street,
    addressLocality: "Šibenik",
    postalCode: "22000",
    addressCountry: "HR",
  },
  telephone: HOSTS[0].phone,
  email: HOSTS[0].email,
  employee: HOSTS.map((host) => ({
    "@type": "Person" as const,
    name: host.name,
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomeFlow />
    </>
  );
}
