"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Play, RotateCcw } from "lucide-react";

// SSR-safe "prefers-reduced-motion" bez setState-a u efektu (isti obrazac
// kao useMounted() u intranet InfoTooltip.tsx) — server snapshot je `null`
// (nema window-a), pa se statični fallback prikaže dok se na klijentu ne
// izmjeri stvarna preferenca; usput prati i live promjenu OS postavke.
function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot(): boolean | null {
  return null;
}
function useReducedMotionPreference(): boolean | null {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

// ============================================================
// "Let galeba" — igrivi recap znamenitosti iznad. Obala se sama
// polako odmotava ispod galeba KONSTANTNOM brzinom — tap/klik/
// razmaknica daju ISKLJUČIVO okomiti "zamah" (uzlet), nikad ne diraju
// vodoravno kretanje (nema "trzaja" naprijed-natrag). Znamenitosti su
// raspoređene na različitim visinama i OSTAJU SKRIVENE (samo suptilna
// pulsirajuća točka, bez naziva/opisa) dok ih galeb stvarno ne
// "pogodi" — treba proći kroz njih i vodoravno I okomito, ne samo
// mimoići na bilo kojoj visini. Pogođena znamenitost se otključava
// trajno u dnevniku ispod; ako se promaši, ostaje skrivena do replaya.
//
// Fizika je čisti rAF + direktna mutacija stila preko refova (BEZ
// setState po frameu) — React state se diže samo kad se nova
// znamenitost otključa (par puta po igri) ili na completion/replay.
// Petlja se pauzira IntersectionObserverom kad sekcija nije u
// vidokrugu. prefers-reduced-motion: bez animacije, sve znamenitosti
// odmah vidljive kao obična lista (accessible fallback).
// ============================================================

export interface QuestLandmark {
  id: string;
  label: string;
  fact: string;
}

interface SeagullQuestLabels {
  eyebrow: string;
  title: string;
  instruction: string;
  start: string;
  /** Predložak s "{n}" i "{total}" tokenima */
  progress: string;
  /** Predložak s "{n}" tokenom — naslov dok znamenitost nije otkrivena */
  lockedLabel: string;
  lockedHint: string;
  replay: string;
  complete: {
    title: string;
    text: string;
  };
}

interface SeagullQuestProps {
  landmarks: QuestLandmark[];
  labels: SeagullQuestLabels;
}

const SEGMENT_PX = 260;
const BIRD_SCREEN_FRACTION = 0.2;
const GRAVITY = 480;
const FLAP_IMPULSE = -230;
const MAX_FALL_SPEED = 340;
const BASE_SCROLL_SPEED = 62;
/** Koliko blizu (vodoravno, px) galeb mora biti da bi "prošao kroz" znamenitost */
const X_TOLERANCE_PX = 55;
/** Koliko blizu (okomito, udio visine okvira) galeb mora biti — stvarno gađanje visine, ne samo prolazak */
const Y_TOLERANCE_FRACTION = 0.15;
/** Raspored visina znamenitosti (udio visine okvira) — namjerno cik-cak, ne sve na dnu */
const Y_PATTERN = [0.3, 0.68, 0.42, 0.72, 0.32, 0.6, 0.46, 0.7, 0.38, 0.64];

export function SeagullQuest({ landmarks, labels }: SeagullQuestProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);

  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const reducedMotion = useReducedMotionPreference();
  const [replayTick, setReplayTick] = useState(0);

  const totalDistance = (landmarks.length + 1) * SEGMENT_PX;

  useEffect(() => {
    if (reducedMotion !== false || !started) return;
    const frame = frameRef.current;
    const world = worldRef.current;
    const bird = birdRef.current;
    if (!frame || !world || !bird) return;

    let raf = 0;
    let running = false;
    let visible = false;
    let lastTime = 0;

    let worldOffset = 0;
    let birdY = 0.5; // frakcija visine okvira
    let velocity = 0;
    const collectedIds = new Set<string>();
    let done = false;

    const frameSize = () => frame.getBoundingClientRect();

    const applyBirdTilt = () => {
      const tilt = Math.max(-28, Math.min(50, velocity / 8));
      bird.style.transform = `translateY(-50%) rotate(${tilt}deg)`;
    };

    const reset = () => {
      worldOffset = 0;
      birdY = 0.5;
      velocity = 0;
      collectedIds.clear();
      done = false;
      lastTime = 0;
      setCollected(new Set());
      setCompleted(false);
      world.style.transform = "translateX(0px)";
      const rect = frameSize();
      bird.style.top = `${birdY * rect.height}px`;
      applyBirdTilt();
    };
    reset();

    const flap = () => {
      if (done) return;
      // SAMO okomiti impuls — vodoravno kretanje je uvijek isključivo
      // BASE_SCROLL_SPEED, tap ga nikad ne smije "trznuti".
      velocity = FLAP_IMPULSE;
    };

    const onPointerDown = () => flap();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    };
    frame.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    const tick = (time: number) => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      if (!lastTime) {
        lastTime = time;
        return;
      }
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;
      if (done) return;

      const rect = frameSize();
      const birdSizePx = rect.height * 0.16;

      velocity = Math.min(MAX_FALL_SPEED, velocity + GRAVITY * dt);
      let birdYPx = birdY * rect.height + velocity * dt;
      const minY = birdSizePx * 0.6;
      const maxY = rect.height - birdSizePx * 0.6;
      if (birdYPx < minY) {
        birdYPx = minY;
      } else if (birdYPx > maxY) {
        birdYPx = maxY;
        velocity = 0;
      }
      birdY = birdYPx / rect.height;

      worldOffset += BASE_SCROLL_SPEED * dt;

      const birdScreenX = rect.width * BIRD_SCREEN_FRACTION;
      const yToleranceLo = rect.height * Y_TOLERANCE_FRACTION;
      const newlyCollected: string[] = [];
      landmarks.forEach((landmark, i) => {
        if (collectedIds.has(landmark.id)) return;
        const worldX = (i + 1) * SEGMENT_PX;
        const screenX = worldX - worldOffset;
        const landmarkYPx = Y_PATTERN[i % Y_PATTERN.length] * rect.height;
        // Stvarni "prolazak kroz" — mora biti blizu I vodoravno I okomito,
        // ne samo poravnat po X bez obzira na visinu leta.
        const withinX = Math.abs(screenX - birdScreenX) <= X_TOLERANCE_PX;
        const withinY = Math.abs(birdYPx - landmarkYPx) <= yToleranceLo;
        if (withinX && withinY) {
          collectedIds.add(landmark.id);
          newlyCollected.push(landmark.id);
        }
      });

      if (worldOffset >= totalDistance) {
        done = true;
        setCompleted(true);
      }

      bird.style.top = `${birdYPx}px`;
      applyBirdTilt();
      world.style.transform = `translateX(${-worldOffset}px)`;

      if (newlyCollected.length > 0) {
        setCollected(new Set(collectedIds));
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.2 }
    );
    observer.observe(frame);

    const onResize = () => {
      const rect = frameSize();
      bird.style.top = `${birdY * rect.height}px`;
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      observer.disconnect();
      frame.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, started, replayTick]);

  const total = landmarks.length;

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="block text-xs font-semibold uppercase tracking-[0.28em] [color:var(--hs-accent)]">
          {labels.eyebrow}
        </span>
        <h2 className="mt-2 text-[clamp(1.75rem,6vw,2.5rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {labels.title}
        </h2>
        {reducedMotion === false && (
          <p className="mt-3 text-sm [color:var(--hs-text-soft)]">
            {labels.instruction}
          </p>
        )}
      </div>

      {reducedMotion !== false ? (
        // Statični fallback (prefers-reduced-motion ILI još nemontirano) —
        // sav sadržaj odmah dostupan, bez ijedne animacije.
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {landmarks.map((landmark) => (
            <li
              key={landmark.id}
              className="rounded-2xl p-4"
              style={{
                background: "var(--hs-card)",
                border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
              }}
            >
              <p className="text-sm font-semibold [color:var(--hs-text-strong)]">
                {landmark.label}
              </p>
              <p className="mt-1 text-sm [color:var(--hs-text-soft)]">{landmark.fact}</p>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-center">
            <span
              className="rounded-full px-4 py-1.5 text-sm font-semibold [color:var(--hs-text-strong)]"
              style={{ background: "color-mix(in oklab, var(--hs-accent) 14%, transparent)" }}
            >
              {labels.progress
                .replace("{n}", String(collected.size))
                .replace("{total}", String(total))}
            </span>
          </div>

          <div
            ref={frameRef}
            className="relative mt-4 aspect-[16/10] w-full cursor-pointer touch-none select-none overflow-hidden rounded-3xl sm:aspect-[21/9]"
            style={{
              background:
                "linear-gradient(to bottom, var(--hs-sky-mid) 0%, var(--hs-sky-low) 55%, var(--hs-sea-far) 55%, var(--hs-sea-near) 100%)",
            }}
            role="button"
            tabIndex={0}
            aria-label={labels.instruction}
          >
            {/* Sunce — dekor */}
            <div
              className="absolute right-[10%] top-[14%] h-10 w-10 rounded-full sm:h-14 sm:w-14"
              style={{
                background: "var(--hs-sun-core)",
                boxShadow: "0 0 30px 6px var(--hs-sun-glow)",
              }}
            />

            {/* Svijet koji se odmotava ispod galeba */}
            <div
              ref={worldRef}
              className="absolute bottom-0 left-0 top-0"
              style={{ width: `${totalDistance + 400}px`, willChange: "transform" }}
            >
              {landmarks.map((landmark, i) => {
                const isCollected = collected.has(landmark.id);
                const yFraction = Y_PATTERN[i % Y_PATTERN.length];
                return (
                  <div
                    key={landmark.id}
                    className="absolute flex -translate-y-1/2 flex-col items-center gap-1.5"
                    style={{ left: `${(i + 1) * SEGMENT_PX}px`, top: `${yFraction * 100}%` }}
                  >
                    {isCollected ? (
                      <>
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold sm:h-12 sm:w-12"
                          style={{
                            background: "var(--hs-accent)",
                            color: "#fff8ec",
                            boxShadow: "0 0 0 6px color-mix(in oklab, var(--hs-accent) 20%, transparent)",
                          }}
                        >
                          {i + 1}
                        </div>
                        <span
                          className="max-w-[6rem] rounded-full px-2 py-0.5 text-center text-[0.65rem] font-semibold leading-tight"
                          style={{ background: "rgba(20,20,20,0.35)", color: "#fff8ec" }}
                        >
                          {landmark.label}
                        </span>
                      </>
                    ) : (
                      // Neotkriveno — samo suptilna, "misteriozna" točka, bez naziva
                      <div
                        className="hs-anim hs-quest-dot h-4 w-4 rounded-full sm:h-5 sm:w-5"
                        style={{
                          background: "rgba(255,255,255,0.4)",
                          boxShadow: "0 0 0 5px rgba(255,255,255,0.12)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Galeb — fiksan vodoravno, giba se okomito */}
            <div
              ref={birdRef}
              className="absolute -translate-y-1/2"
              style={{ left: `${BIRD_SCREEN_FRACTION * 100}%`, willChange: "transform, top" }}
            >
              <svg
                viewBox="0 0 76 56"
                className="h-10 w-14 -translate-x-1/2 drop-shadow-[0_3px_6px_rgba(20,30,40,0.3)] sm:h-12 sm:w-16"
              >
                <path d="M16 30 L3 25 L8 37 Z" fill="#dde4ea" />
                <g className="hs-anim hs-quest-wing-far">
                  <path d="M36 22 Q22 4 6 8 Q18 16 32 25 Z" fill="#b9c3cc" />
                </g>
                <path
                  d="M13 33 Q20 24 34 23 Q48 22 56 28 L56 34 Q50 42 38 43 Q23 44 13 33 Z"
                  fill="#f7f9fa"
                />
                <circle cx="57" cy="26" r="8.5" fill="#f7f9fa" />
                <circle cx="59.5" cy="24" r="1.4" fill="#1f2933" />
                <path d="M65 25.5 L74 28 L65 30 Q66.5 28 65 25.5 Z" fill="#f0a03c" />
                <g className="hs-anim hs-quest-wing-near">
                  <path d="M38 24 Q28 2 10 5 Q20 15 34 27 Z" fill="#eef2f5" />
                </g>
              </svg>
            </div>

            {completed && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 p-6 text-center backdrop-blur-sm">
                <p className="text-xl font-semibold text-white [font-family:var(--font-display)]">
                  {labels.complete.title}
                </p>
                <p className="max-w-sm text-sm text-white/85">{labels.complete.text}</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReplayTick((n) => n + 1);
                  }}
                  className="mt-2 inline-flex min-h-[2.75rem] items-center gap-2 rounded-full px-5 text-sm font-bold text-white"
                  style={{ background: "var(--hs-accent)" }}
                >
                  <RotateCcw className="h-4 w-4" />
                  {labels.replay}
                </button>
              </div>
            )}

            {!started && (
              // Ne kreće automatski — bez ovoga korisnik ne stigne shvatiti
              // da je igra počela prije nego galeb proleti prvu znamenitost.
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 p-6 text-center backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStarted(true);
                  }}
                  className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full px-6 text-base font-bold text-white shadow-lg"
                  style={{ background: "var(--hs-accent)" }}
                >
                  <Play className="h-5 w-5" />
                  {labels.start}
                </button>
              </div>
            )}
          </div>

          {/* Dnevnik — činjenice ostaju čitljive i nakon igranja */}
          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {landmarks.map((landmark, i) => {
              const isCollected = collected.has(landmark.id);
              return (
                <li
                  key={landmark.id}
                  className="rounded-xl px-3.5 py-2.5 text-sm transition-opacity duration-500"
                  style={{
                    background: "var(--hs-card)",
                    border: "1px solid color-mix(in oklab, var(--hs-text-soft) 15%, transparent)",
                    opacity: isCollected ? 1 : 0.4,
                  }}
                >
                  <span className="font-semibold [color:var(--hs-text-strong)]">
                    {isCollected ? landmark.label : labels.lockedLabel.replace("{n}", String(i + 1))}:{" "}
                  </span>
                  <span className={!isCollected ? "italic [color:var(--hs-text-soft)]" : "[color:var(--hs-text-soft)]"}>
                    {isCollected ? landmark.fact : labels.lockedHint}
                  </span>
                </li>
              );
            })}
          </ul>

          <style>{`
            @keyframes hsQuestFlapNear {
              0%, 100% { transform: rotate(8deg); }
              50% { transform: rotate(-34deg); }
            }
            @keyframes hsQuestFlapFar {
              0%, 100% { transform: rotate(5deg); }
              50% { transform: rotate(-24deg); }
            }
            .hs-quest-wing-near { transform-origin: 38px 24px; animation: hsQuestFlapNear 0.45s ease-in-out infinite; }
            .hs-quest-wing-far { transform-origin: 36px 22px; animation: hsQuestFlapFar 0.45s ease-in-out infinite; animation-delay: 0.03s; }
            @keyframes hsQuestPulse {
              0%, 100% { opacity: 0.5; transform: scale(0.85); }
              50% { opacity: 1; transform: scale(1.1); }
            }
            .hs-quest-dot { animation: hsQuestPulse 1.6s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .hs-quest-wing-near, .hs-quest-wing-far, .hs-quest-dot { animation: none !important; }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
