"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { ButtonLink } from "@/components/ui/Button";

export function CTA() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-navy-950 px-8 py-16 text-center text-paper sm:px-16 lg:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-grain opacity-40" />
          <div className="pointer-events-none absolute -top-24 start-1/2 size-[28rem] -translate-x-1/2 rounded-full bg-gold-500/15 blur-[100px] rtl:translate-x-1/2" />
          <div className="rule-gold absolute inset-x-12 top-8 opacity-50" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {t.cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-navy-200">{t.cta.subtitle}</p>
            <div className="mt-9 flex justify-center">
              <ButtonLink href="/register" variant="gold" size="lg">
                {t.cta.button}
                <ArrowRight className="size-5 rtl:rotate-180" />
              </ButtonLink>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
