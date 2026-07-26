"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Check, Loader2, Camera, RotateCcw, PenLine, Maximize2, ZoomIn } from "lucide-react";
import type { GuestDocumentType } from "@/lib/api/types";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { debugSaveScan } from "@/lib/debug-save-scan";

// ============================================================
// Kamera za identifikacijske dokumente (gost, self-checkin).
//
// PRIJE je ovo bio custom live-preview (getUserMedia + burst capture,
// biranje najoštrijeg frame-a). Maknuto NAKON istraživanja: kontinuirani
// autofokus preko getUserMedia je dugogodišnji, još uvijek neriješen
// problem na Chromiumu/Androidu (Chromium/Firefox bug traceri idu
// unatrag preko 10 godina — bugzilla #1414055, #950479), iOS Safari
// fokus constraints uopće ne izlaže, a web nema pouzdan način razlikovati
// glavnu od ultra-wide leće. Ukratko: JS ovdje fizički ne može prisiliti
// pravi autofokus na velikom dijelu uređaja — nije bio bug u našem kodu.
//
// RJEŠENJE: prepusti snimanje NATIVNOJ kamera-appici uređaja preko
// <input type="file" accept="image/*" capture="environment">. Ta
// appica ima potpuni, pravi autofokus/blic/zum jer je to IST softver
// koji se koristi i kad se fotka obična slika telefonom.
//
// Native foto rijetko savršeno odgovara okviru dokumenta (drugi
// omjer, gost drži telefon kako stigne) — zato nakon snimanja slijedi
// korak POravnavanja: pan/zoom istom tehnikom kao admin ScanAlignEditor
// (CSS transform za pregled, ista transformacija ponovljena na canvasu
// za izvoz — što se vidi, to se i pošalje).
// ============================================================

const DOC_RATIO: Record<GuestDocumentType, number> = {
  ID_CARD: 1.586,
  DRIVING_LICENCE: 1.586,
  PASSPORT: 1.42,
};

/** Širina izlazne (izrezane) slike; visina slijedi omjer dokumenta */
const OUTPUT_WIDTH = 1600;

/**
 * `zoom` je RELATIVAN faktor iznad "uklopljeno" (cover) stanja, NE
 * apsolutni CSS scale. zoom=1 uvijek znači "cijela slika uklopljena u
 * okvir, bez praznina" (ono što korisnik doživljava kao "original") —
 * to je ujedno i minimum, jer manje od toga bi ostavilo prazninu oko
 * slike. zoom raste do MAX_ZOOM za uže kadriranje.
 *
 * Prije je ovdje bio apsolutni scale s proizvoljnim MIN_SCALE=0.2 —
 * ovisno o omjeru foto/okvir, "uklopljeno" je moglo ispasti BILO GDJE
 * u tom rasponu (npr. 1.25), pa je slider fizički mogao ići ispod te
 * vrijednosti (u prazninu) ali korisniku se činilo da je "1.25 minimum"
 * jer je to bila početna/najčešće korištena vrijednost — zbunjujuće.
 */
const MAX_ZOOM = 5;

export interface GuestDocCameraLabels {
  sideLabel: string;
  /** Tekst na velikom gumbu koji otvara nativnu kameru uređaja */
  openCamera: string;
  /** Uputa prikazana PRIJE otvaranja kamere (statični prijedlog kadra) */
  fitFrame: string;
  /** Nekorišteno (bio je live-preview upozorenje za tamno) — zadržano radi kompatibilnosti props oblika */
  tooDark?: string;
  confirmQuestion: string;
  /** Nekorišteno (bila je poruka o nedostupnoj kameri) — zadržano radi kompatibilnosti props oblika */
  unavailable?: string;
  manualFallback: string;
}

interface GuestDocCameraProps {
  open: boolean;
  documentType: GuestDocumentType;
  labels: GuestDocCameraLabels;
  onClose: () => void;
  /** Čeka potvrdu — modal se zatvara tek kad roditelj završi */
  onCapture: (image: Blob) => Promise<void>;
  /** Prebacivanje na ručni unos — uvijek dostupno, ne samo kod greške */
  onManualFallback: () => void;
  isSubmitting?: boolean;
  /**
   * "front" | "back" — dokumenti s dvije strane (osobna, vozačka) nakon
   * potvrde prednje strane ne zatvaraju modal, samo roditelj promijeni
   * ovu vrijednost i zatraži stražnju. Komponenta na tu promjenu vraća
   * prikaz na "idle" (vidi efekt niže).
   */
  side?: "front" | "back";
}

type Phase = "idle" | "adjusting";

export function GuestDocCamera({
  open,
  documentType,
  labels,
  onClose,
  onCapture,
  onManualFallback,
  isSubmitting = false,
  side = "front",
}: GuestDocCameraProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });

  // Transformacija pregleda: translate → scale, oko središta okvira.
  // `zoom` je RELATIVAN (1 = uklopljeno) — stvarni CSS/canvas scale se
  // izvodi kao fitScale * zoom, vidi niže.
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Aktivni pokazivači — za pan i pinch-zoom
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<{
    startTx: number;
    startTy: number;
    startZoom: number;
    startDist: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const ratio = DOC_RATIO[documentType];

  useScrollLock(open);

  // Prelazak s prednje na stražnju stranu (ili ponovno otvaranje modala)
  // vraća prikaz na "idle" — korisnik ponovno otvara nativnu kameru.
  useEffect(() => {
    if (!open) return;
    setPhase("idle");
    setObjectUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setNaturalSize(null);
  }, [open, side]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // ---------- Mjerenje okvira (za "uklopi") ----------
  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      setFrameSize({ w: rect.width, h: rect.height });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [objectUrl]);

  // "cover" — CSS scale potreban da slika pokrije cijeli okvir bez
  // praznina. zoom=1 se uvijek mapira na OVU vrijednost (vidi gore).
  const fitScale =
    naturalSize && frameSize.w > 0
      ? Math.max(frameSize.w / naturalSize.w, frameSize.h / naturalSize.h)
      : 1;
  const scale = fitScale * zoom;

  const fitToFrame = useCallback(() => {
    setZoom(1);
    setTx(0);
    setTy(0);
  }, []);

  useEffect(() => {
    fitToFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naturalSize, frameSize.w, frameSize.h]);

  const openNativeCamera = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // reset — isti file mora ponovno okinuti change idući put
      if (!file) return; // korisnik odustao u nativnoj kameri — ostani na "idle"

      setObjectUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(file);
      });
      setNaturalSize(null);
      setPhase("adjusting");
    },
    []
  );

  const retake = useCallback(() => {
    setPhase("idle");
    setObjectUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setNaturalSize(null);
  }, []);

  // ---------- Pan i pinch-zoom (ista tehnika kao admin ScanAlignEditor) ----------

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const points = Array.from(pointersRef.current.values());

    if (points.length === 1) {
      gestureRef.current = {
        startTx: tx,
        startTy: ty,
        startZoom: zoom,
        startDist: 0,
        centerX: points[0].x,
        centerY: points[0].y,
      };
    } else if (points.length === 2) {
      const dx = points[0].x - points[1].x;
      const dy = points[0].y - points[1].y;
      gestureRef.current = {
        startTx: tx,
        startTy: ty,
        startZoom: zoom,
        startDist: Math.hypot(dx, dy),
        centerX: (points[0].x + points[1].x) / 2,
        centerY: (points[0].y + points[1].y) / 2,
      };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const gesture = gestureRef.current;
    if (!gesture) return;

    const points = Array.from(pointersRef.current.values());

    if (points.length === 1) {
      setTx(gesture.startTx + (points[0].x - gesture.centerX));
      setTy(gesture.startTy + (points[0].y - gesture.centerY));
    } else if (points.length === 2 && gesture.startDist > 0) {
      const dx = points[0].x - points[1].x;
      const dy = points[0].y - points[1].y;
      const dist = Math.hypot(dx, dy);
      const pinchRatio = dist / gesture.startDist;

      setZoom(Math.min(MAX_ZOOM, Math.max(1, gesture.startZoom * pinchRatio)));

      const midX = (points[0].x + points[1].x) / 2;
      const midY = (points[0].y + points[1].y) / 2;
      setTx(gesture.startTx + (midX - gesture.centerX));
      setTy(gesture.startTy + (midY - gesture.centerY));
    }
  };

  const endPointer = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size === 0) gestureRef.current = null;
  };

  /** Zoom kotačićem (desktop testiranje) — oko pozicije kursora. */
  const onWheel = (e: React.WheelEvent) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const qx = e.clientX - cx;
    const qy = e.clientY - cy;

    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const nextZoom = Math.min(MAX_ZOOM, Math.max(1, zoom * factor));
    const applied = nextZoom / zoom;

    setTx(qx - (qx - tx) * applied);
    setTy(qy - (qy - ty) * applied);
    setZoom(nextZoom);
  };

  // ---------- Izvoz — ista transformacija kao pregled, na canvasu ----------

  const confirm = useCallback(async () => {
    const image = imageRef.current;
    if (!image || !naturalSize || frameSize.w === 0) return;

    setIsExporting(true);
    try {
      const outW = OUTPUT_WIDTH;
      const outH = Math.round(outW / ratio);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const k = outW / frameSize.w;
      ctx.imageSmoothingQuality = "high";
      ctx.translate(outW / 2, outH / 2);
      ctx.scale(k, k);
      ctx.translate(tx, ty);
      ctx.scale(scale, scale);
      ctx.drawImage(
        image,
        -naturalSize.w / 2,
        -naturalSize.h / 2,
        naturalSize.w,
        naturalSize.h
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
      if (blob) {
        debugSaveScan(blob, `checkin-${documentType.toLowerCase()}-${side}`);
        await onCapture(blob);
      }
    } finally {
      setIsExporting(false);
    }
  }, [naturalSize, frameSize, tx, ty, scale, ratio, onCapture, documentType, side]);

  if (!open) return null;

  const busy = isExporting || isSubmitting;

  return (
    <div className="fixed inset-0 z-[95] bg-stone-950">
      {/* Vrh */}
      <div className="absolute inset-x-0 top-0 z-10 pt-safe">
        <div className="flex items-start justify-between gap-3 p-4">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm active:scale-95 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 pt-1 text-center">
            <p className="text-sm font-bold text-white">{labels.sideLabel}</p>
          </div>

          <div className="h-11 w-11" />
        </div>

        {phase === "adjusting" && !busy && (
          <p className="mx-auto max-w-xs px-4 text-center text-sm font-semibold text-white">
            {labels.confirmQuestion}
          </p>
        )}
      </div>

      {phase === "idle" ? (
        /* ---------- Prijedlog kadra + gumb za nativnu kameru ---------- */
        <div className="absolute inset-0 flex items-center justify-center px-6 pb-36 pt-24">
          <div
            className="relative w-full max-w-md"
            style={{ aspectRatio: `${ratio} / 1`, borderRadius: 14 }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed border-white/40 bg-white/5 p-4 text-center">
              <Camera className="h-8 w-8 text-white/50" />
              <p className="text-xs text-white/70 text-pretty">{labels.fitFrame}</p>
            </div>
          </div>
        </div>
      ) : (
        /* ---------- Poravnavanje: pan/zoom nakon native snimke ---------- */
        <div
          className="absolute inset-0 touch-none select-none px-6 pb-56 pt-24"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onWheel={onWheel}
        >
          <div className="flex h-full items-center justify-center">
            <div
              ref={frameRef}
              className="relative w-full max-w-md shadow-[0_0_0_9999px_rgba(0,0,0,0.75)]"
              style={{ aspectRatio: `${ratio} / 1`, borderRadius: 14 }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-stone-800">
                {objectUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    ref={imageRef}
                    src={objectUrl}
                    alt=""
                    draggable={false}
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
                    }}
                    className="absolute left-1/2 top-1/2 max-w-none origin-center"
                    style={{
                      width: naturalSize?.w,
                      height: naturalSize?.h,
                      transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`,
                    }}
                  />
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-[14px] border-2 border-white/85" />
            </div>
          </div>
        </div>
      )}

      {/* Obrada — prekriva ekran dok traje izrezivanje/upload */}
      {busy && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-stone-950/85 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-sm font-semibold text-white">
            {isSubmitting ? "Obrada..." : "Priprema slike..."}
          </p>
        </div>
      )}

      {/* Skriveni native file input — accept + capture otvara kamera-appicu uređaja */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFileChange}
      />

      {/* Dno */}
      <div className="absolute inset-x-0 bottom-0 pb-safe">
        <div className="space-y-3 p-6">
          {phase === "adjusting" && (
            <div className="flex items-center gap-3">
              <ZoomIn className="h-4 w-4 shrink-0 text-white/60" />
              <input
                type="range"
                min={1}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                disabled={busy}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-teal-400"
                aria-label="Zumiranje"
              />
              <button
                type="button"
                onClick={fitToFrame}
                disabled={busy}
                aria-label="Uklopi"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-50"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            {phase === "adjusting" ? (
              <div className="flex items-center justify-center gap-10">
                <button
                  type="button"
                  onClick={retake}
                  disabled={busy}
                  aria-label="Retake"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm active:scale-95 disabled:opacity-50"
                >
                  <RotateCcw className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={() => void confirm()}
                  disabled={busy || !naturalSize}
                  aria-label="Confirm"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform active:scale-90 disabled:opacity-70"
                >
                  {busy ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <Check className="h-9 w-9" strokeWidth={3} />
                  )}
                </button>

                <div className="h-14 w-14" />
              </div>
            ) : (
              <button
                type="button"
                onClick={openNativeCamera}
                className="inline-flex min-h-[3.5rem] w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-teal-500 px-5 text-base font-bold text-stone-950 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]"
              >
                <Camera className="h-5 w-5" />
                {labels.openCamera}
              </button>
            )}

            {phase === "idle" && (
              <button
                type="button"
                onClick={onManualFallback}
                className="inline-flex min-h-[2.5rem] items-center gap-1.5 text-sm font-medium text-white/70 underline-offset-4 active:underline"
              >
                <PenLine className="h-3.5 w-3.5" />
                {labels.manualFallback}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
