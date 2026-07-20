"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AlertTriangle, Info, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Zamjena za window.confirm / window.alert.
//
// ZAŠTO: nativni browser dijalozi izgledaju kao sistemska
// upozorenja ("sus" popup), ne daju se stilizirati, na mobitelu
// se pojavljuju na vrhu ekrana izvan dohvata palca, i blokiraju
// cijelu JS nit dok stoje otvoreni.
//
// API je namjerno promise-based da zamjena bude doslovna:
//   if (window.confirm("...")) { ... }
//   if (await confirm({ title: "..." })) { ... }
//
// Mobile-first: na telefonu je bottom sheet (blizu palca), na
// desktopu centrirani dijalog.
// ============================================================

export interface ConfirmOptions {
  title: string;
  /** Glavno objašnjenje posljedice */
  description?: React.ReactNode;
  /** Dodatna upozorenja u okviru — npr. "ovo se ne može poništiti" */
  warning?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** destructive prikazuje crveni gumb i trokut */
  variant?: "default" | "destructive";
}

type Resolver = (value: boolean) => void;

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const resolverRef = useRef<Resolver | null>(null);

  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    setOptions(opts);
    setIsClosing(false);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const close = useCallback((result: boolean) => {
    setIsClosing(true);

    // Pusti izlaznu animaciju prije unmounta
    setTimeout(() => {
      setOptions(null);
      setIsClosing(false);
      resolverRef.current?.(result);
      resolverRef.current = null;

      // Vrati fokus na element koji je otvorio dijalog
      previouslyFocused.current?.focus?.();
    }, 150);
  }, []);

  const isOpen = options !== null;

  // Escape zatvara, Tab ostaje unutar dijaloga
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Zaključavanje scrolla ide kroz zajednički brojač — dijalog se
  // često otvara IZNAD drugog sloja (npr. detalja prijave), a
  // ručno pamćenje "originalne" vrijednosti je u tom slučaju
  // ostavljalo stranicu trajno zaključanom.
  useScrollLock(isOpen);

  // Fokusiraj potvrdni gumb pri otvaranju
  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => confirmButtonRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [isOpen]);

  const isDestructive = options?.variant === "destructive";
  const visible = isOpen && !isClosing;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {isOpen && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby={options.description ? "confirm-desc" : undefined}
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
        >
          {/* Zatamnjenje */}
          <div
            onClick={() => close(false)}
            className={cn(
              "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-150",
              visible ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Panel — bottom sheet na mobitelu, dijalog na desktopu */}
          <div
            className={cn(
              "relative w-full max-w-md",
              "max-h-[90dvh] overflow-y-auto scroll-touch",
              "rounded-t-3xl bg-card shadow-2xl sm:rounded-2xl",
              "pb-safe px-safe",
              "transition-all duration-150 ease-out",
              visible
                ? "translate-y-0 opacity-100 sm:scale-100"
                : "translate-y-4 opacity-0 sm:scale-95"
            )}
          >
            {/* Grab handle — signal da je ovo bottom sheet */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isDestructive
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {isDestructive ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2
                    id="confirm-title"
                    className="text-base font-semibold text-foreground text-balance sm:text-lg"
                  >
                    {options.title}
                  </h2>

                  {options.description && (
                    <div
                      id="confirm-desc"
                      className="mt-1.5 text-sm text-muted-foreground text-pretty"
                    >
                      {options.description}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => close(false)}
                  aria-label="Zatvori"
                  className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {options.warning && (
                <div className="mt-4 flex gap-2.5 rounded-xl border border-amber-500/30 bg-amber-50 px-3.5 py-3 dark:border-amber-500/25 dark:bg-amber-950/20">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div className="text-xs text-amber-800 text-pretty dark:text-amber-300">
                    {options.warning}
                  </div>
                </div>
              )}

              {/* Akcije — na mobitelu potvrda gore (bliže palcu u sheetu) */}
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="inline-flex min-h-[3rem] items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98] sm:min-h-[2.75rem]"
                >
                  {options.cancelLabel ?? "Odustani"}
                </button>

                <button
                  ref={confirmButtonRef}
                  type="button"
                  onClick={() => close(true)}
                  className={cn(
                    "inline-flex min-h-[3rem] items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98] sm:min-h-[2.75rem]",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-card",
                    isDestructive
                      ? "bg-destructive text-white hover:opacity-90"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {options.confirmLabel ?? "Potvrdi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

/**
 * Vraća funkciju koja otvara dijalog i razrješava se u true/false.
 *
 * Primjer:
 *   const confirm = useConfirm();
 *   if (await confirm({ title: "Obrisati?", variant: "destructive" })) { ... }
 */
export function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm mora biti pozvan unutar <ConfirmProvider>.");
  }
  return ctx.confirm;
}

/** Mali indikator za gumbe koji čekaju nakon potvrde. */
export function PendingDot() {
  return <Loader2 className="h-4 w-4 animate-spin" />;
}
