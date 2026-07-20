"use client";

import { useEffect, useRef, useState } from "react";
import { Home, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApartment } from "@/lib/apartment/apartment-context";

// ============================================================
// Prekidač apartmana u headeru intraneta — isti obrazac kao
// CompanySwitcher, ali za apartmane (koristi ga npr. stranica
// recenzija da zna za koji apartman uređuje sadržaj).
//
// Sakriva se kad postoji 0 ili 1 apartman — tada nema što birati.
// ============================================================

export function ApartmentSwitcher() {
  const { apartments, selectedApartment, selectApartment, isLoading } =
    useApartment();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (isLoading || apartments.length <= 1) return null;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Odaberi apartman"
        className={cn(
          "inline-flex min-h-[2.25rem] max-w-[9rem] items-center gap-1.5 rounded-lg border border-border bg-background px-2 text-xs font-medium transition-colors sm:max-w-[14rem] sm:px-2.5 sm:text-sm",
          open ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">
          {selectedApartment?.internalCode ?? "Apartman"}
        </span>
        <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-60" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-1.5 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <p className="border-b border-border px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Aktivni apartman
          </p>

          <ul className="max-h-72 overflow-y-auto p-1">
            {apartments.map((apartment) => {
              const isActive = apartment.id === selectedApartment?.id;

              return (
                <li key={apartment.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      selectApartment(apartment.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex min-h-[2.75rem] w-full items-center gap-2 rounded-lg px-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">
                      {apartment.internalCode}
                      {apartment.name ? ` — ${apartment.name}` : ""}
                    </span>
                    {isActive && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="border-t border-border px-3 py-2 text-[0.6875rem] text-muted-foreground text-pretty">
            Recenzije se prikazuju za odabrani apartman.
          </p>
        </div>
      )}
    </div>
  );
}
