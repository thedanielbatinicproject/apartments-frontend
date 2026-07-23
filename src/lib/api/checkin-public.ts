// ============================================================
// Javni self-checkin API — §8 iz API-REFERENCE.md
//
// Sve rute su JAVNE (skipAuth) — gost dolazi preko QR koda,
// nema login. Tok je vezan uz recordId koji vraća /start.
// ============================================================

import { apiRequest, api } from "@/lib/api/client";
import type {
  CheckinStatusResponse,
  GuestDocumentType,
} from "@/lib/api/types";

/**
 * POST /api/checkin/start — otvara prijavu.
 * Datumi i privola idu ODMAH (API ih traži prije skena);
 * consentGiven mora biti true.
 */
export async function startCheckin(params: {
  apartmentId: number;
  arrivalDate: string;
  departureDate: string;
  consentGiven: true;
}): Promise<{ recordId: number }> {
  return api.post<{ recordId: number }>(
    "/api/checkin/start",
    params,
    { skipAuth: true }
  );
}

/**
 * POST /api/checkin/{recordId}/document-scan — slanje slika.
 * Putovnica: samo front. Osobna/vozačka: front + back.
 */
export async function scanGuestDocument(
  recordId: number,
  documentType: GuestDocumentType,
  front: Blob,
  back?: Blob | null
): Promise<CheckinStatusResponse> {
  const formData = new FormData();
  formData.append("documentType", documentType);
  formData.append("front", front, "front.jpg");
  if (back) formData.append("back", back, "back.jpg");

  return apiRequest<CheckinStatusResponse>(
    `/api/checkin/${recordId}/document-scan`,
    { method: "POST", body: formData, skipAuth: true }
  );
}

/** GET /api/checkin/{recordId}/status — polling dok je PROCESSING */
export async function getCheckinStatus(
  recordId: number
): Promise<CheckinStatusResponse> {
  return api.get<CheckinStatusResponse>(`/api/checkin/${recordId}/status`, {
    skipAuth: true,
  });
}

/** POST /api/checkin/{recordId}/manual — ručni unos umjesto skena */
export async function submitManualCheckin(
  recordId: number,
  data: {
    fullName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    placeOfResidence: string;
    documentType: GuestDocumentType;
    documentNumber: string;
  }
): Promise<CheckinStatusResponse> {
  return api.post<CheckinStatusResponse>(
    `/api/checkin/${recordId}/manual`,
    data,
    { skipAuth: true }
  );
}

/**
 * POST /api/checkin/{recordId}/confirm — završna potvrda.
 * Gost UVIJEK prolazi kroz ovaj korak, i nakon pouzdanog OCR-a.
 */
export async function confirmCheckin(
  recordId: number,
  data: {
    fullName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    placeOfResidence: string;
    documentNumber: string;
  }
): Promise<CheckinStatusResponse> {
  return api.post<CheckinStatusResponse>(
    `/api/checkin/${recordId}/confirm`,
    data,
    { skipAuth: true }
  );
}

/**
 * POST /api/checkin/{recordId}/abandon — gost odustaje od prijave.
 *
 * ⚠️ RUTA JOŠ NE POSTOJI NA BACKENDU — zahtjev je poslan (vidi chat,
 * ne docs/). Namjerno "best effort": dok backend ne implementira
 * rutu, poziv će pasti (404/405), pa greška ovdje NE smije spriječiti
 * lokalni "odustani" (brisanje spremljene sesije, povratak na
 * početak) — zato pozivatelj ovu funkciju uvijek zove unutar
 * try/catch i ignorira neuspjeh.
 */
export async function abandonCheckin(recordId: number): Promise<void> {
  await api.post<null>(`/api/checkin/${recordId}/abandon`, undefined, {
    skipAuth: true,
  });
}
