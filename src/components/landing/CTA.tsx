"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { ButtonLink } from "@/components/ui/Button";
import { YEMEN } from "@/lib/data";

export function CTA() {
  const { t, locale } = useI18n();
  return (
    <section className="relative pb-28 pt-4">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] border-2 border-ink bg-flame px-8 py-16 text-center text-ink shadow-[10px_10px_0_0_var(--color-ink)] sm:px-16 lg:py-24"
        >
          <span className="pointer-events-none absolute -start-6 -top-10 select-none font-display text-[12rem] font-extrabold leading-none text-ink/10">
            {YEMEN.flag}
          </span>
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-extrabold leading-[0.98] tracking-tight sm:text-6xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-ink/80">{t.cta.subtitle}</p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href="/register" variant="primary" size="lg">
                {t.cta.button}<ArrowRight className="size-5 rtl:rotate-180" />
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-ink/60">
              {YEMEN[locale]} → Europe · {t.brand.name}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
