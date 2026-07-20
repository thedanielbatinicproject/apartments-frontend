"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { pageTitleFor } from "@/lib/navigation";
import { CompanySwitcher } from "./CompanySwitcher";

// ============================================================
// Intranet header.
//
// Mobitel: kompaktni brand + naslov stranice. Email se skriva
//          (nema mjesta, a dostupan je u "Više" draweru).
// Desktop: naslov + rola + email, kao i prije.
//
// Sticky je s pt-safe da ne završi ispod notcha na iPhoneu.
// ============================================================

export function IntranetHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  const title = pageTitleFor(pathname);

  return (
    <header className="sticky top-0 z-30 shrink-0 border-b border-border bg-card/95 backdrop-blur-lg pt-safe">
      {/* Isti gutter kao <main> — naslov u headeru i naslov stranice
          moraju biti poravnati u istoj vertikali. */}
      <div className="flex h-14 items-center justify-between gap-3 px-gutter sm:h-16">
        {/* Lijevo: brand (samo mobitel) + naslov */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary lg:hidden">
            <span className="text-[0.625rem] font-bold text-primary-foreground">
              AŠ
            </span>
          </div>
          <h1 className="min-w-0 truncate whitespace-nowrap text-sm font-semibold text-foreground">
            {title}
          </h1>
        </div>

        {/* Desno: firma + rola + email */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <CompanySwitcher />

          {user?.role === "SUPERADMIN" && (
            <span className="inline-flex items-center rounded-full border border-amber-300/40 bg-amber-50 px-2 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-wider text-amber-700 sm:px-2.5 sm:text-[10px] dark:border-amber-700/30 dark:bg-amber-900/20 dark:text-amber-400">
              <span className="sm:hidden">SA</span>
              <span className="hidden sm:inline">Super Admin</span>
            </span>
          )}
          {/* Email se na mobitelu skriva — vidljiv je u "Više" draweru */}
          <span className="hidden max-w-[16rem] truncate text-sm text-muted-foreground md:inline">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
}
