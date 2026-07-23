// ============================================================
// Bazni URL backenda — s automatskom zamjenom hosta u devu.
//
// PROBLEM KOJI RJEŠAVA: NEXT_PUBLIC_API_URL=http://localhost:8080
// radi na razvojnom računalu, ali kad se stranica otvori s
// mobitela preko LAN IP-a (http://192.168.x.x:3000), "localhost"
// na mobitelu pokazuje NA SAM MOBITEL — svaki API poziv padne s
// "server nije dostupan".
//
// RJEŠENJE: ako je env host localhost/127.0.0.1, a stranica NIJE
// otvorena s localhosta, host API-ja se zamijeni hostom stranice
// (port iz enva ostaje). Backend je na istom računalu kao dev
// server, pa je to uvijek točna adresa.
//
// U produkciji env pokazuje na pravu domenu → zamjena se nikad
// ne aktivira. Ovo je isključivo dev pogodnost.
//
// NAPOMENA ZA CORS: backend mora u app.cors.allowed-origins
// imati i http://192.168.x.x:3000 (LAN origin), inače će browser
// blokirati odgovore unatoč ispravnoj adresi.
// ============================================================

const RAW_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

let cached: string | null = null;

export function apiBaseUrl(): string {
  // SSR: nema window — vrati kako piše u envu
  if (typeof window === "undefined") return RAW_BASE;

  if (cached !== null) return cached;

  cached = RAW_BASE;

  try {
    const envUrl = new URL(RAW_BASE);
    const pageHost = window.location.hostname;

    if (LOCAL_HOSTS.has(envUrl.hostname) && !LOCAL_HOSTS.has(pageHost)) {
      envUrl.hostname = pageHost;
      cached = envUrl.toString().replace(/\/$/, "");
    }
  } catch {
    // Neispravan env URL — pusti sirovu vrijednost, greška će se
    // vidjeti na prvom pozivu s jasnim uzrokom
  }

  return cached;
}
