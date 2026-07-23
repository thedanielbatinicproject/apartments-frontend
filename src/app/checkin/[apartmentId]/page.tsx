"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Check,
  ChevronRight,
  CreditCard,
  Loader2,
  PenLine,
  BookUser,
  Car,
  ShieldCheck,
  CalendarRange,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/language-context";
import { getPublicApartment } from "@/lib/api/apartments";
import { getBookedPeriods } from "@/lib/api/calendar";
import {
  startCheckin,
  scanGuestDocument,
  getCheckinStatus,
  submitManualCheckin,
  confirmCheckin,
  abandonCheckin,
} from "@/lib/api/checkin-public";
import type {
  CheckinStatusResponse,
  GuestDocumentType,
} from "@/lib/api/types";
import { todayIso } from "@/lib/invoice-utils";
import {
  saveCheckinSession,
  loadCheckinSession,
  clearCheckinSession,
} from "@/lib/checkin-session";
import { GuestDocCamera } from "@/components/guest/GuestDocCamera";
import { GuestShell } from "@/components/guest/GuestShell";

// ============================================================
// /checkin/{apartmentId} — self-checkin gosta (javno, preko QR).
//
// TOK (kratko i ugodno, uvijek s povratkom):
//   1. stay     datumi (prijedlog iz kalendara) + privola → /start
//   2. method   sken ili ručni unos
//   3. sken:    tip dokumenta → kamera (front[, back]) → OCR
//      ručno:   forma → /manual
//   4. review   provjera/ispravak → /confirm
//   5. success  kvačica (pop-in) → novi gost ili početna
//
// "Novi gost": datumi se naslijede, privola se traži ponovo
// (osobna je), ide se ravno na izbor načina.
// ============================================================

type Step =
  | "stay"
  | "method"
  | "docType"
  | "processing"
  | "scanFailed"
  | "review"
  | "manual"
  | "success"
  | "newGuest";

const DOC_NEEDS_BACK: Record<GuestDocumentType, boolean> = {
  ID_CARD: true,
  DRIVING_LICENCE: true,
  PASSPORT: false,
};

function addDaysIso(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export default function GuestCheckinPage({
  params,
}: {
  params: Promise<{ apartmentId: string }>;
}) {
  const { apartmentId: rawId } = use(params);
  const apartmentId = Number(rawId);
  const router = useRouter();
  const { dict, lang } = useLanguage();
  const t = dict.checkin;

  // ---------- Stanje toka ----------
  const [step, setStep] = useState<Step>("stay");
  const [apartmentName, setApartmentName] = useState<string | null>(null);

  const [arrival, setArrival] = useState(todayIso());
  const [departure, setDeparture] = useState(addDaysIso(todayIso(), 1));
  const [datesSuggested, setDatesSuggested] = useState(false);
  const [consent, setConsent] = useState(false);

  const [recordId, setRecordId] = useState<number | null>(null);
  /** Klik na start bez privole — označi privolu umjesto nijemog gumba */
  const [consentError, setConsentError] = useState(false);
  const [docType, setDocType] = useState<GuestDocumentType>("ID_CARD");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraSide, setCameraSide] = useState<"front" | "back">("front");
  const [frontBlob, setFrontBlob] = useState<Blob | null>(null);

  const [status, setStatus] = useState<CheckinStatusResponse | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Polja za review/manual
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    placeOfResidence: "",
    documentNumber: "",
  });

  // ---------- Naziv apartmana (na jeziku gosta) ----------
  useEffect(() => {
    if (!Number.isFinite(apartmentId)) return;
    getPublicApartment(apartmentId, lang)
      .then((apartment) => setApartmentName(apartment.name))
      .catch(() => setApartmentName(null));
  }, [apartmentId, lang]);

  // ---------- Prijedlog datuma iz kalendara ----------
  // Tekući boravak (danas unutar perioda) ili najbliži budući.
  // Preskače se ako se nastavlja prekinuta sesija (gore) — ona već
  // nosi datume koje je gost potvrdio, ne smiju se prepisati svježim
  // kalendarskim prijedlogom.
  useEffect(() => {
    if (!Number.isFinite(apartmentId)) return;
    if (loadCheckinSession(apartmentId)) return;

    getBookedPeriods(apartmentId)
      .then((periods) => {
        const today = todayIso();
        const ongoing = periods.find(
          (p) => p.startDate <= today && today < p.endDate
        );
        const upcoming = periods
          .filter((p) => p.startDate > today)
          .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

        const pick = ongoing ?? upcoming;
        if (pick) {
          setArrival(pick.startDate);
          setDeparture(pick.endDate);
          setDatesSuggested(true);
        }
      })
      .catch(() => {
        // Bez prijedloga — gost upisuje sam
      });
  }, [apartmentId]);

  const nights = useMemo(() => {
    const ms =
      new Date(`${departure}T00:00:00`).getTime() -
      new Date(`${arrival}T00:00:00`).getTime();
    const n = Math.round(ms / 86_400_000);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [arrival, departure]);

  const datesValid = nights !== null;

  // ---------- Pomoćnici ----------

  const failGeneric = useCallback(
    (err: unknown) => {
      const message =
        err instanceof Error && /fetch|network/i.test(err.message)
          ? t.errors.network
          : t.errors.generic;
      setError(message);
    },
    [t]
  );

  const fillFormFrom = useCallback((s: CheckinStatusResponse) => {
    setForm({
      fullName: s.fullName ?? "",
      dateOfBirth: s.dateOfBirth ?? "",
      placeOfBirth: s.placeOfBirth ?? "",
      placeOfResidence: s.placeOfResidence ?? "",
      documentNumber: s.documentNumber ?? "",
    });
  }, []);

  // ---------- Nastavak prekinutog checkina (preživljava refresh) ----------
  //
  // Bez ovoga svaki refresh zove /start iznova i ostavlja napušten
  // zapis na backendu koji zauvijek "čeka akciju gosta". Ako postoji
  // spremljena, neistekla sesija (vidi lib/checkin-session.ts), prvo
  // provjerimo kod backenda da zapis stvarno još postoji i nije već
  // gotov, pa nastavimo od odgovarajućeg koraka umjesto od "stay".
  useEffect(() => {
    if (!Number.isFinite(apartmentId)) return;
    const saved = loadCheckinSession(apartmentId);
    if (!saved) return;

    let cancelled = false;

    (async () => {
      try {
        const current = await getCheckinStatus(saved.recordId);
        if (cancelled) return;

        if (current.status === "VERIFIED" || current.status === "EXPIRED") {
          // Već završeno ili isteklo na backendu — nema što nastaviti
          if (current.status === "EXPIRED") setError(t.errors.expired);
          clearCheckinSession(apartmentId);
          return;
        }

        setRecordId(saved.recordId);
        setArrival(saved.arrivalDate);
        setDeparture(saved.departureDate);
        setDatesSuggested(true);
        setConsent(true);
        setStatus(current);
        fillFormFrom(current);

        if (current.status === "FAILED") {
          setStep("scanFailed");
        } else if (current.status === "MANUAL_REVIEW") {
          setStep("review");
        } else {
          // PENDING/PROCESSING — gost još nije poslao ni sken ni ručni unos
          setStep("method");
        }
      } catch {
        // Zapis vjerojatno više ne postoji (istekao/obrisan na backendu)
        if (!cancelled) clearCheckinSession(apartmentId);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartmentId]);

  // ---------- Akcije ----------

  const handleStart = async () => {
    if (!datesValid || isBusy) return;

    // Gumb je namjerno AKTIVAN i bez privole: nijemo siv gumb ne
    // objašnjava što fali. Klik bez kvačice označi privolu.
    if (!consent) {
      setConsentError(true);
      document
        .getElementById("consent-card")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setError(null);
    setIsBusy(true);
    try {
      const { recordId: id } = await startCheckin({
        apartmentId,
        arrivalDate: arrival,
        departureDate: departure,
        consentGiven: true,
      });
      setRecordId(id);
      saveCheckinSession(apartmentId, {
        recordId: id,
        arrivalDate: arrival,
        departureDate: departure,
      });
      setStep("method");
    } catch (err) {
      failGeneric(err);
    } finally {
      setIsBusy(false);
    }
  };

  /** OCR rezultat može biti gotov odmah ili tražiti polling */
  const handleScanResult = useCallback(
    async (result: CheckinStatusResponse) => {
      let current = result;

      if (current.status === "PROCESSING" || current.status === "PENDING") {
        setStep("processing");
        for (let i = 0; i < 20; i++) {
          await new Promise((r) => setTimeout(r, 1500));
          try {
            current = await getCheckinStatus(current.recordId);
          } catch {
            continue;
          }
          if (current.status !== "PROCESSING" && current.status !== "PENDING")
            break;
        }
      }

      setStatus(current);

      if (current.status === "FAILED") {
        setStep("scanFailed");
      } else {
        fillFormFrom(current);
        setStep("review");
      }
    },
    [fillFormFrom]
  );

  const handleCapture = async (image: Blob) => {
    if (recordId == null) return;

    const needsBack = DOC_NEEDS_BACK[docType];

    if (cameraSide === "front" && needsBack) {
      // Spremi prednju, traži stražnju — bez slanja
      setFrontBlob(image);
      setCameraSide("back");
      return;
    }

    // Zadnja potrebna strana → šalji
    const front = needsBack ? frontBlob : image;
    const back = needsBack ? image : null;
    if (!front) return;

    setIsBusy(true);
    setError(null);
    try {
      const result = await scanGuestDocument(recordId, docType, front, back);
      setCameraOpen(false);
      setFrontBlob(null);
      setCameraSide("front");
      await handleScanResult(result);
    } catch (err) {
      setCameraOpen(false);
      setFrontBlob(null);
      setCameraSide("front");
      failGeneric(err);
      setStep("scanFailed");
    } finally {
      setIsBusy(false);
    }
  };

  const handleManualSubmit = async () => {
    if (recordId == null || isBusy) return;
    setError(null);
    setIsBusy(true);
    try {
      const result = await submitManualCheckin(recordId, {
        ...form,
        documentType: docType,
      });
      setStatus(result);
      fillFormFrom(result);
      setStep("review");
    } catch (err) {
      failGeneric(err);
    } finally {
      setIsBusy(false);
    }
  };

  const handleConfirm = async () => {
    if (recordId == null || isBusy) return;
    setError(null);
    setIsBusy(true);
    try {
      const result = await confirmCheckin(recordId, form);
      setStatus(result);
      setStep("success");
      // Gotovo — više nema što nastavljati na refresh
      clearCheckinSession(apartmentId);
    } catch (err) {
      failGeneric(err);
    } finally {
      setIsBusy(false);
    }
  };

  /** Novi gost — isti datumi, nova privola, novi record */
  const handleNewGuestStart = async () => {
    if (isBusy) return;
    if (!consent) {
      setConsentError(true);
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      const { recordId: id } = await startCheckin({
        apartmentId,
        arrivalDate: arrival,
        departureDate: departure,
        consentGiven: true,
      });
      setRecordId(id);
      saveCheckinSession(apartmentId, {
        recordId: id,
        arrivalDate: arrival,
        departureDate: departure,
      });
      setStatus(null);
      setForm({
        fullName: "",
        dateOfBirth: "",
        placeOfBirth: "",
        placeOfResidence: "",
        documentNumber: "",
      });
      setStep("method");
    } catch (err) {
      failGeneric(err);
    } finally {
      setIsBusy(false);
    }
  };

  /**
   * Odustani od prijave — briše lokalnu sesiju (refresh više neće
   * nastaviti ovaj zapis) i, best effort, javlja backendu da je gost
   * odustao (vidi abandonCheckin — ruta još ne postoji, greška se
   * ignorira).
   */
  const handleCancelCheckin = async () => {
    setShowCancelConfirm(false);
    const idToCancel = recordId;

    setStep("stay");
    setRecordId(null);
    setStatus(null);
    setConsent(false);
    setConsentError(false);
    setError(null);
    setForm({
      fullName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      placeOfResidence: "",
      documentNumber: "",
    });
    clearCheckinSession(apartmentId);

    if (idToCancel != null) {
      try {
        await abandonCheckin(idToCancel);
      } catch {
        // Backend ruta možda još ne postoji — lokalni "odustani" je
        // svejedno uspio, zapis na backendu ostaje dok ne dodamo pravu
        // rutu (vidi zahtjev u chatu)
      }
    }
  };

  // ---------- Stilovi ----------

  const inputClass =
    "min-h-[3.25rem] w-full rounded-xl border border-stone-700 bg-stone-900/70 px-4 text-stone-100 placeholder:text-stone-500 transition-colors focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/30";
  const labelClass = "text-sm font-medium text-stone-300";
  const primaryBtn =
    "inline-flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 text-base font-bold text-stone-950 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98] disabled:opacity-50";
  const cardBtn =
    "flex w-full items-center gap-4 rounded-2xl border border-stone-700/60 bg-stone-900/60 p-4 text-left transition-all active:scale-[0.98]";

  if (!Number.isFinite(apartmentId)) {
    return (
      <GuestShell title={t.title} subtitle={null}>
        <p className="text-sm text-stone-400">{t.errors.generic}</p>
      </GuestShell>
    );
  }

  const missingBirth = status?.placeOfBirthMissing && !form.placeOfBirth.trim();
  const missingResidence =
    status?.placeOfResidenceMissing && !form.placeOfResidence.trim();

  const reviewValid =
    form.fullName.trim() !== "" &&
    form.dateOfBirth !== "" &&
    form.placeOfBirth.trim() !== "" &&
    form.placeOfResidence.trim() !== "" &&
    form.documentNumber.trim() !== "";

  return (
    <GuestShell
      title={t.title}
      subtitle={apartmentName}
      onBack={
        step === "method"
          ? () => setStep("stay")
          : step === "docType"
            ? () => setStep("method")
            : step === "manual"
              ? () => setStep("method")
              : step === "review" && status?.status !== "PROCESSING"
                ? () => setStep("method")
                : undefined
      }
      backLabel={t.common.back}
    >
      {error && (
        <div className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 text-pretty">
          {error}
        </div>
      )}

      {recordId != null && step !== "success" && step !== "newGuest" && (
        <button
          type="button"
          onClick={() => setShowCancelConfirm(true)}
          className="mb-4 inline-flex min-h-[2.5rem] items-center text-xs font-medium text-stone-500 underline-offset-4 active:underline"
        >
          {t.common.cancelCheckin}
        </button>
      )}

      {/* ============ 1. BORAVAK + PRIVOLA ============ */}
      {step === "stay" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-stone-100">{t.stay.title}</h2>
            <p className="mt-1 text-sm text-stone-400">{t.stay.subtitle}</p>
          </div>

          {datesSuggested && (
            <p className="flex gap-2 rounded-xl bg-teal-500/10 px-3.5 py-2.5 text-xs text-teal-300 text-pretty">
              <CalendarRange className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {t.stay.suggested}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="arrival" className={labelClass}>
                {t.stay.arrival}
              </label>
              <input
                id="arrival"
                type="date"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="departure" className={labelClass}>
                {t.stay.departure}
              </label>
              <input
                id="departure"
                type="date"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {!datesValid ? (
            <p className="text-xs text-amber-400">{t.stay.invalidRange}</p>
          ) : (
            <p className="text-xs text-stone-500">
              {nights} {nights === 1 ? t.stay.night : t.stay.nights}
            </p>
          )}

          {/* Privola — naglasak na brisanju podataka */}
          <div
            id="consent-card"
            className={cn(
              "space-y-3 rounded-2xl border bg-stone-900/60 p-4 transition-colors",
              consentError
                ? "border-amber-500/70 bg-amber-500/5"
                : "border-stone-700/60"
            )}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-teal-400" />
              <h3 className="text-sm font-semibold text-stone-200">
                {t.consent.title}
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 text-pretty">
              {t.consent.text}
            </p>
            <label className="flex min-h-[2.75rem] cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (e.target.checked) setConsentError(false);
                }}
                className="mt-0.5 h-5 w-5 shrink-0 accent-teal-500"
              />
              <span className="text-sm text-stone-200 text-pretty">
                {t.consent.checkbox}
              </span>
            </label>
            {consentError && (
              <p className="text-xs font-semibold text-amber-400">
                ↑ {t.consent.checkbox}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleStart()}
            disabled={!datesValid || isBusy}
            className={primaryBtn}
          >
            {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {t.start}
          </button>
        </div>
      )}

      {/* ============ NOVI GOST (isti boravak) ============ */}
      {step === "newGuest" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-stone-100">
              {t.newGuest.title}
            </h2>
            <p className="mt-1 text-sm text-stone-400">{t.newGuest.subtitle}</p>
          </div>

          <p className="rounded-xl bg-stone-900/60 px-4 py-3 text-sm text-stone-300">
            {arrival} → {departure}
          </p>

          <div
            className={cn(
              "space-y-3 rounded-2xl border bg-stone-900/60 p-4 transition-colors",
              consentError
                ? "border-amber-500/70 bg-amber-500/5"
                : "border-stone-700/60"
            )}
          >
            <label className="flex min-h-[2.75rem] cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  if (e.target.checked) setConsentError(false);
                }}
                className="mt-0.5 h-5 w-5 shrink-0 accent-teal-500"
              />
              <span className="text-sm text-stone-200 text-pretty">
                {t.consent.checkbox}
              </span>
            </label>
            {consentError && (
              <p className="text-xs font-semibold text-amber-400">
                ↑ {t.consent.checkbox}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleNewGuestStart()}
            disabled={isBusy}
            className={primaryBtn}
          >
            {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {t.common.continue}
          </button>
        </div>
      )}

      {/* ============ 2. NAČIN PRIJAVE ============ */}
      {step === "method" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-100">{t.method.title}</h2>

          <button
            type="button"
            onClick={() => setStep("docType")}
            className={cn(cardBtn, "border-teal-500/40 bg-teal-500/10")}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-500/20">
              <Camera className="h-6 w-6 text-teal-300" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-base font-bold text-stone-100">
                  {t.method.scanTitle}
                </span>
                <span className="rounded-full bg-teal-500 px-2 py-0.5 text-[0.625rem] font-bold text-stone-950">
                  {t.method.recommended}
                </span>
              </span>
              <span className="mt-0.5 block text-xs text-stone-400 text-pretty">
                {t.method.scanDesc}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-stone-500" />
          </button>

          <button
            type="button"
            onClick={() => setStep("manual")}
            className={cardBtn}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-800">
              <PenLine className="h-6 w-6 text-stone-300" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-base font-bold text-stone-100">
                {t.method.manualTitle}
              </span>
              <span className="mt-0.5 block text-xs text-stone-400 text-pretty">
                {t.method.manualDesc}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-stone-500" />
          </button>
        </div>
      )}

      {/* ============ 3. TIP DOKUMENTA ============ */}
      {step === "docType" && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-100">{t.docType.title}</h2>

          {(
            [
              { type: "ID_CARD" as const, label: t.docType.idCard, icon: CreditCard },
              { type: "PASSPORT" as const, label: t.docType.passport, icon: BookUser },
              { type: "DRIVING_LICENCE" as const, label: t.docType.drivingLicence, icon: Car },
            ]
          ).map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setDocType(type);
                setCameraSide("front");
                setFrontBlob(null);
                setCameraOpen(true);
              }}
              className={cardBtn}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-stone-800">
                <Icon className="h-6 w-6 text-teal-300" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-base font-bold text-stone-100">{label}</span>
                <span className="mt-0.5 block text-xs text-stone-400">
                  {DOC_NEEDS_BACK[type] ? t.docType.bothSides : t.docType.oneSide}
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-stone-500" />
            </button>
          ))}
        </div>
      )}

      {/* ============ OBRADA ============ */}
      {step === "processing" && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
          <div>
            <p className="text-lg font-bold text-stone-100">
              {t.processing.title}
            </p>
            <p className="mt-1 text-sm text-stone-400">{t.processing.hint}</p>
          </div>
        </div>
      )}

      {/* ============ SKEN NIJE USPIO ============ */}
      {step === "scanFailed" && (
        <div className="space-y-5 text-center">
          <div>
            <h2 className="text-xl font-bold text-stone-100">
              {t.scanFailed.title}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone-400 text-pretty">
              {t.scanFailed.text}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setCameraSide("front");
              setFrontBlob(null);
              setCameraOpen(true);
            }}
            className={primaryBtn}
          >
            <Camera className="h-5 w-5" />
            {t.scanFailed.tryAgain}
          </button>

          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep("manual");
            }}
            className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-2xl border border-stone-700 px-5 text-sm font-semibold text-stone-200 transition-all active:scale-[0.98]"
          >
            <PenLine className="h-4 w-4" />
            {t.scanFailed.goManual}
          </button>
        </div>
      )}

      {/* ============ RUČNI UNOS ============ */}
      {step === "manual" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-stone-100">{t.manual.title}</h2>
            <p className="mt-1 text-sm text-stone-400">{t.manual.subtitle}</p>
          </div>

          <GuestFields
            form={form}
            setForm={setForm}
            t={t}
            inputClass={inputClass}
            labelClass={labelClass}
            missingBirth={false}
            missingResidence={false}
          />

          <div className="space-y-1.5">
            <label htmlFor="docTypeSelect" className={labelClass}>
              {t.fields.documentType}
            </label>
            <select
              id="docTypeSelect"
              value={docType}
              onChange={(e) => setDocType(e.target.value as GuestDocumentType)}
              className={inputClass}
            >
              <option value="ID_CARD">{t.docType.idCard}</option>
              <option value="PASSPORT">{t.docType.passport}</option>
              <option value="DRIVING_LICENCE">{t.docType.drivingLicence}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void handleManualSubmit()}
            disabled={!reviewValid || isBusy}
            className={primaryBtn}
          >
            {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {t.manual.submit}
          </button>
        </div>
      )}

      {/* ============ 4. PROVJERA ============ */}
      {step === "review" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-stone-100">{t.review.title}</h2>
            <p className="mt-1 text-sm text-stone-400">{t.review.subtitle}</p>
          </div>

          <GuestFields
            form={form}
            setForm={setForm}
            t={t}
            inputClass={inputClass}
            labelClass={labelClass}
            missingBirth={Boolean(missingBirth)}
            missingResidence={Boolean(missingResidence)}
          />

          {status?.nationality && (
            <p className="text-xs text-stone-500">
              {t.fields.nationality}: {status.nationality}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!reviewValid || isBusy}
            className={primaryBtn}
          >
            {isBusy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
            {t.review.confirm}
          </button>
        </div>
      )}

      {/* ============ 5. USPJEH ============ */}
      {step === "success" && (
        <div className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="animate-pop-in flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <Check className="h-12 w-12 text-white" strokeWidth={3} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-stone-100">
              {t.success.title}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-stone-400 text-pretty">
              {status?.status === "VERIFIED"
                ? t.success.verifiedText
                : t.success.reviewText}
            </p>
          </div>

          <div className="w-full space-y-3 pt-2">
            <p className="text-sm font-semibold text-stone-200">
              {t.success.anotherQuestion}
            </p>

            <button
              type="button"
              onClick={() => {
                setConsent(false);
                setConsentError(false);
                setError(null);
                setStep("newGuest");
              }}
              className={primaryBtn}
            >
              {t.success.addAnother}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex min-h-[3rem] w-full items-center justify-center rounded-2xl border border-stone-700 px-5 text-sm font-semibold text-stone-200 transition-all active:scale-[0.98]"
            >
              {t.success.finish}
            </button>
          </div>
        </div>
      )}

      {/* ============ KAMERA ============ */}
      <GuestDocCamera
        open={cameraOpen}
        documentType={docType}
        side={cameraSide}
        labels={{
          sideLabel:
            docType === "PASSPORT"
              ? t.camera.passportPage
              : cameraSide === "front"
                ? t.camera.frontSide
                : t.camera.backSide,
          openCamera: t.camera.openCamera,
          fitFrame: t.camera.fitFrame,
          tooDark: t.camera.tooDark,
          confirmQuestion: t.camera.confirmQuestion,
          unavailable: t.camera.unavailable,
          manualFallback: t.camera.manualFallback,
        }}
        onClose={() => {
          setCameraOpen(false);
          setFrontBlob(null);
          setCameraSide("front");
        }}
        onCapture={handleCapture}
        onManualFallback={() => {
          setCameraOpen(false);
          setStep("manual");
        }}
        isSubmitting={isBusy}
      />

      {/* ============ POTVRDA ODUSTAJANJA ============ */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            className="mx-4 mb-4 w-full max-w-sm rounded-2xl border border-stone-700/60 bg-stone-900 p-5 pb-safe sm:mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-bold text-stone-100">
              {t.cancel.title}
            </h3>
            <p className="mt-1.5 text-sm text-stone-400 text-pretty">
              {t.cancel.text}
            </p>
            <div className="mt-5 flex flex-col-reverse gap-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-stone-700 px-5 text-sm font-semibold text-stone-200 transition-all active:scale-[0.98]"
              >
                {t.cancel.dismissButton}
              </button>
              <button
                type="button"
                onClick={() => void handleCancelCheckin()}
                className="inline-flex min-h-[3rem] items-center justify-center rounded-xl bg-red-500/90 px-5 text-sm font-bold text-white transition-all active:scale-[0.98]"
              >
                {t.cancel.confirmButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </GuestShell>
  );
}

// ---------- Zajednička polja (manual + review) ----------

function GuestFields({
  form,
  setForm,
  t,
  inputClass,
  labelClass,
  missingBirth,
  missingResidence,
}: {
  form: {
    fullName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    placeOfResidence: string;
    documentNumber: string;
  };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  t: ReturnType<typeof useLanguage>["dict"]["checkin"];
  inputClass: string;
  labelClass: string;
  missingBirth: boolean;
  missingResidence: boolean;
}) {
  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const missingClass = "border-amber-500/60 bg-amber-500/5";

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="g-fullName" className={labelClass}>
          {t.fields.fullName}
        </label>
        <input
          id="g-fullName"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          autoCapitalize="words"
          autoComplete="name"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="g-dob" className={labelClass}>
          {t.fields.dateOfBirth}
        </label>
        <input
          id="g-dob"
          type="date"
          value={form.dateOfBirth}
          onChange={(e) => set("dateOfBirth", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="g-pob" className={labelClass}>
          {t.fields.placeOfBirth}
        </label>
        <input
          id="g-pob"
          value={form.placeOfBirth}
          onChange={(e) => set("placeOfBirth", e.target.value)}
          className={cn(inputClass, missingBirth && missingClass)}
        />
        {missingBirth && (
          <p className="text-xs text-amber-400">{t.review.missingHint}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="g-por" className={labelClass}>
          {t.fields.placeOfResidence}
        </label>
        <input
          id="g-por"
          value={form.placeOfResidence}
          onChange={(e) => set("placeOfResidence", e.target.value)}
          placeholder={t.fields.placeOfResidenceHint}
          className={cn(inputClass, missingResidence && missingClass)}
        />
        {missingResidence && (
          <p className="text-xs text-amber-400">{t.review.missingHint}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="g-docnum" className={labelClass}>
          {t.fields.documentNumber}
        </label>
        <input
          id="g-docnum"
          value={form.documentNumber}
          onChange={(e) => set("documentNumber", e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          className={cn(inputClass, "font-mono")}
        />
      </div>
    </div>
  );
}
