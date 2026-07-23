"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { fileUrl } from "@/lib/api/files";
import type { ApartmentImageResponse } from "@/lib/api/types";
import { ImageLightbox } from "./ImageLightbox";

interface ApartmentGalleryProps {
  images: ApartmentImageResponse[];
  apartmentName: string;
  emptyLabel: string;
}

export function ApartmentGallery({
  images,
  apartmentName,
  emptyLabel,
}: ApartmentGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const urls = sorted
    .map((img) => ({ url: fileUrl(img.url), alt: apartmentName }))
    .filter((img): img is { url: string; alt: string } => Boolean(img.url));

  if (urls.length === 0) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-3xl"
        style={{
          background: "var(--hs-card)",
          border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff className="h-8 w-8 [color:var(--hs-text-soft)] opacity-60" />
          <p className="text-sm [color:var(--hs-text-soft)]">{emptyLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-none sm:grid sm:snap-none sm:grid-cols-4 sm:grid-rows-2 sm:gap-2 sm:overflow-visible">
        {urls.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`relative shrink-0 snap-start overflow-hidden rounded-2xl ${
              i === 0
                ? "aspect-[4/3] w-[85%] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:w-full"
                : "aspect-[4/3] w-[45%] sm:aspect-auto sm:w-full"
            }`}
            style={{ background: "var(--hs-card)" }}
          >
            <img
              src={img.url}
              alt={img.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <ImageLightbox
          images={urls}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
