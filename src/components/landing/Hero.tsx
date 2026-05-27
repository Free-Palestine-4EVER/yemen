"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Stamp } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { ButtonLink } from "@/components/ui/Button";
import { GatewayGlyph } from "@/components/ui/Logo";
import { DESTINATIONS } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t, locale } = useI18n();

  return (
    <section className="relative overflow-hidden bg-navy-950 text-paper">
      {/* ambient glows + grain */}
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.5]" />
      <div className="pointer-events-none absolute -top-40 -end-32 size-[36rem] rounded-full bg-azure-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -start-24 size-[32rem] rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="rule-gold absolute inset-x-0 top-16 opacity-40" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:px-8 lg:pb-32 lg:pt-28">
        {/* copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-gold-300"
          >
            <span className="size-1.5 rounded-full bg-gold-400" />
            {t.hero.kicker}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-navy-200"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <ButtonLink href="/register" variant="gold" size="lg">
              {t.hero.ctaPrimary}
              <ArrowRight className="size-5 rtl:rotate-180" />
            </ButtonLink>
            <ButtonLink href="/#how" variant="paper" size="lg">
              {t.hero.ctaSecondary}
            </ButtonLink>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-7 inline-flex items-center gap-2 text-sm text-navy-300"
          >
            <ShieldCheck className="size-4 text-emerald-soft" />
            {t.hero.trustline}
          </motion.p>

          {/* stats */}
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {[
              { v: "1,200+", l: t.hero.stat1 },
              { v: `${DESTINATIONS.length}`, l: t.hero.stat2 },
              { v: t.hero.stat3val, l: t.hero.stat3 },
            ].map((s) => (
              <div key={s.l}>
                <dt className="font-display text-2xl font-semibold text-paper sm:text-3xl">{s.v}</dt>
                <dd className="mt-1 text-xs leading-snug text-navy-300">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* visual */}
        <HeroDossier locale={locale} />
      </div>
    </section>
  );
}

function HeroDossier({ locale }: { locale: "en" | "ar" }) {
  const chips = DESTINATIONS.slice(0, 5);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease }}
      className="relative mx-auto w-full max-w-md"
    >
      {/* main dossier card */}
      <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white to-paper-2 p-6 text-navy-950 shadow-lift">
        <div className="flex items-center justify-between">
          <GatewayGlyph className="size-9" />
          <span className="rounded-full bg-navy-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-paper">
            Application
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <FieldRow label={locale === "ar" ? "الاسم" : "Applicant"} value="Ahmed Al-Sami" w="80%" />
          <FieldRow label={locale === "ar" ? "الشهادة" : "Degree"} value="BSc Computer Science" w="92%" />
          <FieldRow label={locale === "ar" ? "اللغات" : "Languages"} value="Arabic · English · German A2" w="70%" />
          <FieldRow label={locale === "ar" ? "الوجهة" : "Destination"} value="🇩🇪 Germany — Berlin" w="60%" />
        </div>

        <div className="mt-5 h-px w-full bg-line" />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-soft">
            <span className="size-2 rounded-full bg-emerald-soft" />
            {locale === "ar" ? "تم التحقق" : "Verified & ready"}
          </div>
          <span className="text-xs text-navy-400">#MNF-2048</span>
        </div>

        {/* gold seal */}
        <motion.div
          animate={{ rotate: [0, 6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 -end-6 grid size-24 place-items-center rounded-full border-2 border-gold-400/60 bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-lift"
        >
          <Stamp className="size-8" strokeWidth={1.6} />
        </motion.div>
      </div>

      {/* floating destination chips */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -start-6 top-10 hidden rounded-xl border border-white/10 bg-navy-900/90 px-3 py-2 shadow-lift backdrop-blur sm:block"
      >
        <div className="flex items-center gap-1.5">
          {chips.map((c) => (
            <span key={c.code} className="text-lg" title={c[locale]}>
              {c.flag}
            </span>
          ))}
        </div>
        <p className="mt-1 text-[10px] text-navy-300">
          {locale === "ar" ? "وجهات متاحة" : "Open pathways"}
        </p>
      </motion.div>
    </motion.div>
  );
}

function FieldRow({ label, value, w }: { label: string; value: string; w: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-navy-400">{label}</div>
      <div className="mt-0.5 flex items-center gap-2">
        <span className="text-sm font-medium text-navy-900">{value}</span>
      </div>
      <div className="mt-1.5 h-1 rounded-full bg-navy-100" style={{ width: w }} />
    </div>
  );
}
