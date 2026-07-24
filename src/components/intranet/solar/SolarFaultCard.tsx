import { AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { InfoTooltip } from "@/components/intranet/ui/InfoTooltip";
import { cn } from "@/lib/utils";

// ============================================================
// Kartica za bitmaska greške/upozorenja invertera/MPPT punjača —
// umjesto sirovog broja odmah prikazuje KOJA je greška u pitanju
// (moguće je više aktivnih istovremeno, otud niz).
// ============================================================

interface SolarFaultCardProps {
  label: string;
  description: string;
  kind: "error" | "warning";
  /** Već dekodirani tekstovi aktivnih grešaka/upozorenja (prazno = nema aktivnih) */
  active: string[];
}

export function SolarFaultCard({
  label,
  description,
  kind,
  active,
}: SolarFaultCardProps) {
  const hasActive = active.length > 0;
  const Icon = !hasActive ? CheckCircle2 : kind === "error" ? AlertOctagon : AlertTriangle;

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 shadow-sm sm:p-5",
        hasActive
          ? kind === "error"
            ? "border-destructive/40 bg-destructive/5"
            : "border-amber-500/40 bg-amber-500/5"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Icon
            className={cn(
              "h-4 w-4 shrink-0",
              !hasActive
                ? "text-emerald-500"
                : kind === "error"
                  ? "text-destructive"
                  : "text-amber-500"
            )}
          />
          <h3 className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            {label}
          </h3>
        </div>
        <InfoTooltip>{description}</InfoTooltip>
      </div>

      {!hasActive ? (
        <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {kind === "error" ? "Nema aktivnih grešaka" : "Nema aktivnih upozorenja"}
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {active.map((text) => (
            <li
              key={text}
              className={cn(
                "text-sm font-semibold leading-snug",
                kind === "error" ? "text-destructive" : "text-amber-600 dark:text-amber-400"
              )}
            >
              {text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
