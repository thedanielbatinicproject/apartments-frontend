"use client";

import { useEffect, useState } from "react";
import {
  Sun,
  RefreshCw,
  Battery,
  BatteryCharging,
  Zap,
  Activity,
  Thermometer,
  Plug,
  TrendingUp,
  TrendingDown,
  Cpu,
  Gauge,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/hooks/use-async";
import {
  getLatestReading,
  getChartData,
  getVariables,
  getWeeklyReports,
  getMonthlyReports,
} from "@/lib/api/solar";
import type { SolarChartRange } from "@/lib/api/types";
import {
  FIELD_GROUPS,
  resolveFieldMeta,
  CHART_RANGES,
  formatDateTime,
  timeAgo,
} from "@/lib/solar-utils";
import { SolarStatCard } from "@/components/intranet/solar/SolarStatCard";
import { SolarLineChart } from "@/components/intranet/solar/SolarLineChart";
import { SolarAggregateCard } from "@/components/intranet/solar/SolarAggregateCard";
import {
  AsyncBoundary,
  EmptyState,
  LoadingState,
  SkeletonList,
} from "@/components/intranet/ui/DataStates";

// ============================================================
// /intranet/solar — pregled solarnog/baterijskog sustava.
//
// Samo čitanje: koristimo isključivo ADMIN GET rute iz §14
// API-REFERENCE.md (latest, chart-data, variables, reports/*).
// Upravljanje relejima (POST /solar/relay/*) namjerno nije dio
// ovog ekrana — traženo je samo praćenje podataka.
//
// "Realtime" osjećaj bez websocketa: periodično osvježavanje
// zadnjeg očitanja (vidi useEffect niže).
// ============================================================

const ICON_MAP: Partial<Record<string, LucideIcon>> = {
  batteryVoltage: Battery,
  batteryCurrent: Zap,
  batteryPower: Activity,
  batterySoc: BatteryCharging,
  batteryTemperature: Thermometer,
  pvVoltage: Sun,
  pvCurrent: Sun,
  pvPower: Sun,
  loadVoltage: Plug,
  loadCurrent: Plug,
  loadPower: Plug,
  yieldToday: TrendingUp,
  consumptionToday: TrendingDown,
  controllerStatus: Cpu,
};

type ReportTab = "WEEKLY" | "MONTHLY";

const tabButtonClass = (active: boolean) =>
  cn(
    "min-h-[2.25rem] rounded-lg border px-2.5 text-xs font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-card text-muted-foreground hover:text-foreground"
  );

export default function SolarPage() {
  const [range, setRange] = useState<SolarChartRange>("24h");
  const [reportTab, setReportTab] = useState<ReportTab>("WEEKLY");
  const [showAllReports, setShowAllReports] = useState(false);

  const latest = useAsync(() => getLatestReading(), []);
  const variables = useAsync(() => getVariables(), []);
  const chart = useAsync(() => getChartData(range), [range]);
  const weekly = useAsync(() => getWeeklyReports(), []);
  const monthly = useAsync(() => getMonthlyReports(), []);

  // Umjeren interval (30s) — dovoljno za "uživo" osjećaj, a ne
  // preplavljuje backend upitima dok admin samo gleda ekran.
  useEffect(() => {
    const interval = setInterval(() => {
      void latest.refetch();
    }, 30_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAll = () => {
    void latest.refetch();
    void variables.refetch();
    void chart.refetch();
    void weekly.refetch();
    void monthly.refetch();
  };

  const isRefreshing = latest.isLoading && !latest.isInitialLoading;
  const reports = reportTab === "WEEKLY" ? weekly : monthly;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Zaglavlje */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Solarni sustav
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {latest.data ? (
              <span className="truncate">
                Zadnje očitanje {timeAgo(latest.data.timestamp)} ·{" "}
                {formatDateTime(latest.data.timestamp)}
              </span>
            ) : (
              "Praćenje baterije, proizvodnje i potrošnje u stvarnom vremenu"
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={refreshAll}
          disabled={latest.isLoading}
          aria-label="Osvježi"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </button>
      </div>

      {/* Grid kartica — grupirano po Baterija / PV / Load / Danas */}
      <AsyncBoundary
        isLoading={latest.isLoading}
        error={latest.error}
        data={latest.data}
        onRetry={() => void latest.refetch()}
        context="Dohvat solarnih podataka"
        loadingFallback={<SkeletonList count={6} />}
        emptyFallback={
          <EmptyState
            icon={Sun}
            title="Nema očitanja"
            description="Uređaj na terenu još nije poslao nijedno očitanje."
          />
        }
      >
        {(reading) => (
          <div className="space-y-5">
            {FIELD_GROUPS.map((group) => (
              <div key={group.group}>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {group.keys.map((key) => {
                    const meta = resolveFieldMeta(key, variables.data);
                    const Icon = ICON_MAP[key] ?? Gauge;

                    return (
                      <SolarStatCard
                        key={key}
                        label={meta.label}
                        value={reading[key]}
                        unit={meta.unit}
                        icon={Icon}
                        description={meta.description}
                        progress={key === "batterySoc"}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </AsyncBoundary>

      {/* Grafovi povijesti */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">
            Povijest očitanja
          </h3>
          <div className="flex gap-1.5">
            {CHART_RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRange(r.value)}
                className={tabButtonClass(range === r.value)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <AsyncBoundary
          isLoading={chart.isLoading}
          error={chart.error}
          data={chart.data}
          onRetry={() => void chart.refetch()}
          context="Dohvat povijesti očitanja"
          loadingFallback={
            <div className="mt-4">
              <LoadingState label="Učitavanje grafa..." />
            </div>
          }
          emptyFallback={
            <div className="mt-4">
              <EmptyState title="Nema podataka za odabrani period" />
            </div>
          }
        >
          {(points) => (
            <div className="mt-5 space-y-6">
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Napon baterije
                </p>
                <SolarLineChart
                  data={points}
                  series={[
                    {
                      key: "batteryVoltage",
                      label: "Napon baterije",
                      unit: "V",
                      stroke: "stroke-foreground",
                      dot: "bg-foreground",
                    },
                  ]}
                />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Napunjenost baterije
                </p>
                <SolarLineChart
                  data={points}
                  series={[
                    {
                      key: "batterySoc",
                      label: "Napunjenost",
                      unit: "%",
                      stroke: "stroke-emerald-500 dark:stroke-emerald-400",
                      dot: "bg-emerald-500",
                    },
                  ]}
                  yDomain={[0, 100]}
                />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Snaga — proizvodnja i potrošnja
                </p>
                <SolarLineChart
                  data={points}
                  series={[
                    {
                      key: "pvPower",
                      label: "PV proizvodnja",
                      unit: "W",
                      stroke: "stroke-amber-500 dark:stroke-amber-400",
                      dot: "bg-amber-500",
                    },
                    {
                      key: "loadPower",
                      label: "Potrošnja",
                      unit: "W",
                      stroke: "stroke-blue-500 dark:stroke-blue-400",
                      dot: "bg-blue-500",
                    },
                  ]}
                />
              </div>
            </div>
          )}
        </AsyncBoundary>
      </div>

      {/* Kumulativni izvještaji */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">
            Kumulativni izvještaji
          </h3>
          <div className="flex gap-1.5">
            {(["WEEKLY", "MONTHLY"] as ReportTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setReportTab(tab);
                  setShowAllReports(false);
                }}
                className={tabButtonClass(reportTab === tab)}
              >
                {tab === "WEEKLY" ? "Tjedno" : "Mjesečno"}
              </button>
            ))}
          </div>
        </div>

        <AsyncBoundary
          isLoading={reports.isLoading}
          error={reports.error}
          data={reports.data}
          onRetry={() => void reports.refetch()}
          context="Dohvat izvještaja"
          loadingFallback={<SkeletonList count={2} />}
          emptyFallback={
            <EmptyState
              title="Još nema izračunatih izvještaja"
              description="Izvještaji se generiraju automatski nakon što prođe barem jedan puni period."
            />
          }
        >
          {(data) => {
            const sorted = [...data].sort((a, b) =>
              b.periodStart.localeCompare(a.periodStart)
            );
            const visible = showAllReports ? sorted : sorted.slice(0, 6);

            return (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {visible.map((agg) => (
                    <SolarAggregateCard
                      key={`${agg.periodType}-${agg.periodStart}`}
                      aggregate={agg}
                    />
                  ))}
                </div>

                {sorted.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllReports((v) => !v)}
                    className="mt-3 inline-flex min-h-[2.5rem] items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    {showAllReports
                      ? "Prikaži manje"
                      : `Prikaži sve (${sorted.length})`}
                  </button>
                )}
              </>
            );
          }}
        </AsyncBoundary>
      </div>
    </div>
  );
}
