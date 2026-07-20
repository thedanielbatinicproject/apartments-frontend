"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, FileText, RefreshCw, Building, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/hooks/use-async";
import { useCompany } from "@/lib/company/company-context";
import { listInvoices, type InvoiceFilters } from "@/lib/api/invoices";
import type {
  InvoiceSummaryResponse,
  InvoiceDocumentType,
  InvoiceStatus,
} from "@/lib/api/types";
import {
  DOCUMENT_TYPES,
  STATUS_META,
  documentTypeLabel,
  formatDate,
  formatMoney,
  recentYears,
} from "@/lib/invoice-utils";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
  SkeletonList,
} from "@/components/intranet/ui/DataStates";
import { CatalogsSection } from "@/components/intranet/invoices/CatalogsSection";

// ============================================================
// /intranet/invoices — lista dokumenata odabrane firme.
//
// Filtri (documentType, year, status) šalju se backendu kao query
// parametri, ne filtriraju se lokalno — backend to već podržava,
// a lista može narasti kroz godine.
// ============================================================

export default function InvoicesPage() {
  const { selectedCompany, selectedCompanyId, isLoading: isCompanyLoading, error: companyError, reload } =
    useCompany();

  const [documentType, setDocumentType] = useState<InvoiceDocumentType | "">("");
  const [status, setStatus] = useState<InvoiceStatus | "">("");
  const [year, setYear] = useState<number | "">("");

  const filters: InvoiceFilters = useMemo(
    () => ({
      documentType: documentType || undefined,
      status: status || undefined,
      year: year === "" ? undefined : year,
    }),
    [documentType, status, year]
  );

  const invoices = useAsync<InvoiceSummaryResponse[]>(
    () => listInvoices(selectedCompanyId as number, filters),
    [selectedCompanyId, documentType, status, year],
    { enabled: selectedCompanyId != null }
  );

  const hasActiveFilters = documentType !== "" || status !== "" || year !== "";

  const clearFilters = () => {
    setDocumentType("");
    setStatus("");
    setYear("");
  };

  // --- Firme se još učitavaju ---
  if (isCompanyLoading) {
    return <SkeletonList count={2} />;
  }

  // --- Dohvat firmi pao ---
  if (companyError != null) {
    return (
      <ErrorState
        error={companyError}
        onRetry={() => void reload()}
        context="Dohvat firmi"
      />
    );
  }

  // --- Nema nijedne firme ---
  if (selectedCompanyId == null) {
    return (
      <EmptyState
        icon={Building}
        title="Nema definiranih firmi"
        description="Dokumenti se izdaju u ime firme, pa je barem jedna potrebna. Ako je očekujete ovdje, javite se onome tko održava sustav."
      />
    );
  }

  const totalShown = invoices.data?.length ?? 0;
  const isRefreshing = invoices.isLoading && !invoices.isInitialLoading;

  const selectClass =
    "min-h-[2.5rem] rounded-xl border border-input bg-background px-2.5 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Zaglavlje */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Računi
          </h2>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {selectedCompany?.brandName}
            {invoices.data && ` · ${totalShown} dokumenata`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void invoices.refetch()}
            disabled={invoices.isLoading}
            aria-label="Osvježi listu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>

          <Link
            href="/intranet/invoices/new"
            className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novi
          </Link>
        </div>
      </div>

      {/* Filtri — horizontalni scroll na mobitelu */}
      <div className="scrollbar-none -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <select
          aria-label="Filtriraj po tipu dokumenta"
          value={documentType}
          onChange={(e) =>
            setDocumentType(e.target.value as InvoiceDocumentType | "")
          }
          className={cn(selectClass, "shrink-0")}
        >
          <option value="">Svi tipovi</option>
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtriraj po statusu"
          value={status}
          onChange={(e) => setStatus(e.target.value as InvoiceStatus | "")}
          className={cn(selectClass, "shrink-0")}
        >
          <option value="">Svi statusi</option>
          {(Object.keys(STATUS_META) as InvoiceStatus[]).map((key) => (
            <option key={key} value={key}>
              {STATUS_META[key].label}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtriraj po godini"
          value={year}
          onChange={(e) =>
            setYear(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={cn(selectClass, "shrink-0")}
        >
          <option value="">Sve godine</option>
          {recentYears().map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex min-h-[2.5rem] shrink-0 items-center gap-1 rounded-xl px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
            Poništi
          </button>
        )}
      </div>

      {/* Lista */}
      <AsyncBoundary
        isLoading={invoices.isLoading}
        error={invoices.error}
        data={invoices.data}
        onRetry={() => void invoices.refetch()}
        context="Dohvat dokumenata"
        loadingFallback={<SkeletonList count={3} />}
        emptyFallback={
          <EmptyState
            icon={FileText}
            title={
              hasActiveFilters
                ? "Nema dokumenata za odabrane filtre"
                : "Još nema dokumenata"
            }
            description={
              hasActiveFilters
                ? "Pokušajte proširiti ili poništiti filtre."
                : "Kreirajte prvi račun, predračun ili ponudu za ovu firmu."
            }
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  Poništi filtre
                </button>
              ) : (
                <Link
                  href="/intranet/invoices/new"
                  className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />
                  Novi dokument
                </Link>
              )
            }
          />
        }
      >
        {(list) => (
          <ul className="space-y-2.5">
            {list.map((invoice) => {
              const meta = STATUS_META[invoice.status];

              return (
                <li key={invoice.id}>
                  <Link
                    href={`/intranet/invoices/${invoice.id}`}
                    className="block rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {documentTypeLabel(invoice.documentType)}
                          </span>
                          <span
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[0.625rem] font-bold",
                              meta.className
                            )}
                          >
                            {meta.label}
                          </span>
                        </div>

                        <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                          {invoice.documentNumber ?? "— bez broja —"}
                        </p>

                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {invoice.recipientName}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-foreground">
                          {formatMoney(invoice.totalDue, invoice.currency)}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatDate(invoice.invoiceDate)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </AsyncBoundary>

      {/* Katalozi */}
      <CatalogsSection companyId={selectedCompanyId} />
    </div>
  );
}
