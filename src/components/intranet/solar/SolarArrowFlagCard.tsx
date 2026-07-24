import { ArrowLeftRight } from "lucide-react";
import { InfoTooltip } from "@/components/intranet/ui/InfoTooltip";
import type { DecodedArrowSegment } from "@/lib/solar-fault-codes";

// ============================================================
// Kartica za inverterArrowFlag — brojčana bitmaska koja opisuje
// smjer toka energije kroz sustav (PV → opterećenje, baterija →
// mreža, itd.). Prikazuje svaki dekodirani segment kao zaseban
// redak umjesto sirovog broja.
// ============================================================

interface SolarArrowFlagCardProps {
  label: string;
  description: string;
  segments: DecodedArrowSegment[];
}

export function SolarArrowFlagCard({
  label,
  description,
  segments,
}: SolarArrowFlagCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:col-span-2 sm:p-5 lg:col-span-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <ArrowLeftRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          <h3 className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            {label}
          </h3>
        </div>
        <InfoTooltip>{description}</InfoTooltip>
      </div>

      {segments.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">—</p>
      ) : (
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 xs:grid-cols-2 lg:grid-cols-4">
          {segments.map((segment) => (
            <div key={segment.name} className="min-w-0">
              <dt className="truncate text-[0.6875rem] text-muted-foreground">
                {segment.name}
              </dt>
              <dd className="truncate text-sm font-semibold text-foreground">
                {segment.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
