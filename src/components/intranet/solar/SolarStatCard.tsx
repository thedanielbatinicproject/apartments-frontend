import type { LucideIcon } from "lucide-react";
import { InfoTooltip } from "@/components/intranet/ui/InfoTooltip";
import { formatSolarValue } from "@/lib/solar-utils";
import { cn } from "@/lib/utils";

// ============================================================
// Jedna kartica u solar gridu — label + vrijednost + info-tooltip.
//
// batterySoc dobiva dodatnu mini traku napunjenosti — postotak je
// jedina varijabla ovdje s prirodnim, univerzalnim 0-100 rasponom
// koji ima smisla vizualizirati bez poznavanja kemije baterije.
// ============================================================

interface SolarStatCardProps {
  label: string;
  value: number | null | undefined;
  unit: string;
  icon: LucideIcon;
  description: string;
  /** Prikazuje mini progress traku (0-100) — koristi se za SoC */
  progress?: boolean;
}

export function SolarStatCard({
  label,
  value,
  unit,
  icon: Icon,
  description,
  progress = false,
}: SolarStatCardProps) {
  const displayValue = formatSolarValue(value, unit);
  const progressPct =
    progress && value != null && Number.isFinite(value)
      ? Math.min(100, Math.max(0, value))
      : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          <h3 className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            {label}
          </h3>
        </div>
        <InfoTooltip>{description}</InfoTooltip>
      </div>

      <p className="mt-2 text-xl font-bold text-foreground sm:text-2xl">
        {displayValue}
        {displayValue !== "—" && unit && (
          <span className="ml-1 text-sm font-medium text-muted-foreground">
            {unit}
          </span>
        )}
      </p>

      {progressPct != null && (
        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progressPct < 20
                ? "bg-destructive"
                : progressPct < 50
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            )}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
    </div>
  );
}
