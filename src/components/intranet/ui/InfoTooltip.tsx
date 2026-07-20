"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

// SSR-safe "je li montirano na klijentu" bez setState-a u efektu
// (React-ov preporučeni obrazac za ovakve slučajeve — vidi
// react-hooks/set-state-in-effect).
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ============================================================
// Malo info-dugme uz naslov kartice — objašnjava što podatak
// znači (npr. "Napon baterije" → "Ova kartica prikazuje...").
//
// Hover otkriva panel na desktopu (pointerenter/leave filtrirano na
// pointerType "mouse"). Touch uređaji nemaju pravi hover, pa tap
// (obični onClick) prebacuje stanje i drži panel otvorenim dok
// korisnik ne dodirne izvan njega ili pritisne Escape.
//
// Pozicija je posve JS-računata i panel se portala u <body>
// (createPortal) — NE oslanja se na CSS postotke/transform unutar
// kartice. Razlog: kartica može biti uska (mobitel) ili blizu ruba
// grida, pa bi bilo koje fiksno CSS poravnanje povremeno gurnulo
// panel napola izvan ekrana. Ovako se prije prikaza uvijek mjeri
// stvarna širina/visina panela i gumba te se pozicija stisne unutar
// vidljivog prozora (viewport), s marginom od 8px sa svake strane.
// ============================================================

interface InfoTooltipProps {
  children: React.ReactNode;
  className?: string;
}

const MARGIN = 8;

export function InfoTooltip({ children, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const reposition = useCallback(() => {
    const button = buttonRef.current;
    const tooltip = tooltipRef.current;
    if (!button || !tooltip) return;

    const buttonRect = button.getBoundingClientRect();
    const w = tooltip.offsetWidth;
    const h = tooltip.offsetHeight;

    // Zadano: desno poravnat uz gumb (raste ulijevo) — gumb je
    // uobičajeno na desnom rubu retka. Uvijek stisnuto unutar
    // viewporta, nikad unutar roditelja.
    let left = buttonRect.right - w;
    left = Math.min(Math.max(left, MARGIN), window.innerWidth - w - MARGIN);

    let top = buttonRect.bottom + 6;
    if (top + h > window.innerHeight - MARGIN) {
      // Nema mjesta ispod (npr. gumb pri dnu ekrana) — prikaži iznad
      top = buttonRect.top - h - 6;
    }
    top = Math.max(MARGIN, top);

    setCoords({ left, top });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    reposition();

    const onViewportChange = () => reposition();
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        tooltipRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const tooltip = (
    <div
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      style={{ left: coords.left, top: coords.top }}
      className={cn(
        "fixed z-50 w-56 max-w-[calc(100vw-1rem)] text-pretty rounded-xl border border-border bg-popover px-3 py-2 text-xs leading-relaxed text-popover-foreground shadow-lg transition-opacity duration-150",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {children}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setOpen(true);
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setOpen(false);
        }}
        aria-expanded={open}
        aria-describedby={tooltipId}
        aria-label="Objašnjenje podatka"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      {mounted && createPortal(tooltip, document.body)}
    </>
  );
}
