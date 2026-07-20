"use client";

import { useMemo, useState } from "react";
import {
  RefreshCw,
  Loader2,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Merge,
  X,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import {
  getBookedPeriods,
  syncApartmentCalendar,
  getCalendarSyncStatus,
  deleteBookedPeriod,
} from "@/lib/api/calendar";
import type {
  BookedPeriodResponse,
  SyncStatusResponse,
} from "@/lib/api/types";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
} from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";

// ============================================================
// Tab "Kalendar".
//
// Backend spaja preklapajuće periode pri čitanju, pa jedan redak
// ovdje može predstavljati VIŠE zapisa u bazi (npr. isti termin
// s Airbnba i zrcaljen na Bookingu). Zato:
//   - prikazujemo SVE izvore, ne samo `source`
//   - brišemo po `periodIds`, jer spojeni period nema svoj ID
//
// `mismatch` je jedini stvarni alarm: znači da spojeni zapisi
// NISU imali identične datume → mogući dvostruki booking.
// Identično zrcaljenje daje mismatch=false i nije problem.
// ============================================================

const SOURCE_STYLES: Record<string, string> = {
  AIRBNB: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  BOOKING: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  MANUAL: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}.`;
}

function monthLabel(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("hr-HR", { month: "long", year: "numeric" });
}

function nightsBetween(start: string, end: string): number {
  const ms =
    new Date(end + "T00:00:00").getTime() -
    new Date(start + "T00:00:00").getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

/** Je li period već prošao — takvi se brišu trajno. */
function isPast(endDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(endDate + "T00:00:00").getTime() < today.getTime();
}

/** Vraća li ga sljedeći sync natrag (aktualan + dolazi iz feeda). */
function willReturnAfterSync(period: BookedPeriodResponse): boolean {
  const fromFeed = period.sources.some((s) => s !== "MANUAL");
  return fromFeed && !isPast(period.endDate);
}

/**
 * Ključ retka — spojeni period nema jedinstven ID.
 *
 * Fallback na datume pokriva i slučaj starijeg backenda koji
 * `periodIds` uopće ne vraća (normalizira se u prazan niz).
 */
function periodKey(period: BookedPeriodResponse): string {
  return period.periodIds.length > 0
    ? period.periodIds.join("-")
    : `${period.startDate}_${period.endDate}`;
}

/** Može li se period uopće obrisati — bez ID-eva nema što slati. */
function isDeletable(period: BookedPeriodResponse): boolean {
  return period.periodIds.length > 0;
}

interface ApartmentCalendarTabProps {
  apartmentId: number;
}

export function ApartmentCalendarTab({
  apartmentId,
}: ApartmentCalendarTabProps) {
  const confirm = useConfirm();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const periods = useAsync<BookedPeriodResponse[]>(
    () => getBookedPeriods(apartmentId),
    [apartmentId]
  );

  const syncStatus = useAsync<SyncStatusResponse[]>(
    () => getCalendarSyncStatus(),
    []
  );

  const sync = useMutation(
    async () => {
      await syncApartmentCalendar(apartmentId);
    },
    {
      onSuccess: async () => {
        setSelected(new Set());
        await periods.refetch();
        await syncStatus.refetch();
      },
    }
  );

  /** Briše sve pojedinačne zapise iza jednog ili više prikazanih perioda. */
  const removePeriods = useMutation(
    async (targets: BookedPeriodResponse[]) => {
      const ids = targets.flatMap((p) => p.periodIds);
      for (const id of ids) {
        await deleteBookedPeriod(id);
      }
    },
    {
      onSuccess: async () => {
        setSelected(new Set());
        await periods.refetch();
      },
    }
  );

  const myStatuses = (syncStatus.data ?? []).filter(
    (s) => s.apartmentId === apartmentId
  );

  const sorted = useMemo(
    () =>
      [...(periods.data ?? [])].sort((a, b) =>
        a.startDate.localeCompare(b.startDate)
      ),
    [periods.data]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, BookedPeriodResponse[]>();
    for (const period of sorted) {
      const key = period.startDate.slice(0, 7);
      map.set(key, [...(map.get(key) ?? []), period]);
    }
    return Array.from(map.entries());
  }, [sorted]);

  const mismatchCount = sorted.filter((p) => p.mismatch).length;
  const selectedPeriods = sorted.filter((p) => selected.has(periodKey(p)));

  // Backend bez `periodIds` (starija verzija) ne dopušta brisanje —
  // bolje sakriti kontrole nego slati zahtjev koji ne može uspjeti.
  const deletionSupported = sorted.length === 0 || sorted.some(isDeletable);

  const toggleSelect = (period: BookedPeriodResponse) => {
    const key = periodKey(period);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const confirmDelete = async (targets: BookedPeriodResponse[]) => {
    const recordCount = targets.flatMap((p) => p.periodIds).length;
    const returning = targets.filter(willReturnAfterSync);
    const isBulk = targets.length > 1;

    const ok = await confirm({
      title: isBulk
        ? `Obrisati ${targets.length} termina?`
        : "Obrisati termin?",
      description: (
        <>
          {isBulk ? "Odabrani termini se" : "Termin se"} uklanjaju iz kalendara
          zauzetosti.
          {recordCount > targets.length && (
            <>
              {" "}
              Riječ je o <strong>{recordCount} zapisa</strong> jer su neki
              termini spojeni iz više izvora.
            </>
          )}
        </>
      ),
      warning:
        returning.length > 0 ? (
          <>
            {returning.length === targets.length
              ? "Ovaj termin dolazi"
              : `${returning.length} od ${targets.length} termina dolazi`}{" "}
            iz Airbnb/Booking feeda i još je aktualan, pa će se{" "}
            <strong>vratiti pri sljedećoj sinkronizaciji</strong> (svakih ~10
            min). Za trajno uklanjanje otkažite rezervaciju na samoj platformi.
          </>
        ) : undefined,
      confirmLabel: isBulk ? `Obriši ${targets.length}` : "Obriši",
      variant: "destructive",
    });

    if (!ok) return;

    setBusyKey(isBulk ? null : periodKey(targets[0]));
    await removePeriods.run(targets);
    setBusyKey(null);
  };

  return (
    <div className="space-y-4">
      {/* --- Sync kontrola --- */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">
              iCal sinkronizacija
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground text-pretty">
              Sync se pokreće automatski svakih ~10 min. Ovime ga pokrećete
              ručno.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void sync.run()}
            disabled={sync.isPending}
            className="inline-flex min-h-[2.75rem] shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {sync.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {sync.isPending ? "Sinkroniziram..." : "Sinkroniziraj"}
          </button>
        </div>

        {myStatuses.length > 0 && (
          <ul className="mt-3 space-y-2 border-t border-border pt-3">
            {myStatuses.map((status, i) => (
              <SyncStatusRow key={`${status.source}-${i}`} status={status} />
            ))}
          </ul>
        )}
      </div>

      {sync.error != null && (
        <ErrorState
          error={sync.error}
          context="Ručna sinkronizacija kalendara"
          compact
        />
      )}

      {syncStatus.error != null && (
        <ErrorState
          error={syncStatus.error}
          onRetry={() => void syncStatus.refetch()}
          context="Status sinkronizacije"
          compact
        />
      )}

      {removePeriods.error != null && (
        <ErrorState
          error={removePeriods.error}
          context="Brisanje termina"
          compact
        />
      )}

      {/* --- Alarm: mogući dvostruki booking --- */}
      {mismatchCount > 0 && (
        <div className="flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-50 px-4 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs text-amber-800 text-pretty dark:text-amber-300">
            <strong>
              {mismatchCount}{" "}
              {mismatchCount === 1 ? "termin ima" : "termina imaju"} neusklađene
              datume
            </strong>{" "}
            između izvora — mogući dvostruki booking. Provjerite rezervacije na
            Airbnbu i Bookingu.
          </p>
        </div>
      )}

      {/* --- Akcijska traka za skupno brisanje --- */}
      {selectedPeriods.length > 0 && (
        <div className="sticky top-16 z-20 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2.5 backdrop-blur-sm">
          <span className="text-sm font-semibold text-foreground">
            Odabrano: {selectedPeriods.length}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="inline-flex min-h-[2.25rem] items-center gap-1 rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Poništi
            </button>

            <button
              type="button"
              onClick={() => void confirmDelete(selectedPeriods)}
              disabled={removePeriods.isPending}
              className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-lg bg-destructive px-3 text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {removePeriods.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Obriši
            </button>
          </div>
        </div>
      )}

      {/* --- Zauzeti termini --- */}
      <AsyncBoundary
        isLoading={periods.isLoading}
        error={periods.error}
        data={periods.data}
        onRetry={() => void periods.refetch()}
        context="Dohvat zauzetih termina"
        emptyFallback={
          <EmptyState
            icon={CalendarDays}
            title="Nema zauzetih termina"
            description="Apartman je slobodan u cijelom uvezenom razdoblju, ili iCal linkovi još nisu postavljeni u tabu Osnovno."
          />
        }
      >
        {() => (
          <div className="space-y-4">
            {grouped.map(([month, items]) => (
              <div key={month}>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {monthLabel(items[0].startDate)}
                </h4>

                <ul className="space-y-2">
                  {items.map((period) => (
                    <PeriodRow
                      key={periodKey(period)}
                      period={period}
                      canDelete={isDeletable(period)}
                      isSelected={selected.has(periodKey(period))}
                      isBusy={busyKey === periodKey(period)}
                      onToggleSelect={() => toggleSelect(period)}
                      onDelete={() => void confirmDelete([period])}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </AsyncBoundary>

      {sorted.length > 0 &&
        (deletionSupported ? (
          <p className="flex gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Termini iz Airbnb/Booking feeda koji još nisu prošli vraćaju se pri
            sljedećoj sinkronizaciji. Trajno se brišu samo prošli termini i
            ručni unosi.
          </p>
        ) : (
          <div className="flex gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-pretty">
              Brisanje termina nije dostupno jer backend u odgovoru ne šalje
              <code className="mx-1 font-mono">periodIds</code>. Ta su polja
              dodana u novijoj verziji API-ja — nakon nadogradnje backenda
              kontrole se pojavljuju same.
            </p>
          </div>
        ))}
    </div>
  );
}

// ---------- Redak termina ----------

function PeriodRow({
  period,
  canDelete,
  isSelected,
  isBusy,
  onToggleSelect,
  onDelete,
}: {
  period: BookedPeriodResponse;
  canDelete: boolean;
  isSelected: boolean;
  isBusy: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
}) {
  const nights = nightsBetween(period.startDate, period.endDate);

  return (
    <li
      className={cn(
        "group relative rounded-xl border bg-card px-3.5 py-3 transition-all",
        isSelected ? "border-primary bg-primary/5" : "border-border",
        period.mismatch && !isSelected && "border-amber-500/40",
        isBusy && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox — radi i na dodir, za razliku od hovera */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          disabled={!canDelete}
          aria-label={`Odaberi termin ${formatDate(period.startDate)}`}
          onClick={onToggleSelect}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background",
            !canDelete && "invisible"
          )}
        >
          {isSelected && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-current stroke-2">
              <path d="M2 6.5L4.5 9L10 3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-foreground">
              {formatDate(period.startDate)} – {formatDate(period.endDate)}
            </p>

            {/* Alarm za neusklađene datume */}
            {period.mismatch && (
              <span
                title="Izvori nemaju iste datume — mogući dvostruki booking"
                className="inline-flex shrink-0 items-center"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {nights} {nights === 1 ? "noć" : "noći"}
            {period.merged && (
              <>
                {" · "}
                <span className="inline-flex items-center gap-1 font-medium text-foreground">
                  <Merge className="h-3 w-3" />
                  Spojeno
                  {period.periodIds.length > 1 &&
                    ` iz ${period.periodIds.length} zapisa`}
                </span>
              </>
            )}
          </p>

          <div className="mt-1.5">
            <SourcesBadge period={period} />
          </div>

          {period.mismatch && (
            <p className="mt-1.5 text-xs text-amber-700 text-pretty dark:text-amber-500">
              Izvori se preklapaju, ali nemaju iste datume — provjerite je li
              riječ o dvije različite rezervacije.
            </p>
          )}
        </div>

        {/* Brisanje — na desktopu diskretno do hovera, na mobitelu uvijek
            vidljivo jer hover ne postoji.
            Sakriveno ako backend nije poslao periodIds. */}
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isBusy}
            aria-label={`Obriši termin ${formatDate(period.startDate)}`}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-destructive transition-all",
              "hover:bg-destructive/10 active:scale-95 disabled:opacity-50",
              "sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            )}
          >
            {isBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        )}
      </div>
    </li>
  );
}

// ---------- Oznaka izvora ----------

/**
 * Prikaz izvora kao JEDNA oznaka.
 *
 * Spojeni termin mora se čitati kao cjelina ("AIRBNB & BOOKING"),
 * a ne kao dvije nepovezane oznake jedna do druge — inače izgleda
 * kao da su u pitanju dva odvojena termina.
 *
 * Boje po izvoru su zadržane jer nose informaciju, pa je oznaka
 * segmentirana umjesto da bude jedan monokromatski tekst.
 */
function SourcesBadge({ period }: { period: BookedPeriodResponse }) {
  const list = period.sources;

  // Backend zna poslati source: "MERGED" bez popisa izvora.
  // Tada znamo DA je spojeno, ali ne i iz čega.
  if (list.length === 0) {
    const isMergedWithoutDetail = period.source === "MERGED";

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground">
          {isMergedWithoutDetail ? "Spojeno" : period.source}
        </span>
        {isMergedWithoutDetail && (
          <span className="text-[0.625rem] text-muted-foreground">
            backend nije poslao popis izvora
          </span>
        )}
      </div>
    );
  }

  // Jedan izvor — obična obojana oznaka
  if (list.length === 1) {
    return (
      <span
        className={cn(
          "inline-block rounded-full px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide",
          SOURCE_STYLES[list[0]] ?? "bg-muted text-muted-foreground"
        )}
      >
        {list[0]}
      </span>
    );
  }

  // Više izvora — jedna segmentirana oznaka: AIRBNB & BOOKING
  return (
    <span className="inline-flex items-center overflow-hidden rounded-full border border-border">
      {list.map((src, index) => (
        <span key={src} className="inline-flex items-center">
          {index > 0 && (
            <span className="bg-card px-1 text-[0.625rem] font-bold text-muted-foreground">
              &
            </span>
          )}
          <span
            className={cn(
              "px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide",
              SOURCE_STYLES[src] ?? "bg-muted text-muted-foreground"
            )}
          >
            {src}
          </span>
        </span>
      ))}
    </span>
  );
}

// ---------- Status sinkronizacije ----------

/**
 * `lastErrorMessage` nosi i UPOZORENJA, ne samo greške: kad sync
 * uspije ali je nešto sumnjivo, lastSyncSuccess ostaje true a
 * poruka dobiva prefiks "UPOZORENJE:". Više ih se spaja s " | ".
 */
function SyncStatusRow({ status }: { status: SyncStatusResponse }) {
  const messages = (status.lastErrorMessage ?? "")
    .split(" | ")
    .map((m) => m.trim())
    .filter(Boolean);

  const warnings = messages.filter((m) => m.startsWith("UPOZORENJE:"));
  const errors = messages.filter((m) => !m.startsWith("UPOZORENJE:"));

  return (
    <li className="flex gap-2.5">
      {status.lastSyncSuccess ? (
        warnings.length > 0 ? (
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        ) : (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        )
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-foreground">
            {status.source}
          </span>
          {status.importedCount != null && (
            <span className="text-xs text-muted-foreground">
              {status.importedCount} termina
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {status.lastSyncAt
            ? new Date(status.lastSyncAt).toLocaleString("hr-HR")
            : "Još nije sinkronizirano"}
        </p>

        {/* Upozorenja — sync je uspio, ali nešto treba provjeriti */}
        {warnings.map((message, i) => (
          <p
            key={`w-${i}`}
            className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-800 break-anywhere dark:bg-amber-950/30 dark:text-amber-300"
          >
            {message.replace(/^UPOZORENJE:\s*/, "")}
          </p>
        ))}

        {/* Stvarne greške */}
        {errors.map((message, i) => (
          <p
            key={`e-${i}`}
            className="mt-1 rounded-lg bg-destructive/10 px-2 py-1 text-xs text-destructive break-anywhere"
          >
            {message}
          </p>
        ))}
      </div>
    </li>
  );
}
