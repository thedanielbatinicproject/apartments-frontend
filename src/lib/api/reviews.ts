// ============================================================
// Reviews API — §13 (admin) iz API-REFERENCE.md
//
// §12 (javne rute /api/reviews/{apartmentId} i POST .../upvote)
// se OVDJE namjerno ne dodaju — to je upvote sustav za javnu
// stranicu, koristi se negdje drugdje, ne u intranetu.
// ============================================================

import { api } from "@/lib/api/client";
import type { AdminReviewResponse, ReviewRequest } from "@/lib/api/types";

/**
 * GET /api/admin/reviews?apartmentId=
 * Vraća SVE recenzije (uključujući skrivene), za razliku od javne rute.
 */
export async function listAdminReviews(
  apartmentId?: number
): Promise<AdminReviewResponse[]> {
  return api.get<AdminReviewResponse[]>("/api/admin/reviews", {
    params: { apartmentId },
  });
}

/** POST /api/admin/reviews — ručno dodavanje recenzije */
export async function createReview(
  payload: ReviewRequest
): Promise<AdminReviewResponse> {
  return api.post<AdminReviewResponse>(
    "/api/admin/reviews",
    payload as unknown as Record<string, unknown>
  );
}

/** PUT /api/admin/reviews/{id} — šalje se CIJEL ReviewRequest, ne samo izmjene */
export async function updateReview(
  id: number,
  payload: ReviewRequest
): Promise<AdminReviewResponse> {
  return api.put<AdminReviewResponse>(
    `/api/admin/reviews/${id}`,
    payload as unknown as Record<string, unknown>
  );
}

/** DELETE /api/admin/reviews/{id} */
export async function deleteReview(id: number): Promise<void> {
  await api.delete<null>(`/api/admin/reviews/${id}`);
}
