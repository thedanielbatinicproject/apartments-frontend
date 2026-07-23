"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { Portal } from "@/components/ui/portal";

// ============================================================
// Javni mobilni izbornik — fullscreen glassmorphic overlay u
// dnevnoj paleti (--hs-*): danju svijetli "papir", noću taman —
// isti identitet kao ostatak sitea. Veliki tap targeti, staggered
// fade-in.
//
// PORTAL JE OBAVEZAN: PublicHeader ima backdrop-blur-md, a
// backdrop-filter stvara novi containing block za position:fixed
// potomke — bez portala se ovaj "fullscreen" overlay renderirao
// stisnut unutar ~60px visine headera umjesto preko cijelog ekrana
// (isti uzrok kao i kod LanguageGate/LanguageSwitcherButton).
// ============================================================

interface PublicMobileMenuProps {
  /** Linkovi dolaze iz PublicHeadera — već prevedeni */
  links: { href: string; label: string }[];
  bookLabel: string;
}

export function PublicMobileMenu({ links, bookLabel }: PublicMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Otvori izbornik"
        aria-expanded={open}
        className="tap-target -mr-2 flex items-center justify-center rounded-full [color:var(--hs-text-strong)] md:hidden"
      >
        <Menu className="h-6 w-6" strokeWidth={1.8} />
      </button>

      <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigacija"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] border-t border-white/10 backdrop-blur-2xl transition-all duration-300 ease-out md:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        style={{
          background: "color-mix(in oklab, var(--hs-paper) 68%, transparent)",
        }}
      >
        {/* Meki akcenti u paleti */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: "color-mix(in oklab, var(--hs-sun-glow) 30%, transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: "color-mix(in oklab, var(--hs-sea-far) 25%, transparent)",
          }}
        />

        <div className="relative flex h-dvh flex-col pt-safe pb-safe px-safe">
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <span className="text-lg font-semibold italic [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
              Apartments Šibenik
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zatvori izbornik"
              className="tap-target -mr-2 flex items-center justify-center rounded-full [color:var(--hs-text-strong)]"
            >
              <X className="h-6 w-6" strokeWidth={1.8} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-2 px-5">
            {links.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    transitionDelay: open ? `${100 + i * 60}ms` : "0ms",
                    background: isActive
                      ? "color-mix(in oklab, var(--hs-accent) 14%, var(--hs-card))"
                      : "var(--hs-card)",
                    borderColor: isActive
                      ? "color-mix(in oklab, var(--hs-accent) 45%, transparent)"
                      : "color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
                  }}
                  className={cn(
                    "group flex min-h-[3.75rem] items-center justify-between rounded-2xl border px-5",
                    "text-2xl font-semibold tracking-tight [font-family:var(--font-display)]",
                    "transition-all duration-300 ease-out active:scale-[0.98]",
                    open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                    isActive
                      ? "[color:var(--hs-accent)]"
                      : "[color:var(--hs-text-strong)]"
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

          <div className="shrink-0 px-5 pb-6">
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              style={{
                transitionDelay: open ? "340ms" : "0ms",
                background: "var(--hs-accent)",
              }}
              className={cn(
                "flex min-h-[3.25rem] items-center justify-center rounded-full px-6 text-base font-bold text-white",
                "transition-all duration-300 active:scale-[0.98]",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              {bookLabel}
            </Link>
          </div>
        </div>
      </div>
      </Portal>
    </>
  );
}
