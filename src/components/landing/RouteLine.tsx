"use client";

import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { YEMEN, destinationByCode } from "@/lib/data";

/** A drawn flight path from Yemen to a European hub — the brand's core motif. */
export function RouteLine({ to = "DE" }: { to?: string }) {
  const { t, locale } = useI18n();
  const dest = destinationByCode(to);

  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <Node flag={YEMEN.flag} label={t.journey.from} place={YEMEN.capital[locale]} />

      <svg viewBox="0 0 200 60" className="h-12 flex-1" preserveAspectRatio="none" aria-hidden>
        <motion.path
          d="M2 50 C 60 10, 140 10, 198 30"
          fill="none"
          stroke="var(--color-flame)"
          strokeWidth="2.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.g
          initial={{ offsetDistance: "0%", opacity: 0 }}
          whileInView={{ offsetDistance: "100%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ offsetPath: "path('M2 50 C 60 10, 140 10, 198 30')" } as React.CSSProperties}
        >
          <circle r="3.5" fill="var(--color-flame)" />
        </motion.g>
      </svg>

      <Node flag={dest?.flag ?? "🇪🇺"} label={t.journey.to} place={dest ? dest[locale] : "Europe"} />
    </div>
  );
}

function Node({ flag, label, place }: { flag: string; label: string; place: string }) {
  return (
    <div className="shrink-0 text-center">
      <div className="grid size-12 place-items-center rounded-full border-2 border-ink bg-canvas text-2xl shadow-[3px_3px_0_0_var(--color-ink)]">
        {flag}
      </div>
      <div className="mt-2 font-display text-[9px] font-bold uppercase tracking-widest text-flame">{label}</div>
      <div className="text-xs font-semibold text-ink">{place}</div>
    </div>
  );
}
