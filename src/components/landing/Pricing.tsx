"use client";

import { Check, GraduationCap, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { t } = useI18n();
  const plans = [
    { data: t.pricing.student, icon: GraduationCap, href: "/register?track=student", featured: false },
    { data: t.pricing.job, icon: Briefcase, href: "/register?track=job", featured: true },
  ] as const;

  return (
    <section id="pricing" className="relative scroll-mt-24 border-y-2 border-ink bg-sand py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal className="flex justify-center"><Kicker>{t.pricing.kicker}</Kicker></Reveal>
          <Reveal i={1}>
            <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {t.pricing.title}
            </h2>
          </Reveal>
          <Reveal i={2}><p className="mt-4 text-lg text-ink-soft">{t.pricing.subtitle}</p></Reveal>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-7 md:grid-cols-2">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const popular = "popular" in plan.data ? plan.data.popular : undefined;
            return (
              <Reveal key={plan.data.name} i={i}>
                <div className={cn(
                  "relative flex h-full flex-col rounded-[1.5rem] border-2 border-ink p-8 transition-all duration-200 hover:-translate-y-1",
                  plan.featured
                    ? "bg-ink text-canvas shadow-[8px_8px_0_0_var(--color-flame)] hover:shadow-[12px_12px_0_0_var(--color-flame)]"
                    : "bg-canvas text-ink shadow-[8px_8px_0_0_var(--color-ink)] hover:shadow-[12px_12px_0_0_var(--color-ink)]",
                )}>
                  {popular && (
                    <span className="absolute -top-4 end-7 rounded-full border-2 border-ink bg-flame px-3 py-1 font-display text-xs font-bold uppercase tracking-wide text-ink">
                      {popular}
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div className={cn("grid size-12 place-items-center rounded-xl border-2",
                      plan.featured ? "border-canvas bg-flame text-ink" : "border-ink bg-flame text-ink")}>
                      <Icon className="size-6" strokeWidth={2} />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="font-display text-6xl font-extrabold leading-none">{plan.data.price}</span>
                    </div>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold">{plan.data.name}</h3>
                  <p className={cn("mt-1 text-sm", plan.featured ? "text-canvas/70" : "text-ink-soft")}>{plan.data.for}</p>

                  <ul className="mt-7 flex-1 space-y-3">
                    {plan.data.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className={cn("mt-0.5 size-4 shrink-0", plan.featured ? "text-flame" : "text-teal")} strokeWidth={3} />
                        <span className={plan.featured ? "text-canvas/90" : "text-ink-soft"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <ButtonLink href={plan.href} variant={plan.featured ? "gold" : "primary"} size="lg" className="w-full">
                      {plan.data.cta}
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
