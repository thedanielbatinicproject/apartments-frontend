"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Plus,
  X,
  Check,
  Loader2,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import {
  getCompanyCatalogs,
  updateCompanyCatalogs,
} from "@/lib/api/companies";
import type { CompanyCatalogs } from "@/lib/api/types";
import { ErrorState, LoadingState } from "@/components/intranet/ui/DataStates";

// ============================================================
// Sekcija "Katalozi" (§10).
//
// Tri liste koje se u formi računa nude kao prijedlozi:
//   - opisi jedinica (npr. "Apartman A, 2 osobe")
//   - vrste usluga  (npr. "Noćenje", "Boravišna pristojba")
//   - načini plaćanja (npr. "Gotovina", "Transakcijski račun")
//
// Backend nudi samo GET i PUT cijelog objekta — nema dodavanja
// pojedinačne stavke. Zato lokalno mijenjamo cijeli set pa ga
// spremamo odjednom, uz jasnu oznaku nespremljenih promjena.
//
// Zatvorena je po defaultu: većina posjeta ovoj stranici je zbog
// računa, ne zbog kataloga.
// ============================================================

const EMPTY: CompanyCatalogs = {
  unitDescriptionCatalog: [],
  serviceTypeCatalog: [],
  paymentMethodCatalog: [],
};

const CATALOG_FIELDS: {
  key: keyof CompanyCatalogs;
  label: string;
  placeholder: string;
  hint: string;
}[] = [
  {
    key: "unitDescriptionCatalog",
    label: "Opisi jedinica",
    placeholder: "npr. Apartman Oliva, 2+2 osobe",
    hint: "Nudi se kao prijedlog u polju Opis jedinice na stavci računa.",
  },
  {
    key: "serviceTypeCatalog",
    label: "Vrste usluga",
    placeholder: "npr. Noćenje",
    hint: "Nudi se kao prijedlog u polju Vrsta usluge na stavci računa.",
  },
  {
    key: "paymentMethodCatalog",
    label: "Načini plaćanja",
    placeholder: "npr. Gotovina",
    hint: "Nudi se kao prijedlog u polju Način plaćanja na dnu računa.",
  },
];

interface CatalogsSectionProps {
  companyId: number;
}

export function CatalogsSection({ companyId }: CatalogsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<CompanyCatalogs>(EMPTY);
  const [newValues, setNewValues] = useState<Record<string, string>>({});

  const catalogs = useAsync<CompanyCatalogs>(
    () => getCompanyCatalogs(companyId),
    [companyId],
    { enabled: isOpen }
  );

  // Napuni lokalnu kopiju kad podaci stignu
  useEffect(() => {
    if (catalogs.data) {
      setDraft({
        unitDescriptionCatalog: catalogs.data.unitDescriptionCatalog ?? [],
        serviceTypeCatalog: catalogs.data.serviceTypeCatalog ?? [],
        paymentMethodCatalog: catalogs.data.paymentMethodCatalog ?? [],
      });
    }
  }, [catalogs.data]);

  const save = useMutation(
    async () => {
      await updateCompanyCatalogs(companyId, draft);
    },
    { onSuccess: () => void catalogs.refetch() }
  );

  const addValue = (key: keyof CompanyCatalogs) => {
    const value = (newValues[key] ?? "").trim();
    if (!value || draft[key].includes(value)) return;

    setDraft((prev) => ({ ...prev, [key]: [...prev[key], value] }));
    setNewValues((prev) => ({ ...prev, [key]: "" }));
  };

  const removeValue = (key: keyof CompanyCatalogs, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
  };

  // Ima li nespremljenih izmjena
  const isDirty =
    catalogs.data != null &&
    CATALOG_FIELDS.some(
      ({ key }) =>
        JSON.stringify(draft[key]) !==
        JSON.stringify(catalogs.data?.[key] ?? [])
    );

  const totalItems = CATALOG_FIELDS.reduce(
    (sum, { key }) => sum + draft[key].length,
    0
  );

  return (
    <section className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="flex min-h-[3.5rem] w-full items-center gap-3 px-4 text-left"
      >
        <ListChecks className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground">Katalozi</p>
          <p className="text-xs text-muted-foreground">
            Prijedlozi za brži unos stavki
            {isOpen && totalItems > 0 && ` · ${totalItems} stavki`}
          </p>
        </div>
        {isDirty && (
          <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.625rem] font-bold text-amber-700 dark:text-amber-400">
            Nespremljeno
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="space-y-4 border-t border-border p-4">
          {catalogs.isInitialLoading && <LoadingState label="Učitavanje..." />}

          {catalogs.error != null && (
            <ErrorState
              error={catalogs.error}
              onRetry={() => void catalogs.refetch()}
              context="Dohvat kataloga"
              compact
            />
          )}

          {save.error != null && (
            <ErrorState
              error={save.error}
              context="Spremanje kataloga"
              compact
            />
          )}

          {catalogs.data != null &&
            CATALOG_FIELDS.map(({ key, label, placeholder, hint }) => (
              <div key={key} className="space-y-2">
                <label
                  htmlFor={`catalog-${key}`}
                  className="text-sm font-medium text-foreground"
                >
                  {label}
                </label>

                {/* Postojeće stavke */}
                {draft[key].length > 0 ? (
                  <ul className="flex flex-wrap gap-1.5">
                    {draft[key].map((value) => (
                      <li
                        key={value}
                        className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs text-foreground"
                      >
                        <span className="max-w-[12rem] truncate">{value}</span>
                        <button
                          type="button"
                          onClick={() => removeValue(key, value)}
                          aria-label={`Ukloni ${value}`}
                          className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Prazno — dodajte prvi prijedlog.
                  </p>
                )}

                {/* Dodavanje */}
                <div className="flex gap-2">
                  <input
                    id={`catalog-${key}`}
                    value={newValues[key] ?? ""}
                    onChange={(e) =>
                      setNewValues((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addValue(key);
                      }
                    }}
                    placeholder={placeholder}
                    className="min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]"
                  />
                  <button
                    type="button"
                    onClick={() => addValue(key)}
                    disabled={!(newValues[key] ?? "").trim()}
                    aria-label={`Dodaj u ${label.toLowerCase()}`}
                    className="flex min-h-[3rem] w-12 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 sm:min-h-[2.5rem]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground">{hint}</p>
              </div>
            ))}

          {catalogs.data != null && (
            <button
              type="button"
              onClick={() => void save.run()}
              disabled={!isDirty || save.isPending}
              className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 sm:min-h-[2.75rem]"
            >
              {save.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Spremi kataloge
            </button>
          )}
        </div>
      )}
    </section>
  );
}
