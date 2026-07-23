"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// Scroll-otkrivanje sadržaja sekcije — sve elemente s klasom
// ".fs-reveal" unutar sekcije jednom otkrije (y+fade stagger) kad
// sekcija uđe u viewport. prefers-reduced-motion: sve odmah vidljivo,
// bez triggera. gsap.context čisti SVE (uklj. ScrollTrigger) na
// unmount.
// ============================================================

export function useReveal(
  sectionRef: React.RefObject<HTMLElement | null>
): void {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".fs-reveal",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}

/**
 * Blaga scroll-paralaksa dekorativnog sloja (transform-only, scrub).
 * `distance` px koliko se sloj pomakne dok sekcija prolazi viewportom.
 */
export function useParallax(
  sectionRef: React.RefObject<HTMLElement | null>,
  selector: string,
  distance: number
): void {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { y: -distance / 2 },
        {
          y: distance / 2,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, selector, distance]);
}
