"use client";

import { MessageSquare } from "lucide-react";
import { useAsync, useMutation } from "@/hooks/use-async";
import { getPublicReviews, toggleReviewUpvote } from "@/lib/api/reviews";
import { ReviewCard } from "./ReviewCard";

interface ReviewsListLabels {
  title: string;
  empty: string;
  error: string;
  retry: string;
  upvote: string;
  /** Predložak s "{n}" tokenom, npr. "/ 5 · {n} recenzija" */
  averageSuffix: string;
}

interface ReviewsListProps {
  apartmentId: number;
  labels: ReviewsListLabels;
}

export function ReviewsList({ apartmentId, labels }: ReviewsListProps) {
  const reviews = useAsync(() => getPublicReviews(apartmentId), [apartmentId]);

  const upvote = useMutation((reviewId: number) => toggleReviewUpvote(reviewId), {
    onSuccess: (result) => {
      reviews.setData((prev) =>
        prev
          ? prev.map((r) =>
              r.id === result.reviewId
                ? { ...r, upvoteCount: result.upvoteCount, upvotedByYou: result.upvoted }
                : r
            )
          : prev
      );
    },
  });

  const list = reviews.data ?? [];
  const average =
    list.length > 0
      ? list.reduce((sum, r) => sum + r.rating, 0) / list.length
      : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {labels.title}
        </h3>
        {list.length > 0 && (
          <span className="text-sm [color:var(--hs-text-soft)]">
            {average.toFixed(1)} {labels.averageSuffix.replace("{n}", String(list.length))}
          </span>
        )}
      </div>

      {reviews.isLoading && !reviews.data && (
        <div className="mt-4 space-y-2.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl"
              style={{ background: "color-mix(in oklab, var(--hs-text-soft) 12%, transparent)" }}
            />
          ))}
        </div>
      )}

      {Boolean(reviews.error) && (
        <div className="mt-4 text-center text-sm [color:var(--hs-text-soft)]">
          {labels.error}
          <button
            onClick={() => void reviews.refetch()}
            className="mt-2 block w-full font-semibold underline underline-offset-2 [color:var(--hs-accent)]"
          >
            {labels.retry}
          </button>
        </div>
      )}

      {!reviews.isLoading && !reviews.error && list.length === 0 && (
        <div className="mt-6 flex flex-col items-center gap-2 text-center [color:var(--hs-text-soft)]">
          <MessageSquare className="h-6 w-6 opacity-60" />
          <p className="text-sm">{labels.empty}</p>
        </div>
      )}

      {list.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {list.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onUpvote={(id) => void upvote.run(id)}
              upvoteLabel={labels.upvote}
              isPending={upvote.isPending}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
