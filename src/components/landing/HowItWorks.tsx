"use client";

import { UserPlus, MapPin, BadgeDollarSign, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";

const icons = [UserPlus, MapPin, BadgeDollarSign, Send];

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how" className="relative scroll-mt-20 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <Reveal><Kicker>{t.how.kicker}</Kicker></Reveal>
          <Reveal i={1}>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
              {t.how.title}
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 text-lg text-navy-600">{t.how.subtitle}</p>
          </Reveal>
        </div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={step.t} i={i} className="h-full">
                <div className="group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <div className="grid size-12 place-items-center rounded-xl bg-navy-950 text-paper transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                      <Icon className="size-6" strokeWidth={1.7} />
                    </div>
                    <span className="font-display text-5xl font-semibold text-navy-100 transition-colors group-hover:text-gold-300">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-navy-950">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-600">{step.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
