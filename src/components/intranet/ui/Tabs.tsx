"use client";

import { cn } from "@/lib/utils";

// ============================================================
// Tabovi s horizontalnim scrollom na mobitelu.
//
// Zašto scroll umjesto lomljenja u više redova: na 375px ekranu
// 5 tabova u dva reda pojede 80px vertikale prije nego korisnik
// vidi ijedan podatak. Scroll traka je skrivena (scrollbar-none),
// a rubni gradijent nagovještava da ima još sadržaja desno.
// ============================================================

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Mali indikator (npr. broj slika, upozorenje) */
  badge?: string | number;
  /** Prikazuje badge u boji upozorenja */
  badgeWarning?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div className="relative">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="scrollbar-none scroll-touch -mx-4 flex gap-1 overflow-x-auto px-4 pb-px sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex min-h-[2.75rem] shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {tab.label}
              {tab.badge != null && (
                <span
                  className={cn(
                    "ml-0.5 rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold",
                    tab.badgeWarning
                      ? "bg-amber-500 text-white"
                      : isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted-foreground/15 text-muted-foreground"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Nagovještaj da tabovi idu dalje udesno */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background to-transparent sm:hidden" />
    </div>
  );
}
