"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTimeOfDay } from "./useTimeOfDay";
import { StoneDefs } from "./StoneDefs";
import { HomeHero } from "./HomeHero";
import { ApartmentsFlowSection } from "./ApartmentsFlowSection";
import { AboutFlowSection } from "./AboutFlowSection";
import { ContactFlowSection } from "./ContactFlowSection";
import { FlowBird } from "./FlowBird";
import {
  saveHomeFlowSection,
  loadHomeFlowSection,
} from "@/lib/home-flow-session";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// Naslovnica kao FLOW — jedan kontinuirani scroll kroz 4 sekcije
// (hero → apartmani → o-Šibeniku → kontakt/footer), de facto SPA
// bez ruta, s pozicijom koja preživljava refresh.
//
//  - Paleta doba dana (--hs-*) živi OVDJE na korijenu, pa cijela
//    stranica (ne samo hero) diše istim svjetlom kroz dan.
//  - Lenis daje smooth scroll (namjerno blaga inercija, duration
//    0.9), pogonjen GSAP tickerom da ScrollTrigger animacije čitaju
//    istu poziciju koju korisnik vidi. prefers-reduced-motion ga
//    potpuno gasi (nativni scroll).
//  - Pozicija: scroll-listener (rAF-throttled, geometrijski izračun —
//    ne IntersectionObserver, vidi komentar niže zašto) pamti zadnju
//    sekciju u fokusu (localStorage, TTL 6h); na povratku se skoči na
//    nju TRENUTNO, prije nego Lenis preuzme — refresh djeluje kao
//    "nisam ni otišao".
//  - FlowBird (galebica) živi iznad svega, potpuno neovisna o
//    scrollu — vidi FlowBird.tsx.
// ============================================================

const SECTION_IDS = ["hero", "apartmani", "o-sibeniku", "kontakt"] as const;

export function HomeFlow() {
  const tod = useTimeOfDay();
  const flowRef = useRef<HTMLDivElement>(null);

  const apartmentsSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);

  // Sidra za pticu, redom kroz stranicu
  const heroTitlePerchRef = useRef<HTMLDivElement>(null);
  const heroLampPerchRef = useRef<HTMLDivElement>(null);
  const heroBollardPerchRef = useRef<HTMLDivElement>(null);
  const heroMooringPerchRef = useRef<HTMLDivElement>(null);
  const apartmentsPerchRef = useRef<HTMLDivElement>(null);
  const olivePerchRef = useRef<HTMLDivElement>(null);
  const fortressPerchRef = useRef<HTMLDivElement>(null);
  const footerBollardPerchRef = useRef<HTMLDivElement>(null);
  const footerBrandPerchRef = useRef<HTMLDivElement>(null);

  const perches = useMemo(
    () => [
      heroTitlePerchRef,
      heroLampPerchRef,
      heroBollardPerchRef,
      heroMooringPerchRef,
      apartmentsPerchRef,
      olivePerchRef,
      fortressPerchRef,
      footerBollardPerchRef,
      footerBrandPerchRef,
    ],
    []
  );

  const [birdActive, setBirdActive] = useState(false);
  const onEntranceDone = useCallback(() => setBirdActive(true), []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 1) Povratak na zapamćenu sekciju — TRENUTNO, bez animacije
    const stored = loadHomeFlowSection();
    if (stored && stored !== "hero") {
      requestAnimationFrame(() => {
        document
          .getElementById(stored)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }

    // 2) Lenis — "buttery" ali ne tromo; reduced-motion = nativni scroll
    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 0.9,
        smoothWheel: true,
        touchMultiplier: 1.4,
      });
      lenis.on("scroll", ScrollTrigger.update);
      tickerCallback = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // 3) Pamćenje sekcije u fokusu — izravan geometrijski izračun na
    // svaki scroll (rAF-throttled), NE IntersectionObserver. Observer
    // šalje samo elemente čiji se presjek promijenio OTKAD je zadnji
    // put okinuo — brz povratak na sam vrh zna stići prije nego okine
    // za "hero", pa ostane zapisana stara sekcija (i idući refresh ili
    // klik na "Home" skoči na nju). Ovo umjesto toga uvijek ODMAH
    // izračuna i spremi trenutno stanje, bez oslanjanja na to hoće li
    // i kad browser odluči okinuti observer callback.
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    let scheduled = false;
    const updateCurrentSection = () => {
      scheduled = false;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = section;
        }
      }
      if (current) saveHomeFlowSection(current.id);
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateCurrentSection);
    };

    updateCurrentSection();
    window.addEventListener("scroll", onScroll, { passive: true });

    // 4) Fraunces se učitava s display:"swap" — dok se ne zamijeni s
    // fallback fonta, naslovi u sekcijama ispod heroa mijenjaju visinu
    // (drukčiji metrics), što pomakne sve ispod. ScrollTrigineri za
    // .fs-reveal su do tog trenutka već izmjereni s POGREŠNIM pozicijama
    // sekcija — na sporijim (mobilnim) mrežama font zna stići i NAKON
    // toga, pa "top 78%" okidač ostane zauvijek pogrešno postavljen i
    // tekst se nikad ne otkrije. Refresh nakon fonts.ready ispravlja to.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onScroll);
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      lenis?.destroy();
    };
  }, []);

  const ready = tod !== null;

  return (
    <div
      ref={flowRef}
      style={{
        ...(tod ? (tod.cssVars as React.CSSProperties) : undefined),
        opacity: ready ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
      className="relative"
    >
      <StoneDefs />

      <HomeHero
        tod={tod}
        titlePerchRef={heroTitlePerchRef}
        lampPerchRef={heroLampPerchRef}
        bollardPerchRef={heroBollardPerchRef}
        mooringPerchRef={heroMooringPerchRef}
        onEntranceDone={onEntranceDone}
      />

      <ApartmentsFlowSection
        sectionRef={apartmentsSectionRef}
        perchRef={apartmentsPerchRef}
        olivePerchRef={olivePerchRef}
      />

      <AboutFlowSection
        sectionRef={aboutSectionRef}
        perchRef={fortressPerchRef}
      />

      <ContactFlowSection
        sectionRef={contactSectionRef}
        perchRef={footerBollardPerchRef}
        brandPerchRef={footerBrandPerchRef}
      />

      <FlowBird
        containerRef={flowRef}
        perches={perches}
        active={birdActive}
      />
    </div>
  );
}
