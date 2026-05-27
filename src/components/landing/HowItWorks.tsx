"use client";

import { UserPlus, MapPin, BadgeDollarSign, Send } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const icons = [UserPlus, MapPin, BadgeDollarSign, Send];

export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section id="how" className="relative scroll-mt-24 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <Reveal><Kicker>{t.how.kicker}</Kicker></Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[0.98] tracking-tight text-ink sm:text-5xl">
                {t.how.title}
              </h2>
            </Reveal>
          </div>
          <Reveal i={2}>
            <p className="max-w-sm text-ink-soft md:text-end">{t.how.subtitle}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border-2 border-ink bg-ink md:grid-cols-2 lg:grid-cols-4">
          {t.how.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Reveal key={step.t} i={i} className="h-full">
                <div className={cn(
                  "group relative flex h-full flex-col bg-canvas p-7 transition-colors duration-300 hover:bg-flame-soft",
                )}>
                  <div className="flex items-start justify-between">
                    <div className="grid size-12 place-items-center rounded-xl border-2 border-ink bg-canvas text-ink transition-colors group-hover:bg-flame">
                      <Icon className="size-6" strokeWidth={2} />
                    </div>
                    <span className="font-display text-6xl font-extrabold leading-none text-sand-2 transition-colors group-hover:text-flame">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-ink">{step.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.d}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
