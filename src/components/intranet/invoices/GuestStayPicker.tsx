"use client";

import { useEffect, useMemo, useState } from "react";
import {
  UserRound,
  X,
  Search,
  CalendarRange,
  Users,
  Link2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/hooks/use-async";
import {
  listGuestRecords,
  groupIntoStays,
  type GuestStayGroup,
} from "@/lib/api/checkin";
import type { AdminGuestRecordResponse } from "@/lib/api/types";
import {
  AsyncBoundary,
  EmptyState,
  LoadingState,
} from "@/components/intranet/ui/DataStates";
import { formatDate, nightsBetween } from "@/lib/invoice-utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Odabir boravka za automatsko popunjavanje računa.
//
// Backend vraća zapise PO GOSTU (§9), pa ih grupiramo u boravke
// (isti apartman + isti datumi). Admin bira boravak, a nositelj
// računa je prvi gost — može se promijeniti unutar kartice.
//
// Bottom sheet na mobitelu jer se otvara iz forme i mora se
// zatvarati palcem.
// ============================================================

export interface GuestStaySelection {
  stay: GuestStayGroup;
  payer: AdminGuestRecordResponse;
}

interface GuestStayPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selection: GuestStaySelection) => void;
}

export function GuestStayPicker({
  open,
  onClose,
  onSelect,
}: GuestStayPickerProps) {
  // Zajedničko zaključavanje scrolla (brojač) — vidi use-scroll-lock
  useScrollLock(open);

  const [query, setQuery] = useState("");

  const records = useAsync<AdminGuestRecordResponse[]>(
    () => listGuestRecords(),
    [],
    { enabled: open }
  );


  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const stays = useMemo(
    () => groupIntoStays(records.data ?? []),
    [records.data]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stays;

    return stays.filter(
      (stay) =>
        stay.guests.some((g) => g.fullName?.toLowerCase().includes(q)) ||
        stay.apartmentInternalCode?.toLowerCase().includes(q)
    );
  }, [stays, query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Odaberi boravak"
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl pb-safe px-safe sm:rounded-2xl">
        {/* Zaglavlje */}
        <div className="shrink-0 border-b border-border">
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground">
                Odaberi boravak
              </h2>
              <p className="text-xs text-muted-foreground">
                Podaci gosta prepisuju se u račun
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Zatvori"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative px-5 pb-3">
            <Search className="absolute left-8 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Traži po imenu ili apartmanu"
              className="min-h-[3rem] w-full rounded-xl border border-input bg-background pl-10 pr-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]"
            />
          </div>
        </div>

        {/* Popis */}
        <div className="scroll-touch min-h-0 flex-1 overflow-y-auto p-4">
          <AsyncBoundary
            isLoading={records.isLoading}
            error={records.error}
            data={records.data}
            onRetry={() => void records.refetch()}
            context="Dohvat evidencije gostiju"
            loadingFallback={<LoadingState label="Učitavanje gostiju..." />}
            emptyFallback={
              <EmptyState
                icon={UserRound}
                title="Nema evidentiranih gostiju"
                description="Kad gosti obave prijavu, ovdje ćete moći odabrati boravak i račun se popuni sam."
              />
            }
          >
            {() =>
              filtered.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="Nema rezultata"
                  description="Pokušajte s drugim imenom ili oznakom apartmana."
                />
              ) : (
                <ul className="space-y-2.5">
                  {filtered.map((stay) => (
                    <StayCard
                      key={stay.key}
                      stay={stay}
                      onSelect={(payer) => {
                        onSelect({ stay, payer });
                        onClose();
                      }}
                    />
                  ))}
                </ul>
              )
            }
          </AsyncBoundary>
        </div>
      </div>
    </div>
  );
}

// ---------- Kartica boravka ----------

function StayCard({
  stay,
  onSelect,
}: {
  stay: GuestStayGroup;
  onSelect: (payer: AdminGuestRecordResponse) => void;
}) {
  const [showGuests, setShowGuests] = useState(false);
  const nights = nightsBetween(stay.arrivalDate, stay.departureDate);
  const main = stay.guests[0];

  return (
    <li className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {main?.fullName ?? "Nepoznat gost"}
          </p>

          {stay.guests.length > 1 && (
            <button
              type="button"
              onClick={() => setShowGuests((v) => !v)}
              className="mt-0.5 text-xs text-primary underline-offset-4 hover:underline"
            >
              {showGuests
                ? "Sakrij ostale goste"
                : `+ još ${stay.guests.length - 1} ${
                    stay.guests.length - 1 === 1 ? "gost" : "gostiju"
                  }`}
            </button>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {stay.apartmentInternalCode && (
              <span className="font-mono">{stay.apartmentInternalCode}</span>
            )}

            <span className="inline-flex items-center gap-1">
              <CalendarRange className="h-3.5 w-3.5" />
              {formatDate(stay.arrivalDate)} – {formatDate(stay.departureDate)}
              {nights != null && ` · ${nights} ${nights === 1 ? "noć" : "noći"}`}
            </span>

            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {stay.adults} odraslih
              {stay.children > 0 && `, ${stay.children} djece`}
            </span>
          </div>
        </div>
      </div>

      {/* Ostali gosti — bilo tko od njih može biti nositelj računa */}
      {showGuests && stay.guests.length > 1 && (
        <ul className="mt-3 space-y-1 border-t border-border pt-3">
          {stay.guests.map((guest) => (
            <li key={guest.id}>
              <button
                type="button"
                onClick={() => onSelect(guest)}
                className="flex min-h-[2.75rem] w-full items-center justify-between gap-2 rounded-lg px-2 text-left text-sm text-foreground transition-colors active:bg-muted"
              >
                <span className="min-w-0 truncate">{guest.fullName}</span>
                <span className="shrink-0 text-xs text-primary">
                  Na ovoga
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => onSelect(main)}
        disabled={!main}
        className="mt-3 inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <Link2 className="h-4 w-4" />
        Popuni račun ovim boravkom
      </button>
    </li>
  );
}

/** Mali indikator dok se popunjava — koristi forma. */
export function FillingIndicator() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
