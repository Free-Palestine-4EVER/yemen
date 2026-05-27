"use client";

import { UserCheck, Lock, Receipt, LayoutGrid } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";

const icons = [UserCheck, Lock, Receipt, LayoutGrid];

export function Trust() {
  const { t } = useI18n();
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Reveal><Kicker>{t.trust.kicker}</Kicker></Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1] tracking-tight text-ink sm:text-5xl">
                {t.trust.title}
              </h2>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {t.trust.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={item.t} i={i}>
                  <div className="flex h-full flex-col rounded-2xl border-2 border-ink bg-canvas p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--color-flame)]">
                    <div className="grid size-11 place-items-center rounded-xl border-2 border-ink bg-flame-soft text-ink">
                      <Icon className="size-5" strokeWidth={2} />
                    </div>
                    <h3 className="mt-4 font-bold text-ink">{item.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.d}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
