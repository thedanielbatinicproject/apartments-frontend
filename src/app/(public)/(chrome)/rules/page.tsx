import type { Metadata } from "next";
import { cookies } from "next/headers";
import { RulesPageClient, type HostKey } from "@/components/public/rules/RulesPageClient";
import { LANG_COOKIE, DEFAULT_LANG, isSupportedLang } from "@/i18n/config";
import { en } from "@/i18n/dictionaries/en";
import { hr } from "@/i18n/dictionaries/hr";
import { de } from "@/i18n/dictionaries/de";
import { it } from "@/i18n/dictionaries/it";
import { fr } from "@/i18n/dictionaries/fr";
import { ua } from "@/i18n/dictionaries/ua";

const DICTIONARIES = { en, hr, de, it, fr, ua };

// ============================================================
// Server wrapper samo radi metadata (title na jeziku iz cookieja —
// vidi i18n/config.ts, cookie je namjerno server-čitljiv baš za
// ovakav slučaj) + čitanje ?host= iz URL-a za shareable stanje.
//
// noindex: ovo je referentna/pravna stranica, ne marketinška —
// namjerno je izvan glavnog izbornika i ne treba se natjecati s
// pravim stranicama u rezultatima pretrage.
// ============================================================

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const stored = cookieStore.get(LANG_COOKIE)?.value;
  const lang = isSupportedLang(stored) ? stored : DEFAULT_LANG;

  return {
    title: DICTIONARIES[lang].houseRules.title,
    robots: { index: false, follow: true },
  };
}

function resolveHost(value: string | string[] | undefined): HostKey {
  return value === "ivica" ? "ivica" : "brigita";
}

export default async function RulesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialHost = resolveHost(params.host);

  return <RulesPageClient initialHost={initialHost} />;
}
