"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// Brojač s + i − gumbima.
//
// Postoji zato što je tipkanje brojeva na mobitelu spor i
// pogrešiv način unosa — otvara se numerička tipkovnica koja
// prekrije pola ekrana zbog jedne znamenke.
//
// Polje ostaje upisivo za veće skokove (npr. 14 noćenja), ali
// gumbi pokrivaju uobičajen slučaj (±1) s 48px tap targetom.
// ============================================================

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Dopušta decimale (npr. količina 2.5) */
  allowDecimal?: boolean;
  id?: string;
  disabled?: boolean;
  /** Tekst desno od broja, npr. "noći" */
  suffix?: string;
  className?: string;
}

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  allowDecimal = false,
  id,
  disabled = false,
  suffix,
  className,
}: NumberStepperProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  const nudge = (direction: -1 | 1) => {
    const next = clamp(Number((value + direction * step).toFixed(2)));
    onChange(next);
  };

  const buttonClass =
    "flex h-12 w-12 shrink-0 items-center justify-center text-muted-foreground transition-colors active:bg-muted disabled:opacity-30 sm:h-10 sm:w-10";

  return (
    <div
      className={cn(
        "flex items-stretch overflow-hidden rounded-xl border border-input bg-background",
        disabled && "opacity-50",
        className
      )}
    >
      <button
        type="button"
        onClick={() => nudge(-1)}
        disabled={disabled || value <= min}
        aria-label="Smanji"
        className={cn(buttonClass, "border-r border-input")}
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2">
        <input
          id={id}
          type="number"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          step={allowDecimal ? "any" : step}
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const parsed = Number(e.target.value.replace(",", "."));
            if (Number.isFinite(parsed)) onChange(clamp(parsed));
            else if (e.target.value === "") onChange(min);
          }}
          className={cn(
            "w-full min-w-0 border-0 bg-transparent p-0 text-center font-semibold text-foreground",
            "focus:outline-none focus:ring-0",
            // Sakrij nativne strelice — imamo svoje gumbe
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          )}
        />
        {suffix && (
          <span className="shrink-0 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => nudge(1)}
        disabled={disabled || value >= max}
        aria-label="Povećaj"
        className={cn(buttonClass, "border-l border-input")}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
