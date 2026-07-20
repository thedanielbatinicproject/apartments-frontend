"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV_ITEMS, isNavItemActive } from "@/lib/navigation";

// ============================================================
// Mobilna bottom navigacija (vidljiva samo ispod lg breakpointa).
//
// Dizajnerske odluke:
//  - Fiksirana na dnu jer je to zona koju palac najlakše doseže
//    na velikim telefonima (thumb zone).
//  - pb-safe-nav gura sadržaj iznad iPhone home indicatora.
//  - Svaki tab je min 56px visok → udoban tap target (HIG traži 44px).
//  - Aktivni tab ima i ikonu i boju + gornju crticu, ne oslanja se
//    samo na boju (pristupačnost za daltoniste).
// ============================================================

interface IntranetBottomNavProps {
  onOpenDrawer: () => void;
  isDrawerOpen: boolean;
}

export function IntranetBottomNav({
  onOpenDrawer,
  isDrawerOpen,
}: IntranetBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Glavna navigacija"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "border-t border-border bg-card/95 backdrop-blur-lg",
        "pb-safe-nav px-safe"
      )}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = !isDrawerOpen && isNavItemActive(item.href, pathname);
          const Icon = item.icon;

          // Istaknuta stavka: crna kružnica s bijelom ikonom,
          // izdignuta iznad trake — glavna radnja na mobitelu.
          if (item.bottomNavSpecial) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-end gap-1 px-1 pb-1"
              >
                <span
                  className={cn(
                    "absolute -top-4 flex h-14 w-14 items-center justify-center rounded-full",
                    "bg-foreground text-background shadow-lg",
                    "ring-4 ring-card transition-transform active:scale-95",
                    isActive && "scale-105"
                  )}
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <span
                  className={cn(
                    "text-[0.625rem] leading-none font-semibold tracking-tight",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.shortLabel ?? item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 pb-1",
                "transition-colors active:bg-muted/60",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {/* Indikator aktivne stavke — vizualni signal uz boju */}
              <span
                className={cn(
                  "absolute top-0 h-0.5 w-8 rounded-full transition-all",
                  isActive ? "bg-primary opacity-100" : "opacity-0"
                )}
              />
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-transform",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.4 : 1.8}
              />
              <span
                className={cn(
                  "text-[0.625rem] leading-none font-medium tracking-tight",
                  isActive && "font-semibold"
                )}
              >
                {item.shortLabel ?? item.label}
              </span>
            </Link>
          );
        })}

        {/* Gumb "Više" — otvara drawer s ostalim rutama i profilom */}
        <button
          type="button"
          onClick={onOpenDrawer}
          aria-expanded={isDrawerOpen}
          aria-haspopup="dialog"
          className={cn(
            "relative flex min-h-[3.5rem] flex-1 flex-col items-center justify-center gap-1 px-1 pt-2 pb-1",
            "transition-colors active:bg-muted/60",
            isDrawerOpen ? "text-primary" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "absolute top-0 h-0.5 w-8 rounded-full transition-all",
              isDrawerOpen ? "bg-primary opacity-100" : "opacity-0"
            )}
          />
          <Menu
            className={cn(
              "h-5 w-5 shrink-0 transition-transform",
              isDrawerOpen && "scale-110"
            )}
            strokeWidth={isDrawerOpen ? 2.4 : 1.8}
          />
          <span
            className={cn(
              "text-[0.625rem] leading-none font-medium tracking-tight",
              isDrawerOpen && "font-semibold"
            )}
          >
            Više
          </span>
        </button>
      </div>
    </nav>
  );
}
