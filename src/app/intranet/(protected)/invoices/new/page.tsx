"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building } from "lucide-react";
import { useCompany } from "@/lib/company/company-context";
import type { InvoiceDocumentType } from "@/lib/api/types";
import { newDocumentLabel } from "@/lib/invoice-utils";
import { EmptyState, LoadingState } from "@/components/intranet/ui/DataStates";
import { InvoiceForm } from "@/components/intranet/invoices/InvoiceForm";

// ============================================================
// /intranet/invoices/new
//
// Naslov prati odabranu vrstu dokumenta ("Novi račun", "Nova
// ponuda"), pa je uvijek jasno što se upravo radi.
// ============================================================

export default function NewInvoicePage() {
  const router = useRouter();
  const { selectedCompany, selectedCompanyId, isLoading } = useCompany();
  const [documentType, setDocumentType] =
    useState<InvoiceDocumentType>("INVOICE");

  if (isLoading) return <LoadingState label="Učitavanje..." />;

  if (selectedCompanyId == null) {
    return (
      <EmptyState
        icon={Building}
        title="Nema definiranih firmi"
        description="Dokument se izdaje u ime firme, pa je barem jedna obavezna."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Link
        href="/intranet/invoices"
        className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Svi dokumenti
      </Link>

      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
        {newDocumentLabel(documentType)}
      </h2>

      <InvoiceForm
        companyId={selectedCompanyId}
        companyName={selectedCompany?.brandName ?? ""}
        currency={selectedCompany?.currency || "EUR"}
        invoice={null}
        showCompanyBanner
        onDocumentTypeChange={setDocumentType}
        onSaved={(saved) => router.push(`/intranet/invoices/${saved.id}`)}
      />
    </div>
  );
}
