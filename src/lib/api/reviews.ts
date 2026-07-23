// ============================================================
// Reviews API — §12 (javno) i §13 (admin) iz API-REFERENCE.md
// ============================================================

import { api } from "@/lib/api/client";
import type {
  AdminReviewResponse,
  ReviewRequest,
  ReviewResponse,
  UpvoteResponse,
} from "@/lib/api/types";

// ---------- Javne rute ----------

/** GET /api/reviews/{apartmentId} — samo visible: true recenzije */
export async function getPublicReviews(
  apartmentId: number
): Promise<ReviewResponse[]> {
  return api.get<ReviewResponse[]>(`/api/reviews/${apartmentId}`, {
    skipAuth: true,
  });
}

/** POST /api/reviews/{reviewId}/upvote — toggle, anonimno preko fingerprinta */
export async function toggleReviewUpvote(
  reviewId: number
): Promise<UpvoteResponse> {
  return api.post<UpvoteResponse>(
    `/api/reviews/${reviewId}/upvote`,
    undefined,
    { skipAuth: true }
  );
}

// ---------- Admin rute ----------

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
