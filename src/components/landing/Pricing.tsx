"use client";

import { Check, GraduationCap, Briefcase } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal, Kicker } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Pricing() {
  const { t } = useI18n();

  const plans = [
    {
      data: t.pricing.student,
      icon: GraduationCap,
      href: "/register?track=student",
      featured: false,
    },
    {
      data: t.pricing.job,
      icon: Briefcase,
      href: "/register?track=job",
      featured: true,
    },
  ] as const;

  return (
    <section id="pricing" className="relative scroll-mt-20 bg-paper-2 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal><Kicker>{t.pricing.kicker}</Kicker></Reveal>
          <Reveal i={1}>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
              {t.pricing.title}
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-4 text-lg text-navy-600">{t.pricing.subtitle}</p>
          </Reveal>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const popular = "popular" in plan.data ? plan.data.popular : undefined;
            return (
              <Reveal key={plan.data.name} i={i}>
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300",
                    plan.featured
                      ? "border-navy-950 bg-navy-950 text-paper shadow-lift"
                      : "border-line bg-white text-navy-950 shadow-card hover:-translate-y-1 hover:shadow-lift",
                  )}
                >
                  {popular && (
                    <span className="absolute -top-3 end-6 rounded-full bg-gold-500 px-3 py-1 text-xs font-semibold text-navy-950">
                      {popular}
                    </span>
                  )}
                  <div
                    className={cn(
                      "grid size-12 place-items-center rounded-xl",
                      plan.featured ? "bg-gold-500 text-navy-950" : "bg-navy-950 text-paper",
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.7} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">{plan.data.name}</h3>
                  <p className={cn("mt-1 text-sm", plan.featured ? "text-navy-200" : "text-navy-500")}>
                    {plan.data.for}
                  </p>

                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-display text-5xl font-semibold">{plan.data.price}</span>
                    <span className={cn("mb-1.5 text-sm", plan.featured ? "text-navy-300" : "text-navy-500")}>
                      {plan.data.unit}
                    </span>
                  </div>

                  <ul className="mt-7 flex-1 space-y-3">
                    {plan.data.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            plan.featured ? "text-gold-400" : "text-emerald-soft",
                          )}
                          strokeWidth={2.5}
                        />
                        <span className={plan.featured ? "text-navy-100" : "text-navy-700"}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <ButtonLink
                      href={plan.href}
                      variant={plan.featured ? "gold" : "primary"}
                      size="lg"
                      className="w-full"
                    >
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
