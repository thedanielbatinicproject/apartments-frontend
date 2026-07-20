// ============================================================
// Admin Users i Invites API — §2 i §3 iz API-REFERENCE.md
//
// Sve rute su SUPERADMIN-only osim onih pod "OSOBNE RUTE".
// ============================================================

import { api, apiRequest } from "@/lib/api/client";
import type {
  AdminUserResponse,
  AdminInviteResponse,
  AdminRole,
} from "@/lib/api/types";

// ---------- Korisnici (SUPERADMIN) ----------

/** GET /api/admin/users — lista svih admin korisnika */
export async function listAdminUsers(): Promise<AdminUserResponse[]> {
  return api.get<AdminUserResponse[]>("/api/admin/users");
}

/**
 * POST /api/admin/users/invite — šalje pozivnicu novom adminu.
 *
 * NAPOMENA: ovo NE kreira račun. Backend šalje email s linkom;
 * račun nastaje tek kad primatelj postavi ime i lozinku preko
 * /api/auth/invite/accept.
 */
export async function inviteAdminUser(
  email: string,
  role: AdminRole
): Promise<void> {
  await api.post<null>("/api/admin/users/invite", { email, role });
}

/** PATCH /api/admin/users/{id}/disable — korisnik se više ne može prijaviti */
export async function disableAdminUser(id: number): Promise<void> {
  await apiRequest<null>(`/api/admin/users/${id}/disable`, {
    method: "PATCH",
  });
}

/** PATCH /api/admin/users/{id}/enable */
export async function enableAdminUser(id: number): Promise<void> {
  await apiRequest<null>(`/api/admin/users/${id}/enable`, {
    method: "PATCH",
  });
}

// ---------- Pozivnice (SUPERADMIN) ----------

/** GET /api/admin/invites — sve pozivnice, i iskorištene i neiskorištene */
export async function listAdminInvites(): Promise<AdminInviteResponse[]> {
  return api.get<AdminInviteResponse[]>("/api/admin/invites");
}

/** DELETE /api/admin/invites/{id} — opoziva NEISKORIŠTENU pozivnicu */
export async function revokeAdminInvite(id: number): Promise<void> {
  await api.delete<null>(`/api/admin/invites/${id}`);
}

// ---------- Osobne rute (svaki autenticirani korisnik) ----------

/**
 * PATCH /api/admin/users/me/solar-report-subscription
 * Uključuje/isključuje tjedni solar izvještaj mailom za SEBE.
 * Ovo NIJE SUPERADMIN ruta — mijenja samo vlastitu pretplatu.
 */
export async function setSolarReportSubscription(
  subscribed: boolean
): Promise<void> {
  await api.patch<null>("/api/admin/users/me/solar-report-subscription", {
    subscribed,
  });
}

// ============================================================
// RUTE KOJE BACKEND JOŠ NEMA
//
// Sljedeće dvije funkcije gađaju endpointe koji trenutno NE
// POSTOJE — vraćat će 404 dok ih backend ne doda. UI ih koristi
// da se vidi puni zamišljeni tok; ErrorState će uredno prikazati
// 404 s objašnjenjem.
//
// Točna specifikacija zatražena od backenda nalazi se u
// docs/BACKEND-ZAHTJEVI.md
// ============================================================

/**
 * DELETE /api/admin/users/{id} — TRAJNO brisanje admin računa.
 * ⚠️ Endpoint još ne postoji na backendu.
 */
export async function deleteAdminUser(id: number): Promise<void> {
  await api.delete<null>(`/api/admin/users/${id}`);
}

/**
 * PATCH /api/admin/users/{id}/role — promjena role postojećeg admina.
 * ⚠️ Endpoint još ne postoji na backendu.
 */
export async function changeAdminUserRole(
  id: number,
  role: AdminRole
): Promise<void> {
  await api.patch<null>(`/api/admin/users/${id}/role`, { role });
}
