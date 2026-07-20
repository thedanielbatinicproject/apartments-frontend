"use client";

// ============================================================
// Apartment Context — globalno odabrani apartman za cijeli intranet.
//
// Isti obrazac kao CompanyContext (lib/company/company-context.tsx):
// stranice koje su vezane uz jedan apartman (recenzije, uskoro
// možda i drugo) čitaju odabir odavde umjesto da svaka ima svoj
// lokalni selektor — inače bi admin lako uređivao krivi apartman
// nakon prelaska s jedne stranice na drugu.
//
// Izbor se pamti u localStorage da preživi refresh.
// ============================================================

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { listAdminApartments } from "@/lib/api/apartments";
import type { ApartmentResponse } from "@/lib/api/types";

const STORAGE_KEY = "apsi:selected-apartment";

interface ApartmentContextValue {
  apartments: ApartmentResponse[];
  selectedApartment: ApartmentResponse | null;
  selectedApartmentId: number | null;
  selectApartment: (id: number) => void;
  isLoading: boolean;
  error: unknown;
  reload: () => Promise<void>;
}

const ApartmentContext = createContext<ApartmentContextValue | null>(null);

export function ApartmentProvider({ children }: { children: React.ReactNode }) {
  const [apartments, setApartments] = useState<ApartmentResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await listAdminApartments();
      setApartments(list);

      // Odaberi: zapamćeni apartman ako još postoji, inače prvi
      setSelectedId((current) => {
        if (current != null && list.some((a) => a.id === current)) {
          return current;
        }

        const stored =
          typeof window !== "undefined"
            ? Number(window.localStorage.getItem(STORAGE_KEY))
            : NaN;

        if (Number.isFinite(stored) && list.some((a) => a.id === stored)) {
          return stored;
        }

        return list[0]?.id ?? null;
      });
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selectApartment = useCallback((id: number) => {
    setSelectedId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(id));
    } catch {
      // localStorage blokiran — izbor vrijedi samo za ovu sesiju
    }
  }, []);

  const selectedApartment = useMemo(
    () => apartments.find((a) => a.id === selectedId) ?? null,
    [apartments, selectedId]
  );

  return (
    <ApartmentContext.Provider
      value={{
        apartments,
        selectedApartment,
        selectedApartmentId: selectedId,
        selectApartment,
        isLoading,
        error,
        reload: load,
      }}
    >
      {children}
    </ApartmentContext.Provider>
  );
}

export function useApartment(): ApartmentContextValue {
  const ctx = useContext(ApartmentContext);
  if (!ctx) {
    throw new Error("useApartment mora biti pozvan unutar <ApartmentProvider>.");
  }
  return ctx;
}
