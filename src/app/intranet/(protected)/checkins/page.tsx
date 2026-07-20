"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Camera,
  Upload,
  RefreshCw,
  UserRound,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync, useMutation } from "@/hooks/use-async";
import {
  listGuestRecords,
  getGuestRecord,
  scanPaperForm,
} from "@/lib/api/checkin";
import type { AdminGuestRecordResponse, GuestStayStatus } from "@/lib/api/types";
import {
  stayStatusMeta,
  submissionMethodLabel,
  flagEmoji,
} from "@/lib/checkin-utils";
import { formatDate } from "@/lib/invoice-utils";
import {
  AsyncBoundary,
  EmptyState,
  ErrorState,
  SkeletonList,
} from "@/components/intranet/ui/DataStates";
import { PaperScanCamera } from "@/components/intranet/checkins/PaperScanCamera";
import { GuestRecordDetail } from "@/components/intranet/checkins/GuestRecordDetail";
import { ScanAlignEditor } from "@/components/intranet/checkins/ScanAlignEditor";

// ============================================================
// /intranet/checkins — Prijave gostiju.
//
// Glavno mjesto za pregled svih prijava (sva 3 načina: sken
// dokumenta, ručni unos, papirnati obrazac) i za skeniranje
// papirnatog obrasca.
//
// Mobitel: veliki gumb za kameru + kartice (bez horizontalnog
// scrolla). Desktop: upload zona + tablica.
//
// Paginacija: 5 po stranici — korisnici prepisuju podatke u
// eVisitor red po red, kratka stranica drži fokus.
// ============================================================

const PAGE_SIZE = 5;

type StatusFilter = "ALL" | "NEEDS_REVIEW" | "VERIFIED";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Sve" },
  { value: "NEEDS_REVIEW", label: "Za provjeru" },
  { value: "VERIFIED", label: "Potvrđene" },
];

export default function CheckinsPage() {
  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [openRecord, setOpenRecord] = useState<AdminGuestRecordResponse | null>(
    null
  );
  /** Datoteka koja čeka poravnanje prije slanja */
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  /** Zapis kojem backend još obrađuje OCR */
  const [processingId, setProcessingId] = useState<number | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const records = useAsync<AdminGuestRecordResponse[]>(
    () => listGuestRecords(),
    []
  );

  const scan = useMutation(
    async (image: Blob) => scanPaperForm(image),
    {
      onSuccess: async (created) => {
        setIsCameraOpen(false);
        setPendingFile(null);
        await records.refetch();

        // Vraćamo se na listu, a novi zapis se označi kao "u obradi"
        // dok backend ne dovrši OCR. Detalj se NE otvara sam — admin
        // najčešće ima još obrazaca za skenirati.
        if (created) setProcessingId(created.id);
      },
    }
  );

  /**
   * Prati zapis koji je backend još u obradi.
   *
   * OCR traje nekoliko sekundi, a status i zastavice (treba li
   * provjeru, pouzdanost) poznati su tek na kraju. Zato zapis
   * povlačimo svake 2 s dok ne izađe iz stanja obrade, pa kartica
   * sama osvježi oznake — bez ručnog osvježavanja.
   */
  useEffect(() => {
    if (processingId == null) return;

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // ~40 s

    const tick = async () => {
      if (cancelled) return;
      attempts++;

      try {
        const fresh = await getGuestRecord(processingId);
        if (cancelled) return;

        records.setData((prev) =>
          prev ? prev.map((r) => (r.id === fresh.id ? fresh : r)) : prev
        );

        const stillProcessing =
          fresh.status === "PENDING" || fresh.status === "PROCESSING";

        if (!stillProcessing || attempts >= MAX_ATTEMPTS) {
          setProcessingId(null);
          return;
        }
      } catch {
        // Zapis je možda obrisan ili je mreža pukla — prestani pratiti
        if (!cancelled) setProcessingId(null);
        return;
      }

      if (!cancelled) timer = setTimeout(tick, 2000);
    };

    let timer = setTimeout(tick, 1500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingId]);

  /**
   * Odabrana datoteka ne ide odmah na backend — prvo se otvara
   * editor za poravnanje. Sken s pisača je često malo zakrenut
   * ili ima višak ruba, a OCR traži pozicijske markere.
   */
  const handleUpload = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setPendingFile(file);
    if (uploadInputRef.current) uploadInputRef.current.value = "";
  };

  /**
   * Otvara detalj: odmah s podacima iz liste (bez čekanja), a u
   * pozadini povuče svježi zapis — lista je mogla ostarjeti (npr.
   * kolega je u međuvremenu ispravio podatke s drugog uređaja).
   */
  const openDetail = (record: AdminGuestRecordResponse) => {
    // Očišćeni (GDPR purge) zapisi se više ne smiju otvarati ni uređivati
    if (record.personalDataPurgedAt != null) return;

    setOpenRecord(record);

    void getGuestRecord(record.id)
      .then((fresh) => {
        setOpenRecord((current) =>
          current?.id === fresh.id ? fresh : current
        );
        records.setData((prev) =>
          prev ? prev.map((r) => (r.id === fresh.id ? fresh : r)) : prev
        );
      })
      .catch(() => {
        // Svježi dohvat je optimizacija — podaci iz liste ostaju
      });
  };

  // --- Filtriranje + sortiranje (najnovije prvo) ---
  const filtered = useMemo(() => {
    const list = [...(records.data ?? [])].sort((a, b) => {
      const dateCompare = (b.arrivalDate ?? "").localeCompare(a.arrivalDate ?? "");
      return dateCompare !== 0 ? dateCompare : b.id - a.id;
    });

    switch (filter) {
      case "NEEDS_REVIEW":
        return list.filter((r) => r.needsManualReview);
      case "VERIFIED":
        return list.filter(
          (r) => r.status === "VERIFIED" && !r.needsManualReview
        );
      default:
        return list;
    }
  }, [records.data, filter]);

  // --- Paginacija ---
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );

  const setFilterAndReset = (next: StatusFilter) => {
    setFilter(next);
    setPage(0);
  };

  const needsReviewCount = (records.data ?? []).filter(
    (r) => r.needsManualReview
  ).length;

  const isRefreshing = records.isLoading && !records.isInitialLoading;

  return (
    <div className="space-y-4">
      {/* Zaglavlje */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Prijave gostiju
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {records.data
              ? `${records.data.length} prijava${needsReviewCount > 0 ? ` · ${needsReviewCount} za provjeru` : ""}`
              : "Skeniranje obrazaca i evidencija za eVisitor"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void records.refetch()}
          disabled={records.isLoading}
          aria-label="Osvježi"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* --- Skeniranje: kamera (mobitel) / upload (desktop) --- */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsCameraOpen(true)}
          disabled={scan.isPending}
          className="flex min-h-[4.5rem] w-full items-center justify-center gap-3 rounded-2xl bg-foreground px-5 text-background shadow-lg transition-all active:scale-[0.98] disabled:opacity-60"
        >
          {scan.isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-background/15">
              <Camera className="h-6 w-6" />
            </span>
          )}
          <span className="text-left">
            <span className="block text-base font-bold">
              {scan.isPending ? "Obrada obrasca..." : "Skeniraj obrazac"}
            </span>
            <span className="block text-xs opacity-70">
              Slikajte papirnatu prijavu kamerom
            </span>
          </span>
        </button>
      </div>

      {/* Upload zona — desktop */}
      <div
        className="hidden lg:block"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleUpload(e.dataTransfer.files);
        }}
      >
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          disabled={scan.isPending}
          className="flex min-h-[6rem] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card/50 px-5 text-center transition-colors hover:border-primary/40 hover:bg-card disabled:opacity-60"
        >
          {scan.isPending ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Obrada obrasca...
              </span>
            </>
          ) : (
            <>
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">
                Učitaj sken papirnatog obrasca
              </span>
              <span className="text-xs text-muted-foreground">
                Kliknite ili dovucite sliku — apartman se prepoznaje s obrasca
              </span>
            </>
          )}
        </button>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleUpload(e.target.files)}
      />

      {scan.error != null && (
        <ErrorState error={scan.error} context="Skeniranje obrasca" compact />
      )}

      {/* --- Filtri --- */}
      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilterAndReset(f.value)}
            className={cn(
              "inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground"
            )}
          >
            {f.label}
            {f.value === "NEEDS_REVIEW" && needsReviewCount > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold",
                  filter === f.value
                    ? "bg-primary-foreground/20"
                    : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                )}
              >
                {needsReviewCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* --- Lista --- */}
      <AsyncBoundary
        isLoading={records.isLoading}
        error={records.error}
        data={records.data}
        onRetry={() => void records.refetch()}
        context="Dohvat prijava"
        loadingFallback={<SkeletonList count={3} />}
        emptyFallback={
          <EmptyState
            icon={UserRound}
            title="Još nema prijava"
            description="Skenirajte papirnati obrazac, ili pričekajte da gosti obave online prijavu preko QR koda."
          />
        }
      >
        {() =>
          filtered.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title={
                filter === "NEEDS_REVIEW"
                  ? "Ništa ne čeka provjeru"
                  : "Nema prijava za ovaj filtar"
              }
              description={
                filter === "NEEDS_REVIEW"
                  ? "Sve su prijave pregledane."
                  : "Pokušajte s drugim filtrom."
              }
            />
          ) : (
            <>
              <ul className="space-y-2.5">
                {pageItems.map((record) => (
                  <GuestRecordCard
                    key={record.id}
                    record={record}
                    isProcessing={processingId === record.id}
                    onOpen={() => openDetail(record)}
                  />
                ))}
              </ul>

              {/* Paginacija */}
              {pageCount > 1 && (
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={safePage === 0}
                    className="inline-flex min-h-[2.75rem] items-center gap-1 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold text-foreground transition-colors active:scale-95 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Novije
                  </button>

                  <span className="text-xs font-medium text-muted-foreground">
                    {safePage + 1} / {pageCount}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((p) => Math.min(pageCount - 1, p + 1))
                    }
                    disabled={safePage >= pageCount - 1}
                    className="inline-flex min-h-[2.75rem] items-center gap-1 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold text-foreground transition-colors active:scale-95 disabled:opacity-40"
                  >
                    Starije
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )
        }
      </AsyncBoundary>

      {/* --- Kamera (mobitel) ---
          onCapture ČEKA odgovor backenda: kamera tako zna kad
          prikazati obradu, a zatvara se tek na uspjeh. */}
      <PaperScanCamera
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={async (image) => {
          await scan.run(image);
        }}
        isSubmitting={scan.isPending}
        error={scan.error}
      />

      {/* --- Poravnanje uploadanog skena (desktop) --- */}
      <ScanAlignEditor
        file={pendingFile}
        onCancel={() => {
          setPendingFile(null);
          scan.reset();
        }}
        onConfirm={async (image) => {
          await scan.run(image);
        }}
        isSubmitting={scan.isPending}
        error={scan.error}
      />

      {/* --- Detalj --- */}
      {openRecord && (
        <GuestRecordDetail
          record={openRecord}
          onClose={() => setOpenRecord(null)}
          onChanged={(updated) => {
            setOpenRecord(updated);
            records.setData((prev) =>
              prev
                ? prev.map((r) => (r.id === updated.id ? updated : r))
                : prev
            );
          }}
          onPurged={(purged) => {
            setOpenRecord(null);

            // DELETE ne briše red (vidi API-REFERENCE.md §9) — samo
            // ukloni osjetljive podatke. Zapis ostaje u tablici,
            // samo ga ažuriramo na mjestu umjesto da ga maknemo.
            records.setData((prev) =>
              prev ? prev.map((r) => (r.id === purged.id ? purged : r)) : prev
            );

            if (processingId === purged.id) setProcessingId(null);
          }}
        />
      )}
    </div>
  );
}

// ---------- Kartica prijave ----------

function GuestRecordCard({
  record,
  isProcessing,
  onOpen,
}: {
  record: AdminGuestRecordResponse;
  isProcessing: boolean;
  onOpen: () => void;
}) {
  const statusMeta = stayStatusMeta(record.status);
  const flag = flagEmoji(record.nationality);
  const isPurged = record.personalDataPurgedAt != null;

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        disabled={isPurged}
        aria-disabled={isPurged}
        title={isPurged ? "Osobni podaci su uklonjeni — zapis se više ne može otvarati" : undefined}
        className={cn(
          "w-full rounded-2xl border bg-card p-4 text-left transition-all",
          isPurged
            ? "cursor-not-allowed opacity-60"
            : "hover:border-primary/30 active:scale-[0.99]",
          isPurged
            ? "border-border"
            : isProcessing
              ? "border-primary/40"
              : record.needsManualReview
                ? "border-amber-500/40"
                : "border-border"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {flag && <span className="mr-1.5">{flag}</span>}
              {record.fullName || "(bez imena)"}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDate(record.arrivalDate)} – {formatDate(record.departureDate)}
              {record.apartmentInternalCode && (
                <span className="font-mono">
                  {" · "}
                  {record.apartmentInternalCode}
                </span>
              )}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {isPurged ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-bold text-muted-foreground">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Podaci uklonjeni
                </span>
              ) : isProcessing ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[0.625rem] font-bold text-primary">
                  <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  Čitam obrazac...
                </span>
              ) : (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
                    statusMeta.className
                  )}
                >
                  {statusMeta.label}
                </span>
              )}

              {!isPurged && !isProcessing && record.needsManualReview && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.625rem] font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Provjeriti
                </span>
              )}

              <span className="rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
                {submissionMethodLabel(record.submissionMethod)}
              </span>

              {!isPurged && record.reviewedAt && !record.needsManualReview && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-medium text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-2.5 w-2.5" />
                  Pregledano
                </span>
              )}
            </div>
          </div>

          {!isPurged && (
            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/50" />
          )}
        </div>
      </button>
    </li>
  );
}
