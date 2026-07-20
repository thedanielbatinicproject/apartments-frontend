"use client";

import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@/hooks/use-async";
import { createReview, updateReview } from "@/lib/api/reviews";
import type { AdminReviewResponse, ReviewRequest } from "@/lib/api/types";
import { REVIEW_SOURCES } from "@/lib/review-utils";
import { ErrorState } from "@/components/intranet/ui/DataStates";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Forma za dodavanje/uređivanje recenzije — bottom sheet na
// mobitelu, centrirani dijalog na desktopu (isti obrazac kao
// ConfirmDialog/GuestRecordDetail).
//
// apartmentId NIJE polje u formi — recenzija je uvijek vezana uz
// apartman odabran u globalnom selektoru (ApartmentSwitcher), pa
// dolazi kao prop, ne kao unos.
//
// PUT šalje CIJELI ReviewRequest (API-REFERENCE.md §13 — isti oblik
// kao POST), zato edit forma unaprijed popuni SVA polja postojeće
// recenzije, ne samo izmijenjena.
// ============================================================

interface ReviewFormDialogProps {
  apartmentId: number;
  /** Postojeća recenzija za uređivanje — izostavljeno/null = novi unos */
  review?: AdminReviewResponse | null;
  onClose: () => void;
  onSaved: (review: AdminReviewResponse) => void;
}

export function ReviewFormDialog({
  apartmentId,
  review,
  onClose,
  onSaved,
}: ReviewFormDialogProps) {
  useScrollLock(true);
  const isEditing = review != null;

  const [authorName, setAuthorName] = useState(review?.authorName ?? "");
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [text, setText] = useState(review?.text ?? "");
  const [source, setSource] = useState<string>(review?.source ?? "OTHER");
  const [languageCode, setLanguageCode] = useState(review?.languageCode ?? "hr");
  const [reviewDate, setReviewDate] = useState(review?.reviewDate ?? "");
  const [visible, setVisible] = useState(review?.visible ?? true);
  const [sortOrder, setSortOrder] = useState(
    review?.sortOrder != null ? String(review.sortOrder) : ""
  );

  const save = useMutation(
    async () => {
      const payload: ReviewRequest = {
        apartmentId,
        authorName: authorName.trim(),
        rating,
        text: text.trim() || null,
        languageCode: languageCode.trim() || null,
        source,
        reviewDate: reviewDate || null,
        visible,
        sortOrder: sortOrder.trim() === "" ? null : Number(sortOrder),
      };
      return isEditing ? updateReview(review.id, payload) : createReview(payload);
    },
    { onSuccess: (saved) => onSaved(saved) }
  );

  const inputClass =
    "min-h-[2.75rem] w-full rounded-xl border border-input bg-background px-3.5 text-sm transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40";

  const canSubmit = authorName.trim().length > 0 && rating >= 1 && rating <= 5;

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto scroll-touch rounded-t-3xl bg-card pb-safe shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEditing ? "Uredi recenziju" : "Nova recenzija"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {save.error != null && (
            <ErrorState error={save.error} context="Spremanje recenzije" compact />
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Autor *
            </label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={inputClass}
              placeholder="Ime gosta"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Ocjena *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  aria-label={`${n} zvjezdica`}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      n <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Tekst recenzije
            </label>
            <textarea
              value={text ?? ""}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className={cn(inputClass, "min-h-[6rem] py-2.5")}
              placeholder="Što je gost napisao..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Izvor
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={inputClass}
              >
                {REVIEW_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Jezik
              </label>
              <input
                value={languageCode ?? ""}
                onChange={(e) => setLanguageCode(e.target.value)}
                className={inputClass}
                placeholder="hr, en, de..."
                maxLength={5}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Datum recenzije
              </label>
              <input
                type="date"
                value={reviewDate ?? ""}
                onChange={(e) => setReviewDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                Redoslijed (opcionalno)
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-3">
            <span className="text-sm font-medium text-foreground">
              Vidljivo na javnoj stranici
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              aria-label="Vidljivost recenzije"
              onClick={() => setVisible((v) => !v)}
              className={cn(
                "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card",
                visible ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
                  visible ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-t border-border p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={save.isPending}
            className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center rounded-xl border border-border text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            Odustani
          </button>
          <button
            type="button"
            onClick={() => void save.run()}
            disabled={!canSubmit || save.isPending}
            className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Spremi
          </button>
        </div>
      </div>
    </div>
  );
}
