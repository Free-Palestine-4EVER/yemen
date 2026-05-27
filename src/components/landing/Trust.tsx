"use client";

import { UserCheck, Lock, Receipt, LayoutGrid } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";

const icons = [UserCheck, Lock, Receipt, LayoutGrid];

export function Trust() {
  const { t } = useI18n();
  return (
    <section className="relative bg-paper-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Reveal><Kicker>{t.trust.kicker}</Kicker></Reveal>
            <Reveal i={1}>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-navy-950 sm:text-4xl">
                {t.trust.title}
              </h2>
            </Reveal>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {t.trust.items.map((item, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={item.t} i={i}>
                  <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card">
                    <div className="grid size-11 place-items-center rounded-xl bg-navy-50 text-navy-800">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </div>
                    <h3 className="mt-4 font-semibold text-navy-950">{item.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-600">{item.d}</p>
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
