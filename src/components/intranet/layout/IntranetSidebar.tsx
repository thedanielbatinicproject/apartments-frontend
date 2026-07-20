"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { LogOut, ChevronRight } from "lucide-react";
import { NAV_ITEMS, isNavItemActive, visibleNavItems } from "@/lib/navigation";

// ============================================================
// Desktop sidebar — vidljiv SAMO od lg breakpointa naviše.
//
// Na mobitelu ga u potpunosti zamjenjuju IntranetBottomNav +
// IntranetMobileDrawer. Prije je bio uvijek vidljiv i na
// telefonu od 375px oduzimao 256px (2/3 ekrana).
// ============================================================

export function IntranetSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = visibleNavItems(NAV_ITEMS, user?.role);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/intranet/login";
  };

  return (
    <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      {/* Logo / Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <span className="text-xs font-bold text-primary-foreground">AŠ</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground leading-none">
            Apartments
          </p>
          <p className="truncate text-xs text-muted-foreground leading-none mt-0.5">
            Šibenik Intranet
          </p>
        </div>
      </div>

      {/* Navigacija */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {items.map((item) => {
          const isActive = isNavItemActive(item.href, pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.superAdminOnly && !isActive && (
                <span className="rounded px-1 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  SA
                </span>
              )}
              {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Korisnik + logout */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase">
            {user?.fullName?.charAt(0) ?? "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">
              {user?.fullName ?? "Admin"}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {user?.role === "SUPERADMIN" ? "Super Admin" : "Admin"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Odjava"
            aria-label="Odjava"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
