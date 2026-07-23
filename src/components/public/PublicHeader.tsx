"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/language-context";
import { PublicMobileMenu } from "./PublicMobileMenu";
import { LanguageSwitcherButton } from "@/components/guest/LanguageGate";

// ============================================================
// Zaglavlje PODSTRANICA (apartmani, o-sibeniku, kontakt) — novi
// svijetli identitet: staklena traka u dnevnoj paleti (--hs-*),
// Fraunces brend, tekst boje prate doba dana. Naslovnica ("/")
// namjerno NEMA ovaj header (scenični flow bez chromea).
// ============================================================

export function PublicHeader() {
  const { dict } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/apartmani", label: dict.nav.apartments },
    { href: "/o-sibeniku", label: dict.nav.about },
    { href: "/kontakt", label: dict.nav.contact },
  ];

  return (
    <header
      className="sticky top-0 z-50 w-full pt-safe backdrop-blur-md"
      style={{
        background: "color-mix(in oklab, var(--hs-paper) 78%, transparent)",
        borderBottom:
          "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-gutter sm:h-16">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="truncate text-lg font-semibold italic [color:var(--hs-text-strong)] [font-family:var(--font-display)] sm:text-xl">
            Apartments Šibenik
          </span>
        </Link>

        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "transition-opacity",
                  isActive
                    ? "[color:var(--hs-accent)]"
                    : "[color:var(--hs-text-soft)] hover:opacity-70"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <div
            className="rounded-full border backdrop-blur-sm"
            style={{
              borderColor:
                "color-mix(in oklab, var(--hs-text-soft) 25%, transparent)",
              background:
                "color-mix(in oklab, var(--hs-card) 60%, transparent)",
            }}
          >
            <LanguageSwitcherButton />
          </div>

          <Link
            href="/kontakt"
            className="hidden min-h-[2.5rem] items-center rounded-full px-5 text-xs font-bold text-white shadow-[0_6px_16px_-4px_var(--hs-accent)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_-4px_var(--hs-accent)] active:translate-y-0 active:scale-95 xs:flex sm:inline-flex sm:text-sm"
            style={{ background: "var(--hs-accent)" }}
          >
            {dict.nav.book}
          </Link>

          <PublicMobileMenu links={links} bookLabel={dict.nav.book} />
        </div>
      </div>
    </header>
  );
}
