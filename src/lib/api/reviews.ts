// ============================================================
// Reviews API — §13 (admin) iz API-REFERENCE.md
// ============================================================

import { api } from "@/lib/api/client";
import type { AdminReviewResponse } from "@/lib/api/types";

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

/** DELETE /api/admin/reviews/{id} */
export async function deleteReview(id: number): Promise<void> {
  await api.delete<null>(`/api/admin/reviews/${id}`);
}
