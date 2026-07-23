// ============================================================
// Perzistencija pozicije u homepage flowu — preživljava refresh.
//
// Pamti se ID zadnje sekcije u fokusu (ne sirovi scrollY): visina
// sadržaja se pomiče dok se apartmani/fontovi učitavaju, pa bi
// pikselska pozicija promašila; sekcija je stabilna meta.
//
// Isti obrazac kao src/lib/checkin-session.ts (TTL + try/catch
// oko svakog pristupa localStorageu).
// ============================================================

const FLOW_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const STORAGE_KEY = "apsi:home:flow";

interface HomeFlowSession {
  sectionId: string;
  savedAt: number;
}

export function saveHomeFlowSection(sectionId: string): void {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sectionId, savedAt: Date.now() } satisfies HomeFlowSession)
    );
  } catch {
    // localStorage blokiran — flow radi dalje, samo bez pamćenja pozicije
  }
}

/** null ako nema spremljene pozicije ILI je starija od FLOW_TTL_MS */
export function loadHomeFlowSection(): string | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as HomeFlowSession;
    if (Date.now() - parsed.savedAt > FLOW_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.sectionId;
  } catch {
    return null;
  }
}
