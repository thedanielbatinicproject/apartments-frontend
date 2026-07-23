"use client";

// ============================================================
// Realtime status releja preko STOMP/SockJS (§14 API-REFERENCE.md).
//
// ZAŠTO WebSocket, a ne polling: traženo je da se stanje gumba
// sinkronizira kod SVIH korisnika bez ručnog refresha. Backend već
// broadcasta RelayStatusResponse na /topic/solar-relay kad god se
// stanje promijeni (i kad ESP32 potvrdi komandu, i kad je netko
// drugi klikne) — pretplatom na tu temu svaki otvoreni tab dobije
// update odmah, bez ikakvog ponovnog dohvata.
//
// GET /relay/status i dalje treba za POČETNO stanje pri učitavanju
// (WebSocket ne "pamti" prošlost, samo šalje buduće promjene).
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getRelayStatus, toggleRelay } from "@/lib/api/solar";
import type { RelayAction, RelayStatusResponse } from "@/lib/api/types";
import { apiBaseUrl } from "@/lib/api/base-url";

const TOPIC_RELAY_STATUS = "/topic/solar-relay";

function wsUrl(): string {
  const base = apiBaseUrl();
  return `${base}/ws/solar`;
}

export function useRelayStatus(relayIds: number[]) {
  const [relays, setRelays] = useState<Record<number, RelayStatusResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [connected, setConnected] = useState(false);
  const [submittingIds, setSubmittingIds] = useState<Set<number>>(new Set());

  const applyStatus = useCallback((status: RelayStatusResponse) => {
    setRelays((prev) => ({ ...prev, [status.relayId]: status }));
  }, []);

  // Početno stanje
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const list = await getRelayStatus();
        if (cancelled) return;
        setRelays(Object.fromEntries(list.map((r) => [r.relayId, r])));
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // WebSocket pretplata — živi dok je komponenta montirana
  const applyStatusRef = useRef(applyStatus);
  useEffect(() => {
    applyStatusRef.current = applyStatus;
  }, [applyStatus]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl()) as unknown as WebSocket,
      reconnectDelay: 4000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(TOPIC_RELAY_STATUS, (message) => {
          try {
            const status = JSON.parse(message.body) as RelayStatusResponse;
            applyStatusRef.current(status);
          } catch {
            // Neispravan payload — zanemari, sljedeći broadcast dolazi uskoro
          }
        });
      },
      onWebSocketClose: () => setConnected(false),
    });

    client.activate();
    return () => {
      void client.deactivate();
    };
  }, []);

  const toggle = useCallback(
    async (relayId: number, action: RelayAction) => {
      setSubmittingIds((prev) => new Set(prev).add(relayId));
      try {
        const status = await toggleRelay(relayId, action);
        applyStatus(status);
      } finally {
        setSubmittingIds((prev) => {
          if (!prev.has(relayId)) return prev;
          const next = new Set(prev);
          next.delete(relayId);
          return next;
        });
      }
    },
    [applyStatus]
  );

  return {
    relays: relayIds.map((id) => relays[id] ?? null),
    isLoading,
    error,
    connected,
    isSubmitting: (id: number) => submittingIds.has(id),
    toggle,
  };
}
