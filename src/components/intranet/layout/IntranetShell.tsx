"use client";

import { useState } from "react";
import { IntranetSidebar } from "./IntranetSidebar";
import { IntranetHeader } from "./IntranetHeader";
import { IntranetBottomNav } from "./IntranetBottomNav";
import { IntranetMobileDrawer } from "./IntranetMobileDrawer";

// ============================================================
// Intranet shell — dvije potpuno različite strukture:
//
// MOBITEL (< lg):
//   sticky header  →  normalan scroll stranice  →  fiksni bottom nav
//   Namjerno NE koristimo h-screen + overflow-hidden jer to na iOS-u
//   lomi scroll i onemogućuje sakrivanje URL trake pri skrolanju.
//
// DESKTOP (lg+):
//   fiksni sidebar | header + skrolabilni main (klasični app layout)
// ============================================================

export function IntranetShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background lg:h-dvh lg:overflow-hidden">
      {/* Sidebar — samo desktop */}
      <IntranetSidebar />

      {/* Glavni stupac */}
      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <IntranetHeader />

        <main
          className={
            // px-gutter daje 16/24/32px razmaka i sam poštuje safe-area.
            // (Ne kombinirati s px-safe — vidi komentar uz .px-gutter.)
            "flex-1 px-gutter py-4 pb-nav-offset " +
            // Desktop: scroll unutar maina, bez bottom nav offseta
            "sm:py-6 lg:overflow-y-auto lg:pb-8"
          }
        >
          {children}
        </main>
      </div>

      {/* Mobilna navigacija */}
      <IntranetBottomNav
        onOpenDrawer={() => setDrawerOpen(true)}
        isDrawerOpen={drawerOpen}
      />
      <IntranetMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
