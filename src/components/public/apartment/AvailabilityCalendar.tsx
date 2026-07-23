"use client";

import { useMemo } from "react";
import { useAsync } from "@/hooks/use-async";
import { getBookedPeriods } from "@/lib/api/calendar";
import type { BookedPeriodResponse } from "@/lib/api/types";

// ============================================================
// Read-only pregled zauzetosti — NE booking forma. Stvarna
// rezervacija ide preko Airbnba (vidi AirbnbCard).
// ============================================================

interface AvailabilityCalendarLabels {
  title: string;
  legendFree: string;
  legendBooked: string;
  bookHint: string;
  error: string;
  retry: string;
  weekdays: string[];
}

interface AvailabilityCalendarProps {
  apartmentId: number;
  labels: AvailabilityCalendarLabels;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isBooked(dateStr: string, periods: BookedPeriodResponse[]): boolean {
  return periods.some((p) => dateStr >= p.startDate && dateStr < p.endDate);
}

function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

export function AvailabilityCalendar({
  apartmentId,
  labels,
}: AvailabilityCalendarProps) {
  const periods = useAsync(() => getBookedPeriods(apartmentId), [apartmentId]);
  const data = periods.data;

  const now = useMemo(() => new Date(), []);
  const todayStr = toISODate(now);

  const months = useMemo(
    () =>
      [0, 1].map((offset) => {
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        return {
          year: d.getFullYear(),
          month: d.getMonth(),
          cells: buildMonthGrid(d.getFullYear(), d.getMonth()),
        };
      }),
    [now]
  );

  return (
    <div
      className="rounded-3xl p-5 sm:p-6"
      style={{
        background: "var(--hs-card)",
        border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
      }}
    >
      <h3 className="text-lg font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
        {labels.title}
      </h3>

      {periods.isLoading && !data && (
        <div
          className="mt-4 h-48 animate-pulse rounded-2xl"
          style={{ background: "color-mix(in oklab, var(--hs-text-soft) 12%, transparent)" }}
        />
      )}

      {Boolean(periods.error) && (
        <div className="mt-4 text-center text-sm [color:var(--hs-text-soft)]">
          {labels.error}
          <button
            onClick={() => void periods.refetch()}
            className="mt-2 block w-full font-semibold underline underline-offset-2 [color:var(--hs-accent)]"
          >
            {labels.retry}
          </button>
        </div>
      )}

      {data && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {months.map(({ year, month, cells }) => (
              <div key={`${year}-${month}`}>
                <p className="mb-2 text-center text-sm font-semibold capitalize [color:var(--hs-text-strong)]">
                  {new Date(year, month, 1).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div
                  className="grid grid-cols-7 gap-1 text-center text-[0.6875rem]"
                  style={{ color: "color-mix(in oklab, var(--hs-text-soft) 80%, transparent)" }}
                >
                  {labels.weekdays.map((w, i) => (
                    <span key={i}>{w}</span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {cells.map((date, i) => {
                    if (!date) return <span key={i} />;
                    const dateStr = toISODate(date);
                    const booked = isBooked(dateStr, data);
                    const isPast = dateStr < todayStr;
                    return (
                      <span
                        key={i}
                        className={
                          "flex aspect-square items-center justify-center rounded-lg text-xs" +
                          (booked && !isPast ? " font-bold shadow-sm" : "")
                        }
                        style={{
                          color: isPast
                            ? "color-mix(in oklab, var(--hs-text-soft) 45%, transparent)"
                            : booked
                              ? "#ffffff"
                              : "color-mix(in oklab, var(--hs-accent) 90%, black 5%)",
                          background: isPast
                            ? booked
                              ? "color-mix(in oklab, #dc2626 20%, transparent)"
                              : "transparent"
                            : booked
                              ? "#dc2626"
                              : "color-mix(in oklab, var(--hs-accent) 12%, transparent)",
                        }}
                      >
                        {date.getDate()}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs [color:var(--hs-text-soft)]">
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "color-mix(in oklab, var(--hs-accent) 60%, transparent)" }}
              />
              {labels.legendFree}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "#dc2626" }}
              />
              {labels.legendBooked}
            </span>
          </div>
        </>
      )}

      <p className="mt-3 text-center text-xs [color:var(--hs-text-soft)]">
        {labels.bookHint}
      </p>
    </div>
  );
}
