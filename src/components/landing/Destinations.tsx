"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";
import { DESTINATIONS } from "@/lib/data";

export function Destinations() {
  const { t, locale } = useI18n();
  return (
    <section id="destinations" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal><Kicker>{t.destinations.kicker}</Kicker></Reveal>
          <Reveal i={1}>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
              {t.destinations.title}
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 text-lg text-navy-600">{t.destinations.subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DESTINATIONS.map((d, i) => (
            <motion.div
              key={d.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="group flex items-center gap-3 rounded-xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-lift"
            >
              <span className="text-3xl leading-none">{d.flag}</span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-navy-950">{d[locale]}</div>
                <div className="truncate text-xs text-navy-500">{d.hub[locale]}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
