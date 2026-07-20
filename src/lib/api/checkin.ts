// ============================================================
// Checkin Admin API — §9 iz API-REFERENCE.md
//
// Koristi se za povezivanje računa s evidencijom gosta:
// admin odabere gosta i podaci se prepišu u račun.
// ============================================================

import { api, apiRequest } from "@/lib/api/client";
import type {
  AdminGuestRecordResponse,
  AdminCorrectionRequest,
} from "@/lib/api/types";

export interface GuestRecordFilters {
  apartmentId?: number;
  /** "YYYY-MM-DD" */
  from?: string;
  to?: string;
}

/** GET /api/admin/checkin/records — pretraga evidencija gostiju */
export async function listGuestRecords(
  filters: GuestRecordFilters = {}
): Promise<AdminGuestRecordResponse[]> {
  return api.get<AdminGuestRecordResponse[]>("/api/admin/checkin/records", {
    params: {
      apartmentId: filters.apartmentId,
      from: filters.from,
      to: filters.to,
    },
  });
}

/** GET /api/admin/checkin/records/{id} — detalj jedne evidencije */
export async function getGuestRecord(
  id: number
): Promise<AdminGuestRecordResponse> {
  return api.get<AdminGuestRecordResponse>(`/api/admin/checkin/records/${id}`);
}

/**
 * PUT /api/admin/checkin/records/{id} — admin ispravlja podatke.
 * Šalju se SAMO promijenjena polja.
 */
export async function updateGuestRecord(
  id: number,
  correction: AdminCorrectionRequest
): Promise<AdminGuestRecordResponse> {
  return api.put<AdminGuestRecordResponse>(
    `/api/admin/checkin/records/${id}`,
    correction as Record<string, unknown>
  );
}

/**
 * POST /api/admin/checkin/records/{id}/mark-reviewed
 * Backend iz JWT-a sprema tko je i kada pregledao.
 */
export async function markGuestRecordReviewed(id: number): Promise<void> {
  await api.post<null>(`/api/admin/checkin/records/${id}/mark-reviewed`);
}

/** DELETE /api/admin/checkin/records/{id} */
export async function deleteGuestRecord(id: number): Promise<void> {
  await api.delete<null>(`/api/admin/checkin/records/${id}`);
}

/**
 * POST /api/admin/checkin/paper-scan — upload slike papirnatog obrasca.
 *
 * ⚠️ NAMJERNO BEZ apartmentId: nova verzija obrasca nosi oznaku
 * apartmana na papiru (npr. "EN-1" uz gornji lijevi marker), pa je
 * backend čita OCR-om. Vidi BACKEND-ZAHTJEVI-CHECKIN.md — trenutna
 * ruta još traži apartmentId i vraćat će 400 dok se ne prilagodi.
 */
export async function scanPaperForm(
  image: Blob
): Promise<AdminGuestRecordResponse> {
  const formData = new FormData();
  formData.append(
    "image",
    image,
    image instanceof File ? image.name : "obrazac.jpg"
  );

  return apiRequest<AdminGuestRecordResponse>("/api/admin/checkin/paper-scan", {
    method: "POST",
    body: formData,
  });
}

// ============================================================
// Grupiranje u BORAVKE
//
// Backend vraća zapise po gostu. Za račun nas zanima boravak —
// skupina gostiju u istom apartmanu s istim datumima. Grupiranje
// radimo ovdje jer backend nema pojam "boravka".
// ============================================================

export interface GuestStayGroup {
  key: string;
  apartmentId: number;
  apartmentInternalCode: string | null;
  arrivalDate: string | null;
  departureDate: string | null;
  /** Svi gosti tog boravka; prvi je prijedlog za nositelja računa */
  guests: AdminGuestRecordResponse[];
  adults: number;
  children: number;
}

/** Dob na dan dolaska — dijete je mlađe od 18 u trenutku boravka. */
function isChildAt(
  dateOfBirth: string | null,
  referenceDate: string | null
): boolean {
  if (!dateOfBirth) return false;

  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const reference = referenceDate
    ? new Date(`${referenceDate}T00:00:00`)
    : new Date();

  if (Number.isNaN(birth.getTime()) || Number.isNaN(reference.getTime())) {
    return false;
  }

  let age = reference.getFullYear() - birth.getFullYear();
  const monthDiff = reference.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && reference.getDate() < birth.getDate())) {
    age--;
  }

  return age < 18;
}

/**
 * Grupira zapise u boravke i prebrojava odrasle i djecu.
 *
 * Broj osoba je PRIJEDLOG — admin ga uvijek može ispraviti, jer
 * se ne prijavljuju uvijek svi gosti (npr. dojenčad) niti su svi
 * zapisi nužno dovršeni.
 */
export function groupIntoStays(
  records: AdminGuestRecordResponse[]
): GuestStayGroup[] {
  const map = new Map<string, GuestStayGroup>();

  for (const record of records) {
    const key = `${record.apartmentId}|${record.arrivalDate ?? ""}|${record.departureDate ?? ""}`;

    const existing = map.get(key);
    if (existing) {
      existing.guests.push(record);
    } else {
      map.set(key, {
        key,
        apartmentId: record.apartmentId,
        apartmentInternalCode: record.apartmentInternalCode,
        arrivalDate: record.arrivalDate,
        departureDate: record.departureDate,
        guests: [record],
        adults: 0,
        children: 0,
      });
    }
  }

  const groups = Array.from(map.values());

  for (const group of groups) {
    for (const guest of group.guests) {
      if (isChildAt(guest.dateOfBirth, group.arrivalDate)) group.children++;
      else group.adults++;
    }
  }

  // Najnoviji boravci prvi — najčešće se račun radi za tekući
  return groups.sort((a, b) =>
    (b.arrivalDate ?? "").localeCompare(a.arrivalDate ?? "")
  );
}
