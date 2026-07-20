"use client";

import { useState } from "react";
import {
  Ban,
  Trash2,
  Loader2,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@/hooks/use-async";
import {
  cancelInvoice,
  deleteInvoice,
  convertInvoice,
} from "@/lib/api/invoices";
import type { InvoiceResponse, InvoiceDocumentType } from "@/lib/api/types";
import { DOCUMENT_TYPES, documentTypeLabel } from "@/lib/invoice-utils";
import { ErrorState } from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// Akcije nad dokumentom.
//
// Nema koraka "izdaj" — dokument je gotov čim se spremi.
// Ispravke se rade uređivanjem, a ne storniranjem pa ponovnim
// izdavanjem.
//
// Storno je zadržan kao mekša opcija od brisanja: dokument koji
// je gost već dobio bolje je stornirati (ostaje trag) nego
// obrisati.
// ============================================================

interface InvoiceActionsProps {
  companyId: number;
  invoice: InvoiceResponse;
  onChanged: (updated: InvoiceResponse) => void | Promise<void>;
  onDeleted: () => void;
  onConverted: (created: InvoiceResponse) => void;
}

export function InvoiceActions({
  companyId,
  invoice,
  onChanged,
  onDeleted,
  onConverted,
}: InvoiceActionsProps) {
  const [showConvert, setShowConvert] = useState(false);
  const confirm = useConfirm();

  const cancel = useMutation(
    async () => cancelInvoice(companyId, invoice.id),
    { onSuccess: (updated) => updated && void onChanged(updated) }
  );

  const remove = useMutation(
    async () => {
      await deleteInvoice(companyId, invoice.id);
    },
    { onSuccess: () => onDeleted() }
  );

  const convert = useMutation(
    async (to: InvoiceDocumentType) => convertInvoice(companyId, invoice.id, to),
    {
      onSuccess: (created) => {
        setShowConvert(false);
        if (created) onConverted(created);
      },
    }
  );

  const isCancelled = invoice.status === "CANCELLED";

  const anyError = cancel.error ?? remove.error ?? convert.error;
  const anyPending = cancel.isPending || remove.isPending || convert.isPending;

  const handleCancel = async () => {
    const ok = await confirm({
      title: "Stornirati dokument?",
      description: invoice.documentNumber
        ? `${documentTypeLabel(invoice.documentType)} ${invoice.documentNumber} označava se kao poništen, ali ostaje u evidenciji.`
        : "Dokument se označava kao poništen, ali ostaje u evidenciji.",
      warning:
        "Koristite ovo ako je gost već dobio dokument — ostaje vidljiv trag da je poništen.",
      confirmLabel: "Storniraj",
      variant: "destructive",
    });
    if (ok) void cancel.run();
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Obrisati dokument?",
      description: invoice.documentNumber
        ? `${documentTypeLabel(invoice.documentType)} ${invoice.documentNumber} briše se u cijelosti.`
        : "Dokument se briše u cijelosti.",
      warning:
        "Ako je ovo zadnji izdani dokument, broj se oslobađa za sljedeći. Stariji dokumenti zadržavaju svoje brojeve.",
      confirmLabel: "Obriši",
      variant: "destructive",
    });
    if (ok) void remove.run();
  };

  const buttonBase =
    "inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 sm:min-h-[2.75rem]";

  return (
    <div className="space-y-3">
      {anyError != null && (
        <ErrorState error={anyError} context="Akcija nad dokumentom" compact />
      )}

      <div className="flex flex-col gap-2">
        {/* Konverzija */}
        <div>
          <button
            type="button"
            onClick={() => setShowConvert((v) => !v)}
            disabled={anyPending}
            aria-expanded={showConvert}
            className={cn(
              buttonBase,
              "w-full border-border bg-card text-foreground"
            )}
          >
            <ArrowRightLeft className="h-4 w-4" />
            Pretvori u drugu vrstu
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                showConvert && "rotate-180"
              )}
            />
          </button>

          {showConvert && (
            <div className="mt-2 space-y-2 rounded-xl border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground text-pretty">
                Nastaje <strong>novi</strong> dokument. Ovaj ostaje
                nepromijenjen.
              </p>

              <div className="grid gap-2 xs:grid-cols-2">
                {DOCUMENT_TYPES.filter(
                  (type) => type.value !== invoice.documentType
                ).map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => void convert.run(type.value)}
                    disabled={anyPending}
                    className="inline-flex min-h-[2.75rem] items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors active:scale-[0.98] disabled:opacity-50"
                  >
                    {convert.isPending && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Storno — mekša opcija od brisanja */}
        {!isCancelled && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={anyPending}
            className={cn(
              buttonBase,
              "border-border bg-card text-muted-foreground"
            )}
          >
            {cancel.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
            Storniraj
          </button>
        )}

        {/* Brisanje */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={anyPending}
          className={cn(
            buttonBase,
            "border-border bg-card text-destructive"
          )}
        >
          {remove.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Obriši
        </button>
      </div>
    </div>
  );
}
