"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Users, BedDouble, ArrowRight } from "lucide-react";
import { fileUrl } from "@/lib/api/files";
import type { ApartmentResponse } from "@/lib/api/types";

// ============================================================
// Kartica apartmana — dijele je homepage flow (ApartmentsFlowSection)
// i /apartmani listing, da izgled ostane dosljedan. Boje dolaze iz
// --hs-* (dnevna paleta), naslov u Fraunces, Framer Motion za
// ulazak/hover/tap.
// ============================================================

interface ApartmentCardProps {
  apartment: ApartmentResponse;
  index?: number;
  guestsLabel: string;
  roomsLabel: string;
  cta: string;
}

export function ApartmentCard({
  apartment,
  index = 0,
  guestsLabel,
  roomsLabel,
  cta,
}: ApartmentCardProps) {
  const reduceMotion = useReducedMotion();
  const cover = fileUrl(apartment.coverImageUrl);

  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="list-none"
    >
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="h-full"
      >
        <Link
          href={`/apartmani/${apartment.id}`}
          className="block h-full overflow-hidden rounded-3xl shadow-[0_18px_40px_-18px_rgba(40,50,70,0.35)]"
          style={{
            background: "var(--hs-card)",
            border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
          }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            {cover ? (
              <img
                src={cover}
                alt={apartment.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div
                className="relative h-full w-full"
                style={{
                  background:
                    "linear-gradient(to bottom, var(--hs-sky-mid) 55%, var(--hs-sea-far) 55%, var(--hs-sea-near))",
                }}
              >
                <div
                  className="absolute left-[70%] top-[26%] h-8 w-8 -translate-x-1/2 rounded-full"
                  style={{
                    background: "var(--hs-sun-core)",
                    boxShadow: "0 0 24px 4px var(--hs-sun-glow)",
                  }}
                />
              </div>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-xl font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
              {apartment.name}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {apartment.capacity != null && (
                <span
                  title={guestsLabel}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold [color:var(--hs-text-soft)]"
                  style={{
                    background:
                      "color-mix(in oklab, var(--hs-text-soft) 12%, transparent)",
                  }}
                >
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">{guestsLabel}: </span>×
                  {apartment.capacity}
                </span>
              )}
              {apartment.roomCount != null && (
                <span
                  title={roomsLabel}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold [color:var(--hs-text-soft)]"
                  style={{
                    background:
                      "color-mix(in oklab, var(--hs-text-soft) 12%, transparent)",
                  }}
                >
                  <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">{roomsLabel}: </span>×
                  {apartment.roomCount}
                </span>
              )}
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-relaxed [color:var(--hs-text-soft)]">
              {apartment.description}
            </p>

            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold [color:var(--hs-accent)]">
              {cta}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.li>
  );
}
