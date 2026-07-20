"use client";

import Link from "next/link";
import { Star, MessageSquare, EyeOff, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/hooks/use-async";
import { listAdminReviews } from "@/lib/api/reviews";
import type { AdminReviewResponse } from "@/lib/api/types";
import { AsyncBoundary, EmptyState } from "@/components/intranet/ui/DataStates";

// ============================================================
// Tab "Recenzije" — read-only pregled za ovaj apartman.
//
// Uređivanje namjerno NIJE ovdje: puni CRUD nad recenzijama
// pripada stranici /intranet/reviews. Ovdje je samo kontekst
// ("kako gosti ocjenjuju baš ovaj apartman") s linkom dalje.
// ============================================================

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Ocjena ${rating} od 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

interface ApartmentReviewsTabProps {
  apartmentId: number;
}

export function ApartmentReviewsTab({ apartmentId }: ApartmentReviewsTabProps) {
  const reviews = useAsync<AdminReviewResponse[]>(
    () => listAdminReviews(apartmentId),
    [apartmentId]
  );

  const list = reviews.data ?? [];
  const average =
    list.length > 0
      ? list.reduce((sum, r) => sum + r.rating, 0) / list.length
      : 0;
  const hiddenCount = list.filter((r) => !r.visible).length;

  return (
    <div className="space-y-4">
      {/* Sažetak */}
      {list.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {average.toFixed(1)}
            </p>
            <Stars rating={Math.round(average)} />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              {list.length} {list.length === 1 ? "recenzija" : "recenzija"}
            </p>
            {hiddenCount > 0 && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-xs">
                <EyeOff className="h-3 w-3" />
                {hiddenCount} skriveno s javne stranice
              </p>
            )}
          </div>
          <Link
            href="/intranet/reviews"
            className="ml-auto inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Uredi
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <AsyncBoundary
        isLoading={reviews.isLoading}
        error={reviews.error}
        data={reviews.data}
        onRetry={() => void reviews.refetch()}
        context="Dohvat recenzija"
        emptyFallback={
          <EmptyState
            icon={MessageSquare}
            title="Nema recenzija"
            description="Recenzije se ne povlače automatski s Airbnb/Booking-a — dodaju se ručno na stranici Recenzije."
            action={
              <Link
                href="/intranet/reviews"
                className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Otvori recenzije
              </Link>
            }
          />
        }
      >
        {(items) => (
          <ul className="space-y-2.5">
            {items.map((review) => (
              <li
                key={review.id}
                className={cn(
                  "rounded-2xl border border-border bg-card p-4",
                  !review.visible && "opacity-60"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {review.authorName}
                    </span>
                    {!review.visible && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-semibold text-muted-foreground">
                        <EyeOff className="h-2.5 w-2.5" />
                        Skriveno
                      </span>
                    )}
                  </div>
                  <Stars rating={review.rating} />
                </div>

                {review.text && (
                  <p className="mt-2 text-sm text-muted-foreground text-pretty">
                    {review.text}
                  </p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">
                    {review.source}
                  </span>
                  {review.reviewDate && (
                    <span>
                      {new Date(review.reviewDate).toLocaleDateString("hr-HR")}
                    </span>
                  )}
                  {review.languageCode && (
                    <span className="font-mono uppercase">
                      {review.languageCode}
                    </span>
                  )}
                  {review.upvoteCount > 0 && (
                    <span>{review.upvoteCount} korisnih</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </AsyncBoundary>
    </div>
  );
}
