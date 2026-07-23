"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";
import { WaveDivider } from "@/components/public/home/WaveDivider";

// ============================================================
// Footer podstranica — isti "završetak na moru" kao naslovnica:
// valoviti rub u more (dnevna paleta), navigacija, brend, ©.
// ============================================================

export function PublicFooter() {
  const { dict } = useLanguage();

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/apartmani", label: dict.nav.apartments },
    { href: "/o-sibeniku", label: dict.nav.about },
    { href: "/kontakt", label: dict.nav.contact },
  ];

  return (
    <footer className="mt-auto">
      <WaveDivider fill="var(--hs-sea-near)" />
      <div
        className="pb-safe"
        style={{ background: "var(--hs-sea-near)" }}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-gutter py-8 text-center">
          <p className="text-base font-semibold italic text-[#f7f5ec] [font-family:var(--font-display)]">
            Apartments Šibenik
          </p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-sm text-[#f7f5ec]/80 transition-colors hover:text-[#f7f5ec]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="text-xs text-[#f7f5ec]/60">
            <p className="italic">{dict.home.contact.footerTagline}</p>
            <p className="mt-1">© {new Date().getFullYear()} Apartments Šibenik</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
