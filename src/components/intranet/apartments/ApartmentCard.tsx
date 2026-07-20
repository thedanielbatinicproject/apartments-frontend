"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BedDouble,
  Users,
  ImageOff,
  Languages,
  CalendarCheck,
  CalendarX,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fileUrl } from "@/lib/api/files";
import type { ApartmentResponse, SyncStatusResponse } from "@/lib/api/types";

// ============================================================
// Kartica apartmana u listi.
//
// Mobile-first: cijela kartica je jedan veliki tap target koji
// vodi na detalj. Prekidač "aktivan" je namjerno IZVAN linka
// (zasebno dugme) da se ne okine navigacija pri prebacivanju.
// ============================================================

interface ApartmentCardProps {
  apartment: ApartmentResponse;
  /** Statusi synca za ovaj apartman (može ih biti više — Airbnb i Booking) */
  syncStatuses?: SyncStatusResponse[];
  onToggleActive: (apartment: ApartmentResponse, next: boolean) => void;
  isTogglePending?: boolean;
}

export function ApartmentCard({
  apartment,
  syncStatuses = [],
  onToggleActive,
  isTogglePending = false,
}: ApartmentCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const cover = fileUrl(apartment.coverImageUrl);
  const showImage = cover && !imgFailed;

  const failedSyncs = syncStatuses.filter((s) => !s.lastSyncSuccess);
  const hasSyncData = syncStatuses.length > 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      {/* Slika + osnovni podaci — klik vodi na detalj */}
      <Link
        href={`/intranet/apartments/${apartment.id}`}
        className="block active:opacity-90"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={apartment.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
              <ImageOff className="h-6 w-6" />
              <span className="text-xs">
                {cover ? "Slika se ne može učitati" : "Nema slike"}
              </span>
            </div>
          )}

          {/* Status "neaktivan" preko slike */}
          {!apartment.active && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
              <span className="rounded-full bg-foreground/85 px-3 py-1 text-xs font-semibold text-background">
                Sakriven s javne stranice
              </span>
            </div>
          )}

          {/* Broj slika */}
          {apartment.images.length > 0 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[0.625rem] font-semibold text-white backdrop-blur-sm">
              {apartment.images.length}{" "}
              {apartment.images.length === 1 ? "slika" : "slika"}
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                {apartment.name || apartment.internalCode}
              </h3>
              <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                {apartment.internalCode}
              </p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
          </div>

          {/* Meta podaci */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            {apartment.roomCount != null && (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" />
                {apartment.roomCount} soba
              </span>
            )}
            {apartment.capacity != null && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {apartment.capacity} osoba
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center gap-1",
                apartment.translationFallbackUsed && "text-amber-600"
              )}
            >
              <Languages className="h-3.5 w-3.5" />
              {apartment.availableLanguages.length > 0
                ? apartment.availableLanguages.join(", ").toUpperCase()
                : "bez prijevoda"}
            </span>
          </div>

          {/* Status iCal synca */}
          {hasSyncData && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              {failedSyncs.length > 0 ? (
                <>
                  <CalendarX className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                  <span className="truncate text-amber-700 dark:text-amber-500">
                    Sync neuspješan ({failedSyncs.map((s) => s.source).join(", ")})
                  </span>
                </>
              ) : (
                <>
                  <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate text-emerald-700 dark:text-emerald-500">
                    Kalendar sinkroniziran
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Prekidač aktivnosti — izvan <Link> da klik ne navigira */}
      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">
          Prikaz na javnoj stranici
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={apartment.active}
          aria-label={`Prikaz apartmana ${apartment.internalCode} na javnoj stranici`}
          disabled={isTogglePending}
          onClick={() => onToggleActive(apartment, !apartment.active)}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card",
            "disabled:cursor-not-allowed disabled:opacity-50",
            apartment.active ? "bg-primary" : "bg-muted-foreground/30"
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
              apartment.active ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </article>
  );
}
