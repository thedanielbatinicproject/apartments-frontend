"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/i18n/language-context";
import { useAsync } from "@/hooks/use-async";
import { listPublicApartments } from "@/lib/api/apartments";
import { ApartmentCard } from "@/components/public/apartment/ApartmentCard";
import { useReveal, useParallax } from "./use-reveal";
import { WaveDivider } from "./WaveDivider";

// ============================================================
// Sekcija apartmana u flowu — TRI doma s backenda (javna ruta
// vraća samo aktivne; skriveni se ne prikazuju), prijevodi preko
// ?lang. Namjerno BEZ kalendara/recenzija — detalji žive na
// stranici apartmana, homepage ostaje iskustvo.
//
// Naslov se otkriva GSAP ScrollTriggerom (useReveal); kartice
// (ApartmentCard, dijeljena s /apartmani listingom) rade Framer
// Motion ulazak/hover/tap. Dekoracije u pozadini blago
// paralaksiraju (transform-only scrub).
// ============================================================

interface ApartmentsFlowSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  perchRef: React.RefObject<HTMLDivElement | null>;
  /** Drugo sidro — vrh masline u kutu sekcije */
  olivePerchRef: React.RefObject<HTMLDivElement | null>;
}

export function ApartmentsFlowSection({
  sectionRef,
  perchRef,
  olivePerchRef,
}: ApartmentsFlowSectionProps) {
  const { dict, lang } = useLanguage();
  const t = dict.home.apartments;
  const apartments = useAsync(() => listPublicApartments(lang), [lang]);

  useReveal(sectionRef);
  useParallax(sectionRef, ".afs-parallax", 70);

  // Kartice stižu async i mijenjaju visinu sekcije — triggeri sekcija
  // ispod moraju preračunati pozicije
  useEffect(() => {
    if (apartments.data) ScrollTrigger.refresh();
  }, [apartments.data]);

  const sorted = [...(apartments.data ?? [])].sort(
    (a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99) || a.id - b.id
  );

  return (
    <section
      id="apartmani"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--hs-paper)" }}
    >
      {/* Rub prema heroju — more se prelijeva u "papir" sekcije */}
      <div className="absolute inset-x-0 top-0 -translate-y-[98%]">
        <WaveDivider fill="var(--hs-paper)" />
      </div>

      {/* Dekoracije s paralaksom */}
      <div
        className="afs-parallax pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full border-[3px] opacity-20"
        style={{ borderColor: "var(--hs-accent)" }}
      />
      <div
        className="afs-parallax pointer-events-none absolute -left-16 bottom-24 h-40 w-40 rounded-full opacity-10"
        style={{ background: "var(--hs-sea-far)" }}
      />

      {/* Maslina u tegli — dekor + sidro za pticu */}
      <div className="pointer-events-none absolute bottom-[2%] left-[5%] hidden h-[clamp(3.2rem,9dvh,5.2rem)] sm:block">
        <svg viewBox="0 0 60 80" className="h-full">
          <path d="M20 80 L18 62 H42 L40 80 Z" fill="var(--hs-accent)" opacity="0.75" />
          <path d="M29 62 Q28 48 30 40 Q32 48 31 62 Z" fill="var(--hs-city)" />
          <path
            d="M30 42 Q16 40 14 28 Q28 26 32 36 Q34 20 46 18 Q48 32 34 38 Q44 36 50 42 Q42 50 32 44 Z"
            style={{ fill: "color-mix(in oklab, var(--hs-city) 45%, #5a6b46)" }}
          />
        </svg>
        <div
          ref={olivePerchRef}
          className="absolute left-[55%] top-[18%] h-px w-px"
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-gutter pb-20 pt-14 sm:pb-28 sm:pt-20">
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="fs-reveal block text-[clamp(0.7rem,2vw,0.85rem)] font-semibold uppercase tracking-[0.32em] [color:var(--hs-accent)]">
            {t.eyebrow}
          </span>
          <h2 className="fs-reveal mt-3 text-[clamp(2rem,7vw,3.2rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
            {t.title}
          </h2>
          <p className="fs-reveal mt-3 text-[clamp(0.95rem,3vw,1.1rem)] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
            {t.subtitle}
          </p>
          {/* Sidro za pticu — vrh naslova sekcije */}
          <div ref={perchRef} className="absolute right-[6%] top-8 h-px w-px" />
        </div>

        <div className="mt-10 sm:mt-14">
          {apartments.isLoading && !apartments.data && (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-3xl"
                  style={{
                    background:
                      "color-mix(in oklab, var(--hs-text-soft) 14%, var(--hs-card))",
                  }}
                />
              ))}
            </ul>
          )}

          {Boolean(apartments.error) && (
            <div className="mx-auto max-w-sm text-center">
              <p className="text-sm [color:var(--hs-text-soft)]">{t.error}</p>
              <button
                onClick={() => void apartments.refetch()}
                className="mt-3 inline-flex min-h-[2.75rem] items-center rounded-full px-5 text-sm font-bold text-white active:scale-[0.97]"
                style={{ background: "var(--hs-accent)" }}
              >
                {t.retry}
              </button>
            </div>
          )}

          {!apartments.isLoading &&
            !apartments.error &&
            sorted.length === 0 && (
              <p className="text-center text-sm [color:var(--hs-text-soft)]">
                {t.empty}
              </p>
            )}

          {sorted.length > 0 && (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {sorted.map((apartment, index) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  index={index}
                  guestsLabel={t.guestsLabel}
                  roomsLabel={t.roomsLabel}
                  cta={t.cta}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
