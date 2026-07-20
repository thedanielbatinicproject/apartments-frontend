// ============================================================
// Solar Admin API — §14 iz API-REFERENCE.md
//
// Frontend je samo ČITATELJ: koristimo isključivo ADMIN rute
// (JWT). DEVICE rute (/ingest, /relay/pending, /relay/ack) su
// ESP32 → backend komunikacija preko X-Device-Secret headera i
// namjerno se ovdje ne pozivaju.
// ============================================================

import { api } from "@/lib/api/client";
import type {
  SolarReadingResponse,
  SolarChartRange,
  SolarVariableResponse,
  SolarAggregateResponse,
  RelayAction,
  RelayStatusResponse,
} from "@/lib/api/types";

/** GET /api/solar/latest — zadnje očitanje senzora */
export async function getLatestReading(): Promise<SolarReadingResponse> {
  return api.get<SolarReadingResponse>("/api/solar/latest");
}

/**
 * GET /api/solar/chart-data — povijest očitanja za graf.
 * `range` prema API-REFERENCE.md: "24h" | "7d" | "30d" (default "24h").
 */
export async function getChartData(
  range: SolarChartRange = "24h"
): Promise<SolarReadingResponse[]> {
  return api.get<SolarReadingResponse[]>("/api/solar/chart-data", {
    params: { range },
  });
}

/** GET /api/solar/variables — dinamičke labele/jedinice (dvojezično) */
export async function getVariables(): Promise<SolarVariableResponse[]> {
  return api.get<SolarVariableResponse[]>("/api/solar/variables");
}

/** GET /api/solar/reports/weekly — tjedni agregati */
export async function getWeeklyReports(): Promise<SolarAggregateResponse[]> {
  return api.get<SolarAggregateResponse[]>("/api/solar/reports/weekly");
}

/** GET /api/solar/reports/monthly — mjesečni agregati */
export async function getMonthlyReports(): Promise<SolarAggregateResponse[]> {
  return api.get<SolarAggregateResponse[]>("/api/solar/reports/monthly");
}

// ============================================================
// Releji — daljinsko upravljanje preko ESP32.
//
// Komanda ide u red (backend) → ESP32 je povuče (/relay/pending)
// → izvrši → potvrdi (/relay/ack). Zato POST ovdje ne mijenja
// stanje odmah — `pendingCommand: true` u odgovoru znači "čeka se
// potvrda uređaja". Realtime sinkronizacija ide preko WebSocketa
// (vidi hooks/use-relay-status.ts), ne pollingom.
// ============================================================

/** GET /api/solar/relay/status — status svih releja */
export async function getRelayStatus(): Promise<RelayStatusResponse[]> {
  return api.get<RelayStatusResponse[]>("/api/solar/relay/status");
}

/** POST /api/solar/relay/{id}/toggle */
export async function toggleRelay(
  relayId: number,
  action: RelayAction
): Promise<RelayStatusResponse> {
  return api.post<RelayStatusResponse>(`/api/solar/relay/${relayId}/toggle`, {
    action,
  });
}
