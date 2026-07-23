// ============================================================
// Pretvara bilo koju grešku u strukturu koju UI može prikazati.
//
// Cilj: kad nešto pukne, korisnik mora vidjeti ŠTO je puklo —
// HTTP status, poruku backenda i je li backend uopće dostupan.
// Nikad prazan ekran ili tiha greška.
// ============================================================

import { ApiError } from "@/lib/api/types";

import { apiBaseUrl } from "@/lib/api/base-url";

export interface DescribedError {
  /** Kratki naslov za prikaz */
  title: string;
  /** Objašnjenje na hrvatskom, po mogućnosti s uputom što napraviti */
  message: string;
  /** HTTP status, ako postoji */
  status?: number;
  /** Sirova poruka backenda / iznimke — za "Tehnički detalji" */
  detail?: string;
  /** Je li backend nedostupan (mreža), za razliku od greške aplikacije */
  isNetworkError: boolean;
  /** Ima li smisla nuditi "Pokušaj ponovo" */
  isRetryable: boolean;
}

export function describeError(error: unknown): DescribedError {
  // --- Greška koju je vratio backend (ApiResponse success: false) ---
  if (error instanceof ApiError) {
    const backendMessage = error.message;

    const byStatus: Record<number, { title: string; message: string }> = {
      400: {
        title: "Neispravni podaci",
        message:
          "Backend je odbio zahtjev zbog validacije. Provjerite jesu li sva obavezna polja ispravno popunjena.",
      },
      401: {
        title: "Sesija je istekla",
        message: "Prijavite se ponovo kako biste nastavili.",
      },
      403: {
        title: "Nemate ovlasti",
        message:
          "Vaša rola nema pristup ovoj akciji. Za neke radnje potrebna je SUPERADMIN rola.",
      },
      404: {
        title: "Nije pronađeno",
        message:
          "Traženi zapis ne postoji. Možda je obrisan u međuvremenu ili je link neispravan.",
      },
      409: {
        title: "Akcija trenutno nije dopuštena",
        message:
          "Zapis je u stanju koje ne dopušta ovu radnju (npr. već izdan račun).",
      },
      413: {
        title: "Datoteka je prevelika",
        message:
          "Upload premašuje maksimalnu dopuštenu veličinu. Smanjite sliku pa pokušajte ponovo.",
      },
      500: {
        title: "Greška na serveru",
        message:
          "Backend je vratio internu grešku. Provjerite logove Spring Boot aplikacije.",
      },
    };

    const known = byStatus[error.status];

    return {
      title: known?.title ?? `Greška ${error.status}`,
      message: known?.message ?? backendMessage,
      status: error.status,
      detail: backendMessage,
      isNetworkError: false,
      // 401/403 nema smisla ponavljati — problem je u sesiji/roli
      isRetryable: error.status !== 401 && error.status !== 403,
    };
  }

  // --- Mrežna greška: backend nije upaljen ili CORS blokira ---
  if (
    error instanceof TypeError ||
    (error instanceof Error && /fetch|network|Failed to fetch/i.test(error.message))
  ) {
    return {
      title: "Backend nije dostupan",
      message: `Nije uspjelo spajanje na ${apiBaseUrl() || "(nije postavljen)"}. Provjerite je li Spring Boot pokrenut i je li NEXT_PUBLIC_API_URL ispravan u .env.local. Ako backend radi, uzrok može biti CORS (app.cors.allowed-origins).`,
      detail: error instanceof Error ? error.message : String(error),
      isNetworkError: true,
      isRetryable: true,
    };
  }

  // --- Sve ostalo ---
  return {
    title: "Neočekivana greška",
    message:
      "Dogodilo se nešto neočekivano. Pokušajte ponovo, a ako se ponavlja provjerite konzolu preglednika.",
    detail: error instanceof Error ? error.message : String(error),
    isNetworkError: false,
    isRetryable: true,
  };
}
