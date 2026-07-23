"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useReveal, useParallax } from "./use-reveal";

// ============================================================
// "O Šibeniku" teaser u flowu — ilustrirana tvrđava sv. Mihovila
// (ista likovnost kao hero scena, prozori se pale noću) + kratki
// poziv na punu stranicu. Bez hrpe informacija — homepage ostaje
// iskustvo, priča živi na /o-sibeniku.
// ============================================================

interface AboutFlowSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Sidro za pticu — kruna tvrđave */
  perchRef: React.RefObject<HTMLDivElement | null>;
}

export function AboutFlowSection({
  sectionRef,
  perchRef,
}: AboutFlowSectionProps) {
  const { dict } = useLanguage();
  const t = dict.home.about;
  const reduceMotion = useReducedMotion();

  useReveal(sectionRef);
  useParallax(sectionRef, ".abs-parallax", 55);

  return (
    <section
      id="o-sibeniku"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "var(--hs-card)" }}
    >
      {/* Dekorativni "sunčev luk" s paralaksom */}
      <div
        className="abs-parallax pointer-events-none absolute -left-28 top-6 h-80 w-80 rounded-full border-[3px] opacity-15"
        style={{ borderColor: "var(--hs-sea-far)" }}
      />

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 px-gutter py-16 sm:grid-cols-2 sm:py-24">
        {/* Ilustracija tvrđave */}
        <div className="relative mx-auto w-full max-w-sm sm:max-w-none">
          <svg viewBox="0 0 320 200" className="abs-parallax w-full">
            {/* Brdo */}
            <path
              d="M0 200 V120 Q60 84 140 80 Q230 78 320 130 V200 Z"
              fill="var(--hs-city)"
            />
            {/* Zidine s kruništem */}
            <path
              d="M88 92 V64 H102 V52 H116 V64 H130 V52 H144 V64 H158 V52 H172 V64 H186 V52 H200 V64 H214 V94 Z"
              fill="var(--hs-city)"
            />
            {/* Kula */}
            <path d="M144 52 V30 H160 V52 Z" fill="var(--hs-city)" />
            {/* Kamena tekstura preko brda, zidina i kule */}
            <path
              d="M0 200 V120 Q60 84 140 80 Q230 78 320 130 V200 Z"
              fill="url(#hs-stone)"
            />
            <path
              d="M88 92 V64 H102 V52 H116 V64 H130 V52 H144 V64 H158 V52 H172 V64 H186 V52 H200 V64 H214 V94 Z"
              fill="url(#hs-stone)"
            />
            <path d="M144 52 V30 H160 V52 Z" fill="url(#hs-stone)" />
            {/* Čempresi */}
            <path
              d="M52 150 C47 132 47 122 56 108 C65 122 65 132 60 150 Z M256 166 C252 150 252 142 259 130 C266 142 266 150 262 166 Z"
              fill="var(--hs-city)"
            />
            {/* Prozori — pale se noću */}
            <g style={{ opacity: "calc(var(--hs-night) * 0.9)" }}>
              <rect x="110" y="70" width="5" height="8" fill="var(--hs-accent)" />
              <rect x="149" y="38" width="5" height="8" fill="var(--hs-accent)" />
              <rect x="178" y="70" width="5" height="8" fill="var(--hs-accent)" />
            </g>
          </svg>
          {/* Sidro za pticu — vrh kule */}
          <div
            ref={perchRef}
            className="absolute left-[47.5%] top-[13%] h-px w-px"
          />
        </div>

        {/* Tekst */}
        <div className="text-center sm:text-left">
          <span className="fs-reveal block text-[clamp(0.7rem,2vw,0.85rem)] font-semibold uppercase tracking-[0.32em] [color:var(--hs-accent)]">
            {t.eyebrow}
          </span>
          <h2 className="fs-reveal mt-3 text-[clamp(1.9rem,6.5vw,3rem)] font-semibold leading-tight text-balance [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
            {t.title}
          </h2>
          <p className="fs-reveal mt-4 text-[clamp(0.95rem,3vw,1.1rem)] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
            {t.text}
          </p>
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="fs-reveal mt-7 inline-block"
          >
            <Link
              href="/o-sibeniku"
              className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full px-7 text-base font-bold text-white shadow-[0_14px_30px_-12px_var(--hs-accent)]"
              style={{ background: "var(--hs-accent)" }}
            >
              {t.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
