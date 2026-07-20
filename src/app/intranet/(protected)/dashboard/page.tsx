"use client";

import { useAuth } from "@/hooks/use-auth";
import { Building2, Sun, Star } from "lucide-react";

// ============================================================
// Dashboard — mobile-first.
//
// Promjene:
//  - Kartice: 1 stupac na telefonu → 2 (xs) → 3 (lg).
//    Prije je bilo sm:grid-cols-2, pa je do 640px sve bilo
//    u jednom uskom stupcu s previše praznog prostora.
//  - Padding p-6 → p-4 na mobitelu (na 375px je 24px sa svake
//    strane trošilo 13% širine ekrana)
//  - Dodane ikone radi brže vizualne orijentacije na malom ekranu
// ============================================================

const CARDS = [
  { title: "Status Apartmana", value: "3 aktivna", icon: Building2 },
  { title: "Solarni Sustav", value: "Proizvodnja OK", icon: Sun },
  { title: "Nepročitane Recenzije", value: "2 nove", icon: Star },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Pozdravna kartica */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-foreground text-balance sm:text-xl">
          Dobrodošli, {user?.fullName || "Admin"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">
          Ovo je početni ekran intranet sustava. Vaša razina pristupa je:{" "}
          <strong className="text-foreground">{user?.role}</strong>.
        </p>
      </div>

      {/* Statistike */}
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {CARDS.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.99] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xs font-medium text-muted-foreground text-pretty sm:text-sm">
                  {card.title}
                </h3>
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              </div>
              <p className="mt-2 text-xl font-bold text-foreground text-balance sm:text-2xl">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
