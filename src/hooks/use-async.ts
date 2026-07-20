"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// use-async — dohvat podataka s backenda uz loading/error/retry.
//
// Namjerno bez React Query: projekt zasad nema tu ovisnost, a
// potrebe su jednostavne (dohvati, prikaži, osvježi nakon akcije).
//
// Ključno za ovaj projekt: greška se NE guta. Čuvamo cijeli
// error objekt da UI može prikazati HTTP status i poruku backenda.
// ============================================================

export interface AsyncState<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;
  /** true samo pri prvom učitavanju — za razlikovanje skeletona od refresha */
  isInitialLoading: boolean;
  /** Ponovno dohvaća podatke (npr. nakon spremanja ili klika "Pokušaj ponovo") */
  refetch: () => Promise<void>;
  /** Lokalna izmjena podataka bez novog poziva (optimistic update) */
  setData: (updater: T | ((prev: T | null) => T | null)) => void;
}

export function useAsync<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: { enabled?: boolean } = {}
): AsyncState<T> {
  const { enabled = true } = options;

  const [data, setDataState] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Drži najnoviji fetcher bez da retrigerira efekt
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Sprječava setState nakon unmounta i race condition između
  // dva brza poziva (prikazao bi se rezultat starijeg).
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setDataState(result);
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return;
      setError(err);
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setIsLoading(false);
        setHasLoadedOnce(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const setData = useCallback(
    (updater: T | ((prev: T | null) => T | null)) => {
      setDataState((prev) =>
        typeof updater === "function"
          ? (updater as (p: T | null) => T | null)(prev)
          : updater
      );
    },
    []
  );

  return {
    data,
    error,
    isLoading,
    isInitialLoading: isLoading && !hasLoadedOnce,
    refetch: run,
    setData,
  };
}

// ============================================================
// use-mutation — za akcije koje mijenjaju podatke (spremi, obriši).
// ============================================================

export interface MutationState<TArgs extends unknown[], TResult> {
  run: (...args: TArgs) => Promise<TResult | undefined>;
  isPending: boolean;
  error: unknown;
  reset: () => void;
}

export function useMutation<TArgs extends unknown[], TResult>(
  mutator: (...args: TArgs) => Promise<TResult>,
  options: {
    onSuccess?: (result: TResult) => void | Promise<void>;
    onError?: (error: unknown) => void;
  } = {}
): MutationState<TArgs, TResult> {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const mutatorRef = useRef(mutator);
  mutatorRef.current = mutator;

  const run = useCallback(async (...args: TArgs) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await mutatorRef.current(...args);
      await optionsRef.current.onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      optionsRef.current.onError?.(err);
      return undefined;
    } finally {
      setIsPending(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { run, isPending, error, reset };
}
