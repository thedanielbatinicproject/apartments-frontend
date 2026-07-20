import type { SolarAggregateResponse } from "@/lib/api/types";
import {
  periodLabel,
  formatSolarValueWithUnit,
  formatSolarRange,
} from "@/lib/solar-utils";

// ============================================================
// Jedna kartica kumulativnog izvještaja (tjedni ili mjesečni) —
// predizračunat na backendu, ovdje samo prikazujemo.
// ============================================================

interface SolarAggregateCardProps {
  aggregate: SolarAggregateResponse;
}

export function SolarAggregateCard({ aggregate }: SolarAggregateCardProps) {
  const items: { label: string; value: string }[] = [
    {
      label: "Proizvodnja",
      value: formatSolarValueWithUnit(aggregate.totalYieldKwh, "kWh"),
    },
    {
      label: "Potrošnja",
      value: formatSolarValueWithUnit(aggregate.totalConsumptionKwh, "kWh"),
    },
    {
      label: "Prosj. napon baterije",
      value: formatSolarValueWithUnit(aggregate.avgBatteryVoltage, "V"),
    },
    {
      label: "Napon (min–maks)",
      value: formatSolarRange(
        aggregate.minBatteryVoltage,
        aggregate.maxBatteryVoltage,
        "V"
      ),
    },
    {
      label: "Min. napunjenost",
      value: formatSolarValueWithUnit(aggregate.minBatterySoc, "%"),
    },
    {
      label: "Vršna PV snaga",
      value: formatSolarValueWithUnit(aggregate.peakPvPower, "W"),
    },
    {
      label: "Prosj. PV snaga",
      value: formatSolarValueWithUnit(aggregate.avgPvPower, "W"),
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground text-balance">
          {periodLabel(aggregate)}
        </h4>
        <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground">
          {aggregate.readingCount} očitanja
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="truncate text-[0.6875rem] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
