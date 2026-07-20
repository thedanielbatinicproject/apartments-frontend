"use client";

import { Power, Loader2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRelayStatus } from "@/hooks/use-relay-status";
import { ErrorState } from "@/components/intranet/ui/DataStates";
import type { RelayStatusResponse } from "@/lib/api/types";

// ============================================================
// 4 gumba za daljinsko uključivanje/isključivanje releja.
//
// Sinkronizacija je REALTIME preko WebSocketa (useRelayStatus) —
// kad jedan korisnik klikne, svi ostali otvoreni tabovi/uređaji
// vide novo stanje čim ga ESP32 potvrdi, bez ručnog refresha.
//
// Stil: pravokutnik sa zaobljenim rubovima (NE pill/switch) —
// zelenkasta ispuna kad je uključeno, crvenkasti obrub kad je
// isključeno. Dok se čeka potvrda uređaja (pendingCommand), gumb
// prikazuje spinner umjesto ikone.
// ============================================================

const RELAY_IDS = [1, 2, 3, 4];
const RELAY_LABELS: Record<number, string> = {
  1: "Relej 1",
  2: "Relej 2",
  3: "Relej 3",
  4: "Relej 4",
};

export function RelayPanel() {
  const { relays, isLoading, error, connected, isSubmitting, toggle } =
    useRelayStatus(RELAY_IDS);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground sm:text-base">
          Upravljanje relejima
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-medium text-muted-foreground">
          <Circle
            className={cn(
              "h-2 w-2",
              connected
                ? "fill-emerald-500 text-emerald-500"
                : "fill-muted-foreground/40 text-muted-foreground/40"
            )}
          />
          {connected ? "Uživo" : "Povezivanje..."}
        </span>
      </div>

      {error != null && (
        <div className="mt-3">
          <ErrorState error={error} context="Dohvat statusa releja" compact />
        </div>
      )}

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RELAY_IDS.map((relayId, i) => (
          <RelayButton
            key={relayId}
            relayId={relayId}
            label={RELAY_LABELS[relayId] ?? `Relej ${relayId}`}
            status={relays[i]}
            isLoading={isLoading}
            isSubmitting={isSubmitting(relayId)}
            onToggle={(action) => void toggle(relayId, action)}
          />
        ))}
      </div>
    </div>
  );
}

function RelayButton({
  label,
  status,
  isLoading,
  isSubmitting,
  onToggle,
}: {
  relayId: number;
  label: string;
  status: RelayStatusResponse | null;
  isLoading: boolean;
  isSubmitting: boolean;
  onToggle: (action: "ON" | "OFF") => void;
}) {
  const isOn = status?.currentState === true;
  const isKnown = status?.currentState != null;
  const isPending = isSubmitting || (status?.pendingCommand ?? false);

  return (
    <button
      type="button"
      disabled={isLoading || isSubmitting}
      onClick={() => onToggle(isOn ? "OFF" : "ON")}
      aria-pressed={isOn}
      className={cn(
        "flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-2.5 text-center transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60",
        isOn
          ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-400"
          : isKnown
            ? "border-destructive/50 bg-transparent text-destructive"
            : "border-border bg-transparent text-muted-foreground"
      )}
    >
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Power className="h-3.5 w-3.5" />
        )}
        {label}
      </span>
      <span className="text-[0.6875rem] font-bold uppercase tracking-wide">
        {!isKnown ? "Nepoznato" : isOn ? "Uključeno" : "Isključeno"}
      </span>
    </button>
  );
}
