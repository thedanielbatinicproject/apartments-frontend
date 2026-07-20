// ============================================================
// Apartments API — §4 (javno) i §5 (admin) iz API-REFERENCE.md
// ============================================================

import { api, apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/types";
import type {
  ApartmentResponse,
  ApartmentRequest,
  ApartmentTranslationRequest,
  ApartmentTranslationResponse,
} from "@/lib/api/types";

// ---------- Javne rute ----------

/** GET /api/apartments — lista aktivnih apartmana (javni katalog) */
export async function listPublicApartments(
  lang?: string
): Promise<ApartmentResponse[]> {
  return api.get<ApartmentResponse[]>("/api/apartments", {
    params: { lang },
    skipAuth: true,
  });
}

/** GET /api/apartments/{id} */
export async function getPublicApartment(
  id: number,
  lang?: string
): Promise<ApartmentResponse> {
  return api.get<ApartmentResponse>(`/api/apartments/${id}`, {
    params: { lang },
    skipAuth: true,
  });
}

// ---------- Admin rute ----------

/**
 * GET /api/admin/apartments — lista SVIH apartmana.
 *
 * Za razliku od javne rute vraća i skrivene (neaktivne) apartmane
 * te popunjava admin polja: `companyId`, `airbnbIcalUrl`,
 * `bookingIcalUrl`.
 */
export async function listAdminApartments(): Promise<ApartmentResponse[]> {
  return api.get<ApartmentResponse[]>("/api/admin/apartments");
}

/**
 * Dohvat jednog apartmana s ADMIN poljima.
 *
 * Backend zasad nema GET /api/admin/apartments/{id}, samo listu,
 * pa filtriramo listu. Javnu rutu /api/apartments/{id} ovdje NE
 * smijemo koristiti jer ona vraća companyId i iCal URL-ove kao
 * null — forma bi ih pri spremanju obrisala.
 *
 * Ako backend doda single-item admin rutu, mijenja se samo ovo
 * tijelo funkcije.
 */
export async function getAdminApartment(
  id: number
): Promise<ApartmentResponse> {
  const all = await listAdminApartments();
  const found = all.find((apartment) => apartment.id === id);

  if (!found) {
    throw new ApiError(404, `Apartman #${id} ne postoji.`);
  }

  return found;
}

/** POST /api/admin/apartments — kreira apartman */
export async function createApartment(
  payload: ApartmentRequest
): Promise<ApartmentResponse> {
  return api.post<ApartmentResponse>(
    "/api/admin/apartments",
    payload as unknown as Record<string, unknown>
  );
}

/** PUT /api/admin/apartments/{id} — ažurira apartman */
export async function updateApartment(
  id: number,
  payload: ApartmentRequest
): Promise<ApartmentResponse> {
  return api.put<ApartmentResponse>(
    `/api/admin/apartments/${id}`,
    payload as unknown as Record<string, unknown>
  );
}

/** DELETE /api/admin/apartments/{id} */
export async function deleteApartment(id: number): Promise<void> {
  await api.delete<null>(`/api/admin/apartments/${id}`);
}

/**
 * PATCH /api/admin/apartments/{id}/active?active=true|false
 * Kontrolira prikaz apartmana na javnoj stranici.
 * `active` ide kao QUERY parametar, ne u body.
 */
export async function setApartmentActive(
  id: number,
  active: boolean
): Promise<void> {
  await apiRequest<null>(`/api/admin/apartments/${id}/active`, {
    method: "PATCH",
    params: { active },
  });
}

// ---------- Slike ----------

/** POST /api/admin/apartments/{id}/images — upload (multipart, polje "file") */
export async function uploadApartmentImage(
  apartmentId: number,
  file: File
): Promise<number> {
  const formData = new FormData();
  formData.append("file", file);
  return api.postForm<number>(
    `/api/admin/apartments/${apartmentId}/images`,
    formData
  );
}

/** PUT /api/admin/apartments/{id}/images/order — novi redoslijed slika */
export async function reorderApartmentImages(
  apartmentId: number,
  orderedImageIds: number[]
): Promise<void> {
  await api.put<null>(`/api/admin/apartments/${apartmentId}/images/order`, {
    orderedImageIds,
  });
}

/** PUT /api/admin/apartments/{id}/images/{imageId}/cover */
export async function setApartmentCoverImage(
  apartmentId: number,
  imageId: number
): Promise<void> {
  await api.put<null>(
    `/api/admin/apartments/${apartmentId}/images/${imageId}/cover`
  );
}

/** DELETE /api/admin/apartments/{id}/images/{imageId} */
export async function deleteApartmentImage(
  apartmentId: number,
  imageId: number
): Promise<void> {
  await api.delete<null>(
    `/api/admin/apartments/${apartmentId}/images/${imageId}`
  );
}

// ---------- Prijevodi ----------

/** GET /api/admin/apartments/{id}/translations */
export async function getApartmentTranslations(
  apartmentId: number
): Promise<ApartmentTranslationResponse[]> {
  return api.get<ApartmentTranslationResponse[]>(
    `/api/admin/apartments/${apartmentId}/translations`
  );
}

/**
 * PUT /api/admin/apartments/{id}/translations/{lang} — upsert.
 * Nema auto-prijevoda; sve se unosi ručno.
 */
export async function upsertApartmentTranslation(
  apartmentId: number,
  lang: string,
  payload: ApartmentTranslationRequest
): Promise<void> {
  await api.put<null>(
    `/api/admin/apartments/${apartmentId}/translations/${lang}`,
    payload as unknown as Record<string, unknown>
  );
}

/** DELETE /api/admin/apartments/{id}/translations/{lang} */
export async function deleteApartmentTranslation(
  apartmentId: number,
  lang: string
): Promise<void> {
  await api.delete<null>(
    `/api/admin/apartments/${apartmentId}/translations/${lang}`
  );
}
