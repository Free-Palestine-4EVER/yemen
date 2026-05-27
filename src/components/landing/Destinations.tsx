"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";
import { DESTINATIONS } from "@/lib/data";

export function Destinations() {
  const { t, locale } = useI18n();
  return (
    <section id="destinations" className="relative scroll-mt-24 border-t-2 border-ink bg-sand py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Reveal><Kicker>{t.destinations.kicker}</Kicker></Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                {t.destinations.title}
              </h2>
            </Reveal>
          </div>
          <Reveal i={2}><p className="max-w-sm text-ink-soft md:text-end">{t.destinations.subtitle}</p></Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DESTINATIONS.map((d, i) => (
            <motion.div
              key={d.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -5 }}
              className="group flex items-center gap-3 rounded-2xl border-2 border-ink bg-canvas p-4 transition-shadow hover:shadow-[5px_5px_0_0_var(--color-ink)]"
            >
              <span className="text-3xl leading-none transition-transform group-hover:scale-110">{d.flag}</span>
              <div className="min-w-0">
                <div className="truncate font-bold text-ink">{d[locale]}</div>
                <div className="truncate text-xs text-ink-soft">{d.hub[locale]}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
