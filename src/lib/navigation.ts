// ============================================================
// Centralna definicija intranet navigacije.
//
// Jedan izvor istine za sve tri navigacijske površine:
//   - IntranetSidebar      (desktop, lg+)
//   - IntranetBottomNav    (mobitel, fiksirano na dnu)
//   - IntranetMobileDrawer (mobitel, "Više" panel)
//
// Ovako se nova ruta dodaje na jednom mjestu i automatski se
// pojavi na svim uređajima.
// ============================================================

import {
  LayoutDashboard,
  Sun,
  Star,
  FileText,
  Building2,
  Settings,
  ShieldCheck,
  Camera,
  Printer,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  /** Kraća oznaka za bottom tab bar — mora stati u ~64px širine */
  shortLabel?: string;
  icon: LucideIcon;
  /** Ako je true, stavka je vidljiva samo SUPERADMIN korisnicima */
  superAdminOnly?: boolean;
  /**
   * Prikazuje li se u mobilnom bottom tab baru.
   * Maksimalno 4 stavke — peto mjesto zauzima gumb "Više".
   */
  inBottomNav?: boolean;
  /**
   * Istaknuta stavka u SREDINI bottom nava — crna kružnica s
   * bijelom ikonom (invertirane boje), izdignuta iznad trake.
   * Smije postojati najviše jedna.
   */
  bottomNavSpecial?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/intranet/dashboard",
    label: "Dashboard",
    shortLabel: "Početna",
    icon: LayoutDashboard,
    inBottomNav: true,
  },
  {
    href: "/intranet/solar",
    label: "Solar",
    shortLabel: "Solar",
    icon: Sun,
    inBottomNav: true,
  },
  {
    // Prijave gostiju — glavna radnja na mobitelu (skeniranje
    // obrasca pri dolasku gosta), zato istaknuta u sredini bottom
    // nava. Recenzije su joj ustupile mjesto i žive u "Više".
    href: "/intranet/checkins",
    label: "Prijave gostiju",
    shortLabel: "Prijave",
    icon: Camera,
    inBottomNav: true,
    bottomNavSpecial: true,
  },
  {
    href: "/intranet/invoices",
    label: "Računi",
    shortLabel: "Računi",
    icon: FileText,
    inBottomNav: true,
  },
  {
    // Ispis praznih obrazaca za goste. Na mobitelu je u "Više" —
    // radnja se obavlja rijetko i uvijek uz pisač, dakle za stolom.
    href: "/intranet/forms",
    label: "Ispis obrazaca",
    icon: Printer,
  },
  {
    href: "/intranet/reviews",
    label: "Recenzije",
    icon: Star,
  },
  {
    href: "/intranet/apartments",
    label: "Apartmani",
    icon: Building2,
  },
  {
    href: "/intranet/settings",
    label: "Postavke",
    icon: Settings,
  },
  {
    // Upravljanje admin korisnicima.
    //
    // Naziv NIJE "Uredi račune" jer bi se u izborniku sudarao s
    // "Računi" (fakture) — "račun" na hrvatskom znači i fakturu i
    // korisnički račun. "Administratori" je nedvosmisleno.
    //
    // Time je oslobođen slot koji je po AGENTS.md bio predviđen za
    // /intranet/invoices/edit — uređivanje faktura ostaje unutar
    // sekcije Računi, gdje logički pripada.
    href: "/intranet/users",
    label: "Administratori",
    icon: ShieldCheck,
    superAdminOnly: true,
  },
];

/** Stavke za mobilni bottom tab bar (max 4). */
export const BOTTOM_NAV_ITEMS = NAV_ITEMS.filter((item) => item.inBottomNav);

/** Stavke koje idu u "Više" drawer — sve što nije u bottom baru. */
export const DRAWER_NAV_ITEMS = NAV_ITEMS.filter((item) => !item.inBottomNav);

/** Mapiranje pathname → naslov stranice (za header). */
export const PAGE_TITLES: Record<string, string> = Object.fromEntries(
  NAV_ITEMS.map((item) => [item.href, item.label])
);

/**
 * Je li ruta trenutno aktivna.
 *
 * Pazi na dvije zamke:
 *  - /intranet/dashboard ne smije biti aktivan na svim podrutama
 *  - /intranet/invoices ne smije biti aktivan kad si na /intranet/invoices/edit
 */
export function isNavItemActive(itemHref: string, pathname: string): boolean {
  if (pathname === itemHref) return true;

  // Dashboard je aktivan samo na točnom poklapanju
  if (itemHref === "/intranet/dashboard") return false;

  // Roditeljska ruta nije aktivna ako postoji specifičnije dijete koje se poklapa
  const moreSpecificMatch = NAV_ITEMS.some(
    (other) =>
      other.href !== itemHref &&
      other.href.startsWith(itemHref + "/") &&
      pathname.startsWith(other.href)
  );
  if (moreSpecificMatch) return false;

  return pathname.startsWith(itemHref + "/");
}

/** Filtrira nav stavke prema ulozi korisnika. */
export function visibleNavItems(
  items: NavItem[],
  role: string | undefined
): NavItem[] {
  return items.filter((item) => !item.superAdminOnly || role === "SUPERADMIN");
}

/** Naslov stranice za trenutni pathname. */
export function pageTitleFor(pathname: string): string {
  const match = NAV_ITEMS.filter((item) => pathname.startsWith(item.href)).sort(
    (a, b) => b.href.length - a.href.length
  )[0];

  return match?.label ?? "Intranet";
}
