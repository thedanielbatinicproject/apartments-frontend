"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/i18n/language-context";
import { PhotoFrame } from "@/components/public/about/PhotoFrame";
import { FeatureBlock } from "@/components/public/about/FeatureBlock";
import { FactCard } from "@/components/public/about/FactCard";
import { SeagullQuest, type QuestLandmark } from "@/components/public/about/SeagullQuest";

export default function OSibenikuPage() {
  const { dict } = useLanguage();
  const t = dict.aboutPage;
  const reduceMotion = useReducedMotion();

  const fortresses = [
    { photo: "barone-fortress.jpg", ...t.fortresses.barone },
    { photo: "st-michaels-fortress.jpg", eyebrow: undefined, ...t.fortresses.stMichael },
    { photo: "st-johns-fortress.jpg", eyebrow: undefined, ...t.fortresses.stJohn },
    { photo: "st-nicholas-fortress.jpg", ...t.fortresses.stNicholas },
  ];

  const questLandmarks: QuestLandmark[] = [
    { id: "cathedral", label: t.cathedral.title, fact: t.quest.landmarks.cathedral },
    { id: "stMichael", label: t.fortresses.stMichael.title, fact: t.quest.landmarks.stMichael },
    { id: "siege", label: t.siege.title, fact: t.quest.landmarks.siege },
    { id: "barone", label: t.fortresses.barone.title, fact: t.quest.landmarks.barone },
    { id: "stJohn", label: t.fortresses.stJohn.title, fact: t.quest.landmarks.stJohn },
    { id: "parachute", label: t.parachute.title, fact: t.quest.landmarks.parachute },
    { id: "innovation", label: t.innovation.title, fact: t.quest.landmarks.innovation },
    { id: "stNicholas", label: t.fortresses.stNicholas.title, fact: t.quest.landmarks.stNicholas },
    { id: "krka", label: t.nature.krka.title, fact: t.quest.landmarks.krka },
    { id: "kornati", label: t.nature.kornati.title, fact: t.quest.landmarks.kornati },
  ];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[46dvh] items-end overflow-hidden sm:min-h-[52dvh]">
        <PhotoFrame src="/images/sibenik/hero.jpg" alt="" className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--hs-paper), color-mix(in oklab, var(--hs-paper) 55%, transparent) 55%, transparent)",
          }}
        />
        <div className="relative w-full px-gutter pb-10 pt-20 sm:pb-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <span
              className="inline-block rounded-full border border-white/15 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-white backdrop-blur-md sm:text-xs sm:tracking-widest"
              style={{ background: "rgba(12, 12, 16, 0.55)" }}
            >
              {t.hero.eyebrow}
            </span>
            <h1 className="mt-4 text-[clamp(2.25rem,9vw,4rem)] font-semibold leading-[1.05] tracking-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
              {t.hero.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)] sm:text-lg">
              {t.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl space-y-16 px-gutter py-14 sm:space-y-24 sm:py-20">
        {/* ---------- POVIJEST ---------- */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
            {t.history.title}
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
            {t.history.text}
          </p>
        </motion.section>

        {/* ---------- KATEDRALA ---------- */}
        <section>
          <FeatureBlock
            photoSrc="/images/sibenik/cathedral.jpg"
            photoAlt={t.cathedral.title}
            eyebrow={t.cathedral.eyebrow}
            title={t.cathedral.title}
            text={t.cathedral.text}
          />
        </section>

        {/* ---------- ZANIMLJIVOSTI: padobran, opsada, struja ---------- */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FactCard eyebrow={t.parachute.eyebrow} title={t.parachute.title} text={t.parachute.text} />
          <FactCard eyebrow={t.siege.eyebrow} title={t.siege.title} text={t.siege.text} delay={0.1} />
          <FactCard eyebrow={t.innovation.eyebrow} title={t.innovation.title} text={t.innovation.text} delay={0.2} />
        </section>

        {/* ---------- TVRĐAVE ---------- */}
        <section>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
              {t.fortresses.title}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-pretty [color:var(--hs-text-soft)]">
              {t.fortresses.intro}
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-4">
            {fortresses.map((f, i) => (
              <motion.div
                key={f.photo}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="overflow-hidden rounded-3xl"
                style={{
                  background: "var(--hs-card)",
                  border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
                }}
              >
                <PhotoFrame src={`/images/sibenik/${f.photo}`} alt={f.title} className="aspect-[4/3] w-full" />
                <div className="p-5">
                  {f.eyebrow && (
                    <span className="block text-[0.6875rem] font-semibold uppercase tracking-wider [color:var(--hs-accent)]">
                      {f.eyebrow}
                    </span>
                  )}
                  <h3 className="mt-1 text-base font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pretty [color:var(--hs-text-soft)]">
                    {f.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- PRIRODA ---------- */}
        <section>
          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="text-center text-[clamp(1.5rem,5vw,2rem)] font-semibold leading-tight [color:var(--hs-text-strong)] [font-family:var(--font-display)]"
          >
            {t.nature.title}
          </motion.h2>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[
              { photo: "krka-waterfalls.jpg", ...t.nature.krka },
              { photo: "kornati.jpg", ...t.nature.kornati },
            ].map((n, i) => (
              <motion.div
                key={n.photo}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="overflow-hidden rounded-3xl"
                style={{
                  background: "var(--hs-card)",
                  border: "1px solid color-mix(in oklab, var(--hs-text-soft) 18%, transparent)",
                }}
              >
                <PhotoFrame src={`/images/sibenik/${n.photo}`} alt={n.title} className="aspect-[4/3] w-full" />
                <div className="p-5">
                  <h3 className="text-base font-semibold [color:var(--hs-text-strong)] [font-family:var(--font-display)]">
                    {n.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-pretty [color:var(--hs-text-soft)]">
                    {n.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- MINIGAME: Let galeba ---------- */}
        <section>
          <SeagullQuest landmarks={questLandmarks} labels={t.quest} />
        </section>
      </div>
    </div>
  );
}
