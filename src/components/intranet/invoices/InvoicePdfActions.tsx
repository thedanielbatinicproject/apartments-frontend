"use client";

import { useEffect, useState } from "react";
import { FileDown, ExternalLink, Share2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@/hooks/use-async";
import { fetchInvoicePdf } from "@/lib/api/invoices";
import {
  downloadPdf,
  openPdf,
  sharePdf,
  canSharePdf,
} from "@/lib/pdf-utils";
import { ErrorState } from "@/components/intranet/ui/DataStates";

// ============================================================
// Gumbi za PDF računa.
//
// Tri radnje jer svaka rješava drugu situaciju na terenu:
//   Preuzmi  → uvijek radi, arhiviranje
//   Otvori   → brza provjera prije slanja gostu
//   Podijeli → slanje gostu na licu mjesta (WhatsApp/mail),
//              samo na uređajima s Web Share API-jem
//
// Svaka radnja radi vlastiti fetch. Namjerno se ne kešira blob:
// PDF se generira na backendu i mora odražavati trenutno stanje
// dokumenta (npr. nakon storniranja).
// ============================================================

interface InvoicePdfActionsProps {
  companyId: number;
  invoiceId: number;
  /** Za naziv datoteke kad ga backend ne pošalje u headeru */
  documentNumber: string | null;
  /** Kompaktna varijanta — samo ikone (za listu) */
  compact?: boolean;
  className?: string;
}

export function InvoicePdfActions({
  companyId,
  invoiceId,
  documentNumber,
  compact = false,
  className,
}: InvoicePdfActionsProps) {
  const [shareAvailable, setShareAvailable] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Provjera tek nakon mounta — navigator ne postoji pri SSR-u
  useEffect(() => {
    setShareAvailable(canSharePdf());
  }, []);

  const fallbackName = documentNumber
    ? `dokument-${documentNumber.replace(/[^\w.-]+/g, "-")}`
    : `dokument-${invoiceId}`;

  const download = useMutation(async () => {
    const response = await fetchInvoicePdf(companyId, invoiceId);
    await downloadPdf(response, fallbackName);
  });

  const open = useMutation(async () => {
    setNotice(null);
    const response = await fetchInvoicePdf(companyId, invoiceId);
    const opened = await openPdf(response, fallbackName);

    if (!opened) {
      setNotice(
        "Preglednik je blokirao otvaranje nove kartice. Upotrijebite Preuzmi."
      );
    }
  });

  const share = useMutation(async () => {
    setNotice(null);
    const response = await fetchInvoicePdf(companyId, invoiceId);
    await sharePdf(
      response,
      fallbackName,
      documentNumber ? `Dokument ${documentNumber}` : "Dokument"
    );
  });

  const anyPending = download.isPending || open.isPending || share.isPending;
  const anyError = download.error ?? open.error ?? share.error;

  const buttonBase = cn(
    "inline-flex items-center justify-center gap-1.5 rounded-xl border font-semibold transition-all active:scale-[0.98] disabled:opacity-50",
    compact ? "min-h-[2.25rem] px-2.5 text-xs" : "min-h-[2.75rem] px-3.5 text-sm"
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("flex flex-wrap gap-2", !compact && "xs:flex-nowrap")}>
        {/* Preuzmi — primarna radnja, uvijek pouzdana */}
        <button
          type="button"
          onClick={() => void download.run()}
          disabled={anyPending}
          className={cn(
            buttonBase,
            "border-transparent bg-primary text-primary-foreground hover:opacity-90",
            !compact && "flex-1"
          )}
        >
          {download.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          {compact ? "PDF" : download.isPending ? "Pripremam..." : "Preuzmi PDF"}
        </button>

        {/* Otvori */}
        <button
          type="button"
          onClick={() => void open.run()}
          disabled={anyPending}
          aria-label="Otvori PDF u novoj kartici"
          className={cn(buttonBase, "border-border bg-card text-foreground")}
        >
          {open.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
          {!compact && "Otvori"}
        </button>

        {/* Podijeli — samo gdje uređaj to podržava */}
        {shareAvailable && (
          <button
            type="button"
            onClick={() => void share.run()}
            disabled={anyPending}
            aria-label="Podijeli PDF"
            className={cn(buttonBase, "border-border bg-card text-foreground")}
          >
            {share.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            {!compact && "Podijeli"}
          </button>
        )}
      </div>

      {notice && (
        <p className="text-xs text-amber-600 text-pretty">{notice}</p>
      )}

      {anyError != null && (
        <ErrorState error={anyError} context="Generiranje PDF-a" compact />
      )}
    </div>
  );
}
