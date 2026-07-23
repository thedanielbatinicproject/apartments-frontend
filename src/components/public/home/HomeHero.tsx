"use client";

import { useLayoutEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { useLanguage } from "@/i18n/language-context";
import { LanguageSwitcherButton } from "@/components/guest/LanguageGate";
import { HeroScene } from "./HeroScene";
import type { TimeOfDayState } from "./time-palette";

// ============================================================
// Hero naslovnice — scenično iskustvo, NE konvencionalni header +
// hero. Nema navigacijske trake: jedini "chrome" je plutajući gumb
// jezika; sve ostalo je živa ilustrirana scena (HeroScene) i velika
// Fraunces tipografija.
//
// Paleta doba dana (tod) i sidra za pticu dolaze iz HomeFlow
// roditelja — hero je jedna od sekcija flowa, a ptica živi na
// razini cijele stranice (FlowBird).
// ============================================================

interface HomeHeroProps {
  tod: TimeOfDayState | null;
  titlePerchRef: React.RefObject<HTMLDivElement | null>;
  lampPerchRef: React.RefObject<HTMLDivElement | null>;
  bollardPerchRef: React.RefObject<HTMLDivElement | null>;
  mooringPerchRef: React.RefObject<HTMLDivElement | null>;
  /** Javlja roditelju da smije aktivirati pticu */
  onEntranceDone: () => void;
}

export function HomeHero({
  tod,
  titlePerchRef,
  lampPerchRef,
  bollardPerchRef,
  mooringPerchRef,
  onEntranceDone,
}: HomeHeroProps) {
  const { dict } = useLanguage();
  const t = dict.home.hero;

  const heroRef = useRef<HTMLElement>(null);
  const entranceRan = useRef(false);
  const ready = tod !== null;

  useLayoutEffect(() => {
    if (!ready || entranceRan.current) return;
    entranceRan.current = true;
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(".hh-reveal", { autoAlpha: 1 });
        requestAnimationFrame(onEntranceDone);
        return;
      }

      gsap.fromTo(
        ".hh-reveal",
        { y: 26, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          delay: 0.35,
          onComplete: onEntranceDone,
        }
      );
    }, hero);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const greeting =
    tod === null
      ? ""
      : tod.greeting === "morning"
        ? t.greetingMorning
        : tod.greeting === "day"
          ? t.greetingDay
          : tod.greeting === "evening"
            ? t.greetingEvening
            : t.greetingNight;

  return (
    <section id="hero" ref={heroRef} className="relative h-[100dvh] overflow-hidden">
      {tod && (
        <HeroScene
          sun={tod.sun}
          moon={tod.moon}
          lampPerchRef={lampPerchRef}
          bollardPerchRef={bollardPerchRef}
          mooringPerchRef={mooringPerchRef}
        />
      )}

      {/* Plutajući odabir jezika — jedini chrome na naslovnici */}
      <div className="absolute right-4 top-4 z-30 pt-safe">
        <div className="rounded-full border border-white/25 bg-white/15 shadow-sm backdrop-blur-md">
          <LanguageSwitcherButton />
        </div>
      </div>

      {/* Tipografski sadržaj */}
      <div className="relative z-20 flex h-full flex-col items-center px-gutter pt-[15dvh] text-center sm:pt-[17dvh]">
        <p className="hh-reveal text-[clamp(1.05rem,3.5vw,1.5rem)] italic [color:var(--hs-text-soft)] [font-family:var(--font-display)]">
          {greeting}
        </p>

        <div className="relative mt-3">
          <span className="hh-reveal block text-[clamp(0.7rem,2.2vw,0.95rem)] font-semibold uppercase tracking-[0.42em] [color:var(--hs-text-soft)]">
            Apartments
          </span>
          <h1 className="hh-reveal mt-1 text-[clamp(3.4rem,17vw,8rem)] font-semibold leading-[0.95] tracking-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
            Šibenik
          </h1>
          {/* Sidro za pticu — vrh naslova */}
          <div
            ref={titlePerchRef}
            className="absolute -top-1 right-[14%] h-px w-px"
          />
        </div>

        <p className="hh-reveal mt-5 max-w-md text-[clamp(0.95rem,3vw,1.15rem)] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
          {t.tagline}
        </p>
      </div>

      {/* Poziv na istraživanje */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-safe">
        <div className="hh-reveal mb-5 flex flex-col items-center gap-1">
          <span
            className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-white/90"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.35)" }}
          >
            {t.scrollCue}
          </span>
          <ChevronDown
            className="h-5 w-5 animate-bounce text-white/90"
            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" }}
          />
        </div>
      </div>
    </section>
  );
}
