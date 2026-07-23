"use client";

import { motion, useReducedMotion } from "framer-motion";

interface FactCardProps {
  eyebrow: string;
  title: string;
  text: string;
  delay?: number;
}

/** Kartica "brzinske činjenice" bez fotografije — za priču koju nosi broj, ne slika. */
export function FactCard({ eyebrow, title, text, delay = 0 }: FactCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl p-6 sm:p-8"
      style={{
        background: "var(--hs-card)",
        border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
      }}
    >
      <span className="text-[clamp(2rem,7vw,3rem)] font-semibold leading-none [color:var(--hs-accent)] [font-family:var(--font-display)]">
        {eyebrow}
      </span>
      <h3 className="mt-3 text-lg font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-pretty [color:var(--hs-text-soft)]">
        {text}
      </p>
    </motion.div>
  );
}
