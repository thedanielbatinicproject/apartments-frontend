"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Star,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ThumbsUp,
  RefreshCw,
  MessageSquareText,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import { useApartment } from "@/lib/apartment/apartment-context";
import { ApartmentSwitcher } from "@/components/intranet/layout/ApartmentSwitcher";
import { listAdminReviews, updateReview, deleteReview } from "@/lib/api/reviews";
import type { AdminReviewResponse, ReviewRequest } from "@/lib/api/types";
import { sourceMeta, languageLabel } from "@/lib/review-utils";
import { formatDate } from "@/lib/invoice-utils";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
  SkeletonList,
} from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { ReviewFormDialog } from "@/components/intranet/reviews/ReviewFormDialog";

// ============================================================
// /intranet/reviews — recenzije PO APARTMANU.
//
// Apartman se ne bira ovdje: čita se iz globalnog selektora
// (ApartmentSwitcher u headeru, lib/apartment/apartment-context) —
// isti obrazac kao firma za račune. Zaglavlje ispod uvijek javno
// ispisuje za koji je apartman lista, da ne dođe do zabune kad
// admin promijeni odabir na drugoj stranici pa se vrati ovamo.
//
// §12 (javne rute, upvote toggle) namjerno nisu dio ovog ekrana —
// to je sustav za javnu stranicu (drugi dio projekta), ovdje se
// upvoteCount samo PRIKAZUJE (read-only).
// ============================================================

export default function ReviewsPage() {
  const {
    selectedApartment,
    selectedApartmentId,
    isLoading: isApartmentLoading,
    error: apartmentError,
    reload: reloadApartments,
  } = useApartment();

  const [formOpen, setFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<AdminReviewResponse | null>(
    null
  );

  const confirm = useConfirm();

  const reviews = useAsync<AdminReviewResponse[]>(
    () => listAdminReviews(selectedApartmentId as number),
    [selectedApartmentId],
    { enabled: selectedApartmentId != null }
  );

  const toggleVisible = useMutation(
    async (review: AdminReviewResponse) => {
      const payload: ReviewRequest = {
        apartmentId: review.apartmentId,
        authorName: review.authorName,
        rating: review.rating,
        text: review.text,
        languageCode: review.languageCode,
        source: review.source,
        reviewDate: review.reviewDate,
        visible: !review.visible,
        sortOrder: review.sortOrder,
      };
      return updateReview(review.id, payload);
    },
    {
      onSuccess: (updated) =>
        reviews.setData((prev) =>
          prev ? prev.map((r) => (r.id === updated.id ? updated : r)) : prev
        ),
    }
  );

  const remove = useMutation(
    async (id: number) => {
      await deleteReview(id);
      return id;
    },
    {
      onSuccess: (id) =>
        reviews.setData((prev) => (prev ? prev.filter((r) => r.id !== id) : prev)),
    }
  );

  const handleDelete = async (review: AdminReviewResponse) => {
    const ok = await confirm({
      title: "Obrisati recenziju?",
      description: `Recenzija gosta ${review.authorName} bit će trajno uklonjena s javne stranice.`,
      warning: "Ovo se ne može poništiti.",
      confirmLabel: "Obriši",
      variant: "destructive",
    });
    if (ok) void remove.run(review.id);
  };

  const sorted = useMemo(
    () =>
      [...(reviews.data ?? [])].sort((a, b) => {
        const orderA = a.sortOrder ?? 0;
        const orderB = b.sortOrder ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return (b.reviewDate ?? "").localeCompare(a.reviewDate ?? "");
      }),
    [reviews.data]
  );

  const isRefreshing = reviews.isLoading && !reviews.isInitialLoading;

  // --- Apartmani se još učitavaju ---
  if (isApartmentLoading) {
    return <SkeletonList count={2} />;
  }

  // --- Dohvat apartmana pao ---
  if (apartmentError != null) {
    return (
      <ErrorState
        error={apartmentError}
        onRetry={() => void reloadApartments()}
        context="Dohvat apartmana"
      />
    );
  }

  // --- Nema nijednog apartmana ---
  if (selectedApartmentId == null) {
    return (
      <EmptyState
        icon={Home}
        title="Nema definiranih apartmana"
        description="Recenzije se vežu uz apartman, pa je barem jedan potreban prije unosa."
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Zaglavlje — uvijek jasno za koji je apartman prikaz */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Recenzije
          </h2>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            Uređuju se za apartman{" "}
            <span className="font-semibold text-foreground">
              {selectedApartment?.internalCode}
              {selectedApartment?.name ? ` — ${selectedApartment.name}` : ""}
            </span>
            {reviews.data && ` · ${reviews.data.length} recenzija`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ApartmentSwitcher />

          <button
            type="button"
            onClick={() => void reviews.refetch()}
            disabled={reviews.isLoading}
            aria-label="Osvježi"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingReview(null);
              setFormOpen(true);
            }}
            className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Nova
          </button>
        </div>
      </div>

      {/* Lista */}
      <AsyncBoundary
        isLoading={reviews.isLoading}
        error={reviews.error}
        data={reviews.data}
        onRetry={() => void reviews.refetch()}
        context="Dohvat recenzija"
        loadingFallback={<SkeletonList count={3} />}
        emptyFallback={
          <EmptyState
            icon={MessageSquareText}
            title="Još nema recenzija"
            description="Dodajte recenziju prepisanu s Airbnb-a, Google-a ili Bookinga."
            action={
              <button
                type="button"
                onClick={() => {
                  setEditingReview(null);
                  setFormOpen(true);
                }}
                className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Nova recenzija
              </button>
            }
          />
        }
      >
        {() => (
          <ul className="space-y-2.5">
            {sorted.map((review) => {
              const meta = sourceMeta(review.source);

              return (
                <li
                  key={review.id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="font-semibold text-foreground">
                          {review.authorName}
                        </p>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
                            meta.className
                          )}
                        >
                          {meta.label}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                          {languageLabel(review.languageCode)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={cn(
                              "h-3.5 w-3.5",
                              n <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {formatDate(review.reviewDate)}
                        </span>
                      </div>

                      {review.text && (
                        <p className="mt-2 text-sm text-foreground text-pretty">
                          {review.text}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {review.upvoteCount}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => void toggleVisible.run(review)}
                        disabled={toggleVisible.isPending}
                        title={
                          review.visible
                            ? "Vidljivo na javnoj stranici — klik za skrivanje"
                            : "Skriveno — klik za prikaz na javnoj stranici"
                        }
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.625rem] font-bold transition-colors disabled:opacity-50",
                          review.visible
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {review.visible ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <EyeOff className="h-3 w-3" />
                        )}
                        {review.visible ? "Vidljivo" : "Skriveno"}
                      </button>

                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingReview(review);
                            setFormOpen(true);
                          }}
                          aria-label="Uredi recenziju"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(review)}
                          aria-label="Obriši recenziju"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AsyncBoundary>

      {formOpen && selectedApartmentId != null && (
        <ReviewFormDialog
          apartmentId={selectedApartmentId}
          review={editingReview}
          onClose={() => setFormOpen(false)}
          onSaved={(saved) => {
            setFormOpen(false);
            reviews.setData((prev) => {
              if (!prev) return [saved];
              const exists = prev.some((r) => r.id === saved.id);
              return exists
                ? prev.map((r) => (r.id === saved.id ? saved : r))
                : [saved, ...prev];
            });
          }}
        />
      )}
    </div>
  );
}
