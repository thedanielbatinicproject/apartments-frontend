"use client";

import { useState } from "react";
import {
  AlertTriangle,
  RefreshCw,
  WifiOff,
  ChevronDown,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { describeError } from "@/lib/api/error-utils";

// ============================================================
// Jedinstvena loading / error / empty stanja za cijeli intranet.
//
// ErrorState namjerno prikazuje puno detalja (status, poruka
// backenda, tehnički detalji u <details>) jer je ovo interni
// alat — kad nešto pukne, korisnik treba moći reći ŠTO je puklo.
// ============================================================

// ---------- LOADING ----------

export function LoadingState({ label = "Učitavanje..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-5 py-12">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Skeleton kartica — koristi se dok se lista prvi put učitava. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border border-border bg-card p-4",
        className
      )}
    >
      <div className="h-32 w-full rounded-xl bg-muted" />
      <div className="mt-3 h-4 w-2/3 rounded bg-muted" />
      <div className="mt-2 h-3 w-1/3 rounded bg-muted" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ---------- ERROR ----------

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  /** Kompaktna inline varijanta (za greške unutar taba/sekcije) */
  compact?: boolean;
  /** Dodatni kontekst — npr. "Dohvat apartmana" */
  context?: string;
}

export function ErrorState({
  error,
  onRetry,
  compact = false,
  context,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);
  const described = describeError(error);

  const Icon = described.isNetworkError ? WifiOff : AlertTriangle;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-2xl border border-amber-500/30 bg-amber-50 dark:border-amber-500/25 dark:bg-amber-950/20",
        compact ? "p-4" : "p-5 sm:p-6"
      )}
    >
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              {described.title}
            </h3>
            {described.status && (
              <span className="rounded-full bg-amber-200/60 px-2 py-0.5 text-[0.625rem] font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
                HTTP {described.status}
              </span>
            )}
          </div>

          {context && (
            <p className="mt-0.5 text-xs font-medium text-amber-700/80 dark:text-amber-400/70">
              {context}
            </p>
          )}

          <p className="mt-1.5 text-sm text-amber-800 text-pretty dark:text-amber-300/90">
            {described.message}
          </p>

          {/* Tehnički detalji — skriveni dok ih korisnik ne zatraži */}
          {described.detail && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowDetails((v) => !v)}
                aria-expanded={showDetails}
                className="inline-flex min-h-[2rem] items-center gap-1 text-xs font-medium text-amber-700 underline-offset-4 hover:underline dark:text-amber-400"
              >
                Tehnički detalji
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    showDetails && "rotate-180"
                  )}
                />
              </button>

              {showDetails && (
                <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-amber-100/70 p-3 text-[0.6875rem] leading-relaxed text-amber-900 break-anywhere whitespace-pre-wrap dark:bg-amber-950/40 dark:text-amber-300">
                  {described.detail}
                </pre>
              )}
            </div>
          )}

          {onRetry && described.isRetryable && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex min-h-[2.5rem] items-center gap-2 rounded-xl border border-amber-600/30 bg-amber-100/80 px-3.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-200/80 active:scale-[0.98] dark:border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-200"
            >
              <RefreshCw className="h-4 w-4" />
              Pokušaj ponovo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- EMPTY ----------

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-5 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground text-balance">
        {title}
      </h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ---------- BOUNDARY ----------

interface AsyncBoundaryProps<T> {
  isLoading: boolean;
  error: unknown;
  data: T | null;
  onRetry?: () => void;
  context?: string;
  /** Prikazuje se dok traje prvo učitavanje */
  loadingFallback?: React.ReactNode;
  /** Prikazuje se kad je data prazan niz ili null */
  emptyFallback?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}

/**
 * Objedinjuje loading/error/empty grananje da se ne ponavlja
 * u svakoj komponenti.
 */
export function AsyncBoundary<T>({
  isLoading,
  error,
  data,
  onRetry,
  context,
  loadingFallback,
  emptyFallback,
  children,
}: AsyncBoundaryProps<T>) {
  // Greška ima prednost — ali samo ako nemamo stare podatke za prikaz
  if (error && !data) {
    return <ErrorState error={error} onRetry={onRetry} context={context} />;
  }

  if (isLoading && !data) {
    return <>{loadingFallback ?? <LoadingState />}</>;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return <>{emptyFallback ?? <EmptyState title="Nema podataka" />}</>;
  }

  return (
    <>
      {/* Ako refresh padne, a imamo stare podatke — pokaži traku iznad */}
      {error != null && (
        <div className="mb-3">
          <ErrorState
            error={error}
            onRetry={onRetry}
            context={context ? `${context} (osvježavanje)` : undefined}
            compact
          />
        </div>
      )}
      {children(data)}
    </>
  );
}
