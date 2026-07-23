"use client";

import { useState, type ReactNode, type ComponentType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Info,
  Clock,
  ShieldAlert,
  ClipboardList,
  Home,
  ShieldCheck,
  Sparkles,
  Trees,
  Siren,
  Gavel,
  CheckCircle2,
  KeyRound,
  Phone,
  MapPin,
} from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { Dictionary } from "@/i18n/dictionaries/en";

export type HostKey = "brigita" | "ivica";

type HouseRulesHost = Dictionary["houseRules"]["hosts"][HostKey];
type RuleSection = HouseRulesHost["sections"][number];

interface RulesPageClientProps {
  initialHost: HostKey;
}

/** Ikone po POZICIJI sekcije (ne po tekstu naslova — naslovi su prevedeni
 * po jeziku, ali redoslijed/sadržaj na istom indexu je isti za sve). */
const SECTION_ICONS: Record<HostKey, ComponentType<{ className?: string }>[]> = {
  brigita: [
    Info, // 1. General Provisions
    Clock, // 2. Check-In/out & Registration
    ShieldAlert, // 3. Use of Premises and Behavior (highlight)
    ClipboardList, // 4. Property Care and Damages
    Sparkles, // 5. Cleanliness and Maintenance
    Trees, // 6. Garden and Outdoor Use
    ShieldCheck, // 7. Liability and Insurance
    KeyRound, // 8. Keys and Security
    Siren, // 9. Emergencies
    Gavel, // 10. Rule Violations
    CheckCircle2, // 11. Final Provisions
  ],
  ivica: [
    Info, // 1. General Provisions
    Clock, // 2. Check-In and Check-Out
    ShieldAlert, // 3. Prohibition (highlight)
    ClipboardList, // 4. House Rules and Conduct
    Home, // 5. Apartment Facilities
    ShieldCheck, // 6. Liability
    Sparkles, // 7. Cleanliness and Maintenance
    Siren, // 8. Safety
    Gavel, // 9. Consequences of Rule Violations
    CheckCircle2, // 10. Acceptance
  ],
};

/** "**text**" -> <strong>text</strong>, ostatak kao obični tekst */
function renderRich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="[color:var(--hs-text-strong)]">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function SectionCard({
  section,
  Icon,
}: {
  section: RuleSection;
  Icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className="rounded-3xl p-6"
      style={{
        background: "var(--hs-card)",
        border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          style={{ background: "color-mix(in oklab, var(--hs-accent) 14%, transparent)" }}
        >
          <Icon className="h-4.5 w-4.5 [color:var(--hs-accent)]" />
        </span>
        <h2 className="text-base font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {section.heading}
        </h2>
      </div>

      {section.paragraphs?.map((p, i) => (
        <p key={i} className="mt-3 text-sm leading-relaxed [color:var(--hs-text-soft)]">
          {renderRich(p)}
        </p>
      ))}

      {section.bullets && (
        <ul className="mt-3 space-y-2">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed [color:var(--hs-text-soft)]">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full [background:var(--hs-accent)]" />
              <span>{renderRich(b)}</span>
            </li>
          ))}
        </ul>
      )}

      {section.highlight && (
        <div
          className="mt-4 rounded-2xl p-4"
          style={{
            background: "color-mix(in oklab, #dc2626 10%, transparent)",
            border: "1px solid color-mix(in oklab, #dc2626 35%, transparent)",
          }}
        >
          {section.highlight.intro && (
            <p className="text-sm font-semibold [color:#dc2626]">
              {section.highlight.intro}
            </p>
          )}
          <ul className="mt-2 space-y-2">
            {section.highlight.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed [color:var(--hs-text-strong)]">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 [color:#dc2626]" />
                <span>{renderRich(b)}</span>
              </li>
            ))}
          </ul>
          {section.highlight.outro && (
            <p className="mt-3 text-sm leading-relaxed [color:var(--hs-text-strong)]">
              {renderRich(section.highlight.outro)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function RulesPageClient({ initialHost }: RulesPageClientProps) {
  const { dict } = useLanguage();
  const t = dict.houseRules;
  const [host, setHost] = useState<HostKey>(initialHost);
  const router = useRouter();
  const rules = t.hosts[host];
  const icons = SECTION_ICONS[host];

  const selectHost = (key: HostKey) => {
    setHost(key);
    router.replace(`/rules?host=${key}`, { scroll: false });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-gutter py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span
          className="inline-block rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider [color:var(--hs-accent)] sm:text-xs sm:tracking-widest"
          style={{ background: "color-mix(in oklab, var(--hs-accent) 14%, transparent)" }}
        >
          {t.eyebrow}
        </span>
        <h1 className="mt-4 text-[clamp(2rem,7vw,3rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {t.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)] sm:text-base">
          {t.subtitle}
        </p>
      </motion.div>

      {/* ---------- SWITCH ---------- */}
      <div
        className="mx-auto mt-8 flex w-fit gap-1 rounded-full p-1"
        style={{ background: "var(--hs-card)", border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)" }}
      >
        {(Object.keys(t.switchLabels) as HostKey[]).map((key) => {
          const active = key === host;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectHost(key)}
              className="relative min-w-[7rem] rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              style={{
                background: active ? "var(--hs-accent)" : "transparent",
                color: active ? "#ffffff" : "var(--hs-text-soft)",
              }}
            >
              {t.switchLabels[key]}
            </button>
          );
        })}
      </div>

      {/* ---------- HOST INFO ---------- */}
      <div
        className="mt-8 rounded-3xl p-6"
        style={{
          background: "var(--hs-card)",
          border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
        }}
      >
        <p className="text-lg font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {rules.propertyName}
        </p>
        <p className="mt-1 text-sm [color:var(--hs-text-soft)]">
          {rules.ownerLabel}: {rules.ownerName}
        </p>

        <div className="mt-3 space-y-2">
          <a
            href={`tel:${rules.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70 [color:var(--hs-text-strong)]"
          >
            <Phone className="h-4 w-4 shrink-0 [color:var(--hs-accent)]" />
            <span>{rules.phone}</span>
          </a>
          <div className="flex items-center gap-3 text-sm [color:var(--hs-text-strong)]">
            <MapPin className="h-4 w-4 shrink-0 [color:var(--hs-accent)]" />
            <span>{rules.address}</span>
          </div>
        </div>

        {"apartments" in rules && rules.apartments && (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rules.apartments.map((apt) => (
              <div
                key={apt.name}
                className="rounded-2xl p-4"
                style={{ background: "color-mix(in oklab, var(--hs-accent) 8%, transparent)" }}
              >
                <p className="text-sm font-semibold [color:var(--hs-text-strong)]">{apt.name}</p>
                <p className="mt-1 text-xs leading-relaxed [color:var(--hs-text-soft)]">
                  {apt.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---------- SECTIONS ---------- */}
      <div className="mt-6 space-y-5">
        {rules.sections.map((section, i) => (
          <SectionCard key={section.heading} section={section} Icon={icons[i] ?? ClipboardList} />
        ))}
      </div>

      {/* ---------- FOOTER NOTE ---------- */}
      <div className="mt-8 text-center text-xs [color:var(--hs-text-soft)]">
        {rules.footerNote.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {/* ---------- I UNDERSTAND ---------- */}
      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full px-8 text-base font-bold text-white shadow-[0_14px_30px_-12px_var(--hs-accent)] transition-transform hover:-translate-y-0.5 active:scale-95"
          style={{ background: "var(--hs-accent)" }}
        >
          <CheckCircle2 className="h-5 w-5" />
          {t.understand}
        </Link>
      </div>
    </div>
  );
}
