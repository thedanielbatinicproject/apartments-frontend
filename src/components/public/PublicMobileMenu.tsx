"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Javni mobilni izbornik — fullscreen glassmorphic overlay.
//
// Prije ovoga javni dio NIJE imao nikakvu navigaciju na mobitelu
// (nav je bio hidden md:flex), pa mobilni posjetitelj nije mogao
// doći ni na jednu stranicu osim početne.
//
// Stil prati "premium mediteranski" smjer iz AGENTS.md:
// zamućena pozadina, veliki tap targeti, staggered fade-in.
// ============================================================

const NAV_LINKS = [
  { href: "/", label: "Početna" },
  { href: "/apartmani", label: "Apartmani" },
  { href: "/o-sibeniku", label: "O Šibeniku" },
  { href: "/kontakt", label: "Kontakt" },
];

export function PublicMobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Zajedničko zaključavanje scrolla (brojač) — vidi use-scroll-lock
  useScrollLock(open);


  // Escape zatvara izbornik
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Zatvori pri promjeni rute
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger — samo mobitel/tablet */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Otvori izbornik"
        aria-expanded={open}
        className="tap-target -mr-2 flex items-center justify-center rounded-full text-stone-200 transition-colors active:bg-stone-800/60 md:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={1.8} />
      </button>

      {/* Fullscreen overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigacija"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] md:hidden",
          "bg-stone-950/80 backdrop-blur-2xl",
          "transition-all duration-300 ease-out",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Dekorativni mediteranski gradijenti */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex h-dvh flex-col pt-safe pb-safe px-safe">
          {/* Zaglavlje overlaya */}
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <span className="text-lg font-bold tracking-tight text-stone-100">
              Apartments <span className="text-teal-400">Šibenik</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zatvori izbornik"
              className="tap-target -mr-2 flex items-center justify-center rounded-full text-stone-300 transition-colors active:bg-stone-800/60"
            >
              <X className="h-6 w-6" strokeWidth={1.8} />
            </button>
          </div>

          {/* Linkovi — veliki, lako pogodivi, vertikalno centrirani */}
          <nav className="flex flex-1 flex-col justify-center gap-1 px-5">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    transitionDelay: open ? `${100 + i * 60}ms` : "0ms",
                  }}
                  className={cn(
                    "group flex min-h-[3.75rem] items-center justify-between",
                    "rounded-2xl border border-stone-800/50 bg-stone-900/40 px-5",
                    "text-2xl font-semibold tracking-tight",
                    "transition-all duration-300 ease-out active:scale-[0.98]",
                    open
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0",
                    isActive
                      ? "border-teal-500/40 bg-teal-500/10 text-teal-300"
                      : "text-stone-200"
                  )}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight
                    className={cn(
                      "h-5 w-5 shrink-0 transition-opacity",
                      isActive ? "opacity-70" : "opacity-30"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA na dnu — u zoni palca */}
          <div className="shrink-0 px-5 pb-6">
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? "340ms" : "0ms" }}
              className={cn(
                "flex min-h-[3.25rem] items-center justify-center rounded-full",
                "bg-teal-500 px-6 text-base font-semibold text-stone-950",
                "shadow-lg shadow-teal-500/20 transition-all duration-300 active:scale-[0.98]",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              Rezerviraj boravak
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
