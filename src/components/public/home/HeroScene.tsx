"use client";

import React from "react";

// ============================================================
// Ilustrirana scena hero sekcije — pogled s rive preko kanala na
// stari Šibenik. Sve je vektorski, u kodu, bez fotografija.
//
// Slojevi (odozdo prema gore): nebo → zvijezde → sunce/mjesec →
// oblaci → otoci na horizontu → silueta grada (katedrala sv.
// Jakova s kupolom, zvonik, tvrđava sv. Mihovila na brdu, kuće,
// čempresi) → more s valovima → barke → lampa i bitva na rivi.
//
// Sve boje dolaze iz --hs-* varijabli (vidi time-palette.ts) pa
// scena kontinuirano živi kroz dan: prozori grada i lampa se pale
// s faktorom noći (--hs-night), zvijezde izlaze, sunce i mjesec
// putuju svojim lukovima.
//
// PERFORMANSE: ambijentalne petlje (oblaci, valovi, barke, zvijezde,
// glow) su ČISTI CSS transform/opacity — nula JS-a po frameu. GSAP
// je rezerviran za pticu. prefers-reduced-motion gasi sve petlje.
// ============================================================

/** Horizont — % visine scene gdje nebo prelazi u more */
const HORIZON = 62;

const STARS: { x: number; y: number; r: number; delay: number }[] = [
  { x: 6, y: 12, r: 0.5, delay: 0 },
  { x: 12, y: 28, r: 0.35, delay: 1.2 },
  { x: 17, y: 8, r: 0.45, delay: 2.1 },
  { x: 23, y: 20, r: 0.3, delay: 0.6 },
  { x: 28, y: 34, r: 0.4, delay: 1.8 },
  { x: 33, y: 6, r: 0.5, delay: 0.3 },
  { x: 38, y: 16, r: 0.3, delay: 2.6 },
  { x: 44, y: 27, r: 0.45, delay: 1.5 },
  { x: 49, y: 9, r: 0.35, delay: 0.9 },
  { x: 54, y: 21, r: 0.5, delay: 2.3 },
  { x: 59, y: 33, r: 0.3, delay: 0.2 },
  { x: 64, y: 13, r: 0.45, delay: 1.7 },
  { x: 69, y: 25, r: 0.35, delay: 2.8 },
  { x: 74, y: 7, r: 0.5, delay: 0.8 },
  { x: 79, y: 18, r: 0.3, delay: 1.4 },
  { x: 84, y: 30, r: 0.4, delay: 2.0 },
  { x: 89, y: 11, r: 0.45, delay: 0.5 },
  { x: 94, y: 23, r: 0.35, delay: 1.1 },
  { x: 9, y: 44, r: 0.3, delay: 2.4 },
  { x: 21, y: 48, r: 0.35, delay: 0.7 },
  { x: 41, y: 42, r: 0.3, delay: 1.9 },
  { x: 57, y: 46, r: 0.4, delay: 0.4 },
  { x: 72, y: 40, r: 0.3, delay: 2.7 },
  { x: 87, y: 45, r: 0.35, delay: 1.3 },
  { x: 96, y: 36, r: 0.3, delay: 0.1 },
  { x: 3, y: 30, r: 0.4, delay: 1.6 },
];

interface HeroSceneProps {
  sun: { x: number; y: number; opacity: number };
  moon: { x: number; y: number; opacity: number };
  /** Sidra za slijetanje ptice — vidi FlowBird */
  lampPerchRef: React.RefObject<HTMLDivElement | null>;
  bollardPerchRef: React.RefObject<HTMLDivElement | null>;
  mooringPerchRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroScene({
  sun,
  moon,
  lampPerchRef,
  bollardPerchRef,
  mooringPerchRef,
}: HeroSceneProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* ---------- NEBO ---------- */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, var(--hs-sky-top), var(--hs-sky-mid) 42%, var(--hs-sky-low) ${HORIZON}%, var(--hs-sea-far) ${HORIZON}%, var(--hs-sea-near) 100%)`,
        }}
      />

      {/* ---------- ZVIJEZDE (noću) ---------- */}
      <svg
        className="absolute inset-x-0 top-0"
        style={{ height: `${HORIZON}%`, opacity: "var(--hs-night)" }}
        viewBox="0 0 100 62"
        preserveAspectRatio="none"
      >
        {STARS.map((star, i) => (
          <circle
            key={i}
            cx={star.x}
            cy={star.y}
            r={star.r}
            fill="#f4f2e8"
            className="hs-anim hs-twinkle"
            style={{ animationDelay: `${star.delay}s` }}
          />
        ))}
      </svg>

      {/* ---------- SUNCE ---------- */}
      <div
        className="absolute w-[clamp(3.5rem,10vw,6rem)] -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${sun.x}%`, top: `${sun.y}%`, opacity: sun.opacity }}
      >
        <div
          className="hs-anim hs-glow absolute -inset-[130%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--hs-sun-glow) 55%, transparent) 0%, transparent 68%)",
          }}
        />
        <div
          className="relative aspect-square rounded-full"
          style={{
            background: "var(--hs-sun-core)",
            boxShadow: "0 0 44px 6px var(--hs-sun-glow)",
          }}
        />
      </div>

      {/* ---------- MJESEC ---------- */}
      <div
        className="absolute w-[clamp(2.2rem,6vw,3.4rem)] -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${moon.x}%`, top: `${moon.y}%`, opacity: moon.opacity }}
      >
        <div
          className="aspect-square rounded-full"
          style={{
            background:
              "radial-gradient(circle at 38% 35%, #f7f5ec 0%, #e6e3d4 55%, #cfccba 100%)",
            boxShadow: "0 0 32px 4px rgba(246, 244, 232, 0.35)",
          }}
        />
      </div>

      {/* ---------- ZVIJEZDA PADALICA (rijetka, samo noću) ---------- */}
      <div
        className="absolute left-0 top-0 h-1/2 w-full"
        style={{ opacity: "var(--hs-night)" }}
      >
        <div className="hs-anim hs-shooting absolute left-[68%] top-[10%] h-px w-14 rotate-[-32deg] bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>

      {/* ---------- JATO GALEBOVA U DALJINI (danju) ---------- */}
      <svg
        viewBox="0 0 60 20"
        className="hs-anim hs-flock absolute top-[17%] w-[clamp(2.2rem,6vw,3.4rem)]"
        style={{ opacity: "calc((1 - var(--hs-night)) * 0.55)" }}
      >
        <path
          d="M6 10 Q9 6 12 10 Q15 6 18 10 M26 6 Q29 2 32 6 Q35 2 38 6 M44 12 Q47 8 50 12 Q53 8 56 12"
          fill="none"
          stroke="var(--hs-city)"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>

      {/* ---------- OBLACI ---------- */}
      {[
        { top: "9%", width: "clamp(7rem,18vw,13rem)", cls: "hs-cloud-a", opacity: 0.9 },
        { top: "22%", width: "clamp(5rem,13vw,9rem)", cls: "hs-cloud-b", opacity: 0.65 },
        { top: "33%", width: "clamp(4rem,10vw,7rem)", cls: "hs-cloud-c", opacity: 0.45 },
      ].map((cloud, i) => (
        <svg
          key={i}
          viewBox="0 0 100 44"
          className={`hs-anim absolute ${cloud.cls}`}
          style={{ top: cloud.top, width: cloud.width, opacity: cloud.opacity }}
        >
          <path
            d="M18 34 Q16 22 28 20 Q32 10 44 12 Q52 4 62 10 Q74 8 76 20 Q86 22 84 32 Q80 38 70 38 L26 38 Q18 38 18 34 Z"
            fill="var(--hs-cloud)"
          />
        </svg>
      ))}

      {/* ---------- OTOCI NA HORIZONTU ---------- */}
      <svg
        viewBox="0 0 300 36"
        preserveAspectRatio="none"
        className="absolute left-[-2%] w-[34%]"
        style={{ bottom: `${100 - HORIZON}%`, height: "3.2%" }}
      >
        <path
          d="M0 36 Q50 10 120 24 Q200 38 300 32 V36 Z"
          fill="var(--hs-islands)"
        />
      </svg>
      <svg
        viewBox="0 0 300 36"
        preserveAspectRatio="none"
        className="absolute right-[-3%] w-[28%]"
        style={{ bottom: `${100 - HORIZON}%`, height: "2.6%" }}
      >
        <path
          d="M0 32 Q90 40 180 22 Q250 12 300 36 V36 H0 Z"
          fill="var(--hs-islands)"
        />
      </svg>

      {/* Svjetionik na desnom otoku — svjetlo pulsira noću */}
      <div
        className="absolute right-[7%]"
        style={{ bottom: `${100 - HORIZON + 1.6}%`, height: "clamp(1.1rem,3.2dvh,1.8rem)" }}
      >
        <svg viewBox="0 0 16 36" className="h-full">
          <path d="M5 36 L6 10 H10 L11 36 Z" fill="var(--hs-islands)" />
          <path d="M4 12 H12 V8 H4 Z" fill="var(--hs-islands)" />
        </svg>
        <div
          className="absolute left-1/2 top-[16%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ opacity: "var(--hs-night)" }}
        >
          <div
            className="hs-anim hs-blink h-full w-full rounded-full"
            style={{
              background: "var(--hs-accent)",
              boxShadow: "0 0 10px 3px var(--hs-accent)",
            }}
          />
        </div>
      </div>

      {/* ---------- SILUETA GRADA (na horizontu) ---------- */}
      <div
        className="absolute inset-x-0"
        style={{ bottom: `${100 - HORIZON}%`, height: "clamp(6rem, 24dvh, 13rem)" }}
      >
        {/* Tvrđava sv. Mihovila na brdu — lijevo */}
        <svg
          viewBox="0 0 280 130"
          preserveAspectRatio="xMinYMax meet"
          className="absolute bottom-0 left-0 h-[72%]"
        >
          <path
            d="M0 130 V54 Q40 34 84 40 Q150 48 214 84 Q252 104 280 130 Z"
            fill="var(--hs-city)"
          />
          <path
            d="M44 54 V34 H54 V26 H64 V34 H74 V26 H84 V34 H94 V26 H104 V34 H114 V26 H124 V34 V56 Z"
            fill="var(--hs-city)"
          />
          {/* Kamena tekstura preko zidina i brda */}
          <path
            d="M0 130 V54 Q40 34 84 40 Q150 48 214 84 Q252 104 280 130 Z"
            fill="url(#hs-stone)"
          />
          <path
            d="M44 54 V34 H54 V26 H64 V34 H74 V26 H84 V34 H94 V26 H104 V34 H114 V26 H124 V34 V56 Z"
            fill="url(#hs-stone)"
          />
          <path
            d="M150 92 C146 76 146 68 154 56 C162 68 162 76 158 92 Z M172 100 C169 88 169 82 175 72 C181 82 181 88 178 100 Z"
            fill="var(--hs-city)"
          />
          <g style={{ opacity: "calc(var(--hs-night) * 0.9)" }}>
            <rect x="58" y="40" width="4" height="6" fill="var(--hs-accent)" />
            <rect x="96" y="40" width="4" height="6" fill="var(--hs-accent)" />
          </g>
        </svg>

        {/* Katedrala sv. Jakova + zvonik — središte */}
        <svg
          viewBox="0 0 340 150"
          preserveAspectRatio="xMidYMax meet"
          className="absolute bottom-0 left-1/2 h-full -translate-x-1/2"
        >
          {/* Zajednička "masa" grada uz obalu */}
          <path d="M0 150 V120 H340 V150 Z" fill="var(--hs-city)" />
          {/* Krovovi i tornjevi iznad mase */}
          <path
            d="M10 120 V104 L22 92 L34 104 V120 Z
               M44 120 V98 H72 V120 Z M50 98 V88 H58 V98 Z
               M84 120 V102 L98 88 L112 102 V120 Z
               M128 120 V96 Q158 68 188 96 V120 Z
               M188 120 V92 H206 V120 Z M186 92 Q197 70 208 92 Z
               M195 70 V58 H199 V70 Z M191 62 H203 V66 H191 Z
               M222 120 V56 H240 V120 Z M218 56 L231 30 L244 56 Z
               M252 120 V100 L266 88 L280 100 V120 Z
               M290 120 V102 H316 V120 Z M296 102 V92 H304 V102 Z
               M326 120 C322 104 322 96 330 84 C338 96 338 104 334 120 Z"
            fill="var(--hs-city)"
          />
          {/* Kamena tekstura preko gradske mase i krovova */}
          <path d="M0 150 V120 H340 V150 Z" fill="url(#hs-stone)" />
          <path
            d="M10 120 V104 L22 92 L34 104 V120 Z
               M44 120 V98 H72 V120 Z
               M84 120 V102 L98 88 L112 102 V120 Z
               M128 120 V96 Q158 68 188 96 V120 Z
               M188 120 V92 H206 V120 Z M186 92 Q197 70 208 92 Z
               M222 120 V56 H240 V120 Z
               M252 120 V100 L266 88 L280 100 V120 Z
               M290 120 V102 H316 V120 Z"
            fill="url(#hs-stone)"
          />
          {/* Prozori — pale se s noći */}
          <g style={{ opacity: "calc(var(--hs-night) * 0.9)" }}>
            <rect x="16" y="108" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="26" y="108" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="52" y="104" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="62" y="104" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="94" y="106" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="140" y="104" width="3" height="6" fill="var(--hs-accent)" />
            <rect x="156" y="104" width="3" height="6" fill="var(--hs-accent)" />
            <rect x="172" y="104" width="3" height="6" fill="var(--hs-accent)" />
            <rect x="226" y="68" width="3" height="7" fill="var(--hs-accent)" />
            <rect x="233" y="68" width="3" height="7" fill="var(--hs-accent)" />
            <rect x="260" y="104" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="298" y="108" width="3" height="5" fill="var(--hs-accent)" />
          </g>
        </svg>

        {/* Kuće — desno */}
        <svg
          viewBox="0 0 260 110"
          preserveAspectRatio="xMaxYMax meet"
          className="absolute bottom-0 right-0 h-[62%]"
        >
          <path
            d="M40 110 V86 H260 V110 Z
               M52 86 L66 72 L80 86 Z
               M96 86 V76 H104 V86 Z
               M120 86 L136 70 L152 86 Z
               M170 86 V74 H178 V86 Z
               M196 86 L210 74 L224 86 Z
               M18 110 C14 96 14 88 22 78 C30 88 30 96 26 110 Z"
            fill="var(--hs-city)"
          />
          {/* Kamena tekstura preko kuća */}
          <path
            d="M40 110 V86 H260 V110 Z
               M52 86 L66 72 L80 86 Z
               M120 86 L136 70 L152 86 Z
               M196 86 L210 74 L224 86 Z"
            fill="url(#hs-stone)"
          />
          <g style={{ opacity: "calc(var(--hs-night) * 0.9)" }}>
            <rect x="62" y="92" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="130" y="92" width="3" height="5" fill="var(--hs-accent)" />
            <rect x="204" y="92" width="3" height="5" fill="var(--hs-accent)" />
          </g>
        </svg>
      </div>

      {/* ---------- MORE — valovi (3 pojasa dubine) ---------- */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden"
        style={{ height: `${100 - HORIZON}%` }}
      >
        {/* Sunčeva staza na moru — prati poziciju sunca */}
        <div
          className="hs-anim hs-shimmer absolute top-0 h-[70%] w-[clamp(2.5rem,7vw,4.5rem)] -translate-x-1/2 blur-[2px]"
          style={{
            left: `${sun.x}%`,
            opacity: sun.opacity * 0.5,
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--hs-sun-glow) 60%, transparent), transparent 75%)",
          }}
        />
        {/* Mjesečeva staza — noću */}
        <div
          className="hs-anim hs-shimmer absolute top-0 h-[65%] w-[clamp(1.8rem,5vw,3rem)] -translate-x-1/2 blur-[2px]"
          style={{
            left: `${moon.x}%`,
            opacity: moon.opacity * 0.4,
            background:
              "linear-gradient(to bottom, rgba(246,244,232,0.55), transparent 75%)",
          }}
        />

        {/* Trajekt — polako prelazi kanal */}
        <svg
          viewBox="0 0 80 26"
          className="hs-anim hs-ferry absolute top-[16%] w-[clamp(2.4rem,6vw,3.6rem)]"
          style={{ opacity: 0.85 }}
        >
          <path d="M6 16 H74 L68 24 H12 Z" fill="var(--hs-city)" />
          <path d="M20 16 V9 H58 V16 Z" fill="var(--hs-city)" />
          <path d="M30 9 V4 H40 V9 Z" fill="var(--hs-city)" />
          <g style={{ opacity: "calc(var(--hs-night) * 0.9)" }}>
            <rect x="24" y="11" width="3" height="3" fill="var(--hs-accent)" />
            <rect x="32" y="11" width="3" height="3" fill="var(--hs-accent)" />
            <rect x="40" y="11" width="3" height="3" fill="var(--hs-accent)" />
            <rect x="48" y="11" width="3" height="3" fill="var(--hs-accent)" />
          </g>
        </svg>
        <svg
          viewBox="0 0 480 28"
          preserveAspectRatio="none"
          className="hs-anim hs-wave-a absolute left-0 top-[4%] h-[10%] w-[200%]"
          style={{ opacity: 0.3 }}
        >
          <path
            d="M0 16 Q15 8 30 16 T60 16 T90 16 T120 16 T150 16 T180 16 T210 16 T240 16 T270 16 T300 16 T330 16 T360 16 T390 16 T420 16 T450 16 T480 16 V28 H0 Z"
            fill="var(--hs-sky-low)"
          />
        </svg>
        <svg
          viewBox="0 0 480 28"
          preserveAspectRatio="none"
          className="hs-anim hs-wave-b absolute left-0 top-[38%] h-[14%] w-[200%]"
          style={{ opacity: 0.5 }}
        >
          <path
            d="M0 14 Q20 6 40 14 T80 14 T120 14 T160 14 T200 14 T240 14 T280 14 T320 14 T360 14 T400 14 T440 14 T480 14 V28 H0 Z"
            fill="var(--hs-sea-near)"
          />
        </svg>
        <svg
          viewBox="0 0 480 28"
          preserveAspectRatio="none"
          className="hs-anim hs-wave-c absolute bottom-0 left-0 h-[22%] w-[200%]"
        >
          <path
            d="M0 12 Q25 4 50 12 T100 12 T150 12 T200 12 T250 12 T300 12 T350 12 T400 12 T450 12 L480 12 V28 H0 Z"
            fill="var(--hs-sea-near)"
          />
        </svg>

        {/* Morska pjena — crtice uz horizont koje polako plutaju */}
        <svg
          viewBox="0 0 480 12"
          preserveAspectRatio="none"
          className="hs-anim hs-foam-drift absolute left-0 top-[2%] h-[4%] w-[200%]"
          style={{ opacity: 0.35 }}
        >
          <path
            d="M8 6 h14 M40 8 h10 M72 5 h16 M116 8 h9 M150 6 h13 M195 7 h11 M236 5 h15 M248 8 h14 M280 8 h10 M312 5 h16 M356 8 h9 M390 6 h13 M435 7 h11 M476 5 h15"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Pjenaste kapice — pojave se i nestanu */}
        <div className="hs-anim hs-foam-a absolute left-[30%] top-[46%]">
          <div className="flex gap-1">
            <span className="h-1 w-3 rounded-full bg-white" />
            <span className="h-1 w-2 rounded-full bg-white" />
            <span className="h-1 w-1.5 rounded-full bg-white" />
          </div>
        </div>
        <div className="hs-anim hs-foam-b absolute left-[62%] top-[30%]">
          <div className="flex gap-1">
            <span className="h-1 w-2.5 rounded-full bg-white" />
            <span className="h-1 w-1.5 rounded-full bg-white" />
            <span className="h-1 w-2 rounded-full bg-white" />
          </div>
        </div>
        <div className="hs-anim hs-foam-c absolute left-[14%] top-[64%]">
          <div className="flex gap-1">
            <span className="h-1 w-2 rounded-full bg-white" />
            <span className="h-1 w-3 rounded-full bg-white" />
          </div>
        </div>

        {/* Bova — njiše se na valu */}
        <svg
          viewBox="0 0 20 30"
          className="hs-anim hs-bob-c absolute left-[44%] top-[40%] w-[clamp(0.7rem,1.8vw,1.1rem)]"
        >
          <path d="M4 18 Q10 22 16 18 L14 26 Q10 29 6 26 Z" fill="var(--hs-accent)" />
          <path d="M8 18 V8 H12 V18 Z" fill="var(--hs-accent)" />
          <circle cx="10" cy="6" r="2.4" fill="#f7f5ec" />
        </svg>

        {/* Barke — lagano se njišu */}
        <svg
          viewBox="0 0 48 40"
          className="hs-anim hs-bob-a absolute left-[16%] top-[26%] w-[clamp(2rem,5vw,3.2rem)]"
        >
          <path d="M4 30 Q24 38 44 30 L40 36 Q24 42 8 36 Z" fill="var(--hs-city)" />
          <path d="M23 30 V6" stroke="var(--hs-city)" strokeWidth="1.6" />
          <path d="M25 8 Q37 18 27 28 L25 28 Z" fill="var(--hs-city)" />
        </svg>
        <svg
          viewBox="0 0 48 40"
          className="hs-anim hs-bob-b absolute right-[22%] top-[52%] w-[clamp(1.6rem,4vw,2.6rem)]"
        >
          <path d="M4 30 Q24 38 44 30 L40 36 Q24 42 8 36 Z" fill="var(--hs-city)" />
          <path d="M23 30 V8" stroke="var(--hs-city)" strokeWidth="1.6" />
          <path d="M21 10 Q9 19 19 28 L21 28 Z" fill="var(--hs-city)" />
        </svg>
      </div>

      {/* ---------- RIVA — lampa (desno) i bitva (lijevo) ---------- */}
      <div className="absolute bottom-[2%] right-[6%] h-[clamp(8rem,22dvh,13rem)]">
        {/* Sjaj lampe — noću */}
        <div
          className="absolute left-1/2 top-[10%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--hs-accent) 60%, transparent) 0%, transparent 70%)",
            opacity: "var(--hs-night)",
          }}
        />
        <svg viewBox="0 0 44 170" className="relative h-full">
          <path d="M12 170 H32 V162 H28 V156 H16 V162 H12 Z" fill="var(--hs-city)" />
          <path d="M20 156 V44 H24 V156 Z" fill="var(--hs-city)" />
          <path d="M14 44 H30 V40 H14 Z" fill="var(--hs-city)" />
          <path d="M16 40 L28 40 L26 24 L18 24 Z" fill="var(--hs-city)" />
          <path d="M17 24 H27 V20 H17 Z" fill="var(--hs-city)" />
          <path d="M21 20 V14 H23 V20 Z" fill="var(--hs-city)" />
          {/* Staklo lanterne — svijetli noću */}
          <path
            d="M17.5 38 L26.5 38 L25 26 L19 26 Z"
            fill="var(--hs-accent)"
            style={{ opacity: "calc(0.15 + var(--hs-night) * 0.85)" }}
          />
        </svg>
        {/* Sidro za pticu — vrh lampe */}
        <div
          ref={lampPerchRef}
          className="absolute left-1/2 top-[6%] h-px w-px -translate-x-1/2"
        />
      </div>

      <div className="absolute bottom-[3%] left-[7%] h-[clamp(2rem,5.5dvh,3.2rem)]">
        <svg viewBox="0 0 40 48" className="h-full">
          <path
            d="M8 48 V30 Q8 22 14 20 V14 Q14 8 20 8 Q26 8 26 14 V20 Q32 22 32 30 V48 Z"
            fill="var(--hs-city)"
          />
        </svg>
        {/* Sidro za pticu — vrh bitve */}
        <div
          ref={bollardPerchRef}
          className="absolute left-1/2 top-0 h-px w-px -translate-x-1/2"
        />
      </div>

      {/* Drveni privez-stup s užetom — još jedno sidro za pticu */}
      <div className="absolute bottom-[5%] left-[27%] h-[clamp(2.4rem,6.5dvh,3.8rem)]">
        <svg viewBox="0 0 36 60" className="h-full">
          <path
            d="M13 60 L14 6 Q18 3 22 6 L23 60 Z"
            fill="var(--hs-city)"
          />
          <path
            d="M14 18 Q6 22 8 32 M22 18 Q30 24 27 34"
            fill="none"
            stroke="var(--hs-city)"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
        <div
          ref={mooringPerchRef}
          className="absolute left-1/2 top-0 h-px w-px -translate-x-1/2"
        />
      </div>

      {/* ---------- Ambijentalne CSS petlje ---------- */}
      <style>{`
        @keyframes hsTwinkle {
          from { opacity: 0.35; }
          to { opacity: 1; }
        }
        .hs-twinkle { animation: hsTwinkle 2.8s ease-in-out infinite alternate; }

        @keyframes hsGlow {
          from { transform: scale(0.96); opacity: 0.85; }
          to { transform: scale(1.06); opacity: 1; }
        }
        .hs-glow { animation: hsGlow 8s ease-in-out infinite alternate; }

        @keyframes hsDrift {
          from { transform: translateX(-30vw); }
          to { transform: translateX(115vw); }
        }
        .hs-cloud-a { animation: hsDrift 150s linear infinite; animation-delay: -40s; }
        .hs-cloud-b { animation: hsDrift 190s linear infinite; animation-delay: -120s; }
        .hs-cloud-c { animation: hsDrift 120s linear infinite; animation-delay: -70s; }

        @keyframes hsWave {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hs-wave-a { animation: hsWave 26s linear infinite; }
        .hs-wave-b { animation: hsWave 18s linear infinite; }
        .hs-wave-c { animation: hsWave 13s linear infinite; }

        @keyframes hsBob {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-3px) rotate(1.5deg); }
        }
        .hs-bob-a { animation: hsBob 6s ease-in-out infinite; }
        .hs-bob-b { animation: hsBob 7.5s ease-in-out infinite; animation-delay: -2s; }
        .hs-bob-c { animation: hsBob 5s ease-in-out infinite; animation-delay: -1s; }

        @keyframes hsFoamCap {
          0% { transform: translateX(0); opacity: 0; }
          25% { opacity: 0.55; }
          70% { opacity: 0.35; }
          100% { transform: translateX(34px); opacity: 0; }
        }
        .hs-foam-a { animation: hsFoamCap 9s ease-in-out infinite; }
        .hs-foam-b { animation: hsFoamCap 11s ease-in-out infinite; animation-delay: -4s; }
        .hs-foam-c { animation: hsFoamCap 8s ease-in-out infinite; animation-delay: -6s; }
        .hs-foam-drift { animation: hsWave 34s linear infinite; }

        @keyframes hsBlink {
          0%, 72% { opacity: 0.25; }
          78%, 92% { opacity: 1; }
          100% { opacity: 0.25; }
        }
        .hs-blink { animation: hsBlink 3.2s ease-in-out infinite; }

        @keyframes hsShooting {
          0% { transform: translate(0, 0) rotate(-32deg); opacity: 0; }
          1% { opacity: 1; }
          4% { transform: translate(-170px, 110px) rotate(-32deg); opacity: 0; }
          100% { transform: translate(-170px, 110px) rotate(-32deg); opacity: 0; }
        }
        .hs-shooting { animation: hsShooting 47s linear infinite; animation-delay: 6s; }

        @keyframes hsFlock {
          from { transform: translateX(-12vw) translateY(0); }
          50% { transform: translateX(50vw) translateY(-14px); }
          to { transform: translateX(112vw) translateY(0); }
        }
        .hs-flock { animation: hsFlock 75s linear infinite; animation-delay: -20s; }

        @keyframes hsFerry {
          from { transform: translateX(-14vw); }
          to { transform: translateX(114vw); }
        }
        .hs-ferry { animation: hsFerry 210s linear infinite; animation-delay: -60s; }

        @keyframes hsShimmer {
          from { transform: translateX(-50%) scaleX(0.92); }
          to { transform: translateX(-50%) scaleX(1.08); }
        }
        .hs-shimmer { animation: hsShimmer 4.5s ease-in-out infinite alternate; }

        @media (prefers-reduced-motion: reduce) {
          .hs-anim { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
