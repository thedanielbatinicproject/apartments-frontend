"use client";

// ============================================================
// Company Context — globalno odabrana firma za cijeli intranet.
//
// Zašto globalno, a ne po stranici: sve rute računa idu preko
// /{companyId}/, a isto vrijedi i za buduće postavke firme i
// izvještaje. Da svaka stranica ima svoj selektor, korisnik bi
// morao birati firmu iznova na svakom ekranu — i lako bi izdao
// račun iz krive firme.
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
import { listCompanies } from "@/lib/api/companies";
import type { CompanyResponse } from "@/lib/api/types";

const STORAGE_KEY = "apsi:selected-company";

interface CompanyContextValue {
  companies: CompanyResponse[];
  selectedCompany: CompanyResponse | null;
  selectedCompanyId: number | null;
  selectCompany: (id: number) => void;
  isLoading: boolean;
  error: unknown;
  reload: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await listCompanies();
      setCompanies(list);

      // Odaberi: zapamćenu firmu ako još postoji, inače prvu
      setSelectedId((current) => {
        if (current != null && list.some((c) => c.id === current)) {
          return current;
        }

        const stored =
          typeof window !== "undefined"
            ? Number(window.localStorage.getItem(STORAGE_KEY))
            : NaN;

        if (Number.isFinite(stored) && list.some((c) => c.id === stored)) {
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

  const selectCompany = useCallback((id: number) => {
    setSelectedId(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(id));
    } catch {
      // localStorage blokiran — izbor vrijedi samo za ovu sesiju
    }
  }, []);

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedId) ?? null,
    [companies, selectedId]
  );

  return (
    <CompanyContext.Provider
      value={{
        companies,
        selectedCompany,
        selectedCompanyId: selectedId,
        selectCompany,
        isLoading,
        error,
        reload: load,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) {
    throw new Error("useCompany mora biti pozvan unutar <CompanyProvider>.");
  }
  return ctx;
}
