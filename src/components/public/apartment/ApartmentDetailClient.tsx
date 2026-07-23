"use client";

import Link from "next/link";
import { ArrowLeft, Users, BedDouble } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useAsync } from "@/hooks/use-async";
import { getPublicApartment } from "@/lib/api/apartments";
import { getAirbnbListing } from "@/lib/airbnb-links";
import { ApartmentGallery } from "./ApartmentGallery";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { ReviewsList } from "./ReviewsList";
import { AirbnbCard } from "./AirbnbCard";

interface ApartmentDetailClientProps {
  apartmentId: number;
}

export function ApartmentDetailClient({
  apartmentId,
}: ApartmentDetailClientProps) {
  const { dict, lang } = useLanguage();
  const t = dict.apartmentDetail;
  const apartment = useAsync(
    () => getPublicApartment(apartmentId, lang),
    [apartmentId, lang]
  );

  if (apartment.isLoading && !apartment.data) {
    return (
      <div className="mx-auto max-w-4xl px-gutter py-8 sm:py-12">
        <div
          className="aspect-[16/10] w-full animate-pulse rounded-3xl"
          style={{ background: "color-mix(in oklab, var(--hs-text-soft) 12%, var(--hs-card))" }}
        />
      </div>
    );
  }

  if (apartment.error || !apartment.data) {
    return (
      <div className="mx-auto max-w-md px-gutter py-24 text-center">
        <h1 className="text-xl font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {t.notFound.title}
        </h1>
        <p className="mt-2 text-sm [color:var(--hs-text-soft)]">{t.notFound.text}</p>
        <Link
          href="/apartmani"
          className="mt-6 inline-flex min-h-[3rem] items-center justify-center rounded-full px-6 font-semibold text-white"
          style={{ background: "var(--hs-accent)" }}
        >
          {t.notFound.back}
        </Link>
      </div>
    );
  }

  const data = apartment.data;
  const airbnbListing = getAirbnbListing(data.id);

  return (
    <div className="mx-auto max-w-4xl px-gutter py-8 sm:py-12">
      <Link
        href="/apartmani"
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 [color:var(--hs-text-soft)]"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToList}
      </Link>

      <h1 className="mt-4 text-[clamp(1.75rem,6vw,2.75rem)] font-semibold leading-tight text-balance [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
        {data.name}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm [color:var(--hs-text-soft)]">
        {data.capacity != null && (
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 [color:var(--hs-accent)]" />
            {t.capacity.replace("{n}", String(data.capacity))}
          </span>
        )}
        {data.roomCount != null && (
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 [color:var(--hs-accent)]" />
            {t.rooms.replace("{n}", String(data.roomCount))}
          </span>
        )}
      </div>

      <div className="mt-6">
        <ApartmentGallery
          images={data.images}
          apartmentName={data.name}
          emptyLabel={t.gallery.empty}
        />
      </div>

      <p className="mt-6 whitespace-pre-line text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
        {data.description}
      </p>

      {data.amenities.length > 0 && (
        <div className="mt-6">
          <h3
            className="text-sm font-semibold uppercase tracking-wide opacity-70 [color:var(--hs-text-soft)]"
          >
            {t.amenitiesTitle}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {data.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full px-3 py-1 text-xs [color:var(--hs-text-strong)]"
                style={{
                  background: "var(--hs-card)",
                  border: "1px solid color-mix(in oklab, var(--hs-text-soft) 20%, transparent)",
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <AvailabilityCalendar apartmentId={apartmentId} labels={t.calendar} />
        <AirbnbCard
          listing={airbnbListing}
          apartmentName={data.name}
          labels={t.airbnb}
        />
      </div>

      <div className="mt-8">
        <ReviewsList apartmentId={apartmentId} labels={t.reviews} />
      </div>
    </div>
  );
}
