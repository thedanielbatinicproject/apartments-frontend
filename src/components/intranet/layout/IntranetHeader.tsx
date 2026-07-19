"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

// Mapiranje pathname-a na human-readable naslove
const PAGE_TITLES: Record<string, string> = {
  "/intranet/dashboard": "Dashboard",
  "/intranet/solar": "Solar Dashboard",
  "/intranet/reviews": "Recenzije",
  "/intranet/invoices": "Računi",
  "/intranet/invoices/edit": "Uređivanje Računa",
  "/intranet/apartments": "Apartmani",
  "/intranet/settings": "Postavke",
};

export function IntranetHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title =
    Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? "Intranet";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {user?.role === "SUPERADMIN" && (
          <span className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:border-amber-700/30 dark:bg-amber-900/20 dark:text-amber-400">
            Super Admin
          </span>
        )}
        <span className="text-sm text-muted-foreground">{user?.email}</span>
      </div>
    </header>
  );
}
