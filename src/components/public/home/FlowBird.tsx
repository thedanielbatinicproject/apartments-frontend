"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ============================================================
// Galebica koja živi na CIJELOJ naslovnici — apsolutno pozicionirana
// u flow kontejneru (dio svijeta stranice, ne zalijepljena za ekran)
// i potpuno NEOVISNA o scrollu: nikakav scrub, nikakvo vezanje leta
// uz smjer/količinu scrolla.
//
// Ponašanje "želi biti na ekranu":
//  - Dok korisnik scrolla, ptica NE radi ništa (brzi scroll je time
//    automatski pokriven — po specifikaciji tada "neka samo ostane").
//  - ~300 ms nakon što se scroll smiri provjeri: je li moje sidro još
//    u viewportu? Ako nije, odleti (vremenska animacija, 1-2.5 s) na
//    najbliže VIDLJIVO sidro. Ako nijedno sidro nije vidljivo, ostani
//    gdje jesi — nikad teleportiranje, nikad glitch.
//  - Na sidru povremeno radi geste ili preleti na drugo vidljivo sidro.
//
// Sidra (perches) su nevidljivi markeri raspoređeni po sekcijama:
// vrh naslova, lanterna i bitva na rivi (hero), naslov apartmana,
// tvrđava (o-Šibeniku teaser), bitva u podnožju.
//
// prefers-reduced-motion: statična ptica na prvom sidru, bez tajmera.
// ============================================================

interface Point {
  x: number;
  y: number;
}

function quadBezier(p0: Point, p1: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

const IDLE_MIN_MS = 5000;
const IDLE_MAX_MS = 10000;
const GESTURE_CHANCE = 0.35;
/** Vjerojatnost "kruga" — poleti i vrati se na isto sidro */
const LAP_CHANCE = 0.2;
/** Koliko ms tišine nakon zadnjeg scroll eventa = "scroll se smirio" */
const SETTLE_MS = 300;
/** Rub viewporta unutar kojeg se sidro smatra "na ekranu" */
const EDGE_PX = 80;

interface FlowBirdProps {
  /** Koordinatni prostor — korijen cijelog flowa (position: relative) */
  containerRef: React.RefObject<HTMLDivElement | null>;
  perches: React.RefObject<HTMLDivElement | null>[];
  /** Ptica kreće tek kad ulazna animacija hero-a završi */
  active: boolean;
}

export function FlowBird({ containerRef, perches, active }: FlowBirdProps) {
  const birdRef = useRef<HTMLDivElement>(null);
  const nearWingRef = useRef<SVGGElement>(null);
  const farWingRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const feetRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!active) return;
    const bird = birdRef.current;
    const container = containerRef.current;
    const nearWing = nearWingRef.current;
    const farWing = farWingRef.current;
    const head = headRef.current;
    const feet = feetRef.current;
    if (!bird || !container || !nearWing || !farWing || !head || !feet) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let flying = false;
    let pendingRecheck = false;
    let perchIndex = -1;
    let idleTimer: number | undefined;
    let settleTimer: number | undefined;
    let resizeTimer: number | undefined;

    gsap.set(nearWing, { svgOrigin: "38 24" });
    gsap.set(farWing, { svgOrigin: "36 22" });
    gsap.set(head, { svgOrigin: "54 30" });

    const flap = gsap.timeline({
      paused: true,
      repeat: -1,
      yoyo: true,
      defaults: { duration: 0.13, ease: "sine.inOut" },
    });
    flap
      .fromTo(nearWing, { rotation: 14 }, { rotation: -38 }, 0)
      .fromTo(farWing, { rotation: 10 }, { rotation: -30 }, 0.02);

    /** Točka sidra u koordinatama flow kontejnera (mjeri se svježe) */
    const perchPoint = (index: number): Point | null => {
      const el = perches[index]?.current;
      if (!el) return null;
      const c = container.getBoundingClientRect();
      const p = el.getBoundingClientRect();
      return {
        x: p.left + p.width / 2 - c.left,
        y: p.top + p.height / 2 - c.top,
      };
    };

    /** Je li točka (u koordinatama kontejnera) trenutno u viewportu */
    const isOnScreen = (pt: Point): boolean => {
      const c = container.getBoundingClientRect();
      const screenY = pt.y + c.top;
      const screenX = pt.x + c.left;
      return (
        screenY > EDGE_PX &&
        screenY < window.innerHeight - EDGE_PX &&
        screenX > 0 &&
        screenX < window.innerWidth
      );
    };

    const visiblePerches = (): { index: number; pt: Point }[] =>
      perches
        .map((_, index) => ({ index, pt: perchPoint(index) }))
        .filter((c): c is { index: number; pt: Point } =>
          Boolean(c.pt && isOnScreen(c.pt))
        );

    const standTransform = (pt: Point): Point => {
      const rect = bird.getBoundingClientRect();
      const w = rect.width || 52;
      const h = rect.height || 40;
      return { x: pt.x - w * 0.5, y: pt.y - h * 0.89 };
    };

    const foldWings = () => {
      flap.pause();
      gsap.to(nearWing, { rotation: 7, scaleY: 0.94, duration: 0.35, ease: "power2.out" });
      gsap.to(farWing, { rotation: -4, scaleY: 0.94, duration: 0.35, ease: "power2.out" });
      gsap.to(feet, { autoAlpha: 1, duration: 0.2 });
    };

    const spreadWings = () => {
      gsap.set([nearWing, farWing], { scaleY: 1 });
      gsap.to(feet, { autoAlpha: 0, duration: 0.15 });
      flap.play();
    };

    const scheduleIdle = () => {
      if (disposed) return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(
        () => {
          if (disposed || flying) return;
          if (document.hidden) return scheduleIdle();

          const candidates = visiblePerches().filter(
            (c) => c.index !== perchIndex
          );
          const roll = Math.random();
          if (roll < GESTURE_CHANCE) {
            gesture();
          } else if (roll < GESTURE_CHANCE + LAP_CHANCE || candidates.length === 0) {
            // Krug: poleti, opiši luk i vrati se na isto sidro
            flyLap();
          } else {
            const pick =
              candidates[Math.floor(Math.random() * candidates.length)];
            flyTo(pick.index);
          }
        },
        IDLE_MIN_MS + Math.random() * (IDLE_MAX_MS - IDLE_MIN_MS)
      );
    };

    const gesture = () => {
      const tl = gsap.timeline({ onComplete: scheduleIdle });
      tl.to(head, { rotation: -14, duration: 0.28, ease: "power2.out" })
        .to(head, { rotation: 0, duration: 0.3, ease: "power2.inOut" }, "+=0.45")
        .to(bird, { y: "-=2", duration: 0.09, yoyo: true, repeat: 3 }, "+=0.1");
    };

    /** Krug — poleti u stranu, opiši petlju i sleti natrag na isto sidro */
    const flyLap = () => {
      if (perchIndex < 0) return scheduleIdle();
      const home = perchPoint(perchIndex);
      if (!home) return scheduleIdle();

      const from: Point = {
        x: Number(gsap.getProperty(bird, "x")),
        y: Number(gsap.getProperty(bird, "y")),
      };
      const side = Math.random() < 0.5 ? -1 : 1;
      const control: Point = {
        x: from.x + side * (120 + Math.random() * 90),
        y: from.y - (130 + Math.random() * 60),
      };

      flying = true;
      window.clearTimeout(idleTimer);
      gsap.set(bird, { scaleX: side });
      spreadWings();

      const state = { t: 0 };
      gsap.to(state, {
        t: 1,
        duration: 1.7,
        ease: "power1.inOut",
        onUpdate: () => {
          const pos = quadBezier(from, control, from, state.t);
          // Nakon vrha petlje okreni se prema "kući"
          if (state.t > 0.55) gsap.set(bird, { scaleX: -side });
          const level = Math.sin(Math.PI * state.t);
          gsap.set(bird, { x: pos.x, y: pos.y, rotation: -8 * side * level });
        },
        onComplete: () => {
          flying = false;
          gsap.set(bird, { rotation: 0 });
          foldWings();
          gsap.fromTo(
            bird,
            { y: from.y - 5 },
            { y: from.y, duration: 0.5, ease: "bounce.out" }
          );
          if (pendingRecheck) {
            pendingRecheck = false;
            window.clearTimeout(settleTimer);
            settleTimer = window.setTimeout(settle, 150);
          }
          scheduleIdle();
        },
      });
    };

    const flyTo = (index: number) => {
      const target = perchPoint(index);
      if (!target) return scheduleIdle();

      const from: Point = {
        x: Number(gsap.getProperty(bird, "x")),
        y: Number(gsap.getProperty(bird, "y")),
      };
      const to = standTransform(target);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 8) {
        perchIndex = index;
        return scheduleIdle();
      }

      flying = true;
      window.clearTimeout(idleTimer);
      const facingLeft = dx < 0;
      gsap.set(bird, { scaleX: facingLeft ? -1 : 1 });
      spreadWings();

      const lift = Math.min(180, Math.max(48, dist * 0.3));
      const control: Point = {
        x: (from.x + to.x) / 2,
        y: Math.min(from.y, to.y) - lift,
      };

      const state = { t: 0 };
      gsap.to(state, {
        t: 1,
        duration: Math.min(2.5, Math.max(1, dist / 420)),
        ease: "power2.inOut",
        onUpdate: () => {
          const pos = quadBezier(from, control, to, state.t);
          const ahead = quadBezier(from, control, to, Math.min(1, state.t + 0.02));
          const slope =
            (Math.atan2(ahead.y - pos.y, Math.abs(ahead.x - pos.x)) * 180) /
            Math.PI;
          const level = 1 - state.t * state.t;
          const bank =
            Math.max(-20, Math.min(20, slope)) * level * (facingLeft ? -1 : 1);
          gsap.set(bird, { x: pos.x, y: pos.y, rotation: bank });
        },
        onComplete: () => {
          flying = false;
          perchIndex = index;
          gsap.set(bird, { rotation: 0 });
          foldWings();
          gsap.fromTo(
            bird,
            { y: to.y - 5 },
            { y: to.y, duration: 0.5, ease: "bounce.out" }
          );
          if (pendingRecheck) {
            pendingRecheck = false;
            window.clearTimeout(settleTimer);
            settleTimer = window.setTimeout(settle, 150);
          }
          scheduleIdle();
        },
      });
    };

    /** Scroll se smirio — ako je trenutno sidro van ekrana, doleti na vidljivo */
    const settle = () => {
      if (disposed) return;
      if (flying) {
        pendingRecheck = true;
        return;
      }
      const current = perchIndex >= 0 ? perchPoint(perchIndex) : null;
      if (current && isOnScreen(current)) return;

      const candidates = visiblePerches();
      if (candidates.length === 0) return; // spec: nemoguće izvesti → ostani

      const c = container.getBoundingClientRect();
      const viewportCenterY = -c.top + window.innerHeight / 2;
      candidates.sort(
        (a, b) =>
          Math.abs(a.pt.y - viewportCenterY) - Math.abs(b.pt.y - viewportCenterY)
      );
      flyTo(candidates[0].index);
    };

    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_MS);
    };

    // ---------- Start ----------
    if (prefersReducedMotion) {
      const pt = perchPoint(0);
      if (pt) {
        const pos = standTransform(pt);
        gsap.set(bird, { x: pos.x, y: pos.y, autoAlpha: 1 });
        gsap.set(nearWing, { rotation: 7, scaleY: 0.94 });
        gsap.set(farWing, { rotation: -4, scaleY: 0.94 });
        perchIndex = 0;
      }
      return;
    }

    // Ulazak: izvan ekrana lijevo, u visini trenutnog viewporta, pa na
    // najbliže VIDLJIVO sidro (refresh usred stranice → ne leti u hero)
    const containerTop = container.getBoundingClientRect().top;
    gsap.set(bird, {
      x: -90,
      y: -containerTop + window.innerHeight * 0.32,
      autoAlpha: 1,
    });
    const entranceDelay = window.setTimeout(() => {
      const candidates = visiblePerches();
      flyTo(candidates.length > 0 ? candidates[0].index : 0);
    }, 250);

    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (disposed || flying || perchIndex < 0) return;
        const pt = perchPoint(perchIndex);
        if (pt) {
          const pos = standTransform(pt);
          gsap.set(bird, { x: pos.x, y: pos.y });
        }
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      window.clearTimeout(idleTimer);
      window.clearTimeout(settleTimer);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(entranceDelay);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      flap.kill();
      gsap.killTweensOf([bird, nearWing, farWing, head, feet]);
    };
  }, [active, containerRef, perches]);

  return (
    <div
      ref={birdRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-40 w-[clamp(3.3rem,8vw,4.5rem)] opacity-0 drop-shadow-[0_3px_6px_rgba(20,30,40,0.25)]"
    >
      <svg viewBox="0 0 76 56" className="h-auto w-full">
        {/* Rep */}
        <path d="M16 30 L3 25 L8 37 Z" fill="#dde4ea" />

        {/* Daljnje krilo (iza tijela) */}
        <g ref={farWingRef}>
          <path d="M36 22 Q22 4 6 8 Q18 16 32 25 Z" fill="#b9c3cc" />
        </g>

        {/* Tijelo */}
        <path
          d="M13 33 Q20 24 34 23 Q48 22 56 28 L56 34 Q50 42 38 43 Q23 44 13 33 Z"
          fill="#f7f9fa"
        />
        <path d="M26 26 Q38 22 50 27 Q40 25.5 28 27.5 Z" fill="#d9e0e6" />

        {/* Glava + kljun */}
        <g ref={headRef}>
          <circle cx="57" cy="26" r="8.5" fill="#f7f9fa" />
          <circle cx="59.5" cy="24" r="1.4" fill="#1f2933" />
          <path d="M65 25.5 L74 28 L65 30 Q66.5 28 65 25.5 Z" fill="#f0a03c" />
        </g>

        {/* Bliže krilo */}
        <g ref={nearWingRef}>
          <path d="M38 24 Q28 2 10 5 Q20 15 34 27 Z" fill="#eef2f5" />
          <path d="M14 6 Q24 13 32 23 Q21 16 11 8 Z" fill="#c9d2da" />
        </g>

        {/* Noge — vidljive samo kad sjedi */}
        <g ref={feetRef}>
          <path
            d="M32 42 L31 50 M31 50 L27.5 50 M31 50 L34.5 50 M41 42 L41 50 M41 50 L37.5 50 M41 50 L44.5 50"
            stroke="#f0a03c"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
