"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, X, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/hooks/use-async";
import { useCompany } from "@/lib/company/company-context";
import { getInvoice } from "@/lib/api/invoices";
import type { InvoiceResponse } from "@/lib/api/types";
import {
  STATUS_META,
  documentTypeLabel,
  formatDate,
  formatMoney,
} from "@/lib/invoice-utils";
import { ErrorState, LoadingState } from "@/components/intranet/ui/DataStates";
import { InvoiceForm } from "@/components/intranet/invoices/InvoiceForm";
import { InvoiceActions } from "@/components/intranet/invoices/InvoiceActions";
import { InvoiceDetailView } from "@/components/intranet/invoices/InvoiceDetailView";
import { InvoicePdfActions } from "@/components/intranet/invoices/InvoicePdfActions";

// ============================================================
// /intranet/invoices/[id] — detalj dokumenta.
//
// Uređivanje je dopušteno SAMO ako backend kaže `editable: true`
// (tj. status je DRAFT). Ne zaključujemo to iz statusa lokalno —
// backend je jedini autoritet.
// ============================================================

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const invoiceId = Number(id);
  const router = useRouter();

  const { selectedCompany, selectedCompanyId } = useCompany();
  const [isEditing, setIsEditing] = useState(false);

  const invoice = useAsync<InvoiceResponse>(
    () => getInvoice(selectedCompanyId as number, invoiceId),
    [selectedCompanyId, invoiceId],
    { enabled: selectedCompanyId != null && Number.isFinite(invoiceId) }
  );

  if (!Number.isFinite(invoiceId)) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          error={new Error(`"${id}" nije valjan ID dokumenta.`)}
          context="Neispravan URL"
        />
      </div>
    );
  }

  if (selectedCompanyId == null || invoice.isInitialLoading) {
    return (
      <div className="space-y-4">
        <BackLink />
        <LoadingState label="Učitavanje dokumenta..." />
      </div>
    );
  }

  if (invoice.error && !invoice.data) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          error={invoice.error}
          onRetry={() => void invoice.refetch()}
          context={`Dohvat dokumenta #${invoiceId}`}
        />
      </div>
    );
  }

  if (!invoice.data) return null;

  const data = invoice.data;
  const meta = STATUS_META[data.status];

  return (
    <div className="space-y-4">
      <BackLink />

      {/* Zaglavlje */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {documentTypeLabel(data.documentType)}
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

            <h2 className="mt-1 font-mono text-lg font-bold text-foreground">
              {data.documentNumber ?? "— bez broja —"}
            </h2>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {data.recipientName} · {formatDate(data.invoiceDate)}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xl font-bold text-foreground">
              {formatMoney(data.totalDue, data.currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedCompany?.brandName}
            </p>
          </div>
        </div>

        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground text-pretty">
          {meta.description}
        </p>

        {/* Nastao konverzijom */}
        {data.convertedFromId != null && (
          <Link
            href={`/intranet/invoices/${data.convertedFromId}`}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Nastao konverzijom iz dokumenta #{data.convertedFromId}
          </Link>
        )}
      </div>

      {/* PDF — dostupan u svim stanjima */}
      <InvoicePdfActions
        companyId={selectedCompanyId}
        invoiceId={data.id}
        documentNumber={data.documentNumber}
      />

      {/* Uređivanje ili pregled.
          Uređivanje je uvijek dostupno — dokument nije zaključan
          nakon izdavanja, ispravke se rade izmjenom. */}
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Odustani od uređivanja
          </button>

          <InvoiceForm
            companyId={selectedCompanyId}
            companyName={selectedCompany?.brandName ?? ""}
            currency={data.currency}
            invoice={data}
            onSaved={async () => {
              setIsEditing(false);
              await invoice.refetch();
            }}
          />
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors active:scale-[0.99] sm:min-h-[2.75rem]"
          >
            <Pencil className="h-4 w-4" />
            Uredi dokument
          </button>

          <InvoiceDetailView invoice={data} />

          <InvoiceActions
            companyId={selectedCompanyId}
            invoice={data}
            onChanged={() => void invoice.refetch()}
            onDeleted={() => router.push("/intranet/invoices")}
            onConverted={(created) =>
              router.push(`/intranet/invoices/${created.id}`)
            }
          />
        </>
      )}
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/intranet/invoices"
      className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Svi dokumenti
    </Link>
  );
}
