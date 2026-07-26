"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Check,
  Loader2,
  RotateCw,
  RotateCcw,
  Maximize2,
  ZoomIn,
  Move,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { describeError } from "@/lib/api/error-utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { debugSaveScan } from "@/lib/debug-save-scan";

// ============================================================
// Poravnavanje skeniranog obrasca prije slanja.
//
// Skener/telefon rijetko da savršeno poravnat papir — obrub,
// blagi nagib, višak bijelog. OCR traži pozicijske markere pa
// mu konzistentan izrez bitno olakšava posao.
//
// Ista geometrija kao PaperScanCamera: A4 okvir + 6 markera na
// istim relativnim pozicijama kao na papiru.
//
// Pregled koristi CSS transform (jeftino, 60 fps), a izvoz
// ponavlja isti niz transformacija na canvasu — zato se ono što
// se vidi poklapa s onim što se pošalje.
// ============================================================

const MARKER_SIZE = 0.056;
const MARKER_INSET = 0.038;
const A4_RATIO = Math.SQRT2;

/** Širina izlazne slike; visina slijedi A4 omjer */
const OUTPUT_WIDTH = 1400;

const MIN_SCALE = 0.1;
const MAX_SCALE = 8;

interface ScanAlignEditorProps {
  /** Odabrana datoteka; null zatvara editor */
  file: File | null;
  onCancel: () => void;
  /**
   * MORA vratiti promise koji se razrješava tek kad backend
   * odgovori — editor po tome zna kad prikazati obradu i kad
   * je siguran za zatvaranje.
   */
  onConfirm: (image: Blob) => Promise<void>;
  isSubmitting?: boolean;
  /** Greška slanja — prikazuje se UNUTAR editora, ne iza njega */
  error?: unknown;
}

export function ScanAlignEditor({
  file,
  onCancel,
  onConfirm,
  isSubmitting = false,
  error,
}: ScanAlignEditorProps) {
  // Zajedničko zaključavanje scrolla (brojač) — vidi use-scroll-lock
  useScrollLock(Boolean(file));

  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });

  // Transformacija: translate → rotate → scale, oko središta okvira
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const [isExporting, setIsExporting] = useState(false);

  // Aktivni pokazivači — za pan i pinch
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<{
    startTx: number;
    startTy: number;
    startScale: number;
    startDist: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  // ---------- Učitavanje datoteke ----------

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      setNaturalSize(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);


  useEffect(() => {
    if (!file) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [file, onCancel]);

  // ---------- Mjerenje okvira ----------

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

  // ---------- Početno uklapanje ----------

  const fitToFrame = useCallback(() => {
    if (!naturalSize || frameSize.w === 0) return;

    // Rotacija za 90° zamjenjuje širinu i visinu
    const isSideways = rotation % 180 !== 0;
    const imageW = isSideways ? naturalSize.h : naturalSize.w;
    const imageH = isSideways ? naturalSize.w : naturalSize.h;

    // "cover" — slika pokriva cijeli okvir, bez praznina
    const next = Math.max(frameSize.w / imageW, frameSize.h / imageH);

    setScale(next);
    setTx(0);
    setTy(0);
  }, [naturalSize, frameSize, rotation]);

  useEffect(() => {
    fitToFrame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [naturalSize, frameSize.w, frameSize.h]);

  // ---------- Pan i pinch ----------

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const points = Array.from(pointersRef.current.values());

    if (points.length === 1) {
      gestureRef.current = {
        startTx: tx,
        startTy: ty,
        startScale: scale,
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
        startScale: scale,
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
      const ratio = dist / gesture.startDist;

      setScale(
        Math.min(MAX_SCALE, Math.max(MIN_SCALE, gesture.startScale * ratio))
      );

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

  /** Zoom kotačićem — oko pozicije kursora, ne oko središta. */
  const onWheel = (e: React.WheelEvent) => {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Pozicija kursora u koordinatama okvira (od središta)
    const qx = e.clientX - cx;
    const qy = e.clientY - cy;

    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    const nextScale = Math.min(
      MAX_SCALE,
      Math.max(MIN_SCALE, scale * factor)
    );
    const applied = nextScale / scale;

    // Točka pod kursorom ostaje na mjestu
    setTx(qx - (qx - tx) * applied);
    setTy(qy - (qy - ty) * applied);
    setScale(nextScale);
  };

  const rotate = (direction: -1 | 1) => {
    setRotation((r) => (r + direction * 90 + 360) % 360);
    setTx(0);
    setTy(0);
  };

  // ---------- Izvoz ----------

  const exportImage = useCallback(async () => {
    const image = imageRef.current;
    if (!image || !naturalSize || frameSize.w === 0) return;

    setIsExporting(true);

    try {
      const outW = OUTPUT_WIDTH;
      const outH = Math.round(outW * A4_RATIO);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Bijela podloga — sken može imati prozirne rubove
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, outW, outH);

      // Okvir → izlaz
      const k = outW / frameSize.w;

      ctx.imageSmoothingQuality = "high";
      ctx.translate(outW / 2, outH / 2);
      ctx.scale(k, k);

      // Isti redoslijed kao CSS transform u pregledu
      ctx.translate(tx, ty);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);

      ctx.drawImage(
        image,
        -naturalSize.w / 2,
        -naturalSize.h / 2,
        naturalSize.w,
        naturalSize.h
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92)
      );

      if (blob) {
        debugSaveScan(blob, "admin-form-scan-align");
        await onConfirm(blob);
      }
    } finally {
      setIsExporting(false);
    }
  }, [naturalSize, frameSize, tx, ty, scale, rotation, onConfirm]);

  if (!file || !objectUrl) return null;

  const busy = isExporting || isSubmitting;

  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-neutral-900">
      {/* Zaglavlje */}
      <header className="shrink-0 pt-safe">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="Odustani"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="min-w-0 text-center">
            <p className="text-sm font-semibold text-white">
              Poravnajte obrazac
            </p>
            <p className="truncate text-xs text-white/60">
              Kvadratići na papiru trebaju sjesti u okvire
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>
      </header>

      {/* Greška slanja — unutar editora, da je uopće vidljiva */}
      {error != null && !busy && (
        <div className="shrink-0 px-4 pb-2">
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
            <p className="text-sm font-semibold text-amber-200">
              {describeError(error).title}
            </p>
            <p className="mt-1 text-xs text-amber-100/80 text-pretty">
              {describeError(error).message}
            </p>
            <p className="mt-1.5 text-xs text-amber-100/60">
              Poravnanje je sačuvano — možete pokušati ponovo.
            </p>
          </div>
        </div>
      )}

      {/* Platno */}
      <div
        className="relative min-h-0 flex-1 touch-none select-none overflow-hidden"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onWheel={onWheel}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            ref={frameRef}
            className="relative"
            style={{
              aspectRatio: `1 / ${A4_RATIO}`,
              height: "min(100%, 80dvh)",
              maxWidth: "100%",
            }}
          >
            {/* Slika — clip na okvir */}
            <div className="absolute inset-0 overflow-hidden rounded-sm bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={objectUrl}
                alt="Skenirani obrazac"
                draggable={false}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  setNaturalSize({
                    w: img.naturalWidth,
                    h: img.naturalHeight,
                  });
                }}
                className="absolute left-1/2 top-1/2 max-w-none origin-center"
                style={{
                  width: naturalSize?.w,
                  height: naturalSize?.h,
                  transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rotation}deg) scale(${scale})`,
                }}
              />
            </div>

            {/* Rub okvira */}
            <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-primary" />

            {/* Markeri — iste pozicije kao na papiru */}
            {[
              { left: MARKER_INSET, top: MARKER_INSET },
              { right: MARKER_INSET, top: MARKER_INSET },
              { left: MARKER_INSET, bottom: MARKER_INSET },
              { right: MARKER_INSET, bottom: MARKER_INSET },
              { left: MARKER_INSET, middle: true },
              { right: MARKER_INSET, middle: true },
            ].map((m, i) => (
              <div
                key={i}
                className="pointer-events-none absolute border-2 border-primary/90"
                style={{
                  width: `${MARKER_SIZE * 100}%`,
                  aspectRatio: "1",
                  left: "left" in m ? `${(m.left as number) * 100}%` : undefined,
                  right: "right" in m ? `${(m.right as number) * 100}%` : undefined,
                  top: m.middle
                    ? `calc(50% - ${(MARKER_SIZE / 2) * 100}%)`
                    : "top" in m
                      ? `${((m as { top: number }).top / A4_RATIO) * 100}%`
                      : undefined,
                  bottom:
                    !m.middle && "bottom" in m
                      ? `${((m as { bottom: number }).bottom / A4_RATIO) * 100}%`
                      : undefined,
                }}
              />
            ))}
          </div>
        </div>

        {/* Uputa */}
        {!busy && (
          <p className="pointer-events-none absolute inset-x-0 bottom-2 text-center text-xs text-white/50">
            <Move className="mr-1 inline h-3 w-3" />
            povlačenje pomiče · kotačić zumira
          </p>
        )}

        {/* Obrada — prekriva platno da se vidi da nešto traje.
            OCR na backendu zna potrajati par sekundi; bez ovoga
            izgleda kao da klik nije ništa napravio. */}
        {busy && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-900/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <p className="text-sm font-semibold text-white">
              {isSubmitting ? "Obrada obrasca..." : "Priprema slike..."}
            </p>
            <p className="max-w-xs px-6 text-center text-xs text-white/60 text-pretty">
              {isSubmitting
                ? "Čitamo podatke s obrasca. Ovo može potrajati nekoliko sekundi."
                : "Izrezujem poravnati obrazac."}
            </p>
          </div>
        )}
      </div>

      {/* Alatna traka */}
      <footer className="shrink-0 border-t border-white/10 pb-safe">
        <div className="space-y-3 p-4">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomIn className="h-4 w-4 shrink-0 text-white/60" />
            <input
              type="range"
              min={MIN_SCALE}
              max={MAX_SCALE}
              step={0.01}
              value={scale}
              disabled={busy}
              onChange={(e) => setScale(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-primary"
              aria-label="Zumiranje"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => rotate(-1)}
              disabled={busy}
              className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-white/10 px-3.5 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <RotateCcw className="h-4 w-4" />
              Zakreni
            </button>

            <button
              type="button"
              onClick={() => rotate(1)}
              disabled={busy}
              className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-white/10 px-3.5 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <RotateCw className="h-4 w-4" />
              Zakreni
            </button>

            <button
              type="button"
              onClick={fitToFrame}
              disabled={busy}
              className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-xl bg-white/10 px-3.5 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              <Maximize2 className="h-4 w-4" />
              Uklopi
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="inline-flex min-h-[3rem] flex-1 items-center justify-center rounded-xl bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:opacity-50"
            >
              Odustani
            </button>

            <button
              type="button"
              onClick={() => void exportImage()}
              disabled={busy || !naturalSize}
              className="inline-flex min-h-[3rem] flex-[2] items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
              {isSubmitting ? "Obrada..." : "Pošalji na obradu"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
