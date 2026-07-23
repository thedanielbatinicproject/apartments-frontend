"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Copy,
  Check,
  Pencil,
  Loader2,
  Trash2,
  ShieldCheck,
  ImageOff,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@/hooks/use-async";
import { useProtectedImage } from "@/hooks/use-protected-image";
import {
  updateGuestRecord,
  markGuestRecordReviewed,
  deleteGuestRecord,
} from "@/lib/api/checkin";
import type {
  AdminGuestRecordResponse,
  AdminCorrectionRequest,
} from "@/lib/api/types";
import {
  stayStatusMeta,
  submissionMethodLabel,
  documentTypeLabel,
  copyText,
  flagEmoji,
} from "@/lib/checkin-utils";
import { formatDate } from "@/lib/invoice-utils";
import { ErrorState } from "@/components/intranet/ui/DataStates";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Detalj prijave — fullscreen, dual-screen.
//
// Lijevo: podaci u poljima. Zadani način rada je KOPIRANJE —
// klik bilo gdje na polje kopira vrijednost (za prepisivanje u
// eVisitor). Gumb "Uredi" prebacuje u ispravljanje.
//
// Desno: slika (papirnati obrazac ili dokument), dohvaćena s JWT
// headerom jer je GDPR-zaštićena. Ručni unos nema sliku → forma
// je centrirana.
//
// Sivi tekst ispod polja = što je OCR izvorno pročitao, da se
// admin ispravak može usporediti s originalom.
// ============================================================

interface FieldDef {
  key: keyof AdminCorrectionRequest;
  label: string;
  type: "text" | "date" | "documentType" | "sex";
  /** Vrijednost za prikaz i kopiranje (formatirani datumi) */
  display: (record: AdminGuestRecordResponse) => string;
  /** Sirova vrijednost za edit input */
  raw: (record: AdminGuestRecordResponse) => string;
}

const FIELDS: FieldDef[] = [
  {
    key: "fullName", label: "Ime i prezime", type: "text",
    display: (r) => r.fullName ?? "", raw: (r) => r.fullName ?? "",
  },
  {
    key: "dateOfBirth", label: "Datum rođenja", type: "date",
    display: (r) => formatDate(r.dateOfBirth), raw: (r) => r.dateOfBirth ?? "",
  },
  {
    key: "placeOfBirth", label: "Mjesto rođenja", type: "text",
    display: (r) => r.placeOfBirth ?? "", raw: (r) => r.placeOfBirth ?? "",
  },
  {
    key: "placeOfResidence", label: "Prebivalište", type: "text",
    display: (r) => r.placeOfResidence ?? "", raw: (r) => r.placeOfResidence ?? "",
  },
  {
    key: "nationality", label: "Državljanstvo", type: "text",
    display: (r) => r.nationality ?? "", raw: (r) => r.nationality ?? "",
  },
  {
    key: "sex", label: "Spol", type: "sex",
    display: (r) => (r.sex === "F" ? "Žensko" : r.sex === "M" ? "Muško" : r.sex ?? ""),
    raw: (r) => r.sex ?? "",
  },
  {
    key: "documentType", label: "Vrsta dokumenta", type: "documentType",
    display: (r) => documentTypeLabel(r.documentType), raw: (r) => r.documentType ?? "",
  },
  {
    key: "documentNumber", label: "Broj dokumenta", type: "text",
    display: (r) => r.documentNumber ?? "", raw: (r) => r.documentNumber ?? "",
  },
  {
    key: "documentExpiryDate", label: "Dokument vrijedi do", type: "date",
    display: (r) => formatDate(r.documentExpiryDate), raw: (r) => r.documentExpiryDate ?? "",
  },
  {
    key: "arrivalDate", label: "Dolazak", type: "date",
    display: (r) => formatDate(r.arrivalDate), raw: (r) => r.arrivalDate ?? "",
  },
  {
    key: "departureDate", label: "Odlazak", type: "date",
    display: (r) => formatDate(r.departureDate), raw: (r) => r.departureDate ?? "",
  },
];

interface GuestRecordDetailProps {
  record: AdminGuestRecordResponse;
  onClose: () => void;
  onChanged: (updated: AdminGuestRecordResponse) => void;
  /**
   * DELETE ne briše zapis — samo ukloni osjetljive podatke (GDPR
   * purge). Roditelj dobiva ažurirani (očišćeni) zapis da ga
   * zadrži u tablici, samo označen kao uklonjen.
   */
  onPurged: (purged: AdminGuestRecordResponse) => void;
}

export function GuestRecordDetail({
  record,
  onClose,
  onChanged,
  onPurged,
}: GuestRecordDetailProps) {
  // Zajedničko zaključavanje scrolla (brojač) — vidi use-scroll-lock
  useScrollLock(true);

  const confirm = useConfirm();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const images = record.documentImageUrls ?? [];
  const hasImage = images.length > 0;
  const image = useProtectedImage(hasImage ? images[imageIndex] : null);

  const statusMeta = stayStatusMeta(record.status);
  const flag = flagEmoji(record.nationality);
  const isPurged = record.personalDataPurgedAt != null;


  const startEdit = () => {
    const initial: Record<string, string> = {};
    for (const field of FIELDS) initial[field.key] = field.raw(record);
    setDraft(initial);
    setIsEditing(true);
  };

  const save = useMutation(
    async () => {
      // Šalju se SAMO promijenjena polja
      const changes: AdminCorrectionRequest = {};
      for (const field of FIELDS) {
        const next = (draft[field.key] ?? "").trim();
        if (next !== field.raw(record)) {
          changes[field.key] = next;
        }
      }
      if (Object.keys(changes).length === 0) return record;
      return updateGuestRecord(record.id, changes);
    },
    {
      onSuccess: (updated) => {
        setIsEditing(false);
        if (updated) onChanged(updated);
      },
    }
  );

  const review = useMutation(
    async () => {
      await markGuestRecordReviewed(record.id);
    },
    {
      onSuccess: () =>
        onChanged({
          ...record,
          needsManualReview: false,
          reviewedAt: new Date().toISOString(),
        }),
    }
  );

  const remove = useMutation(
    async () => {
      await deleteGuestRecord(record.id);
      // Backend vraća samo { data: null } — zapis lokalno patchamo
      // prema tablici iz API-REFERENCE.md §9 (što je trajno uklonjeno).
      const purged: AdminGuestRecordResponse = {
        ...record,
        documentNumber: null,
        documentExpiryDate: null,
        documentImageUrls: [],
        personalDataPurgedAt: new Date().toISOString(),
      };
      return purged;
    },
    { onSuccess: (purged) => onPurged(purged) }
  );

  const handleCopy = async (key: string, value: string) => {
    if (!value || isEditing) return;
    const ok = await copyText(value);
    if (ok) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1500);
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Ukloniti osobne podatke?",
      description: `Broj dokumenta, datum isteka i slike dokumenata gosta ${record.fullName || ""} bit će trajno uklonjeni (GDPR). Ime, datumi boravka i apartman ostaju u evidenciji, ali zapis se više neće moći otvarati ni uređivati.`,
      warning: "Ovo se ne može poništiti.",
      confirmLabel: "Ukloni podatke",
      variant: "destructive",
    });
    if (ok) void remove.run();
  };

  const anyError = save.error ?? review.error ?? remove.error;

  // OCR original — prikazuje se samo gdje se razlikuje od trenutnog
  const originals = useMemo(() => {
    const map = new Map<string, string>();
    const source = record.originalExtraction;
    if (!source) return map;

    for (const field of FIELDS) {
      const original = source[field.key as keyof typeof source];
      if (original && original !== field.raw(record)) {
        map.set(field.key, original);
      }
    }
    return map;
  }, [record]);

  const inputClass =
    "min-h-[3rem] w-full rounded-xl border border-input bg-background px-3.5 transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/40 sm:min-h-[2.5rem]";

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-background">
      {/* ---------- Zaglavlje ---------- */}
      <header className="shrink-0 border-b border-border bg-card pt-safe px-safe">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="truncate text-base font-semibold text-foreground">
                {flag && <span className="mr-1">{flag}</span>}
                {record.fullName || "Prijava gosta"}
              </h2>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
                  statusMeta.className
                )}
              >
                {statusMeta.label}
              </span>
              {record.needsManualReview && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.625rem] font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Provjeriti
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {record.apartmentInternalCode ?? `Apartman #${record.apartmentId}`}
              {" · "}
              {submissionMethodLabel(record.submissionMethod)}
              {record.ocrConfidenceScore != null &&
                ` · OCR ${Math.round(record.ocrConfidenceScore * 100)} %`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* ---------- Sadržaj: dual-screen ---------- */}
      <div
        className={cn(
          "scroll-touch min-h-0 flex-1 overflow-y-auto",
          // lg:overflow-hidden SAMO uz grid — dual-pane layout (slika +
          // forma) treba svaku stranu neovisno skrolati, pa vanjski
          // kontejner mora prestati skrolati i prepustiti to unutarnjim
          // lg:overflow-y-auto divovima. BEZ slike nema gridа/druge
          // strane, pa je ostavljen lg:overflow-hidden ovdje ranije
          // gasio JEDINI scroll koji postoji — sadržaj bi overflowao
          // bez ikakvog načina da ga se skrola. Vidi bug: forma bez
          // slike na desktopu/zoomu se nije mogla skrolati.
          hasImage ? "lg:grid lg:grid-cols-2 lg:overflow-hidden" : ""
        )}
      >
        {/* --- Forma --- */}
        <div
          className={cn(
            "space-y-3 p-4 lg:overflow-y-auto lg:p-6",
            !hasImage && "mx-auto w-full max-w-lg"
          )}
        >
          {anyError != null && (
            <ErrorState error={anyError} context="Prijava gosta" compact />
          )}

          {!isEditing && (
            <p className="text-xs text-muted-foreground text-pretty">
              Dodirnite polje da kopirate vrijednost — za prepisivanje u
              eVisitor.
            </p>
          )}

          {FIELDS.map((field) => {
            const displayValue = field.display(record);
            const original = originals.get(field.key);
            const isCopied = copiedKey === field.key;

            return (
              <div key={field.key} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {field.label}
                </label>

                {isEditing ? (
                  field.type === "documentType" ? (
                    <select
                      value={draft[field.key] ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [field.key]: e.target.value }))
                      }
                      className={inputClass}
                    >
                      <option value="">—</option>
                      <option value="ID_CARD">Osobna iskaznica</option>
                      <option value="PASSPORT">Putovnica</option>
                      <option value="DRIVING_LICENCE">Vozačka dozvola</option>
                    </select>
                  ) : field.type === "sex" ? (
                    <select
                      value={draft[field.key] ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [field.key]: e.target.value }))
                      }
                      className={inputClass}
                    >
                      <option value="">—</option>
                      <option value="M">Muško</option>
                      <option value="F">Žensko</option>
                    </select>
                  ) : (
                    <input
                      type={field.type === "date" ? "date" : "text"}
                      value={draft[field.key] ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [field.key]: e.target.value }))
                      }
                      className={inputClass}
                    />
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => void handleCopy(field.key, displayValue)}
                    disabled={!displayValue || displayValue === "—"}
                    className={cn(
                      "flex min-h-[3rem] w-full items-center justify-between gap-2 rounded-xl border px-3.5 text-left transition-colors sm:min-h-[2.5rem]",
                      isCopied
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-input bg-background active:bg-muted",
                      (!displayValue || displayValue === "—") && "opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm",
                        displayValue ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {displayValue || "—"}
                    </span>
                    {isCopied ? (
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" />
                        Kopirano
                      </span>
                    ) : (
                      <Copy className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                )}

                {/* OCR original — sivo, samo ako se razlikuje */}
                {original && (
                  <p className="text-xs text-muted-foreground/70">
                    OCR pročitao: {original}
                  </p>
                )}
              </div>
            );
          })}

          {/* --- Akcije forme --- */}
          <div className="space-y-2 pt-2">
            {isPurged ? (
              <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 px-3.5 py-3 text-xs text-muted-foreground text-pretty">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Osobni podaci i slike dokumenata su trajno uklonjeni
                  {record.personalDataPurgedAt &&
                    ` (${new Date(record.personalDataPurgedAt).toLocaleString("hr-HR")})`}
                  . Zapis se više ne može uređivati.
                </span>
              </div>
            ) : isEditing ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void save.run()}
                  disabled={save.isPending}
                  className="inline-flex min-h-[3rem] flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] disabled:opacity-50 sm:min-h-[2.75rem]"
                >
                  {save.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Spremi ispravke
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={save.isPending}
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-foreground active:scale-[0.98] sm:min-h-[2.75rem]"
                >
                  Odustani
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors active:bg-muted sm:min-h-[2.75rem]"
                >
                  <Pencil className="h-4 w-4" />
                  Uredi podatke
                </button>

                {record.needsManualReview && (
                  <button
                    type="button"
                    onClick={() => void review.run()}
                    disabled={review.isPending}
                    className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50 sm:min-h-[2.75rem]"
                  >
                    {review.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                    Označi kao provjereno
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={remove.isPending}
                  className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-destructive transition-colors active:bg-destructive/10 disabled:opacity-50 sm:min-h-[2.75rem]"
                >
                  {remove.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Ukloni osobne podatke
                </button>
              </>
            )}

            {record.reviewedAt && !record.needsManualReview && (
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Provjereno {new Date(record.reviewedAt).toLocaleString("hr-HR")}
              </p>
            )}
          </div>
        </div>

        {/* --- Slika --- */}
        {hasImage && (
          <div className="border-t border-border bg-muted/30 p-4 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:p-6">
            <div className="flex min-h-[16rem] items-center justify-center rounded-2xl border border-border bg-card p-2 lg:min-h-[24rem]">
              {image.isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : image.error || !image.src ? (
                <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                  <p className="text-xs">Slika se ne može učitati</p>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.src}
                  alt="Dokument gosta"
                  className="max-h-[70dvh] w-full rounded-xl object-contain"
                />
              )}
            </div>

            {/* Više slika (npr. prednja i stražnja strana) */}
            {images.length > 1 && (
              <div className="mt-3 flex justify-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageIndex(i)}
                    className={cn(
                      "min-h-[2.5rem] rounded-lg border px-3 text-xs font-semibold transition-colors",
                      i === imageIndex
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground"
                    )}
                  >
                    Slika {i + 1}
                  </button>
                ))}
              </div>
            )}

            <p className="mt-3 text-center text-xs text-muted-foreground text-pretty">
              Usporedite podatke lijevo s dokumentom.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
