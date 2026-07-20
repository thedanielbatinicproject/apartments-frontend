// ============================================================
// Companies API — §10 iz API-REFERENCE.md
//
// Potrebno jer ApartmentRequest zahtijeva `companyId`, pa forma
// za kreiranje apartmana mora ponuditi izbor firme.
// ============================================================

import { api } from "@/lib/api/client";
import type {
  CompanyResponse,
  CompanyCatalogs,
  CompanyUpdateRequest,
} from "@/lib/api/types";

/** GET /api/admin/companies */
export async function listCompanies(): Promise<CompanyResponse[]> {
  return api.get<CompanyResponse[]>("/api/admin/companies");
}

/** GET /api/admin/companies/{id} — puni podaci jedne firme */
export async function getCompany(id: number): Promise<CompanyResponse> {
  return api.get<CompanyResponse>(`/api/admin/companies/${id}`);
}

/**
 * PUT /api/admin/companies/{id}
 *
 * Mijenja podatke firme. Već izdani dokumenti se NE mijenjaju —
 * oni nose snimku podataka iz trenutka izdavanja.
 */
export async function updateCompany(
  id: number,
  payload: CompanyUpdateRequest
): Promise<CompanyResponse> {
  return api.put<CompanyResponse>(
    `/api/admin/companies/${id}`,
    payload as unknown as Record<string, unknown>
  );
}

/**
 * POST /api/admin/companies/{id}/logo — multipart, polje "file".
 * Logo se ispisuje u zaglavlju PDF dokumenata.
 */
export async function uploadCompanyLogo(
  id: number,
  file: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  await api.postForm<null>(`/api/admin/companies/${id}/logo`, formData);
}

/**
 * GET /api/admin/companies/{id}/catalogs
 * Predefinirane liste koje služe kao autocomplete pri unosu
 * stavki računa (opis jedinice, vrsta usluge, način plaćanja).
 */
export async function getCompanyCatalogs(
  id: number
): Promise<CompanyCatalogs> {
  return api.get<CompanyCatalogs>(`/api/admin/companies/${id}/catalogs`);
}

/** PUT /api/admin/companies/{id}/catalogs */
export async function updateCompanyCatalogs(
  id: number,
  catalogs: CompanyCatalogs
): Promise<void> {
  await api.put<null>(
    `/api/admin/companies/${id}/catalogs`,
    catalogs as unknown as Record<string, unknown>
  );
}
