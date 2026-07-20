"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Building2, RefreshCw } from "lucide-react";
import { useAsync, useMutation } from "@/hooks/use-async";
import { listAdminApartments, setApartmentActive } from "@/lib/api/apartments";
import { getCalendarSyncStatus } from "@/lib/api/calendar";
import type { ApartmentResponse, SyncStatusResponse } from "@/lib/api/types";
import { ApartmentCard } from "@/components/intranet/apartments/ApartmentCard";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
  SkeletonList,
} from "@/components/intranet/ui/DataStates";

// ============================================================
// /intranet/apartments — lista apartmana.
//
// Dohvaća dva izvora paralelno:
//   1. GET /api/admin/apartments           → SVI apartmani, i skriveni
//   2. GET /api/admin/calendar/sync-status → status iCal synca
//
// Sync status je "nice to have": ako padne, lista se svejedno
// prikazuje, samo bez badgeva o kalendaru.
// ============================================================

/**
 * Sažetak iznad liste. Admin ruta vraća i skrivene apartmane, pa
 * ih vrijedi zasebno prebrojati — inače korisnik ne zna zašto se
 * broj ovdje razlikuje od onoga na javnoj stranici.
 */
function summarize(list: ApartmentResponse[]): string {
  const hidden = list.filter((a) => !a.active).length;
  const base = `${list.length} ${list.length === 1 ? "apartman" : "apartmana"}`;

  return hidden > 0 ? `${base} · ${hidden} skriveno` : base;
}

export default function ApartmentsPage() {
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const apartments = useAsync<ApartmentResponse[]>(
    () => listAdminApartments(),
    []
  );

  const syncStatus = useAsync<SyncStatusResponse[]>(
    () => getCalendarSyncStatus(),
    []
  );

  // Grupira sync statuse po apartmanu — jedan apartman može imati
  // više izvora (Airbnb + Booking), svaki sa svojim statusom.
  const syncByApartment = useMemo(() => {
    const map = new Map<number, SyncStatusResponse[]>();
    for (const status of syncStatus.data ?? []) {
      const existing = map.get(status.apartmentId) ?? [];
      existing.push(status);
      map.set(status.apartmentId, existing);
    }
    return map;
  }, [syncStatus.data]);

  const toggleActive = useMutation(
    async (apartment: ApartmentResponse, next: boolean) => {
      await setApartmentActive(apartment.id, next);
      return { id: apartment.id, next };
    },
    {
      onSuccess: (result) => {
        if (!result) return;
        // Optimistično ažuriraj lokalno umjesto punog refetcha
        apartments.setData((prev) =>
          prev
            ? prev.map((a) =>
                a.id === result.id ? { ...a, active: result.next } : a
              )
            : prev
        );
      },
    }
  );

  const handleToggle = useCallback(
    async (apartment: ApartmentResponse, next: boolean) => {
      setTogglingId(apartment.id);
      await toggleActive.run(apartment, next);
      setTogglingId(null);
    },
    [toggleActive]
  );

  const isRefreshing = apartments.isLoading && !apartments.isInitialLoading;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Zaglavlje */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Apartmani
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {apartments.data ? summarize(apartments.data) : "Upravljanje apartmanima, slikama i prijevodima"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void apartments.refetch();
              void syncStatus.refetch();
            }}
            disabled={apartments.isLoading}
            aria-label="Osvježi listu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>

          <Link
            href="/intranet/apartments/new"
            className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novi
          </Link>
        </div>
      </div>

      {/* Greška sync statusa — ne blokira listu */}
      {syncStatus.error != null && (
        <ErrorState
          error={syncStatus.error}
          onRetry={() => void syncStatus.refetch()}
          context="Status sinkronizacije kalendara"
          compact
        />
      )}

      {/* Greška prebacivanja aktivnosti */}
      {toggleActive.error != null && (
        <ErrorState
          error={toggleActive.error}
          context="Promjena vidljivosti apartmana"
          compact
        />
      )}

      {/* Lista */}
      <AsyncBoundary
        isLoading={apartments.isLoading}
        error={apartments.error}
        data={apartments.data}
        onRetry={() => void apartments.refetch()}
        context="Dohvat apartmana"
        loadingFallback={<SkeletonList count={3} />}
        emptyFallback={
          <EmptyState
            icon={Building2}
            title="Još nema apartmana"
            description="Dodajte prvi apartman kako bi se pojavio na javnoj stranici i u kalendaru rezervacija."
            action={
              <Link
                href="/intranet/apartments/new"
                className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                Dodaj apartman
              </Link>
            }
          />
        }
      >
        {(list) => (
          <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {list.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                syncStatuses={syncByApartment.get(apartment.id)}
                onToggleActive={handleToggle}
                isTogglePending={togglingId === apartment.id}
              />
            ))}
          </div>
        )}
      </AsyncBoundary>
    </div>
  );
}
