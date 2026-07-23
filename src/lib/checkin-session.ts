// ============================================================
// Lokalna perzistencija self-checkin sesije — preživljava refresh.
//
// ZAŠTO: bez ovoga svaki refresh stranice zove POST /start iznova,
// pa svaki napušteni pokušaj ostaje na backendu kao "prazan" zapis
// koji zauvijek "čeka akciju gosta" (gost je već otišao/refreshao).
//
// Sesija vrijedi SESSION_TTL_MS (par sati) — nakon toga se tretira
// kao istekla i briše se lokalno, čak i ako backend zapis tehnički
// još postoji.
//
// SIGURNOSNA NAPOMENA: backend ZASAD nema poseban "resume token" —
// nastavak ide preko recordId, koji je obični sekvencijalni broj.
// Ovo je dakle "best effort" pogodnost za normalan tok (gost slučajno
// refresha svoj vlastiti tab), NE sigurnosna mjera protiv nekog tko
// namjerno pogađa tuđe recordId-eve — to je pravi backend zahtjev,
// vidi docs/BACKEND-ZAHTJEVI-SELF-CHECKIN.md §7.
// ============================================================

const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4h

interface CheckinSession {
  recordId: number;
  arrivalDate: string;
  departureDate: string;
  savedAt: number;
}

function storageKey(apartmentId: number): string {
  return `apsi:checkin:${apartmentId}`;
}

export function saveCheckinSession(
  apartmentId: number,
  session: { recordId: number; arrivalDate: string; departureDate: string }
): void {
  try {
    window.localStorage.setItem(
      storageKey(apartmentId),
      JSON.stringify({ ...session, savedAt: Date.now() } satisfies CheckinSession)
    );
  } catch {
    // localStorage blokiran (privatni način rada i sl.) — nastavak preko
    // refresha jednostavno neće raditi, sam unos gosta nije ugrožen
  }
}

/** null ako nema spremljene sesije ILI je starija od SESSION_TTL_MS */
export function loadCheckinSession(apartmentId: number): CheckinSession | null {
  try {
    const raw = window.localStorage.getItem(storageKey(apartmentId));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CheckinSession;
    if (Date.now() - parsed.savedAt > SESSION_TTL_MS) {
      window.localStorage.removeItem(storageKey(apartmentId));
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearCheckinSession(apartmentId: number): void {
  try {
    window.localStorage.removeItem(storageKey(apartmentId));
  } catch {
    // ignore
  }
}
