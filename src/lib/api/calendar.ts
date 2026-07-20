// ============================================================
// Calendar API — §6 iz API-REFERENCE.md
//
// Rute nemaju zajednički prefiks: javna je /api/calendar/{id},
// a admin rute su pod /api/admin/calendar/**.
// ============================================================

import { api } from "@/lib/api/client";
import type {
  BookedPeriodResponse,
  SyncStatusResponse,
} from "@/lib/api/types";

/**
 * Sirovi oblik s backenda — nova polja su OPCIONALNA jer ih
 * starije verzije backenda ne vraćaju.
 */
type RawBookedPeriod = Partial<BookedPeriodResponse> & {
  startDate: string;
  endDate: string;
};

/**
 * Normalizira period u oblik na koji se UI može osloniti.
 *
 * ZAŠTO POSTOJI: polja `sources`, `periodIds`, `merged` i
 * `mismatch` dodana su naknadno. Backend koji ih još nema vraća
 * ih kao undefined, a komponenta je pucala na
 * `period.periodIds.join(...)`.
 *
 * Umjesto da svaka komponenta provjerava, oblik popravljamo
 * jednom ovdje — na granici prema backendu.
 */
function normalizeBookedPeriod(raw: RawBookedPeriod): BookedPeriodResponse {
  const source = raw.source ?? "MANUAL";

  // Stari backend nema `sources` — izvedi iz `source`.
  // "MERGED" bez popisa izvora ne nosi informaciju, pa ga preskačemo.
  const sources =
    raw.sources && raw.sources.length > 0
      ? raw.sources
      : source && source !== "MERGED"
        ? [source]
        : [];

  const periodIds = raw.periodIds ?? [];

  return {
    startDate: raw.startDate,
    endDate: raw.endDate,
    source,
    sources,
    periodIds,
    // Ako backend ne pošalje `merged`, izvedi ga — spojenost se
    // vidi i po broju zapisa i po broju izvora, ovisno o tome
    // koje je od ta dva polja stiglo.
    merged:
      raw.merged ??
      (periodIds.length > 1 || sources.length > 1 || source === "MERGED"),
    mismatch: raw.mismatch ?? false,
  };
}

/** GET /api/calendar/{apartmentId} — zauzeti periodi (javno) */
export async function getBookedPeriods(
  apartmentId: number
): Promise<BookedPeriodResponse[]> {
  const raw = await api.get<RawBookedPeriod[]>(
    `/api/calendar/${apartmentId}`,
    { skipAuth: true }
  );

  return (raw ?? []).map(normalizeBookedPeriod);
}

/**
 * POST /api/admin/calendar/{apartmentId}/sync
 * Ručno pokreće iCal sync (Airbnb/Booking). Sync inače ide i automatski.
 */
export async function syncApartmentCalendar(
  apartmentId: number
): Promise<void> {
  await api.post<null>(`/api/admin/calendar/${apartmentId}/sync`);
}

/**
 * DELETE /api/admin/calendar/periods/{periodId}
 * Briše POJEDINAČNI zapis, ne spojeni period.
 *
 * Backend `message` razlikuje dva ishoda:
 *   "Period obrisan"
 *   "Period obrisan, ali dolazi iz iCal feeda pa će se vratiti
 *    pri sljedećoj sinkronizaciji"
 *
 * Drugi slučaj nastaje jer feed sadrži rezervacije od danas
 * nadalje — sljedeći sync ih upsertom vrati po external_uid.
 * Trajno se brišu samo prošli periodi i MANUAL unosi.
 */
export async function deleteBookedPeriod(periodId: number): Promise<void> {
  await api.delete<null>(`/api/admin/calendar/periods/${periodId}`);
}

/** GET /api/admin/calendar/sync-status — status zadnjeg synca za sve apartmane */
export async function getCalendarSyncStatus(): Promise<SyncStatusResponse[]> {
  return api.get<SyncStatusResponse[]>("/api/admin/calendar/sync-status");
}
