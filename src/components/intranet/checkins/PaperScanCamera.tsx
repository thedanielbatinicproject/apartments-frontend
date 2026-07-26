"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Check, Loader2, Sun, Zap, ZapOff, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { describeError } from "@/lib/api/error-utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { debugSaveScan } from "@/lib/debug-save-scan";

// ============================================================
// Fullscreen kamera za skeniranje papirnatog obrasca.
//
// GEOMETRIJA OKVIRA — izmjerena s priloženog obrasca (786×1122):
//   - 6 crnih markera: 4 u kutovima + 2 na polovici visine
//   - veličina markera ≈ 5,6 % širine papira
//   - uvučenost od ruba ≈ 3,8 % širine papira
// On-screen markeri su na istim relativnim pozicijama, pa kad se
// poklope s onima na papiru, papir točno ispunjava okvir.
//
// OŠTRINA — klik na okidač NE uzima jedan frame: snima se burst
// od 5 frameova kroz ~450 ms, svaki se ocijeni varijancom
// gradijenta (na 160 px sivoj verziji — jeftino), i šalje se
// najoštriji. Ruka se uvijek malo trese; ovo to poništava.
// Memorija: čuva se samo trenutno najbolji full-res frame.
//
// SVJETLINA — svake sekunde prosjek osvjetljenja na 32×32 uzorku;
// ispod praga se pokaže neblokirajuće upozorenje na vrhu.
// ============================================================

// Relativna geometrija markera (udio širine okvira)
const MARKER_SIZE = 0.056;
const MARKER_INSET = 0.038;
/** A4 portret: visina = širina × √2 */
const A4_RATIO = Math.SQRT2;

/** Prosječna luma [0-255] ispod koje se javlja upozorenje */
const BRIGHTNESS_THRESHOLD = 70;

const BURST_FRAMES = 5;
const BURST_INTERVAL_MS = 90;

interface PaperScanCameraProps {
  open: boolean;
  onClose: () => void;
  /**
   * Poziva se s odabranom (najoštrijom) slikom. MORA vratiti
   * promise koji čeka odgovor backenda — inače kamera ne zna
   * je li slanje uspjelo i zatvorila bi se prerano.
   */
  onCapture: (image: Blob) => Promise<void>;
  /** Backend obrađuje sliku */
  isSubmitting?: boolean;
  /** Greška slanja — prikazuje se UNUTAR kamere */
  error?: unknown;
}

type Phase = "live" | "captured";

export function PaperScanCamera({
  open,
  onClose,
  onCapture,
  isSubmitting = false,
  error,
}: PaperScanCameraProps) {
  // Zajedničko zaključavanje scrolla (brojač) — vidi use-scroll-lock
  useScrollLock(open);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("live");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const capturedBlobRef = useRef<Blob | null>(null);

  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  // ---------- Pokretanje i gašenje kamere ----------

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const start = async () => {
      setCameraError(null);
      setPhase("live");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => undefined);
        }

        // Podržava li kamera svjetiljku (torch)
        const track = stream.getVideoTracks()[0];
        const capabilities = track?.getCapabilities?.() as
          | (MediaTrackCapabilities & { torch?: boolean })
          | undefined;
        setTorchSupported(Boolean(capabilities?.torch));
      } catch {
        if (!cancelled) {
          setCameraError(
            "Kamera nije dostupna. Provjerite da je stranici dopušten pristup kameri, ili upotrijebite upload slike."
          );
        }
      }
    };

    void start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setTorchOn(false);
    };
  }, [open]);


  // Očisti preview URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ---------- Nadzor svjetline ----------

  useEffect(() => {
    if (!open || phase !== "live" || cameraError) return;

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || !ctx || video.readyState < 2) return;

      ctx.drawImage(video, 0, 0, 32, 32);
      const { data } = ctx.getImageData(0, 0, 32, 32);

      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        // Percipirana luma
        sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
      setIsDark(sum / (data.length / 4) < BRIGHTNESS_THRESHOLD);
    }, 1000);

    return () => clearInterval(interval);
  }, [open, phase, cameraError]);

  // ---------- Svjetiljka ----------

  const toggleTorch = useCallback(async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;

    try {
      await track.applyConstraints({
        advanced: [{ torch: !torchOn } as MediaTrackConstraintSet],
      });
      setTorchOn((v) => !v);
    } catch {
      setTorchSupported(false);
    }
  }, [torchOn]);

  // ---------- Izračun izvora za crop (object-fit: cover) ----------

  const computeSourceRect = useCallback(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame || video.videoWidth === 0) return null;

    const videoW = video.videoWidth;
    const videoH = video.videoHeight;
    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    // cover: video je skaliran da pokrije viewport, višak odrezan
    const scale = Math.max(viewW / videoW, viewH / videoH);
    const offsetX = (videoW * scale - viewW) / 2;
    const offsetY = (videoH * scale - viewH) / 2;

    const rect = frame.getBoundingClientRect();

    return {
      sx: (rect.left + offsetX) / scale,
      sy: (rect.top + offsetY) / scale,
      sw: rect.width / scale,
      sh: rect.height / scale,
    };
  }, []);

  // ---------- Ocjena oštrine (varijanca gradijenta) ----------

  const sharpnessScore = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const { data } = ctx.getImageData(0, 0, w, h);

    // Siva verzija
    const gray = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const o = i * 4;
      gray[i] = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
    }

    // Suma kvadrata gradijenta — oštrija slika ima jače rubove
    let sum = 0;
    let count = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const gx = gray[i + 1] - gray[i - 1];
        const gy = gray[i + w] - gray[i - w];
        sum += gx * gx + gy * gy;
        count++;
      }
    }
    return sum / count;
  };

  // ---------- Snimanje (burst → najoštriji) ----------

  const capture = useCallback(async () => {
    const video = videoRef.current;
    const source = computeSourceRect();
    if (!video || !source || isCapturing) return;

    setIsCapturing(true);

    try {
      // Mali canvas za ocjenu oštrine
      const scoreW = 160;
      const scoreH = Math.round(scoreW * A4_RATIO);
      const scoreCanvas = document.createElement("canvas");
      scoreCanvas.width = scoreW;
      scoreCanvas.height = scoreH;
      const scoreCtx = scoreCanvas.getContext("2d", {
        willReadFrequently: true,
      })!;

      // Full-res canvas — čuvamo SAMO najbolji frame
      const outW = Math.min(1400, Math.round(source.sw));
      const outH = Math.round(outW * A4_RATIO);
      const bestCanvas = document.createElement("canvas");
      bestCanvas.width = outW;
      bestCanvas.height = outH;
      const bestCtx = bestCanvas.getContext("2d")!;

      let bestScore = -1;

      for (let i = 0; i < BURST_FRAMES; i++) {
        scoreCtx.drawImage(
          video,
          source.sx, source.sy, source.sw, source.sh,
          0, 0, scoreW, scoreH
        );
        const score = sharpnessScore(scoreCtx, scoreW, scoreH);

        if (score > bestScore) {
          bestScore = score;
          bestCtx.drawImage(
            video,
            source.sx, source.sy, source.sw, source.sh,
            0, 0, outW, outH
          );
        }

        if (i < BURST_FRAMES - 1) {
          await new Promise((r) => setTimeout(r, BURST_INTERVAL_MS));
        }
      }

      const blob = await new Promise<Blob | null>((resolve) =>
        bestCanvas.toBlob(resolve, "image/jpeg", 0.92)
      );

      if (blob) {
        capturedBlobRef.current = blob;
        setPreviewUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        setPhase("captured");
      }
    } finally {
      setIsCapturing(false);
    }
  }, [computeSourceRect, isCapturing]);

  const retake = useCallback(() => {
    capturedBlobRef.current = null;
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setPhase("live");
  }, []);

  const confirm = useCallback(async () => {
    const blob = capturedBlobRef.current;
    if (blob) {
      debugSaveScan(blob, "admin-form-scan-camera");
      await onCapture(blob);
    }
  }, [onCapture]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] bg-black">
      {/* Video feed */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* A4 okvir — sve oko njega zatamnjeno */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pb-32 pt-16">
        <div
          ref={frameRef}
          className="relative shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
          style={{
            aspectRatio: `1 / ${A4_RATIO}`,
            width: "min(100%, calc((100dvh - 12rem) / 1.4142))",
            borderRadius: 6,
          }}
        >
          {/* Rub okvira */}
          <div className="absolute inset-0 rounded-md border-2 border-white/80" />

          {/* Snimljena slika preko feeda u fazi potvrde */}
          {phase === "captured" && previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Snimljeni obrazac"
              className="absolute inset-0 h-full w-full rounded-md object-cover"
            />
          )}

          {/* 6 markera — pozicije preslikane s papirnate forme */}
          {phase === "live" &&
            [
              { left: MARKER_INSET, top: MARKER_INSET },
              { right: MARKER_INSET, top: MARKER_INSET },
              { left: MARKER_INSET, bottom: MARKER_INSET },
              { right: MARKER_INSET, bottom: MARKER_INSET },
              { left: MARKER_INSET, middle: true },
              { right: MARKER_INSET, middle: true },
            ].map((m, i) => (
              <div
                key={i}
                className="absolute border-2 border-white bg-transparent"
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

      {/* Vrh: zatvaranje + upozorenja */}
      <div className="absolute inset-x-0 top-0 pt-safe">
        <div className="flex items-start justify-between gap-3 p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori kameru"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 space-y-2">
            {phase === "live" && isDark && !cameraError && (
              <div className="mx-auto flex max-w-xs items-center gap-2 rounded-xl bg-amber-500/90 px-3.5 py-2.5 text-xs font-semibold text-black">
                <Sun className="h-4 w-4 shrink-0" />
                Premalo svjetla — upalite rasvjetu ili priđite prozoru.
              </div>
            )}
          </div>

          {phase === "live" && torchSupported ? (
            <button
              type="button"
              onClick={() => void toggleTorch()}
              aria-label={torchOn ? "Ugasi svjetiljku" : "Upali svjetiljku"}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm active:scale-95",
                torchOn ? "bg-white text-black" : "bg-black/50 text-white"
              )}
            >
              {torchOn ? <Zap className="h-5 w-5" /> : <ZapOff className="h-5 w-5" />}
            </button>
          ) : (
            <div className="h-11 w-11" />
          )}
        </div>

        {phase === "live" && !cameraError && (
          <p className="mx-auto max-w-xs px-4 text-center text-xs text-white/90">
            Poravnajte 6 kvadratića na papiru s okvirima na ekranu
          </p>
        )}

        {phase === "captured" && !isSubmitting && error == null && (
          <p className="mx-auto max-w-xs px-4 text-center text-sm font-semibold text-white">
            Je li obrazac poravnat i tekst čitljiv?
          </p>
        )}

        {/* Greška slanja — unutar kamere, inače je iza nje */}
        {error != null && !isSubmitting && (
          <div className="mx-auto mt-2 max-w-xs rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2.5 backdrop-blur-sm">
            <p className="text-xs font-semibold text-amber-100">
              {describeError(error).title}
            </p>
            <p className="mt-0.5 text-xs text-amber-100/80 text-pretty">
              {describeError(error).message}
            </p>
          </div>
        )}
      </div>

      {/* Greška kamere */}
      {cameraError && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6">
          <div className="mx-auto max-w-sm rounded-2xl bg-black/80 p-5 text-center backdrop-blur-sm">
            <p className="text-sm text-white text-pretty">{cameraError}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 inline-flex min-h-[2.75rem] items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black active:scale-95"
            >
              Zatvori
            </button>
          </div>
        </div>
      )}

      {/* Dno: okidač / potvrda */}
      <div className="absolute inset-x-0 bottom-0 pb-safe">
        <div className="flex items-center justify-center gap-10 p-6">
          {phase === "live" ? (
            <button
              type="button"
              onClick={() => void capture()}
              disabled={isCapturing || Boolean(cameraError)}
              aria-label="Slikaj obrazac"
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20 backdrop-blur-sm transition-transform active:scale-90 disabled:opacity-50"
            >
              {isCapturing ? (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              ) : (
                <span className="h-14 w-14 rounded-full bg-white" />
              )}
            </button>
          ) : (
            <>
              {/* Retake — lijevo, kako je traženo */}
              <button
                type="button"
                onClick={retake}
                disabled={isSubmitting}
                aria-label="Slikaj ponovo"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm active:scale-95 disabled:opacity-50"
              >
                <RotateCcw className="h-6 w-6" />
              </button>

              {/* Zelena kvačica — na mjestu okidača */}
              <button
                type="button"
                onClick={() => void confirm()}
                disabled={isSubmitting}
                aria-label="Potvrdi i pošalji"
                className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform active:scale-90 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <Check className="h-9 w-9" strokeWidth={3} />
                )}
              </button>

              {/* Simetrija s lijevim gumbom */}
              <div className="h-14 w-14" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
