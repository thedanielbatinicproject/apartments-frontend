"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { HOSTS, ADDRESS, whatsappLink } from "@/lib/contact-info";

export default function KontaktPage() {
  const { dict } = useLanguage();
  const t = dict.kontaktPage;
  const reduceMotion = useReducedMotion();

  const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS.full)}&z=16&output=embed`;
  const mapLinkHref = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS.full)}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-gutter py-14 sm:py-20">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <span
          className="inline-block rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider [color:var(--hs-accent)] sm:text-xs sm:tracking-widest"
          style={{ background: "color-mix(in oklab, var(--hs-accent) 14%, transparent)" }}
        >
          {t.hero.eyebrow}
        </span>
        <h1 className="mt-4 text-[clamp(2rem,7vw,3rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
          {t.hero.title}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)] sm:text-base">
          {t.hero.text}
        </p>
      </motion.div>

      {/* ---------- DOMAĆINI ---------- */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70 [color:var(--hs-text-soft)]">
          {t.hosts.title}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {HOSTS.map((host, i) => (
            <motion.div
              key={host.name}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-3xl p-6"
              style={{
                background: "var(--hs-card)",
                border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
              }}
            >
              <p className="text-lg font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
                {host.name}
              </p>

              <div className="mt-3 space-y-2.5">
                <a
                  href={`tel:${host.phone}`}
                  className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70 [color:var(--hs-text-strong)]"
                >
                  <Phone className="h-4 w-4 shrink-0 [color:var(--hs-accent)]" />
                  <span>{host.phone.replace("+385", "+385 ")}</span>
                </a>
                <a
                  href={`mailto:${host.email}`}
                  className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70 [color:var(--hs-text-strong)]"
                >
                  <Mail className="h-4 w-4 shrink-0 [color:var(--hs-accent)]" />
                  <span className="break-anywhere">{host.email}</span>
                </a>
                <a
                  href={whatsappLink(host.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70 [color:var(--hs-text-strong)]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 [color:var(--hs-accent)]" />
                  <span>{t.hosts.whatsappLabel}</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-5 text-center text-sm [color:var(--hs-text-soft)]">{t.note}</p>
      </section>

      {/* ---------- ADRESA + KARTA ---------- */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide opacity-70 [color:var(--hs-text-soft)]">
          {t.address.title}
        </h2>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-4 overflow-hidden rounded-3xl"
          style={{
            background: "var(--hs-card)",
            border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
          }}
        >
          <iframe
            title={ADDRESS.full}
            className="h-56 w-full sm:h-72"
            style={{ border: 0 }}
            loading="lazy"
            src={mapEmbedSrc}
          />
          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div className="text-sm [color:var(--hs-text-strong)]">
              <p className="font-semibold">{ADDRESS.street}</p>
              <p className="[color:var(--hs-text-soft)]">
                {ADDRESS.neighborhood} · {ADDRESS.city}
              </p>
            </div>
            <a
              href={mapLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold [color:var(--hs-accent)]"
            >
              <MapPin className="h-4 w-4" />
              {t.address.directions}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
