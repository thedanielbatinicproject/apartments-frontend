"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  DRAWER_NAV_ITEMS,
  isNavItemActive,
  visibleNavItems,
} from "@/lib/navigation";
import { useScrollLock } from "@/hooks/use-scroll-lock";

// ============================================================
// Mobilni "Više" drawer — klizi odozdo (bottom sheet).
//
// Zašto odozdo, a ne sa strane:
//  - otvara ga gumb u bottom navigaciji, pa je pokret prirodan
//  - sadržaj završava blizu palca, ne na vrhu ekrana
//
// Uključuje: sekundarne rute, profil korisnika i odjavu.
// ============================================================

interface IntranetMobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function IntranetMobileDrawer({
  open,
  onClose,
}: IntranetMobileDrawerProps) {
  // Zajedničko zaključavanje scrolla (brojač) — vidi use-scroll-lock
  useScrollLock(open);

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);

  const items = visibleNavItems(DRAWER_NAV_ITEMS, user?.role);


  // Escape zatvara drawer (za korisnike s vanjskom tipkovnicom)
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Zatvori drawer pri promjeni rute
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/intranet/login";
  };

  return (
    <>
      {/* Zatamnjena pozadina */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Dodatne opcije"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 lg:hidden",
          "max-h-[85dvh] overflow-y-auto scroll-touch",
          "rounded-t-3xl border-t border-border bg-card shadow-2xl",
          "pb-safe px-safe",
          "transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Grab handle — vizualni signal da je ovo bottom sheet */}
        <div className="sticky top-0 z-10 flex flex-col items-center bg-card pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
        </div>

        <div className="flex items-center justify-between px-5 pb-3">
          <h2 className="text-base font-semibold text-foreground">Izbornik</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zatvori izbornik"
            className="tap-target flex items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sekundarne rute */}
        <nav className="space-y-1 px-3 pb-2">
          {items.map((item) => {
            const isActive = isNavItemActive(item.href, pathname);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[3rem] items-center gap-3 rounded-xl px-3 text-[0.9375rem] font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground active:bg-muted"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.superAdminOnly && (
                  <span className="rounded px-1.5 py-0.5 text-[0.625rem] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    SA
                  </span>
                )}
                <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
              </Link>
            );
          })}
        </nav>

        {/* Profil + odjava */}
        <div className="mt-2 border-t border-border px-3 pt-3 pb-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground uppercase">
              {user?.fullName?.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.fullName ?? "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground break-anywhere">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border border-border text-[0.9375rem] font-semibold text-destructive transition-colors active:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Odjava
          </button>
        </div>
      </div>
    </>
  );
}
