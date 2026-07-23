"use client";

import { Star, ThumbsUp } from "lucide-react";
import type { ReviewResponse } from "@/lib/api/types";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          style={
            i < rating
              ? { fill: "var(--hs-sun-core)", color: "var(--hs-sun-core)" }
              : { color: "color-mix(in oklab, var(--hs-text-soft) 35%, transparent)" }
          }
        />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: ReviewResponse;
  onUpvote: (reviewId: number) => void;
  upvoteLabel: string;
  isPending: boolean;
}

export function ReviewCard({
  review,
  onUpvote,
  upvoteLabel,
  isPending,
}: ReviewCardProps) {
  return (
    <li
      className="rounded-2xl p-4"
      style={{
        background: "var(--hs-card)",
        border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-semibold [color:var(--hs-text-strong)]">
          {review.authorName}
        </span>
        <Stars rating={review.rating} />
      </div>

      {review.text && (
        <p className="mt-2 text-sm leading-relaxed text-pretty [color:var(--hs-text-soft)]">
          {review.text}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        {review.reviewDate ? (
          <span className="text-xs opacity-60 [color:var(--hs-text-soft)]">
            {new Date(review.reviewDate).toLocaleDateString()}
          </span>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={() => onUpvote(review.id)}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60"
          style={
            review.upvotedByYou
              ? {
                  borderColor: "color-mix(in oklab, var(--hs-accent) 60%, transparent)",
                  background: "color-mix(in oklab, var(--hs-accent) 12%, transparent)",
                  color: "var(--hs-accent)",
                }
              : {
                  borderColor: "color-mix(in oklab, var(--hs-text-soft) 30%, transparent)",
                  color: "var(--hs-text-soft)",
                }
          }
        >
          <ThumbsUp
            className="h-3.5 w-3.5"
            style={review.upvotedByYou ? { fill: "var(--hs-accent)" } : undefined}
          />
          {upvoteLabel}
          {review.upvoteCount > 0 ? ` (${review.upvoteCount})` : ""}
        </button>
      </div>
    </li>
  );
}
