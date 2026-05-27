"use client";

import { motion } from "framer-motion";
import { Landmark, Banknote } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";
import { YEMEN } from "@/lib/data";

export function YemenSection() {
  const { t, locale } = useI18n();
  return (
    <section className="relative scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10">
        {/* copy */}
        <div>
          <Reveal><Kicker>{YEMEN.flag} {t.yemen.kicker}</Kicker></Reveal>
          <Reveal i={1}>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1] tracking-tight text-ink sm:text-5xl">
              {t.yemen.title}
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{t.yemen.body}</p>
          </Reveal>

          <Reveal i={3}>
            <div className="mt-8 flex items-start gap-4 rounded-2xl border-2 border-ink bg-flame-soft p-5 shadow-[5px_5px_0_0_var(--color-ink)]">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-ink bg-canvas text-ink">
                <Banknote className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-ink">{t.yemen.payTitle}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.yemen.payBody}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* cities composition */}
        <Reveal i={2}>
          <div className="relative rounded-[1.5rem] border-2 border-ink bg-canvas p-8 shadow-[8px_8px_0_0_var(--color-ink)]">
            <div className="flex items-center gap-3">
              <Landmark className="size-5 text-flame" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">
                {t.yemen.citiesLabel}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {YEMEN.cities.map((c, i) => (
                <motion.span
                  key={c.en}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -3 }}
                  className="rounded-full border-2 border-ink bg-canvas px-4 py-2 text-sm font-semibold text-ink hover:bg-flame"
                >
                  {c[locale]}
                </motion.span>
              ))}
            </div>

            <div className="mt-8 flex items-end justify-between border-t-2 border-dashed border-line pt-6">
              <div>
                <div className="font-display text-5xl font-extrabold leading-none text-flame">{YEMEN.flag}</div>
                <div className="mt-2 font-display text-lg font-extrabold text-ink">{YEMEN[locale]}</div>
              </div>
              <div className="text-end">
                <div className="font-display text-4xl font-extrabold leading-none text-ink">21</div>
                <div className="text-xs font-semibold text-ink-soft">{t.yemen.stat}</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
