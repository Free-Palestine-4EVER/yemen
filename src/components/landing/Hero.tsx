"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { ButtonLink } from "@/components/ui/Button";
import { GatewayGlyph } from "@/components/ui/Logo";
import { DESTINATIONS, YEMEN } from "@/lib/data";
import { RouteLine } from "./RouteLine";

const ease = [0.16, 1, 0.3, 1] as const;
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.09, ease } }),
};

export function Hero() {
  const { t, locale } = useI18n();

  return (
    <section className="relative overflow-hidden">
      {/* warm atmosphere */}
      <div className="pointer-events-none absolute -top-40 -end-32 size-[40rem] rounded-full bg-bloom/45 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -start-40 size-[34rem] rounded-full bg-flame-soft/70 blur-[120px]" />
      {/* giant background word */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 select-none text-center">
        <span className="font-display text-[26vw] font-extrabold leading-none text-stroke opacity-[0.06]">
          {locale === "ar" ? "أوروبا" : "EUROPE"}
        </span>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-10 lg:pb-24 lg:pt-20">
        {/* copy column */}
        <div>
          <motion.div custom={0} variants={rise} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-canvas px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] shadow-[3px_3px_0_0_var(--color-flame)]">
            <span className="text-base leading-none">{YEMEN.flag}</span>
            {t.hero.kicker}
          </motion.div>

          <h1 className="mt-6 font-display text-[2.9rem] font-extrabold leading-[0.96] tracking-tight text-ink sm:text-[4.4rem]">
            {locale === "ar" ? (
              <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block">
                {t.hero.title}
              </motion.span>
            ) : (
              <>
                <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block">
                  From a Yemeni
                </motion.span>
                <motion.span custom={2} variants={rise} initial="hidden" animate="show" className="block">
                  degree to a{" "}
                  <span className="relative whitespace-nowrap font-serif italic text-flame">
                    European
                    <svg className="absolute -bottom-2 start-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden>
                      <path d="M2 7 C 60 2, 140 2, 198 6" stroke="var(--color-flame)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </motion.span>
                <motion.span custom={3} variants={rise} initial="hidden" animate="show" className="block">
                  future.
                </motion.span>
              </>
            )}
          </h1>

          <motion.p custom={4} variants={rise} initial="hidden" animate="show"
            className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
            {t.hero.subtitle}
          </motion.p>

          <motion.div custom={5} variants={rise} initial="hidden" animate="show"
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/register" variant="gold" size="lg">
              {t.hero.ctaPrimary}<ArrowRight className="size-5 rtl:rotate-180" />
            </ButtonLink>
            <ButtonLink href="/#how" variant="outline" size="lg">{t.hero.ctaSecondary}</ButtonLink>
          </motion.div>

          <motion.p custom={6} variants={rise} initial="hidden" animate="show"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
            <ShieldCheck className="size-4 text-teal" />{t.hero.trustline}
          </motion.p>
        </div>

        {/* visual column */}
        <HeroCard locale={locale} t={t} />
      </div>

      {/* destination marquee */}
      <div className="relative border-y-2 border-ink bg-ink py-3">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex items-center">
              {DESTINATIONS.map((d) => (
                <span key={d.code} className="mx-5 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-canvas">
                  <span className="text-lg">{d.flag}</span>{d[locale]}
                  <span className="ms-5 text-flame">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroCard({ locale, t }: { locale: "en" | "ar"; t: ReturnType<typeof useI18n>["t"] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1, delay: 0.3, ease }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="relative rounded-[1.4rem] border-2 border-ink bg-canvas p-6 shadow-[8px_8px_0_0_var(--color-ink)]">
        <div className="flex items-center justify-between border-b-2 border-dashed border-line pb-4">
          <GatewayGlyph className="size-9" />
          <span className="rounded-full border-2 border-ink bg-flame px-3 py-1 font-display text-[10px] font-bold uppercase tracking-widest text-ink">
            Dossier · ملف
          </span>
        </div>

        <div className="space-y-3.5 py-5">
          <Field label={locale === "ar" ? "المتقدّم" : "Applicant"} value="Ahmed Al-Sami" />
          <Field label={locale === "ar" ? "الشهادة" : "Degree"} value="BSc Computer Science" />
          <Field label={locale === "ar" ? "اللغات" : "Languages"} value="Arabic · English · German A2" />
          <Field label={locale === "ar" ? "الوجهة" : "Destination"} value="🇩🇪 Germany — Berlin" />
        </div>

        <div className="border-t-2 border-dashed border-line pt-4">
          <RouteLine to="DE" />
        </div>

        {/* verified stamp */}
        <motion.div
          initial={{ scale: 0, rotate: -24 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1.1 }}
          className="absolute -bottom-5 -end-4 grid size-[88px] place-items-center rounded-full border-[3px] border-teal text-center"
        >
          <div className="flex flex-col items-center text-teal">
            <Sparkles className="size-4" />
            <span className="mt-0.5 whitespace-pre-line font-display text-[10px] font-extrabold uppercase leading-tight">
              {locale === "ar" ? "تم\nالتحقق" : "Human\nverified"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* floating fee tag */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute -start-4 top-8 animate-drift rounded-xl border-2 border-ink bg-flame px-3 py-2 shadow-[3px_3px_0_0_var(--color-ink)]"
      >
        <div className="font-display text-lg font-extrabold leading-none text-ink">$30</div>
        <div className="text-[10px] font-semibold text-ink/70">{locale === "ar" ? "طلاب" : "students"}</div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/70 pb-2">
      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-ink-soft">{label}</span>
      <span className="text-end text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}
