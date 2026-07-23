"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PhotoFrame } from "./PhotoFrame";

// ============================================================
// Naizmjenični blok fotografija+tekst (znamenitosti O Šibeniku
// stranice) — Framer Motion whileInView otkrivanje, nova paleta.
// ============================================================

interface FeatureBlockProps {
  photoSrc: string;
  photoAlt: string;
  eyebrow?: string;
  title: string;
  text: string;
  reverse?: boolean;
}

export function FeatureBlock({
  photoSrc,
  photoAlt,
  eyebrow,
  title,
  text,
  reverse = false,
}: FeatureBlockProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid items-center gap-6 sm:grid-cols-2 sm:gap-10">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`overflow-hidden rounded-3xl ${reverse ? "sm:order-2" : ""}`}
      >
        <PhotoFrame src={photoSrc} alt={photoAlt} className="aspect-[4/3] w-full" />
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow && (
          <span className="block text-xs font-semibold uppercase tracking-[0.28em] [color:var(--hs-accent)]">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 text-[clamp(1.5rem,5vw,2.1rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {title}
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
          {text}
        </p>
      </motion.div>
    </div>
  );
}
