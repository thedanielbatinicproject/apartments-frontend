// ============================================================
// Invoicing API — §11 iz API-REFERENCE.md
//
// Kontroler nema class-level prefiks, pa su admin rute pod
// /api/admin/invoices/**, a javna provjera pod /api/invoices/verify.
//
// Sve admin rute su scoped na firmu: /{companyId}/...
// ============================================================

import { api, apiRequest } from "@/lib/api/client";
import type {
  InvoiceRequest,
  InvoiceResponse,
  InvoiceSummaryResponse,
  InvoiceDocumentType,
  InvoiceStatus,
  InvoiceVerificationResponse,
} from "@/lib/api/types";

export interface InvoiceFilters {
  documentType?: InvoiceDocumentType;
  year?: number;
  status?: InvoiceStatus;
}

/**
 * GET /api/admin/invoices/{companyId}
 * Lista/pretraga dokumenata firme. Svi filtri su opcionalni.
 */
export async function listInvoices(
  companyId: number,
  filters: InvoiceFilters = {}
): Promise<InvoiceSummaryResponse[]> {
  return api.get<InvoiceSummaryResponse[]>(
    `/api/admin/invoices/${companyId}`,
    {
      params: {
        documentType: filters.documentType,
        year: filters.year,
        status: filters.status,
      },
    }
  );
}

/** GET /api/admin/invoices/{companyId}/{invoiceId} — puni detalj */
export async function getInvoice(
  companyId: number,
  invoiceId: number
): Promise<InvoiceResponse> {
  return api.get<InvoiceResponse>(
    `/api/admin/invoices/${companyId}/${invoiceId}`
  );
}

/** POST /api/admin/invoices/{companyId} — kreira dokument kao DRAFT */
export async function createInvoice(
  companyId: number,
  payload: InvoiceRequest
): Promise<InvoiceResponse> {
  return api.post<InvoiceResponse>(
    `/api/admin/invoices/${companyId}`,
    payload as unknown as Record<string, unknown>
  );
}

/**
 * PUT /api/admin/invoices/{companyId}/{invoiceId}
 * Radi SAMO dok je dokument u DRAFT statusu (`editable: true`).
 */
export async function updateInvoice(
  companyId: number,
  invoiceId: number,
  payload: InvoiceRequest
): Promise<InvoiceResponse> {
  return api.put<InvoiceResponse>(
    `/api/admin/invoices/${companyId}/${invoiceId}`,
    payload as unknown as Record<string, unknown>
  );
}

/**
 * POST /api/admin/invoices/{companyId}/{invoiceId}/issue
 * DRAFT → ISSUED. Dodjeljuje konačni documentNumber i uid.
 * Nakon ovoga dokument je nepromjenjiv.
 */
export async function issueInvoice(
  companyId: number,
  invoiceId: number
): Promise<InvoiceResponse> {
  return api.post<InvoiceResponse>(
    `/api/admin/invoices/${companyId}/${invoiceId}/issue`
  );
}

/** POST .../cancel — ISSUED → CANCELLED (storno) */
export async function cancelInvoice(
  companyId: number,
  invoiceId: number
): Promise<InvoiceResponse> {
  return api.post<InvoiceResponse>(
    `/api/admin/invoices/${companyId}/${invoiceId}/cancel`
  );
}

/**
 * DELETE /api/admin/invoices/{companyId}/{invoiceId}
 *
 * Referenca kaže "vjerojatno dopušteno samo za DRAFT". UI zato
 * nudi brisanje isključivo za DRAFT; ako backend ipak odbije,
 * greška se uredno prikaže.
 */
export async function deleteInvoice(
  companyId: number,
  invoiceId: number
): Promise<void> {
  await api.delete<null>(`/api/admin/invoices/${companyId}/${invoiceId}`);
}

/**
 * POST .../convert?to=INVOICE|PROFORMA|QUOTE
 * Kreira NOVI dokument povezan preko convertedFromId.
 * Izvorni dokument ostaje nepromijenjen.
 */
export async function convertInvoice(
  companyId: number,
  invoiceId: number,
  to: InvoiceDocumentType
): Promise<InvoiceResponse> {
  return apiRequest<InvoiceResponse>(
    `/api/admin/invoices/${companyId}/${invoiceId}/convert`,
    { method: "POST", params: { to } }
  );
}

/**
 * GET /api/admin/invoices/{companyId}/{invoiceId}/pdf
 *
 * Vraća SIROVI Response — PDF ne ide kroz ApiResponse omotač.
 * Ruta traži JWT, pa se ne smije otvarati običnim <a href>;
 * obrada je u lib/pdf-utils.ts.
 */
export async function fetchInvoicePdf(
  companyId: number,
  invoiceId: number
): Promise<Response> {
  return api.getPdf(`/api/admin/invoices/${companyId}/${invoiceId}/pdf`);
}

/**
 * GET /api/invoices/verify?uid= — JAVNA ruta (bez JWT).
 * Provjera autentičnosti računa preko QR koda s PDF-a.
 *
 * ⚠️ ZASAD NEISKORIŠTENO — čeka javnu stranicu /check-invoice.
 * Jedina ruta iz §11 koja još nema svoj ekran; svjesno odgođena.
 */
export async function verifyInvoice(
  uid: string
): Promise<InvoiceVerificationResponse> {
  return api.get<InvoiceVerificationResponse>("/api/invoices/verify", {
    params: { uid },
    skipAuth: true,
  });
}
