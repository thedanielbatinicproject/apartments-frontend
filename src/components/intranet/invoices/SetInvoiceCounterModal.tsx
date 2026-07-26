"use client";

import { useState } from "react";
import { X, Hash, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { useAsync, useMutation } from "@/hooks/use-async";
import { getInvoiceCounter, setInvoiceCounter } from "@/lib/api/invoices";
import type { InvoiceCounterResponse, InvoiceDocumentType } from "@/lib/api/types";
import { DOCUMENT_TYPES, recentYears } from "@/lib/invoice-utils";
import { describeError } from "@/lib/api/error-utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Popup za ručno postavljanje brojčanog niza računa/predračuna/
// ponude (GET+PUT /api/admin/invoices/{companyId}/counter, §11).
//
// Mobile-first: bottom sheet na mobitelu, centrirani dijalog na
// desktopu — ista vizualna konvencija kao ConfirmProvider. Portal
// je obavezan jer IntranetShell ima lg:overflow-hidden na predku
// glavnog stupca (main sadržaj), što bi na desktopu moglo odsjeći
// position:fixed popup da nije izmješten na document.body.
// ============================================================

interface SetInvoiceCounterModalProps {
  open: boolean;
  onClose: () => void;
  companyId: number;
}

const selectClass =
  "min-h-[2.75rem] w-full rounded-xl border border-input bg-background px-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40";

export function SetInvoiceCounterModal({
  open,
  onClose,
  companyId,
}: SetInvoiceCounterModalProps) {
  useScrollLock(open);

  const [documentType, setDocumentType] = useState<InvoiceDocumentType>("INVOICE");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [nextNumberInput, setNextNumberInput] = useState("");
  const [syncedCounter, setSyncedCounter] = useState<InvoiceCounterResponse | null>(null);
  const [savedResult, setSavedResult] = useState<InvoiceCounterResponse | null>(null);

  const counter = useAsync(
    () => getInvoiceCounter(companyId, documentType, year),
    [companyId, documentType, year],
    { enabled: open }
  );

  // Svježe stanje (nova GET) postaje predložena vrijednost inputa — usklađeno
  // TIJEKOM rendera (React-ov preporučeni obrazac za "prilagodi state kad se
  // promijene ulazni podaci"), umjesto setState() unutar useEffect-a.
  if (counter.data && counter.data !== syncedCounter) {
    setSyncedCounter(counter.data);
    setNextNumberInput(String(counter.data.nextNumber));
  }

  const mutation = useMutation(
    (value: number) => setInvoiceCounter(companyId, documentType, value, year),
    {
      onSuccess: (result) => {
        counter.setData(result);
        setSavedResult(result);
      },
    }
  );

  // "Spremljeno" je izvedeno stanje, ne zaseban useEffect reset — vrijedi
  // dok god je odabrani tip/godina isti kao ono što je zadnje spremljeno.
  const saved =
    savedResult != null &&
    savedResult.documentType === documentType &&
    savedResult.year === year;

  if (!open) return null;

  const parsed = Number(nextNumberInput);
  const isValid = Number.isInteger(parsed) && parsed >= 1;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="counter-modal-title"
        className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <div
          className={cn(
            "relative w-full max-w-md",
            "max-h-[90dvh] overflow-y-auto scroll-touch",
            "rounded-t-3xl bg-card shadow-2xl sm:rounded-2xl",
            "pb-safe px-safe"
          )}
        >
          <div className="flex justify-center pt-3 sm:hidden">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Hash className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="counter-modal-title"
                  className="text-base font-semibold text-foreground text-balance sm:text-lg"
                >
                  Postavi brojeve računa
                </h2>
                <p className="mt-1 text-sm text-muted-foreground text-pretty">
                  Ručno postavi od kojeg broja kreće sljedeći dokument — npr.
                  pri preuzimanju niza iz starog sustava ili ispravku greške.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Zatvori"
                className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">
                    Tip dokumenta
                  </span>
                  <select
                    value={documentType}
                    onChange={(e) =>
                      setDocumentType(e.target.value as InvoiceDocumentType)
                    }
                    className={selectClass}
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-muted-foreground">
                    Godina
                  </span>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className={selectClass}
                  >
                    {recentYears().map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Trenutno stanje niza */}
              <div className="rounded-xl border border-border bg-muted/40 px-3.5 py-3 text-sm">
                {counter.isLoading ? (
                  <span className="text-muted-foreground">
                    Učitavanje trenutnog stanja...
                  </span>
                ) : counter.error ? (
                  <span className="text-destructive">
                    {describeError(counter.error).message}
                  </span>
                ) : counter.data ? (
                  <>
                    <p className="text-muted-foreground">
                      Zadnji dodijeljen broj:{" "}
                      <span className="font-semibold text-foreground">
                        {counter.data.lastNumber === 0
                          ? "još nijedan"
                          : `${counter.data.lastNumber}/${counter.data.year}`}
                      </span>
                    </p>
                    <p className="mt-0.5 text-muted-foreground">
                      Trenutno sljedeći:{" "}
                      <span className="font-semibold text-foreground">
                        {counter.data.nextNumber}/{counter.data.year}
                      </span>
                    </p>
                  </>
                ) : null}
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted-foreground">
                  Novi sljedeći broj
                </span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  inputMode="numeric"
                  value={nextNumberInput}
                  onChange={(e) => setNextNumberInput(e.target.value)}
                  className="min-h-[2.75rem] w-full rounded-xl border border-input bg-background px-3 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </label>

              {mutation.error ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3.5 py-2.5 text-xs text-destructive">
                  {describeError(mutation.error).message}
                </div>
              ) : null}

              {saved && !mutation.error && (
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  Spremljeno — sljedeći dokument dobit će broj{" "}
                  {counter.data?.nextNumber}/{counter.data?.year}.
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98] sm:min-h-[2.75rem]"
              >
                Zatvori
              </button>

              <button
                type="button"
                onClick={() => void mutation.run(parsed)}
                disabled={!isValid || mutation.isPending || counter.isLoading}
                className="inline-flex min-h-[3rem] items-center justify-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 sm:min-h-[2.75rem]"
              >
                {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Spremi
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
