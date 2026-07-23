"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { LanguageSwitcherButton } from "@/components/guest/LanguageGate";
import { WaveDivider } from "./WaveDivider";

// ============================================================
// Završna sekcija flowa — kontakt poziv + footer "u moru": scena
// se zatvara onako kako je i počela, na vodi. U morskom pojasu su
// footer navigacija (jedina "klasična" navigacija naslovnice),
// odabir jezika, brend i bitva na kojoj ptica može dočekati kraj
// stranice.
// ============================================================

interface ContactFlowSectionProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  /** Sidro za pticu — bitva u podnožju */
  perchRef: React.RefObject<HTMLDivElement | null>;
  /** Sidro za pticu — iznad brenda u footeru */
  brandPerchRef: React.RefObject<HTMLDivElement | null>;
}

export function ContactFlowSection({
  sectionRef,
  perchRef,
  brandPerchRef,
}: ContactFlowSectionProps) {
  const { dict } = useLanguage();
  const t = dict.home.contact;
  const reduceMotion = useReducedMotion();

  const navLinks = [
    { href: "/apartmani", label: dict.nav.apartments },
    { href: "/o-sibeniku", label: dict.nav.about },
    { href: "/kontakt", label: dict.nav.contact },
  ];

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className="relative"
      style={{ background: "var(--hs-card)" }}
    >
      {/* Kontakt poziv */}
      <div className="mx-auto w-full max-w-2xl px-gutter pb-20 pt-14 text-center sm:pb-28 sm:pt-20">
        <h2 className="text-[clamp(1.9rem,6.5vw,3rem)] font-semibold leading-tight text-balance [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[clamp(0.95rem,3vw,1.1rem)] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
          {t.text}
        </p>
        <motion.div
          whileHover={reduceMotion ? undefined : { y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="mt-7 inline-block"
        >
          <Link
            href="/kontakt"
            className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full px-7 text-base font-bold text-white shadow-[0_14px_30px_-12px_var(--hs-accent)]"
            style={{ background: "var(--hs-accent)" }}
          >
            {t.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* More se vraća — stranica završava na vodi */}
      <WaveDivider fill="var(--hs-sea-near)" />
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--hs-sea-near)" }}
      >
        {/* Barka u podnožju */}
        <svg
          viewBox="0 0 48 40"
          className="hs-anim-footer pointer-events-none absolute right-[14%] top-6 w-[clamp(1.8rem,4.5vw,2.8rem)] opacity-80"
        >
          <path d="M4 30 Q24 38 44 30 L40 36 Q24 42 8 36 Z" fill="var(--hs-city)" />
          <path d="M23 30 V8" stroke="var(--hs-city)" strokeWidth="1.6" />
          <path d="M25 10 Q37 19 27 28 L25 28 Z" fill="var(--hs-city)" />
        </svg>

        {/* Bitva — posljednje sidro za pticu */}
        <div className="pointer-events-none absolute left-[10%] top-3 h-[clamp(1.8rem,4.5dvh,2.6rem)]">
          <svg viewBox="0 0 40 48" className="h-full">
            <path
              d="M8 48 V30 Q8 22 14 20 V14 Q14 8 20 8 Q26 8 26 14 V20 Q32 22 32 30 V48 Z"
              fill="var(--hs-city)"
            />
          </svg>
          <div
            ref={perchRef}
            className="absolute left-1/2 top-0 h-px w-px -translate-x-1/2"
          />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-gutter pb-safe pt-16">
          <div className="flex flex-col items-center gap-5 pb-8 text-center">
            <Image
              src="/images/logo.png"
              alt=""
              width={64}
              height={64}
              className="h-10 w-10 rounded-full"
            />
            <p className="relative text-lg font-semibold italic text-[#f7f5ec] [font-family:var(--font-display)]">
              Apartments Šibenik
              <span
                ref={brandPerchRef}
                className="absolute -top-1 right-[10%] h-px w-px"
              />
            </p>

            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 text-sm font-medium text-[#f7f5ec]/80 transition-colors hover:text-[#f7f5ec]"
                >
                  {link.label}
                </Link>
              ))}
              <div className="rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                <LanguageSwitcherButton />
              </div>
            </nav>

            <div className="text-xs text-[#f7f5ec]/60">
              <p className="italic">{t.footerTagline}</p>
              <p className="mt-1">
                © {new Date().getFullYear()} Apartments Šibenik
              </p>
            </div>
            <Link
              href="/rules"
              className="text-xs text-[#f7f5ec]/50 underline-offset-2 transition-colors hover:text-[#f7f5ec]/80 hover:underline"
            >
              {dict.houseRules.title}
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes hsFooterBob {
            0%, 100% { transform: translateY(0) rotate(-1.5deg); }
            50% { transform: translateY(-3px) rotate(1.5deg); }
          }
          .hs-anim-footer { animation: hsFooterBob 6.5s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .hs-anim-footer { animation: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
