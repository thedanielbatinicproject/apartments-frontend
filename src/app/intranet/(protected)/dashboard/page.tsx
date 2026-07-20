"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Sun, Camera, DoorOpen, AlertTriangle, TrendingUp, TrendingDown, BatteryCharging } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useAsync } from "@/hooks/use-async";
import { getLatestReading } from "@/lib/api/solar";
import { listGuestRecords } from "@/lib/api/checkin";
import { listAdminApartments } from "@/lib/api/apartments";
import { getBookedPeriods } from "@/lib/api/calendar";
import type { ApartmentResponse, BookedPeriodResponse } from "@/lib/api/types";
import { formatSolarValueWithUnit } from "@/lib/solar-utils";
import { formatDate, todayIso } from "@/lib/invoice-utils";
import { RelayPanel } from "@/components/intranet/dashboard/RelayPanel";

// ============================================================
// Dashboard — mobile-first.
//
// Kartice su sad povezane na stvarne podatke umjesto statičnih
// placeholdera:
//  - Solarni sustav: proizvodnja/potrošnja danas + napunjenost
//    baterije, iz GET /api/solar/latest (§14).
//  - Prijave gostiju: broj checkin zapisa koji čekaju ručnu
//    provjeru (needsManualReview), iz GET /api/admin/checkin/records (§9).
//  - Po jedna kartica za SVAKI apartman: je li danas zauzet i
//    do kojeg datuma, iz GET /api/calendar/{id} (§6, javna ruta —
//    isti izvor kao kalendar dostupnosti na javnoj stranici).
//
// "Status Apartmana" (statični placeholder) je uklonjen — te
// informacije sad daju stvarne per-apartman kartice ispod.
// ============================================================

interface ApartmentOccupancy {
  apartment: ApartmentResponse;
  currentPeriod: BookedPeriodResponse | null;
}

export default function DashboardPage() {
  const { user } = useAuth();

  const solar = useAsync(() => getLatestReading(), []);
  const checkins = useAsync(() => listGuestRecords(), []);

  const occupancy = useAsync<ApartmentOccupancy[]>(async () => {
    const apartments = await listAdminApartments();
    const today = todayIso();

    return Promise.all(
      apartments.map(async (apartment) => {
        const periods = await getBookedPeriods(apartment.id);
        const currentPeriod =
          periods.find((p) => p.startDate <= today && today < p.endDate) ?? null;
        return { apartment, currentPeriod };
      })
    );
  }, []);

  const needsReviewCount = useMemo(
    () => (checkins.data ?? []).filter((r) => r.needsManualReview).length,
    [checkins.data]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Pozdravna kartica */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground text-balance sm:text-xl">
          Dobrodošli, {user?.fullName || "Admin"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Ovo je početni ekran intranet sustava. Vaša razina pristupa je:{" "}
          <strong className="text-foreground">{user?.role}</strong>.
        </p>
      </div>

      {/* Upravljanje relejima — realtime, sinkronizirano preko WebSocketa */}
      <RelayPanel />

      {/* Statistike */}
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Solarni sustav — 3 stavke u jednoj kartici */}
        <Link
          href="/intranet/solar"
          className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99] sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xs font-medium text-muted-foreground text-pretty sm:text-sm">
              Solarni sustav
            </h3>
            <Sun className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          </div>

          <div className="mt-3 space-y-2">
            <MiniStat
              icon={TrendingUp}
              label="Proizvodnja danas"
              value={
                solar.isLoading
                  ? "…"
                  : formatSolarValueWithUnit(solar.data?.yieldToday, "kWh")
              }
            />
            <MiniStat
              icon={TrendingDown}
              label="Potrošnja danas"
              value={
                solar.isLoading
                  ? "…"
                  : formatSolarValueWithUnit(solar.data?.consumptionToday, "kWh")
              }
            />
            <MiniStat
              icon={BatteryCharging}
              label="Napunjenost baterije"
              value={
                solar.isLoading
                  ? "…"
                  : formatSolarValueWithUnit(solar.data?.batterySoc, "%")
              }
            />
          </div>
        </Link>

        {/* Prijave gostiju — broj zapisa koji čekaju provjeru */}
        <Link
          href="/intranet/checkins"
          className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99] sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xs font-medium text-muted-foreground text-pretty sm:text-sm">
              Prijave gostiju
            </h3>
            <Camera className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          </div>
          <p className="mt-2 text-xl font-bold text-foreground text-balance sm:text-2xl">
            {checkins.isLoading ? "…" : needsReviewCount}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground text-pretty">
            {needsReviewCount > 0 && (
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
            )}
            {checkins.isLoading
              ? "Učitavanje..."
              : needsReviewCount > 0
                ? "traži provjeru podataka"
                : "sve prijave provjerene"}
          </p>
        </Link>

        {/* Po jedna kartica za svaki apartman — zauzetost danas */}
        {(occupancy.data ?? []).map(({ apartment, currentPeriod }) => {
          const isOccupied = currentPeriod != null;

          return (
            <div
              key={apartment.id}
              className={cn(
                "rounded-2xl border p-4 shadow-sm transition-transform active:scale-[0.99] sm:p-6",
                isOccupied
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-emerald-500/30 bg-emerald-500/5"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xs font-medium text-muted-foreground text-pretty sm:text-sm">
                  {apartment.internalCode}
                  {apartment.name ? ` — ${apartment.name}` : ""}
                </h3>
                <DoorOpen className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              </div>
              <p
                className={cn(
                  "mt-2 text-xl font-bold text-balance sm:text-2xl",
                  isOccupied
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-emerald-700 dark:text-emerald-400"
                )}
              >
                {isOccupied ? "Zauzeto" : "Slobodno"}
              </p>
              {isOccupied && currentPeriod && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(currentPeriod.startDate)} –{" "}
                  {formatDate(currentPeriod.endDate)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 font-semibold text-foreground">{value}</span>
    </div>
  );
}
