"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import type { SolarReadingResponse } from "@/lib/api/types";
import {
  formatSolarValue,
  formatDateTime,
  type SolarNumericField,
} from "@/lib/solar-utils";
import { cn } from "@/lib/utils";

// ============================================================
// Lagani custom SVG line chart — bez dodavanja chart biblioteke
// (projekt namjerno drži ovisnosti minimalnima, vidi use-async.ts).
//
// Responzivnost: viewBox fiksne veličine + preserveAspectRatio
// "none" razvlači SVG na veličinu roditelja bez JS mjerenja
// (ResizeObserver). Zato su tekst/točke izvan SVG-a (obični HTML,
// pozicioniran postotcima) — da se ne razvlače neravnomjerno s
// linijama. Linije koriste vector-effect="non-scaling-stroke" da
// im debljina ostane konstantna bez obzira na razvlačenje.
//
// Hover (desktop) / tap (mobitel) preko pokazivača na omotaču
// showuje krosher liniju + tooltip s točnim vrijednostima.
// ============================================================

export interface SolarChartSeriesDef {
  key: SolarNumericField;
  label: string;
  unit: string;
  /** Tailwind stroke-* klasa za liniju (podržava dark: varijantu) */
  stroke: string;
  /** Tailwind bg-* klasa za točku u legendi/tooltipu */
  dot: string;
}

interface SolarLineChartProps {
  data: SolarReadingResponse[];
  series: SolarChartSeriesDef[];
  /** Fiksni Y raspon (npr. [0, 100] za postotak) — inače auto-scale */
  yDomain?: [number, number];
  height?: number;
}

const VIEW_W = 600;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SolarLineChart({
  data,
  series,
  yDomain,
  height = 200,
}: SolarLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { paths, min, max } = useMemo(() => {
    const values: number[] = [];
    for (const s of series) {
      for (const point of data) {
        const v = point[s.key];
        if (typeof v === "number" && Number.isFinite(v)) values.push(v);
      }
    }

    let domainMin: number;
    let domainMax: number;

    if (yDomain) {
      [domainMin, domainMax] = yDomain;
    } else if (values.length === 0) {
      domainMin = 0;
      domainMax = 1;
    } else {
      const rawMin = Math.min(...values);
      const rawMax = Math.max(...values);
      const pad =
        rawMax === rawMin ? Math.max(1, Math.abs(rawMax) * 0.1) : (rawMax - rawMin) * 0.1;
      domainMin = rawMin - pad;
      domainMax = rawMax + pad;
    }

    const span = domainMax - domainMin || 1;
    const n = data.length;

    const built = series.map((s) => {
      let d = "";
      let drawing = false;

      data.forEach((point, i) => {
        const raw = point[s.key];
        const x = n <= 1 ? 0 : (i / (n - 1)) * VIEW_W;

        if (typeof raw !== "number" || !Number.isFinite(raw)) {
          drawing = false;
          return;
        }

        const yFraction = (raw - domainMin) / span;
        const y = height - yFraction * height;

        d += drawing ? ` L ${x} ${y}` : `M ${x} ${y}`;
        drawing = true;
      });

      return { key: s.key, d };
    });

    return { paths: built, min: domainMin, max: domainMax };
  }, [data, series, yDomain, height]);

  const hasEnoughData = data.length >= 2;

  const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const index = Math.round(fraction * (data.length - 1));
    setHoverIndex(index);
  };

  const hoverPoint = hoverIndex != null ? data[hoverIndex] : null;
  const hoverFraction =
    hoverIndex != null && data.length > 1 ? hoverIndex / (data.length - 1) : 0;
  const axisUnit = series[0]?.unit ?? "";

  // Tooltip se pozicionira u pikselima unutar granica grafa (NE
  // postotkom + translate) — sadržaj (datum + do 2 serije) ima
  // promjenjivu širinu, pa bi fiksna %-pozicija na uskom mobilnom
  // grafu redovito gurnula tooltip napola izvan kartice.
  useLayoutEffect(() => {
    if (hoverIndex == null) return;
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !tooltip) return;

    const containerWidth = container.clientWidth;
    const tooltipWidth = tooltip.offsetWidth;
    const rawLeft = hoverFraction * containerWidth - tooltipWidth / 2;
    const maxLeft = Math.max(4, containerWidth - tooltipWidth - 4);

    setTooltipLeft(Math.min(maxLeft, Math.max(4, rawLeft)));
  }, [hoverIndex, hoverFraction]);

  return (
    <div>
      {/* Legenda */}
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {series.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span className={cn("h-2 w-2 shrink-0 rounded-full", s.dot)} />
            {s.label}
          </div>
        ))}
      </div>

      {!hasEnoughData ? (
        <div
          className="flex items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground"
          style={{ height }}
        >
          Nedovoljno podataka za prikaz grafa
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="relative touch-pan-y select-none"
            style={{ height }}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onPointerLeave={() => setHoverIndex(null)}
          >
            <svg
              viewBox={`0 0 ${VIEW_W} ${height}`}
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1={0}
                  x2={VIEW_W}
                  y1={height * f}
                  y2={height * f}
                  className="stroke-border"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {paths.map((p, i) => (
                <path
                  key={p.key}
                  d={p.d}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className={series[i].stroke}
                />
              ))}

              {hoverIndex != null && (
                <line
                  x1={hoverFraction * VIEW_W}
                  x2={hoverFraction * VIEW_W}
                  y1={0}
                  y2={height}
                  strokeDasharray="4 4"
                  className="stroke-muted-foreground/50"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </svg>

            {/* Y-os: min/max vrijednost */}
            <span className="pointer-events-none absolute left-1.5 top-1 text-[0.625rem] text-muted-foreground/70">
              {formatSolarValue(max, axisUnit)} {axisUnit}
            </span>
            <span className="pointer-events-none absolute bottom-1 left-1.5 text-[0.625rem] text-muted-foreground/70">
              {formatSolarValue(min, axisUnit)} {axisUnit}
            </span>

            {/* Hover tooltip */}
            {hoverPoint && (
              <div
                ref={tooltipRef}
                className="pointer-events-none absolute top-1 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-lg"
                style={{ left: tooltipLeft }}
              >
                <p className="whitespace-nowrap font-semibold text-popover-foreground">
                  {formatDateTime(hoverPoint.timestamp)}
                </p>
                {series.map((s) => (
                  <p
                    key={s.key}
                    className="flex items-center gap-1.5 whitespace-nowrap text-muted-foreground"
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", s.dot)} />
                    {s.label}:{" "}
                    <span className="font-medium text-popover-foreground">
                      {formatSolarValue(hoverPoint[s.key], s.unit)} {s.unit}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* X-os: raspon vremena */}
          <div className="mt-1.5 flex justify-between text-[0.625rem] text-muted-foreground/70">
            <span>{formatDateTime(data[0]?.timestamp)}</span>
            <span>{formatDateTime(data[data.length - 1]?.timestamp)}</span>
          </div>
        </>
      )}
    </div>
  );
}
