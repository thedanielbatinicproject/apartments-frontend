import React from "react";

// ============================================================
// Zajednički placeholder za javne stranice u izradi.
//
// Tri stranice (apartmani, kontakt, o-sibeniku) imale su identičnu
// strukturu s kopiranim klasama. Sada su mobilni razmaci i
// tipografija definirani na jednom mjestu.
// ============================================================

interface PagePlaceholderProps {
  /** Dio naslova prije istaknute riječi */
  titlePrefix?: string;
  /** Istaknuta (tirkizna) riječ */
  highlight: string;
  /** Dio naslova poslije istaknute riječi */
  titleSuffix?: string;
  description: string;
}

export function PagePlaceholder({
  titlePrefix,
  highlight,
  titleSuffix,
  description,
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center bg-stone-900 px-5 py-14 text-center text-stone-100 sm:px-6 sm:py-20">
      <h1 className="text-[clamp(1.75rem,7vw,2.5rem)] font-bold leading-tight tracking-tight text-stone-100 text-balance">
        {titlePrefix && <>{titlePrefix} </>}
        <span className="text-teal-400">{highlight}</span>
        {titleSuffix && <> {titleSuffix}</>}
      </h1>
      <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-stone-400 text-pretty sm:text-base">
        {description}
      </p>
    </div>
  );
}
