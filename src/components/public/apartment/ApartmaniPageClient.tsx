"use client";

import { useLanguage } from "@/i18n/language-context";
import { useAsync } from "@/hooks/use-async";
import { listPublicApartments } from "@/lib/api/apartments";
import { ApartmentCard } from "@/components/public/apartment/ApartmentCard";

export function ApartmaniPageClient() {
  const { dict, lang } = useLanguage();
  const t = dict.home.apartments;
  const apartments = useAsync(() => listPublicApartments(lang), [lang]);

  const sorted = [...(apartments.data ?? [])].sort(
    (a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99) || a.id - b.id
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-gutter py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="block text-[clamp(0.7rem,2vw,0.85rem)] font-semibold uppercase tracking-[0.32em] [color:var(--hs-accent)]">
          {t.eyebrow}
        </span>
        <h1 className="mt-3 text-[clamp(2rem,7vw,3.2rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {t.title}
        </h1>
        <p className="mt-3 text-[clamp(0.95rem,3vw,1.1rem)] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
          {t.subtitle}
        </p>
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

        {!apartments.isLoading && !apartments.error && sorted.length === 0 && (
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
  );
}
