"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Portal } from "@/components/ui/portal";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Lightbox za galeriju apartmana — pan/pinch-zoom ista tehnika kao
// src/components/guest/GuestDocCamera.tsx, ali "contain" fit (cijela
// fotka vidljiva) i bez canvas-exporta (ovo je pregled, ne kadriranje).
//
// Kad zoom === 1 (uklopljeno), vodoravni drag/swipe listi sljedeću/
// prethodnu sliku; kad je zoom > 1, drag panira uveličanu sliku.
// ============================================================

const MAX_ZOOM = 5;
const SWIPE_THRESHOLD_PX = 70;
const DOUBLE_TAP_MS = 300;

interface ImageLightboxProps {
  images: { url: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(
    null
  );
  const [frameSize, setFrameSize] = useState({ w: 0, h: 0 });
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [zoom, setZoom] = useState(1);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureRef = useRef<{
    startTx: number;
    startTy: number;
    startZoom: number;
    startDist: number;
    centerX: number;
    centerY: number;
    pointerCount: number;
  } | null>(null);
  const lastTapRef = useRef(0);

  useScrollLock(true);

  const resetTransform = useCallback(() => {
    setZoom(1);
    setTx(0);
    setTy(0);
  }, []);

  useEffect(() => {
    setNaturalSize(null);
    resetTransform();
  }, [index, resetTransform]);

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
  }, []);

  const fitScale =
    naturalSize && frameSize.w > 0
      ? Math.min(frameSize.w / naturalSize.w, frameSize.h / naturalSize.h)
      : 1;
  const scale = fitScale * zoom;

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, goNext, goPrev]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const points = Array.from(pointersRef.current.values());

    if (points.length === 1) {
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_MS) {
        setZoom((z) => (z > 1 ? 1 : 2.5));
        setTx(0);
        setTy(0);
      }
      lastTapRef.current = now;

      gestureRef.current = {
        startTx: tx,
        startTy: ty,
        startZoom: zoom,
        startDist: 0,
        centerX: points[0].x,
        centerY: points[0].y,
        pointerCount: 1,
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
        pointerCount: 2,
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
    if (pointersRef.current.size > 0) return;

    const wasSingleTouch = gestureRef.current?.pointerCount === 1;
    gestureRef.current = null;

    if (!wasSingleTouch) return;

    if (zoom <= 1.01 && Math.abs(tx) > SWIPE_THRESHOLD_PX && Math.abs(tx) > Math.abs(ty)) {
      if (tx < 0) goNext();
      else goPrev();
    } else if (zoom <= 1.01) {
      setTx(0);
      setTy(0);
    }
  };

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

  const current = images[index];

  return (
    <Portal>
      <div className="fixed inset-0 z-[95] bg-stone-950/97 backdrop-blur-sm">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 p-4 pt-safe">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>

          {images.length > 1 && (
            <span className="text-sm font-semibold text-white/80">
              {index + 1} / {images.length}
            </span>
          )}

          <button
            type="button"
            onClick={resetTransform}
            aria-label="Reset zoom"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm active:scale-95"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div
          className="absolute inset-0 touch-none select-none px-2 pb-6 pt-20 sm:px-6"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onWheel={onWheel}
        >
          <div ref={frameRef} className="relative h-full w-full overflow-hidden">
            <img
              ref={imageRef}
              src={current.url}
              alt={current.alt}
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
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm active:scale-95 sm:left-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm active:scale-95 sm:right-4"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </Portal>
  );
}
